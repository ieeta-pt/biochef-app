import UploadIcon from '@mui/icons-material/Upload';
import { Box, IconButton, MenuItem, Paper, Select, TextField, Tooltip, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { getTool } from '../utils/toolUtils';
import { NotificationContext } from '../contexts/NotificationContext';
import { detectDataType, detectIsBinaryFile } from '../utils/detectDataType';
import { getUploadExtensions, getTypeExampleInput } from '../utils/typeDefinitions';
import { TourContext } from '../contexts/TourContext';
import { makeTextDataValue, makeBinaryDataValue, dataValueToString } from '../utils/dataValue';

const ToolInputPanel = ({ tool, inputData, setInputData }) => {
    const [fileName, setFileName] = useState('');
    const showNotification = useContext(NotificationContext);
    const [setInputDataType, inputDataType] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isAcceptable, setIsAcceptable] = useState(true);
    const [toolInputFormat, setToolInputFormat] = useState([]);
    const [selectedInputFormat, setSelectedInputFormat] = useState('');
    const [selectedInput, setSelectedInput] = useState('');

    const toolConfig = tool ? getTool(tool.name) : null
    const toolInputs = toolConfig ? toolConfig.io.inputs : []

    const isValidSelection = toolInputs.some(
        (input) => input.name === selectedInput?.name
    );

    const selectValue = isValidSelection
        ? selectedInput.name
        : (toolInputs[0]?.name || '');

    const { tourRegisterSteps, tourIsActive, tourMoveNext } = useContext(TourContext);

    useEffect(() => {
        tourRegisterSteps("t-input", [
            {
                element: '[data-tour="input-section"]',
                popover: {
                    title: "Choosing Input",
                    description: "In this section, you can manually enter or paste your input data.<br /><br />This is where you configure the data the tool will use to run its analysis.",
                },
            },
            {
                element: '[data-tour="import-input"]',
                popover: {
                    title: "Importing Data",
                    description: "You could also use this icon to import your files.",
                },
            },
            {
                element: '[data-tour="example-input"]',
                popover: {
                    title: "Example Input",
                    description: "Based on the selected tool's input format, you can choose to use an example input.<br /><br />This helps you get started quickly with predefined data that matches the expected format.<br /><br />Now choose an example input or upload a file and the tour will continue from there.",
                    // onNextClick: () => {
                    //     handleInputFormatChange("FASTA");
                    //     tourMoveNext();
                    // },
                },
            },
        ]);
    }, []);

    const acceptableExtensions = getUploadExtensions();

    // Get the input formats supported by the tool
    useEffect(() => {
        if (selectedInput) {
            setToolInputFormat(selectedInput.types || []);
        } else if (toolConfig) {
            setToolInputFormat(toolConfig.inputTypes || []);
        } else {
            setToolInputFormat([]);
        }
    }, [selectedInput, toolConfig]);

    // Reset input format and data if the tool changes
    useEffect(() => {
        if (tool) {
            setSelectedInputFormat({});
            setInputData({});
            setSelectedInput(toolInputs[0] || '');
        }
    }, [tool]);

    const updateSelectedInputData = (data) => {
        setInputData(prev => ({
            ...prev,
            [selectedInput.name]: data
        }));
    }

    const updateSelectedInputFormat = (fomat) => {
        setSelectedInputFormat(prev => ({
            ...prev,
            [selectedInput.name]: fomat
        }));
    }

    const handleInputFormatChange = (format) => {
        updateSelectedInputFormat(format);

        const example_input = getTypeExampleInput(format);
        updateSelectedInputData(makeTextDataValue(example_input)); // Load example input if available
    };

    // Debounce state
    const [debounceTimer, setDebounceTimer] = useState(null);

    const processFileContent = (file, content, isPartial) => {
        const isBinary = detectIsBinaryFile(content)

        let dv
        if (isBinary) {
            dv = makeBinaryDataValue(content)
        }
        else {
            const text = new TextDecoder("utf-8").decode(content);
            dv = makeTextDataValue(text)
        }

        handleInputChange(dv)
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const extension = `.${file.name.split('.').pop().toLowerCase()}`;
            if (!acceptableExtensions.includes(extension)) {
                showNotification(`Unsupported file type: ${extension}`, 'error');
                setIsAcceptable(false);
                setFileName('');
                setInputData({});
                setIsValid(false);
                setInputDataType('UNKNOWN'); // Reset data type
                return;
            }

            const fileSizeLimit = 100 * 1024 * 1024; // 100 MB in bytes
            const isPartial = file.size > fileSizeLimit;
            if (isPartial) {
                showNotification("Uploaded file is too large. Only the first 100 lines will be processed.", 'warning');
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const content = new Uint8Array(e.target.result);
                processFileContent(file, content, isPartial);
            };
            reader.onerror = (e) => {
                console.error('Error reading file:', e);
                showNotification('Failed to read the file.', 'error');
            };

            // if file size is too large, read only the first 100 MB
            if (isPartial) {
                reader.readAsArrayBuffer(file.slice(0, fileSizeLimit));
            } else {
                reader.readAsArrayBuffer(file);
            }
        }
    };

    const handleSelectedInputChange = (inputName) => {
        const selected = toolInputs.find(
            (input) => input.name === inputName
        );
        setSelectedInput(selected);
    }

    const handleInputChange = (dataValue) => {
        updateSelectedInputData(dataValue)
        const detectedDataType = detectDataType(dataValue, selectedInput.types)
        setInputDataType(detectedDataType)

        const valid = detectedDataType != "" && detectedDataType != "UNKNOWN"
        setIsValid(valid);

        if (!valid && detectedDataType !== 'UNKNOWN') {
            showNotification(`Invalid ${detectedDataType} data format.`, 'error');
        }
    };

    // Cleanup the debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
        };
    }, [debounceTimer]);

    return (
        <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} data-tour="input-section">
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: 2,
                }}
            >
                <Typography variant="h6">
                    Input{" "}
                    {inputData?.[selectedInput.name]?.kind && (
                        <Typography
                            component="span"
                            variant="subtitle2"
                            style={{ marginLeft: 4, color: "#555" }}
                        >
                            {inputData[selectedInput.name].kind}
                        </Typography>
                    )}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        minWidth: 200,
                    }}
                >
                    <Select
                        data-tour="example-input"
                        value={selectedInputFormat[selectedInput.name] || ''}
                        onChange={(e) => handleInputFormatChange(e.target.value)}
                        displayEmpty
                        fullWidth
                        size="small"
                    >
                        <MenuItem value="" disabled>
                            Select Example Format
                        </MenuItem>
                        {toolInputFormat.map((format) => (
                            <MenuItem key={format} value={format}>
                                {format}
                            </MenuItem>
                        ))}
                    </Select>

                    {toolInputs.length > 1 && selectedInput && (
                        <Select
                            value={selectValue}
                            onChange={(e) => handleSelectedInputChange(e.target.value)}
                            displayEmpty
                            fullWidth
                            size="small"
                        >
                            <MenuItem value="" disabled>
                                Select Input
                            </MenuItem>
                            {toolInputs.map((input) => (
                                <MenuItem key={input.name} value={input.name}>
                                    {input.name}
                                </MenuItem>
                            ))}
                        </Select>
                    )}

                </Box>
            </Box>
            {/* TextField with dynamic height */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 2 }}>
                <TextField
                    variant="outlined"
                    value={dataValueToString(inputData[selectedInput.name])}
                    onChange={(e) => handleInputChange(makeTextDataValue(e.target.value))}
                    placeholder="e.g., >Sequence1\nACGT..."
                    InputProps={{
                        multiline: true,
                        inputComponent: 'textarea',
                    }}
                    inputProps={{ maxLength: 100000 }}
                    rows={9}
                    sx={{
                        flexGrow: 1,
                        flexShrink: 1,
                        overflow: 'auto',
                        minHeight: '100px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        fontSize: '0.875rem',
                    }}
                    error={!isValid && inputDataType !== 'UNKNOWN'}
                    helperText={!isValid && inputDataType !== 'UNKNOWN' ? `The entered data does not conform to the expected ${inputDataType} format.` : ''}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 1,
                    flexShrink: 0,
                }}
            >

                {inputData[selectedInput.name]?.kind != "binary" && (
                    <Typography variant="body2" color="textSecondary">
                        {(inputData[selectedInput.name]?.data?.length || 0)}/100000 characters, {(inputData[selectedInput.name]?.data?.split('\n').length || 0)} lines
                    </Typography>
                )}
                <Tooltip title="Upload File">
                    <IconButton
                        color="primary"
                        component="label"
                        sx={{
                            padding: '6px',
                            backgroundColor: isAcceptable ? 'primary.main' : 'grey.500',
                            '&:hover': {
                                backgroundColor: isAcceptable ? 'primary.dark' : 'grey.500',
                            },
                            cursor: isAcceptable ? 'pointer' : 'not-allowed',
                            color: 'white',
                        }}
                        disabled={!isAcceptable}
                        data-tour="import-input"
                    >
                        <UploadIcon fontSize="small" />
                        <input
                            type="file"
                            hidden
                            accept={acceptableExtensions.join(',')}
                            onChange={handleFileUpload}
                        />
                    </IconButton>
                </Tooltip>
            </Box>
        </Paper>
    );
};

export default ToolInputPanel;
