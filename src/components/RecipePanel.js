import React, { useEffect, useContext, useCallback, useImperativeHandle, forwardRef, useState } from 'react';
import { ReactFlow, useStoreApi, useReactFlow, useNodesState, useEdgesState, applyNodeChanges, applyEdgeChanges, addEdge, Background, BackgroundVariant, ViewportPortal, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Paper, Button, Box, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { WorkflowNode } from './nodes/WorkflowNode';
import { OutputWorkflowNode } from './nodes/OutputWorkflowNode';
import { InputWorkflowNode } from './nodes/InputWorkflowNode';
import { WorkflowEdge } from './nodes/WorkflowEdge';
import { loadTool, toolHasNoInputs, getTool, runTools, parameterArguments } from '../utils/toolUtils';
import { NotificationContext } from '../contexts/NotificationContext';
import { getNodeHandles, isValidWorkflowConnection, prepareWorkflowNodesForExport, prepareWorkflowNodesForLocalStorage } from '../utils/workflowUtils';
import logger from '../utils/logger';
import { resolveCollisions } from '../utils/resolveNodeCollisions';
import { getBlob, removeUnreferencedBlobs } from '../utils/blobStore';
import { makeBinaryDataValue } from '../utils/dataValue';

const RecipePanel = forwardRef(({ selectedNode, setSelectedNode, indexLoaded }, ref) => {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  const defaultNodeWidth = 150
  const defaultNodeHeight = 40

  const store = useStoreApi()
  const { updateNodeData, screenToFlowPosition, getNode, getViewport, setViewport, toObject, setCenter } = useReactFlow();
  const showNotification = useContext(NotificationContext);

  const [agentUrl, setAgentUrl] = useState("http://localhost:8000/convert");
  const [openDialog, setOpenDialog] = useState(false);
  const [renderWorklowBoxes, setRenderWorklowBoxes] = useState(true);

  const [workflowLoaded, setWorkflowLoaded] = useState(false);

  useEffect(() => {
    if (!indexLoaded) return;

    const fetchWorkflow = async () => {
      const flow = JSON.parse(localStorage.getItem("workflow"));

      if (flow) {
        const { nodes: savedNodes = [], edges: savedEdges = [], viewport = {} } = flow;

        let blobsToKeep = []
        for (const node of savedNodes) {
          if (node.type === 'workflowNode') {
            const result = await loadTool(node.data.label);
            if (!result) return
          }

          if (node.type === 'inputWorkflowNode') {
            for (const [key, value] of Object.entries(node.data.outputs || {})) {
              if (value?.kind === "reference") {
                const blob = await getBlob(value.data)
                blobsToKeep.push(value.data)
                node.data.outputs[key] = makeBinaryDataValue(blob?.bytes ?? new Uint8Array)
              }
            }
          }
        }
        removeUnreferencedBlobs(blobsToKeep)

        setNodes(savedNodes);
        setEdges(savedEdges);
        setViewport(viewport);
      }

      // add an initial input node if the worklow was empty
      if (!flow || flow.nodes.length == 0) {
        setNodes([{
          id: `input-${Date.now()}`,
          type: 'inputWorkflowNode',
          data: { label: "Input" },
          position: {
            x: 0,
            y: 200,
          },
          selected: true
        }])
      }

      setWorkflowLoaded(true);
    };

    fetchWorkflow()
  }, [indexLoaded])

  // TODO(andrade)
  // Make this more reasonable then just storing at every change.
  // Running this every change is doomed to give performance issues.
  useEffect(() => {
    if (!workflowLoaded) return;

    const flow = toObject();
    flow.nodes = prepareWorkflowNodesForLocalStorage(flow.nodes)

    localStorage.setItem('workflow', JSON.stringify(flow));
  }, [nodes, edges]);

  useEffect(() => {
    if (!selectedNode) return;
    const node = nodes.find((n) => n.id === selectedNode.id);
    if (JSON.stringify(node?.data) !== JSON.stringify(selectedNode.data)) {
      updateNodeData(selectedNode.id, selectedNode.data);
    }
  }, [selectedNode?.data]);

  const onNodesChange = useCallback((changes) => {
    setNodes((prev) => applyNodeChanges(changes, prev));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((prev) => applyEdgeChanges(changes, prev));
  }, []);

  const onConnect = useCallback((params) => {
    setEdges((prev) =>
      addEdge(
        {
          ...params,
          type: 'workflowEdge',
        },
        prev
      )
    );
  }, [setEdges]);

  const applyCollisionResolution = (nodes) => {
    return resolveCollisions(nodes, {
      maxIterations: 100,
      overlapThreshold: 0.5,
      margin: 5,
    });
  };

  const onNodeDragStop = useCallback(() => {
    setNodes((nds) => applyCollisionResolution(nds));
  }, [setNodes]);

  const resolveAndSetNodes = useCallback((updater) => {
    setNodes((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return applyCollisionResolution(next);
    });
  }, [setNodes]);

  const onSelectionChange = useCallback((params) => {
    if (params.nodes.length == 1) {
      const newNode = params.nodes[0]
      if (!selectedNode || selectedNode.id != newNode.id) {
        setSelectedNode(newNode)
      }
    }
    else {
      setSelectedNode(null)
    }
  });

  const onNodesDelete = useCallback((nodes) => {
    for (const node of nodes) {
      if (node.id == selectedNode?.id) {
        setSelectedNode(null)
      }
    }
  });

  const getCenterPosition = () => {
    const { domNode } = store.getState()
    const boundingRect = domNode?.getBoundingClientRect()

    return screenToFlowPosition({
      x: boundingRect.x + boundingRect.width / 2,
      y: boundingRect.y + boundingRect.height / 2,
    })
  }

  const addNode = ({ id, type, data = {} }) => {
    const referenceNode = selectedNode ? getNode(selectedNode.id) : null

    let position = null
    if (referenceNode && type != "inputWorkflowNode") {
      position = {
        x: referenceNode.position.x,
        y: referenceNode.position.y + defaultNodeHeight * 2
      }
    }
    else {
      const center = getCenterPosition();
      position = {
        x: center.x - defaultNodeWidth / 2,
        y: center.y - defaultNodeHeight / 2,
      }
    }

    const newNode = {
      id, type, data, position
    };

    resolveAndSetNodes(prevNodes => {
      let updatedNodes = prevNodes

      if (newNode.type != "outputWorkflowNode") {
        updatedNodes = prevNodes.map(n => ({
          ...n,
          selected: false
        }));
        newNode.selected = true
      }

      return [
        ...updatedNodes,
        newNode
      ];
    });

    // TODO: make this less confusing
    if (referenceNode) {
      const [sourceInputHandles, sourceOutputHandles] = getNodeHandles(referenceNode)
      const [targetInputHandles, targetOutputHandles] = getNodeHandles(newNode)

      if (newNode.type == "workflowNode" || newNode.type == "outputWorkflowNode") {
        if (sourceOutputHandles.length > 0 && targetInputHandles.length > 0) {

          let newEdgeSourceHandle = null
          let newEdgeTargetHandle = targetInputHandles[0]
          for (const sourceHandle of sourceOutputHandles) {
            const handleOccupied = edges.some(
              e => e.source === referenceNode.id && e.sourceHandle === sourceHandle
            );

            const isValidConnection = isValidWorkflowConnection(
              referenceNode, sourceHandle, newNode, newEdgeTargetHandle
            )

            if (!handleOccupied && (isValidConnection)) {
              newEdgeSourceHandle = sourceHandle
              break
            }
          }

          if (newEdgeSourceHandle != null) {
            const newEdge = {
              source: referenceNode.id,
              sourceHandle: newEdgeSourceHandle,
              target: newNode.id,
              targetHandle: newEdgeTargetHandle,
              type: "workflowEdge"
            }

            setEdges((prev) =>
              addEdge(newEdge, prev)
            );
          }

        }
      }
    }

    return id;
  };

  const addWorkflowNode = (toolDefinition) => {
    let initialParamValues = {};
    let toolMessages = { "Parameter": {} }

    toolDefinition.parameters.forEach(param => {
      initialParamValues[param.name] = {
        enabled: param.required ?? false,
        value: param.default !== undefined ? param.default : '',
      };
    });

    const missingRequiredParameters = toolDefinition.parameters.some(param =>
      param.required && param.type != "flag" && !initialParamValues?.[param.name]?.value
    );

    if (missingRequiredParameters) {
      toolMessages["Parameter"].error = ["Missing Required Parameters"]
    }

    return addNode({
      id: `${toolDefinition.id}-${Date.now()}`,
      type: "workflowNode",
      data: {
        label: toolDefinition.name,
        outputs: {},
        output: "",
        repo: toolDefinition.repo,
        paramValues: initialParamValues,
        toolMessages
      },
    });
  };

  const addInputNode = () => {
    return addNode({
      id: `input-${Date.now()}`,
      type: "inputWorkflowNode",
      data: {
        label: "Input",
      }
    });
  };

  const addOutputNode = () => {
    return addNode({
      id: `output-${Date.now()}`,
      type: "outputWorkflowNode",
      data: {
        label: "Output",
      }
    });
  };

  const clearWorkflow = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null)
  };

  // Export Workflow
  const exportWorkflow = useCallback(() => {
    if (nodes.length === 0) return;

    const flow = toObject();
    flow.nodes = prepareWorkflowNodesForExport(flow.nodes);
    const fileContent = JSON.stringify(flow, null, 2);

    const blob = new Blob([fileContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow.json`;
    a.click();

    URL.revokeObjectURL(url);
  }, [nodes, toObject]);

  // Import Workflow
  const importWorkflow = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const flow = JSON.parse(text);

        const { nodes: importedNodes = [], edges: importedEdges = [], viewport = {} } = flow;
        const invalidNodeIds = new Set();

        for (const node of importedNodes) {
          if (node.type === 'workflowNode') {
            // TODO tool versions
            const result = await loadTool(node.data.label);
            if (result == false) {
              invalidNodeIds.add(node.id);
              showNotification(`Tool "${node.data.label}" from imported workflow not available`, "error")
            }
          }
        }

        if (invalidNodeIds.size === 0) {
          showNotification("Workflow imported successfully", "info");
        }
        else {
          showNotification(
            `Workflow imported with ${invalidNodeIds.size} missing tools`,
            "info"
          );
        }
        const filteredNodes = importedNodes.filter(
          (node) => !invalidNodeIds.has(node.id)
        );

        const filteredEdges = importedEdges.filter(
          (edge) =>
            !invalidNodeIds.has(edge.source) &&
            !invalidNodeIds.has(edge.target)
        );

        setNodes(filteredNodes);
        setEdges(filteredEdges);

        if (viewport && typeof viewport === 'object') {
          setViewport(viewport);
        }

      } catch (err) {
        console.error("Failed to import workflow:", err);
        alert("Invalid JSON file.");
      }
    };

    input.click();
  }, [setNodes, setEdges, setViewport]);

  useImperativeHandle(ref, () => ({
    addWorkflowNode,
  }));

  // TODO: this code is duplicated from get component bounds
  const resetViewportPosition = () => {
    if (!nodes.length) return;

    const xs = nodes.map(n => n.position.x);
    const ys = nodes.map(n => n.position.y);

    const widths = nodes.map(n => n.measured?.width || 0);
    const heights = nodes.map(n => n.measured?.height || 0);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs.map((x, i) => x + widths[i]));
    const maxY = Math.max(...ys.map((y, i) => y + heights[i]));

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setCenter(centerX, centerY, { zoom: getViewport().zoom, duration: 300 });
  };

  function getWorklowComponents() {
    const undirected = new Map();
    const directed = new Map();

    for (const node of nodes) {
      undirected.set(node.id, new Set());
      directed.set(node.id, new Set());
    }

    for (const edge of edges) {
      undirected.get(edge.source).add(edge.target);
      undirected.get(edge.target).add(edge.source);

      directed.get(edge.source).add(edge.target);
    }

    const visited = new Set();
    const components = [];

    function depthFirstSearch(nodeId, componentSet) {
      visited.add(nodeId);
      componentSet.add(nodeId);

      for (const neighbor of undirected.get(nodeId)) {
        if (!visited.has(neighbor)) {
          depthFirstSearch(neighbor, componentSet);
        }
      }
    }

    function dependencyOrder(componentArray) {
      const ordered = [];
      const visited = new Set();

      function visit(nodeId) {
        if (visited.has(nodeId)) return;

        visited.add(nodeId);

        const parentEdges = edges.filter(
          (e) =>
            e.target === nodeId &&
            componentArray.includes(e.source)
        );

        for (const edge of parentEdges) {
          visit(edge.source);
        }

        ordered.push(nodeId);
      }

      let sinks = []
      for (const nodeId of componentArray) {
        const isSink = !edges.some(
          (e) =>
            e.source === nodeId &&
            componentArray.includes(e.target)
        )

        if (isSink) sinks.push(nodeId)
      }

      for (const sink of sinks) {
        visit(sink);
      }

      return ordered;
    }

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        const componentSet = new Set();
        depthFirstSearch(node.id, componentSet);
        const componentArray = Array.from(componentSet);

        components.push(
          dependencyOrder(componentArray)
        );
      }
    }

    return components;
  }

  function getComponentBounds(component) {
    const relevant = nodes.filter(n => component.includes(n.id));

    const xs = relevant.map(n => n.position?.x);
    const ys = relevant.map(n => n.position?.y);

    const widths = relevant.map(n => n.measured?.width || 0);
    const heights = relevant.map(n => n.measured?.height || 0);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs.map((x, i) => x + widths[i]));
    const maxY = Math.max(...ys.map((y, i) => y + heights[i]));

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  function isValidWorkflowComponent(component) {
    for (const edge of edges) {
      if (!component.includes(edge.source) || !component.includes(edge.target)) continue

      const valid = isValidWorkflowConnection(
        getNode(edge.source),
        edge.sourceHandle,
        getNode(edge.target),
        edge.targetHandle
      )

      if (!valid) return false
    }

    return true
  }

  async function runWorkflow(component) {
    if (!isValidWorkflowComponent(component)) {
      showNotification(`Please fix the worklow connections before running`, "error")
      return
    }

    let toolInvocations = []
    for (const nodeId of component) {
      const node = getNode(nodeId)
      if (!node) throw "invalid node when trying to run workflow"
      if (node.type != "workflowNode") continue

      if (node.data.canRun == false) {
        showNotification(`Cannot run worklow because node "${node.data.label}" is not valid`, "error")
        return
      }

      const toolDefinition = getTool(node.data.label)

      let inputs = {}
      for (const edge of edges) {
        if (edge.target == nodeId) {
          const sourceNode = getNode(edge.source)

          inputs[edge.targetHandle] = {
            mode: sourceNode.type == "inputWorkflowNode" ? "text" : "output",
            value: sourceNode.type == "inputWorkflowNode" ?
              sourceNode.data.outputs["out"] : [edge.source, edge.sourceHandle],
          }
        }
      }

      let args = []
      toolDefinition.parameters.forEach(param => {
        const enabled = node.data.paramValues[param.name]?.enabled;
        if (!enabled) return;

        const value = node.data.paramValues[param.name].value;

        if (param.type === 'flag') {
          args.push(param.flag);
        }
        else if (value !== undefined && value !== null && value !== '') {
          args.push(...parameterArguments(param.flag, value));
        }
      });

      toolInvocations.push({
        toolName: node.data.label,
        uniqueId: node.id,
        toolArguments: args,
        inputs
      })
    }

    if (toolInvocations.length == 0) {
      showNotification(`Cannot run workflow with no tools`, "error")
      return
    }

    for (const nodeId of component) {
      if (getNode(nodeId).type == "workflowNode") {
        updateNodeData(nodeId, { outputs: {}, isRunning: true })
      }
    }

    const { outputs, errors } = await runTools(
      toolInvocations,
      (nodeId, outputs, errors) => {
        const messages = {
          ...(getNode(nodeId).data.toolMessages ?? {}),
          "Output": {},
        };

        const error = errors.join("\n")
        if (error) {
          const stderrLines = error.split('\n').map(line => line.trim()).filter(Boolean);

          const hasOutput = Object.values(outputs).some(
            value => value !== undefined && value !== null && value.data !== ''
          );
          const failed = error && !hasOutput

          if (failed) {
            messages["Output"].error = stderrLines;
          } else {
            messages["Output"].info = stderrLines;
          }
        }

        updateNodeData(nodeId, {
          outputs,
          toolMessages: messages,
          isRunning: false
        })
      }
    )
  }

  // TODO
  // async function runWorkflowAgent(url) {
  //   let fileData = {}
  //   for (const node of nodes) {
  //     if (node.type == "inputWorkflowNode") {
  //       fileData[node.id + "-out" + ".txt"] = node.data.outputs["out"]
  //     }
  //   }

  //   const formData = new FormData();

  //   const flow = toObject();
  //   flow.nodes = sanitizeWorkflowNodes(flow.nodes);
  //   formData.append("biochef_workflow", JSON.stringify(flow));

  //   for (const [filename, content] of Object.entries(fileData)) {
  //     const file = new File([content], filename, { type: "text/plain" });
  //     formData.append("files", file);
  //   }

  //   let response = null
  //   try {
  //     response = await fetch(url, {
  //       method: "POST",
  //       body: formData
  //     });
  //   }
  //   catch {
  //     logger.error("Could not send request to agent")
  //     showNotification("Agent could not be reached", "error")
  //     return
  //   }

  //   if (!response) {
  //     logger.error("Did not get a response from agent agent")
  //     showNotification("Agent did not responde", "error")
  //     return
  //   }

  //   let data = null
  //   try {
  //     data = await response.json();
  //   }
  //   catch {
  //     logger.error("Could not process response from agent")
  //     showNotification("Invalid reponse from agent", "error")
  //     return
  //   }

  //   for (const [node_id, outputs] of Object.entries(data)) {
  //     updateNodeData(node_id, { outputs })
  //   }
  // }

  const WorkflowButton = ({ children, ...props }) => (
    <Button
      variant='outlined'
      sx={{
        borderColor: 'lightgray',
        color: 'darkslategrey',
        background: 'rgba(255, 255, 255, 1)',
        '&:hover': {
          borderColor: 'lightgray',
          background: 'rgba(240, 240, 240, 1)',
        },
        margin: 0.5
      }}
      disableElevation
      {...props}
    >
      {children}
    </Button>
  );

  const isValidConnection = (connection) => {
    const { source, sourceHandle, target, targetHandle } = connection;
    return isValidWorkflowConnection(getNode(source), sourceHandle, getNode(target), targetHandle)
  };

  if (!workflowLoaded) {
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
    <Paper elevation={3} sx={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
        onSelectionChange={onSelectionChange}
        nodeTypes={{
          workflowNode: WorkflowNode,
          outputWorkflowNode: OutputWorkflowNode,
          inputWorkflowNode: InputWorkflowNode
        }}
        edgeTypes={{
          workflowEdge: WorkflowEdge,
        }}
        isValidConnection={isValidConnection}
        fitView
      >
        <Background bgColor="#FFFFFF" color='#009688' variant={BackgroundVariant.Dots} />

        <Panel>
          <WorkflowButton onClick={addInputNode}>
            Add Input Node
          </WorkflowButton>
          <WorkflowButton onClick={addOutputNode}>
            Add Output Node
          </WorkflowButton>
          <WorkflowButton onClick={importWorkflow}>
            Import Workflow
          </WorkflowButton>
          <WorkflowButton onClick={exportWorkflow}>
            Export Workflow
          </WorkflowButton>
          <WorkflowButton onClick={clearWorkflow}>
            Clear Workflow
          </WorkflowButton>
          <WorkflowButton onClick={resetViewportPosition}>
            Recenter
          </WorkflowButton>
          <WorkflowButton onClick={() => setRenderWorklowBoxes(!renderWorklowBoxes)} >
            Toggle Workflow Groups
          </WorkflowButton>
          {/* {process.env.NODE_ENV === 'development' && (
            <WorkflowButton onClick={() => setOpenDialog(true)}>
              Run Workflow with Agent
            </WorkflowButton>
          )} */}
        </Panel>

      </ReactFlow>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Enter Agent URL</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="URL"
            value={agentUrl}
            onChange={(e) => setAgentUrl(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              setOpenDialog(false);
              await runWorkflowAgent(agentUrl);
            }}
          >
            Run
          </Button>
        </DialogActions>
      </Dialog>

      <ViewportPortal>
        {renderWorklowBoxes && getWorklowComponents().map((component, idx) => {
          const bounds = getComponentBounds(component);
          const componentNodes = component.map((n) => getNode(n)).filter(Boolean);

          const hasWorkflowNode = componentNodes.some((n) => n.type === "workflowNode");

          const hasInputNode = componentNodes.some((n) =>
            n.type === "inputWorkflowNode" ||
            (n.type === "workflowNode" && toolHasNoInputs(n.data?.label))
          );

          if (!hasWorkflowNode || !hasInputNode) {
            return;
          }

          return (
            <React.Fragment key={idx}>
              <div
                style={{
                  position: 'absolute',
                  left: bounds.x - 20,
                  top: bounds.y - 20,
                  width: bounds.width + 40,
                  height: bounds.height + 40,
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 8,
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  left: bounds.x - 30,
                  top: bounds.y - 30,
                  pointerEvents: 'all',
                  // transform: 'translateX(-50%)',
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    minWidth: 24,
                    width: 24,
                    height: 24,
                    padding: 0,
                    fontSize: 10,
                  }}
                  onClick={() => runWorkflow(component)}
                >
                  ▶
                </Button>
              </div>
            </React.Fragment>
          );
        })}
      </ViewportPortal>
    </Paper>
  );
});

export default RecipePanel;