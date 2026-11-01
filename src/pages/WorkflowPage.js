import {
  Box,
  Container,
  Grid,
  CircularProgress,
  Typography,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { getTool } from '../utils/toolUtils';
import InputPanel from '../components/InputPanel';
import ErrorBoundary from '/src/components/ErrorBoundary'; // Ensure this component exists
import OperationsPanel from '/src/components/OperationsPanel';
import RecipePanel from '/src/components/RecipePanel';
import { loadToolIndex, loadTool } from '../utils/toolUtils';
import ToolParameterSection from '../components/ToolParameterSection';
import ToolOutputPanel from '../components/ToolOutputPanel'
import { detectAllDataTypes } from '../utils/detectDataType';

const WorkflowPage = () => {
  const recipePanelRef = useRef();

  const [toolIndexLoaded, setToolIndexLoaded] = useState(false);

  const getInitialTree = () => ({
    id: 'root',
    name: 'Root',
    type: 'folder',
    children: [],
  });

  const [inputTabIndex, setInputTabIndex] = useState({})
  const [selectedFileManagerFiles, setSelectedFileManagerFiles] = useState({});
  const [inputFileManagerTree, setInputFileManagerTree] = useState(getInitialTree());

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedNode, setSelectedNode] = useState(null);
  const selectedNodeData = useMemo(() => {
    return selectedNode ? selectedNode.data : null;
  }, [selectedNode]);

  const selectedNodeConfig = useMemo(() => {
    if (selectedNode && selectedNode.type === "workflowNode" && selectedNodeData) {
      return getTool(selectedNodeData.label);
    }
    return null;
  }, [selectedNode]);

  // load tool index on opening the page
  useEffect(() => {
    const fetchToolIndex = async () => {
      const result = await loadToolIndex();
      setToolIndexLoaded(!!result);
    };

    fetchToolIndex()
  }, []);

  const handleAddOperation = async (toolName) => {
    const loaded = await loadTool(toolName);
    if (!loaded) return;
    const tool = getTool(toolName);
    if (!tool) return;
    recipePanelRef.current.addWorkflowNode(tool);
  };

  const updateSelectedNodeData = (newData) => {
    setSelectedNode((prevNode) => ({
      ...prevNode,
      data: {
        ...prevNode.data,
        ...newData,
      },
    }));
  };

  const handleUpdateSelectedInputNode = (dataValue) => {
    updateSelectedNodeData({ outputs: { "out": dataValue } })
  };

  function handleToggleParam(name) {
    if (!selectedNode) return;

    const oldParam = selectedNodeData.paramValues?.[name] || {};

    const newParamValues = {
      ...selectedNodeData.paramValues,
      [name]: {
        ...oldParam,
        enabled: !oldParam.enabled,
      },
    };

    updateSelectedNodeData({ paramValues: newParamValues });
  }

  function handleChangeParam(name, value) {
    if (!selectedNode) return;

    const oldParam = selectedNodeData.paramValues?.[name] || {};

    const newParamValues = {
      ...selectedNodeData.paramValues,
      [name]: {
        enabled: oldParam.enabled ?? true,
        value: value,
      },
    };

    updateSelectedNodeData({ paramValues: newParamValues });
  }

  if (isMobile) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 64px)',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            Not supported on mobile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This workflow builder currently requires a larger screen.
            Please use a desktop or tablet device.
          </Typography>
        </Paper>
      </Box>
    );
  }
  else if (!toolIndexLoaded) {
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
    <ErrorBoundary>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 64px)',
        }}
      >
        {/* Main Content */}
        <Container
          maxWidth="false"
          sx={{
            flex: 1,
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden', // Prevents overflow beyond the container
          }}
        >
          <Grid container spacing={2} sx={{ flex: 1, height: '100%', overflow: 'hidden' }}>
            {/* Operations Panel */}
            <Grid
              item
              xs={12}
              md={2.6}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1, // Allow it to take available space without stretching
                overflowY: 'auto', // Enable independent scrolling
                height: '100%', // Ensure it does not overflow parent
              }}
            >

              <OperationsPanel
                onAddOperation={handleAddOperation}
                // isWorkflowEmpty={isWorkflowEmpty}
                // isLoading={isLoading}
                setIsLoading={() => { return }}
                // insertAtIndex={insertAtIndex}
                // setInsertAtIndex={setInsertAtIndex}
                // addingATool={addingATool}
                // setAddingATool={setAddingATool}
                filteredTools={[]}
                // setFilteredTools={setFilteredTools}
                // selectedFiles={selectedFiles}
                // tabIndex={0}
                // workflow={workflow}
                selectedNode={selectedNode}
              />
            </Grid>

            {/* Recipe/Workflow Panel */}
            <Grid
              item
              xs={12}
              md={6.8}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1, // Allow it to take available space without stretching
                overflowY: 'auto', // Enable independent scrolling
                height: '100%', // Ensure it does not overflow parent
              }}
            >
              {/* TODO: this is a temporary thing, make it better in the future */}

              <RecipePanel
                ref={recipePanelRef}
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
                indexLoaded={toolIndexLoaded}
              />
            </Grid>

            {/* Input and Output Panels */}
            <Grid
              item
              xs={12}
              md={2.6}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1, // Allow it to take available space without stretching
                overflowY: 'auto', // Enable independent scrolling
                height: '100%', // Ensure it does not overflow parent
              }}
            >
              {!selectedNode && (
                // <h1>nothing to do</h1>
                <Paper elevation={3} sx={{ padding: 2, height: '100%', display: 'flex', flexDirection: 'column' }}></Paper>
              )}

              {/* NOTE(andrade) 
                  I'm reusing the old panels instead of creating new ones
                  that is the reason for these horrendous looking wrappers.
                  These panels expect tree and selectedFiles to be useStates
                  but now we need different ones for each node.
                  It would probably be a good idea either to adapt the panels or
                  just make new ones altogether so this doesn't have to exist.
              */}
              {selectedNode && selectedNode.type === 'inputWorkflowNode' && (
                <InputPanel
                  tabIndex={inputTabIndex?.[selectedNode.id] ?? 0}
                  setTabIndex={(value) =>
                    setInputTabIndex(prev => ({
                      ...prev,
                      [selectedNode.id]: value
                    }))
                  }
                  selectedFiles={selectedFileManagerFiles?.[selectedNode.id] ?? new Set()}
                  setSelectedFiles={(updater) =>
                    setSelectedFileManagerFiles(prev => {
                      const currentFiles = prev[selectedNode.id] || new Set()
                      const newFiles = typeof updater === "function" ? updater(currentFiles) : updater;
                      return {
                        ...prev,
                        [selectedNode.id]: newFiles,
                      };
                    })
                  }
                  inputData={selectedNodeData.outputs?.["out"] ?? ""}
                  setInputData={handleUpdateSelectedInputNode}
                  tree={inputFileManagerTree ?? getInitialTree()}
                  setTree={(updater) =>
                    setInputFileManagerTree(prev =>
                      typeof updater === "function" ? updater(prev) : updater
                    )
                  }
                />
              )}

              {selectedNode && selectedNode.type === 'workflowNode' && (
                <Paper elevation={3} sx={{ padding: 2, height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                    <Typography variant="h6" gutterBottom>{selectedNodeData.label}</Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ marginBottom: 3 }}>
                      <Typography variant="body1" gutterBottom>
                        Supported Formats
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        {/* Inputs */}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Input:</Typography>
                          {selectedNodeConfig.io?.inputs?.length > 0 ? (
                            selectedNodeConfig.io.inputs.map((input, index, arr) => (
                              <Typography key={input.name} variant="body2">
                                {arr.length > 1 ? `${input.name}: ` : ''}
                                {input.types.join(', ')}
                              </Typography>
                            ))
                          ) : (
                            <Typography variant="body2">None available</Typography>
                          )}
                        </Box>

                        {/* Outputs */}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Output:</Typography>
                          {selectedNodeConfig.io?.outputs?.length > 0 ? (
                            selectedNodeConfig.io.outputs.map((output, index, arr) => (
                              <Typography key={output.name} variant="body2">
                                {arr.length > 1 ? `${output.name}: ` : ''}
                                {output.types.join(', ')}
                              </Typography>
                            ))
                          ) : (
                            <Typography variant="body2">None available</Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                      <Paper elevation={0} sx={{
                        transition: 'transform 150ms ease, background-color 300ms ease, border-color 300ms ease',
                        marginBottom: 1, padding: 1, borderRadius: 1, cursor: 'grab', backgroundColor: 'white'
                      }}>
                        <ToolParameterSection
                          toolConfig={selectedNodeConfig}
                          parameters={selectedNodeData.paramValues}
                          validationErrors={{}}
                          handleParameterChange={handleChangeParam}
                          toggleParameter={handleToggleParam}
                        />
                      </Paper>
                    </Box>
                    {/* <Box>
                      <ToolOutputPanel outputData={selectedNodeData.outputs} rows={5} />
                    </Box> */}
                  </Box>
                </Paper>
              )}

              {selectedNode && selectedNode.type === 'outputWorkflowNode' && (
                <ToolOutputPanel
                  outputData={selectedNodeData.output}
                  // setOutputData={setOutputData} 
                  // tool={selectedTool} 
                  // inputData={inputData} 
                  // page={'ToolPage'} 
                  rows={25}
                />
              )}

            </Grid>
          </Grid>
        </Container>
      </Box>
    </ErrorBoundary>
  );
};

export default WorkflowPage;