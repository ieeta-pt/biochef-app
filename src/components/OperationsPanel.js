import { AddCircle, Block } from '@mui/icons-material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import debounce from 'lodash.debounce';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { ValidationErrorsContext } from '../contexts/ValidationErrorsContext';
import { TourContext } from '../contexts/TourContext';
import { getToolsByCategory, getTool } from '../utils/toolUtils';
import { detectAllDataTypes } from '../utils/detectDataType';
import { isValidConnection } from '../utils/workflowUtils';

const OperationsPanel = ({ onAddOperation, isWorkflowEmpty, isLoading, setIsLoading, insertAtIndex, setInsertAtIndex, addingATool, setAddingATool, filteredTools, setFilteredTools, selectedFiles, tabIndex, workflow, selectedNode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const showNotification = useContext(NotificationContext);
  const { validationErrors } = useContext(ValidationErrorsContext); // Access validation errors
  const { tourRegisterSteps, tourMoveNext } = useContext(TourContext);
  const hasValidationErrors = Object.values(validationErrors).some(error => Object.keys(error).length > 0);
  const noFilesSelected = tabIndex === 1 && selectedFiles.size === 0;
  const shouldDisableInteraction = hasValidationErrors || noFilesSelected;

  const [selectedNodeTypes, setSelectedNodeTypes] = useState([]);

  useEffect(() => {
    if (!selectedNode) {
      setSelectedNodeTypes([]);
      return;
    }

    if (selectedNode?.type == "inputWorkflowNode") {
      const outputs = selectedNode?.data?.outputs
      if (outputs && "out" in outputs) {
        setSelectedNodeTypes(detectAllDataTypes(outputs["out"]))
      }
      else {
        setSelectedNodeTypes([])
      }
    }
    else if (selectedNode?.type == "workflowNode") {
      const toolName = selectedNode?.data?.label
      const toolInfo = getTool(toolName)
      setSelectedNodeTypes(toolInfo.outputTypes)
    }

  }, [selectedNode]);

  // Debounced search handler
  const handleSearch = useMemo(
    () => debounce((value) => setSearchTerm(value), 300),
    []
  );

  const onChange = (e) => {
    handleSearch(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Filter operations based on search term
  const filterOperations = (operations) => {
    return operations.filter((op) => {
      const matchesSearch =
        op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = isValidConnection(selectedNodeTypes, op.inputTypes)

      const isSearching = searchTerm !== "";
      const hasNodeSelected = selectedNode && selectedNode.type != "outputWorkflowNode";

      if (isSearching) {
        return matchesSearch;
      }

      const hasNoInputs = getTool(op.name).inputTypes == 0
      if (!hasNodeSelected) {
        return hasNoInputs;
      }

      return matchesType;
    });
  };

  // Determine compatible tools
  // const compatibleTools = useMemo(() => {
  //   if (isWorkflowEmpty) {
  //     // Execute getCompatibleTools even if dataType is 'UNKNOWN' when the workflow is empty
  //     const compatible = getCompatibleTools(dataType, isWorkflowEmpty, workflow);
  //     return new Set(compatible.map((tool) => tool.name));
  //   }

  //   if (!dataType || dataType === 'UNKNOWN') return new Set();
  //   const compatible = getCompatibleTools(dataType, isWorkflowEmpty, workflow);

  //   return new Set(compatible.map((tool) => tool.name));
  // }, [dataType, isWorkflowEmpty, workflow]);

  useEffect(() => {
    tourRegisterSteps("w-operations", [
      {
        element: '[data-tour="operations-panel"]',
        popover: {
          title: "Operations",
          description: "This panel allows you to select tools for your workflow.<br /><br />You can hover over a tool to see its description, collapse tool groups for easier navigation and use the search bar to quickly find the tool you're looking for.<br /><br />The available tools are dynamically filtered based on the input type you've selected.",
        },
      },
      {
        element: '[data-tour="add-operation"]',
        popover: {
          title: "Add Tools",
          description: "For this tour, let's add this tool to your workflow.",
          showButtons: ["previous", "exit"],
        },
      },
    ]);
  }, []);

  // Expand categories with available tools
  useEffect(() => {
    const newExpandedCategories = {};
    Object.entries(getToolsByCategory()).forEach(([category, operations]) => {
      const filteredOps = filterOperations(operations)
      if (filteredOps.length > 0) {
        newExpandedCategories[category] = true;
      }
    });
    setExpandedCategories(newExpandedCategories);
  }, [selectedNodeTypes, searchTerm, insertAtIndex]);

  useEffect(() => {
    if (insertAtIndex !== null && filteredTools.length > 0) {
      const newExpandedCategories = {};
      Object.entries(getToolsByCategory()).forEach(([category, operations]) => {
        const filteredOps = operations.filter((op) =>
          filteredTools.some((tool) => tool.name === op.name)
        );
        if (filteredOps.length > 0) {
          newExpandedCategories[category] = true;
        }
      });
      setExpandedCategories(newExpandedCategories);
    }
  }, [insertAtIndex, filteredTools]);

  const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(0, 123, 255, 0.1);
  }
  50% {
    transform: scale(1.01);
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(0, 123, 255, 0.1);
  }
`;

  return (
    <Paper data-tour="operations-panel" elevation={3} sx={{ padding: 2, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {insertAtIndex !== null && addingATool && (
        <Box
          sx={{
            padding: 2,
            marginBottom: 2,
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            border: '1px solid rgba(0, 123, 255, 0.3)',
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            animation: `${pulseAnimation} 1.5s infinite ease-in-out`,
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Adding a new tool to the workflow. Click on a tool to insert it at the selected position or{' '}
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <Button
                onClick={() => {
                  setInsertAtIndex(null);
                  setAddingATool(false);
                  setFilteredTools([]);
                }}
                color="primary"
                sx={{ textTransform: 'none', padding: 0, minWidth: 'auto' }}
              >
                cancel
              </Button>
            </Box>.
          </Typography>
        </Box>
      )}

      {/* {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )} */}

      {/* Overlay to block interaction */}
      {shouldDisableInteraction && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: hasValidationErrors ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.7)',
            zIndex: 10,
            pointerEvents: 'all',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {hasValidationErrors && (
            <>
              <Block sx={{
                color: 'error.main',
                fontSize: 60,
              }} />
              <Typography variant="body1" sx={{ color: 'error.main', textAlign: 'center' }}>
                Correct the invalid parameters in the workflow to unlock the unavailable features.
              </Typography>
            </>
          )}
        </Box>
      )}

      <Typography variant="h6" align="center" gutterBottom>
        Available Tools
      </Typography>
      <TextField
        label="Search Operations"
        variant="outlined"
        size="small"
        fullWidth
        onChange={onChange}
        sx={{ marginBottom: 2 }}
      />
      <List sx={{ overflowY: 'auto', flexGrow: 1 }}>
        {Object.entries(getToolsByCategory()).map(([category, operations]) => {
          const filteredOps = filterOperations(operations)

          return (
            <React.Fragment key={category}>
              <ListItemButton onClick={() => handleCategoryClick(category)}>
                <ListItemText primary={`${category} (${filteredOps.length})`} />
                {expandedCategories[category] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={expandedCategories[category] || searchTerm !== ''} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {filteredOps.map((operation) => {
                    const toolInputTypes = getTool(operation.name).inputTypes
                    const hasNoInput = toolInputTypes.length == 0

                    const matchesType =
                      isValidConnection(selectedNodeTypes, operation.inputTypes) 
                      && selectedNode?.type !== "outputWorkflowNode";

                    const isDisabled = !hasNoInput && (!selectedNode || !matchesType);

                    let tooltipContent;
                    if (hasNoInput && !selectedNode) {
                      tooltipContent = "";
                    }
                    else if (!selectedNode || selectedNode.type === "outputWorkflowNode") {
                      tooltipContent = `Please select a node to be able to add new tools to the workflow (this tool requires: ${toolInputTypes})`;
                    }
                    else if (!matchesType) {
                      tooltipContent = `This tool is not compatible with the selected node (this tool requires: ${toolInputTypes})`;
                    }
                    else {
                      tooltipContent = operation.description;
                    }

                    return (
                      <Tooltip
                        key={operation.name}
                        title={
                          <React.Fragment>
                            <Typography variant="body2" color="inherit">
                              {tooltipContent}
                            </Typography>
                          </React.Fragment>
                        }
                        placement="right"
                        disableHoverListener={tooltipContent === ""}
                      >
                        <span>
                          <ListItemButton
                            disabled={isDisabled}
                            sx={{
                              pl: 4,
                              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                              '&:hover': {
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.4),
                              },
                            }}
                            data-tour={operation.name === "fasta_to_seq" ? "add-operation" : undefined}
                            onClick={() => {
                              setIsLoading(true);
                              if (insertAtIndex !== null && addingATool) {
                                onAddOperation(operation.name, insertAtIndex);
                                setFilteredTools([]);
                                setAddingATool(false);
                                showNotification('Tool added successfully!', 'success');
                              } else {
                                onAddOperation(operation.name);
                              }
                            }}
                          >
                            <ListItemText primary={operation.name} />
                            <AddCircle sx={{ color: 'primary.main', ml: 'auto' }} />
                          </ListItemButton>
                        </span>
                      </Tooltip>
                    )
                  })}
                </List>
              </Collapse>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
};

export default OperationsPanel;