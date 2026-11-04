// RecipePanel.jsx
import {
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { HelpOutline, PlayArrow } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControlLabel,
    IconButton,
    Paper,
    Switch,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { getTool, parameterArguments } from '../utils/toolUtils';
import { NotificationContext } from '../contexts/NotificationContext';
import { runTools } from '../utils/toolUtils';
import { detectDataType } from '../utils/detectDataType';
import { processFile } from '../utils/fileProcessor';
import { validateParameters, getToolHelpMessage } from '../utils/parameterUtils';
import ToolParameterSection from './ToolParameterSection';
import { TourContext } from '../contexts/TourContext';

const ToolTestingPanel = ({ tool, inputData, setOutputData, setIsLoading }) => {
    const [validationErrors, setValidationErrors] = useState({}); // To store validation errors
    const [parameters, setParameters] = useState({});   // To store parameters
    const [helpMessages, setHelpMessages] = useState({}); // To store help messages
    const [toolParameterFiles, setToolParameterFiles] = useState({}); // To store tool parameter files
    const { tourRegisterSteps, tourStart, tourMoveNext, tourIsActive } = useContext(TourContext);

    // Find tool configuration and supported input formats
    const toolConfig = getTool(tool.name)
    const inputFormats = toolConfig.inputTypes
    const outputFormats = toolConfig.outputTypes
    const showNotification = useContext(NotificationContext);

    useEffect(() => {
        if (Object.keys(inputData).length === 0) return;
        if (localStorage.getItem("toolsPageSecondTourCompleted")) return;
        if (tourIsActive) return;

        tourRegisterSteps("t-testing", [
            {
                element: '[data-tour="testing-section"]',
                popover: {
                    title: "Testing the Tool",
                    description: "In this section, you can configure the tool's parameters and run the analysis.<br /><br />Let's walk through the setup process.",
                },
            },
            {
                element: '[data-tour="parameters"]',
                popover: {
                    title: "Choosing Parameters",
                    description: "You can set both required and optional parameters for the tool.<br /><br />You may activate them and provide the necessary values before running the tool.",
                },
            },
            {
                element: '[data-tour="run-tool"]',
                popover: {
                    title: "Run Tool",
                    description: "Once you've set the parameters, click here to run the tool and start the analysis.",
                    showButtons: ["previous", "exit"]
                },
            },
        ]);

        tourStart(["t-testing", "t-output"]);
        localStorage.setItem("toolsPageSecondTourCompleted", "true");
    }, [inputData, tourIsActive]);

    // load default values for each parameter
    // and set optionals to be disabled by default
    useEffect(() => {
        setParameters((prevParams) => {
            const updatedParams = { ...prevParams };

            toolConfig.parameters.forEach((param) => {
                if (param.name in updatedParams && !param.hidden) return
                updatedParams[param.name] = {
                    value: param.default !== undefined ? param.default : '',
                    enabled: false
                };
            });

            return updatedParams;
        });
    }, [toolConfig]);

    // NOTE(Andrade):
    // This was here before when this was just for GTO
    // but this approach is not scalable at all
    // maybe in the future we should have the help messages in the recipe
    //
    // useEffect(() => {
    //     const fetchHelpMessages = async () => {
    //         if (tool && tool.name) {
    //             const help = await getToolHelpMessage(tool.name);
    //             setHelpMessages(help);
    //         }
    //     };
    //     fetchHelpMessages();
    // }, [tool]);

    const handleParameterChange = async (name, value) => {
        let paramValue = value;

        if (value instanceof File) {
            const processedFile = await processFile(value, showNotification);
            if (!processedFile) return;

            paramValue = processedFile.name;

            const fileObj = { name: processedFile.name, data: processedFile.content };
            setToolParameterFiles((prev) => ({
                ...prev,
                [name]: fileObj,
            }));
        }

        setParameters((prevParams) => ({
            ...prevParams,
            [name]: {
                value: paramValue,
                enabled: prevParams[name]?.enabled ?? true, // preserve or default to true
            },
        }));

        // clear validation errors
        setValidationErrors({})
    };

    const toggleParameter = (name) => {
        setParameters((prevParams) => ({
            ...prevParams,
            [name]: {
                ...prevParams[name],
                enabled: !prevParams[name]?.enabled,
            },
        }));

        // clear validation errors
        setValidationErrors({})
    };

    const handleExecuteTool = async (tool) => {
        tourMoveNext();
        try {
            // Validate parameters before executing the tool
            const { isValid, verrors } = validateParameters(tool.name, parameters);
            if (!isValid) {
                // If validation fails, notify the user and cancel execution
                showNotification('Please correct the parameters highlighted in red.', 'error');
                setValidationErrors(verrors);
                return;
            }

            const toolConfig = getTool(tool.name)
            if (!toolConfig) {
                showNotification(`Configuration for tool ${tool.name} not found.`, 'error');
                throw new Error(`Configuration for tool ${tool.name} not found.`);
            }

            // Prepare arguments based on tool configuration and user-set parameters
            let args = [];
            toolConfig.parameters.forEach((param) => {
                if (param.required || parameters[param.name].enabled) {
                    if (param.type == "flag") {
                        if (param.flag) args.push(param.flag);
                    } else {
                        args.push(...parameterArguments(param.flag, parameters[param.name].value));
                    }
                }
            });

            // Verify if the input data is compatible with the tool
            for (const [key, value] of Object.entries(inputData)) {
                const inputDataType = detectDataType(value, toolConfig.io.inputs.find((i)=>i.name == key).types);

                if (!inputFormats.includes(inputDataType)) {
                    showNotification(
                        `Input data type ${inputDataType} for field "${key}" is not supported by tool ${tool.name}.`,
                        'error'
                    );
                    console.error(
                        `Input data type ${inputDataType} for field "${key}" is not supported by tool ${tool.name}.`
                    );
                    return;
                }
            }

            // Ensure input is defined
            if (inputData === undefined || inputData === null) {
                inputData = '';
            }

            // convert to format supported by runTools
            const inputs = {}
            for (const [key, value] of Object.entries(inputData)) {
                inputs[key] = {
                    mode: "text",
                    value,
                }
            }
            const toolInvocation = {
                toolName: tool.name,
                uniqueId: tool.name,
                toolArguments: args,
                inputs
            }

            // Execute the tool
            const {outputs, errors} = await runTools([toolInvocation]);
            setOutputData(outputs[tool.name])
            const error = errors[tool.name].join("\n")

            if (error) {
                const stderrLines = error.split('\n').map(line => line.trim()).filter(Boolean);
                
                const hasOutput = Object.values(outputs[tool.name]).some(
                    value => value !== undefined && value !== null && value.data !== ''
                );
                
                const failed = error && !hasOutput

                if (failed) {
                    showNotification(stderrLines, "error")
                } else {
                    showNotification(stderrLines, "info")
                }
            }

        } catch (error) {
            console.error(`Failed to execute tool ${tool.name}:`, error);
            throw error;
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{ padding: 2, height: '100%', display: 'flex', flexDirection: 'column' }}
            data-tour="testing-section"
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                <Typography variant="h6" gutterBottom>
                    Tool Testing
                </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <Paper
                    elevation={1}
                    data-tour="parameters"
                    sx={{
                        transition: 'transform 150ms ease, background-color 300ms ease, border-color 300ms ease', // Smooth transition for both color and transform
                        marginBottom: '8px',
                        padding: '8px',
                        borderRadius: '4px',
                        cursor: 'grab',
                        backgroundColor: 'white', // Default background
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                            Tool: {tool.name}
                        </Typography>
                        <Tooltip
                            title={<pre style={{ whiteSpace: 'pre-wrap' }}>{helpMessages?.general || 'Loading help...'}</pre>}
                            arrow
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        maxWidth: 'none',
                                    },
                                },
                            }}
                        >
                            <IconButton size="small" sx={{ marginLeft: 1 }}>
                                <HelpOutline fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* Input and Output Formats */}
                    <Box sx={{ marginBottom: 3 }}>
                        <Typography variant="body1" gutterBottom>
                            Supported Formats
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Input:</Typography>
                                <Typography variant="body2">
                                    {inputFormats.length > 0 ? inputFormats.join(', ') : 'None available'}
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Output:</Typography>
                                <Typography variant="body2">
                                    {outputFormats.length > 0 ? outputFormats.join(', ') : 'None available'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Flags Section */}
                    {toolConfig.parameters.length > 1 && (
                        <Typography variant="body1" gutterBottom >
                            Flags and Parameters
                        </Typography>
                    )}
                    <ToolParameterSection
                        toolConfig={toolConfig}
                        parameters={parameters}
                        validationErrors={validationErrors}
                        helpMessages={helpMessages?.flags}
                        handleParameterChange={handleParameterChange}
                        toggleParameter={toggleParameter}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleExecuteTool(tool)}
                        startIcon={<PlayArrow />}
                        sx={{ marginTop: 2 }} // Adiciona espaçamento no topo
                        data-tour="run-tool"
                    >
                        Run Tool
                    </Button>
                </Paper>
            </Box >
        </Paper >
    );
};

export default ToolTestingPanel;
