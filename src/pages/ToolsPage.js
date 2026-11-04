import { Box, Button, Container, Grid, Typography, Tabs, Tab, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import AllOperationsPanel from '/src/components/AllOperationsPanel';
import ToolInputPanel from '/src/components/ToolInputPanel';
import ToolOutputPanel from '/src/components/ToolOutputPanel';
import ToolTestingPanel from '/src/components/ToolTestingPanel';
import { loadToolIndex, loadTool } from '../utils/toolUtils';
import { TourContext } from '../contexts/TourContext';
import { NotificationContext } from '../contexts/NotificationContext';

const ToolsPage = () => {
    const [selectedTool, setSelectedTool] = useState(null);
    const [inputData, setInputData] = useState('');
    const [outputData, setOutputData] = useState('');
    const [toolIndexLoaded, setToolIndexLoaded] = useState(false);
    const [loadingTool, setLoadingTool] = useState(false);
    const [tab, setTab] = useState(0);

    const { tourStart, tourRegisterSteps, tourMoveNext, tourIsActive } = useContext(TourContext);
    const showNotification = useContext(NotificationContext);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const runToolsTour = () => {
        tourStart(["t-intro", "t-tools", "t-input", "t-testing"]);
        localStorage.setItem("toolsPageTourCompleted", "true");
    };

    useEffect(() => {
        if(!toolIndexLoaded) return

        tourRegisterSteps("t-intro", [
            {
                popover: {
                    title: "Welcome to the Tools Page",
                    description: "This page provides an interactive environment for exploring and running tools directly in the browser. Users can select a tool, configure inputs, execute it, and inspect outputs.<br /><br />The following tour briefly highlights the main components of the interface and how they are used together.<br /><br />You can re-run this tour at any time using the button on the top right.",
                },
            },
        ]);

        if (!localStorage.getItem("toolsPageTourCompleted")) {
            runToolsTour();
        }

    }, [toolIndexLoaded]);

    const handleRerunTour = () => {
        localStorage.removeItem("toolsPageTourCompleted");
        localStorage.removeItem("toolsPageSecondTourCompleted");
        runToolsTour();
    };

    useEffect(() => {
        const fetchTools = async () => {
            const result = await loadToolIndex();
            setToolIndexLoaded(!!result);
        };

        fetchTools();
    }, []);

    const handleToolClick = async (tool) => {
        setLoadingTool(true);
        try {
            const loaded = await loadTool(tool.name);
            if (!loaded) throw new Error("the tool is unavailable");
            setSelectedTool(tool);
            if(tourIsActive) tourMoveNext();
            if (isMobile) setTab(2);
        } catch (error) {
            console.error("Tool loading failed", error);
            setSelectedTool(null);
            setOutputData('');
            showNotification(`Could not load ${tool.name}: ${error.message}`, 'error');
        } finally {
            setLoadingTool(false);
        }
    };

    const handleSetOutputData = (outputData) => {
        setOutputData(outputData)

        if (isMobile) {
            setTab(3)
        }
    }

    if (!toolIndexLoaded) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 'calc(100vh - 64px)',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 64px)',
                overflowY: 'auto',
            }}
        >
            <Container
                maxWidth="xl"
                sx={{
                    flex: 1,
                    py: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    height: '100%',
                }}
            >
                {isMobile ? (
                    <>
                        <Tabs value={tab} onChange={handleTabChange}>
                            <Tab label="Tools" />
                            <Tab label="Run" />
                            <Tab label="Input" />
                            <Tab label="Output" />
                        </Tabs>

                        <div style={{ display: tab === 0 ? 'block' : 'none' }}>
                            <AllOperationsPanel onToolClick={handleToolClick} />
                        </div>

                        <div style={{ display: tab === 1 ? 'block' : 'none' }}>
                            {loadingTool ? (
                                <CircularProgress />
                            ) : selectedTool ? (
                                <ToolTestingPanel
                                    tool={selectedTool}
                                    inputData={inputData}
                                    setOutputData={handleSetOutputData}
                                />
                            ) : (
                                <Typography align="center" variant="h6" sx={{ marginTop: '20%' }}>
                                    Select a tool from the list to view details and test it
                                </Typography>
                            )}
                        </div>

                        <div style={{ display: tab === 2 ? 'block' : 'none' }}>
                            <ToolInputPanel
                                tool={selectedTool}
                                inputData={inputData}
                                setInputData={setInputData}
                            />
                        </div>

                        <div style={{ display: tab === 3 ? 'block' : 'none' }}>
                            <ToolOutputPanel
                                outputData={outputData}
                                setOutputData={setOutputData}
                                tool={selectedTool}
                                inputData={inputData}
                                page={'ToolPage'}
                            />
                        </div>

                    </>
                ) : (
                    <Grid container spacing={2} sx={{ flex: 1, overflow: 'hidden' }}>
                        {/* Tool Selection Panel */}
                        <Grid
                            item
                            xs={12}
                            md={3.2}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                overflowY: 'auto',
                                maxHeight: '100%',
                            }}
                        >
                            <AllOperationsPanel onToolClick={handleToolClick} />
                        </Grid>

                        {/* Testing Tool Panel */}
                        <Grid
                            item
                            xs={12}
                            md={5.8}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                overflowY: 'auto', // Independent scrolling
                                maxHeight: '100%',
                            }}
                        >
                            {loadingTool ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            ) : selectedTool ? (
                                <ToolTestingPanel tool={selectedTool} inputData={inputData} setOutputData={setOutputData} />
                            ) : (
                                <Typography align="center" variant="h6" sx={{ marginTop: '20%' }}>
                                    Select a tool from the list to view details and test it
                                </Typography>
                            )
                            }
                        </Grid>

                        {/* Input and Output Panels */}
                        <Grid
                            item
                            xs={12}
                            md={3}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                overflowY: 'auto', // Independent scrolling
                                maxHeight: '100%', // Adjusts height relative to header/footer
                            }}
                        >
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    mb: 2,
                                    overflowY: 'auto', // Independent scrolling
                                }}
                            >
                                <ToolInputPanel tool={selectedTool} inputData={inputData} setInputData={setInputData} />
                            </Box>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    overflowY: 'auto', // Independent scrolling
                                }}
                            >
                                <ToolOutputPanel outputData={outputData} setOutputData={setOutputData} tool={selectedTool} inputData={inputData} page={'ToolPage'} />
                            </Box>
                        </Grid>
                        {/* <Button
                            variant="outlined"
                            size="small"
                            onClick={handleRerunTour}
                            sx={{
                                position: 'fixed',
                                top: 80,      // below app bar
                                right: 16,
                                zIndex: 1200,
                            }}
                        >
                            Re-run tour
                        </Button> */}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default ToolsPage;
