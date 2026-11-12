import React, { memo, useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { Handle, Position, useNodeConnections, useNodesData, useReactFlow } from '@xyflow/react';
import { OneConnectionHandle } from './OneConnectionHandle';

import { getTool } from '../../utils/toolUtils';
import { detectDataType } from '../../utils/detectDataType';

import ToolMessageIcons from '../ToolMessageIcons';

const defaultNodeWidth = 150
const portCharWidth = 5 // px, at the labels' font size of 8

export const WorkflowNode = memo(({ id, data }) => {
  const { label, paramValues, outputs } = data;

  const { updateNodeData } = useReactFlow();

  const toolData = getTool(label)
  const { inputs: toolInputs = [], outputs: toolOutputs = [] } = toolData.io ?? {};

  // check if required parameters are not filled in
  useEffect(() => {
    const missingRequiredParameters = toolData.parameters?.some(param =>
      param.required && param.type != "flag" && !paramValues?.[param.name]?.value
    );

    const toolMessages = {
      ...(data.toolMessages ?? {}),
      Parameter: {
        ...(data.toolMessages?.Parameter ?? {}),
        error: [],
      },
    };

    if (missingRequiredParameters) {
      toolMessages["Parameter"].error = ["Missing Required Parameters"]
    }

    updateNodeData(id, { canRun: !missingRequiredParameters, toolMessages })
  }, [paramValues]);

  // check if the output is not of an expected type
  useEffect(() => {
    const toolMessages = {
      ...(data.toolMessages ?? {}),
      Parameter: {
        ...(data.toolMessages?.Parameter ?? {}),
        info: [],
      },
    };

    for (const outputName in outputs) {
      const definedTypes = toolData.io.outputs.find(o => o.name === outputName).types
      const detectedType = detectDataType(data.outputs[outputName], definedTypes)
      const isInvalidOutputType = !definedTypes.includes(detectedType)

      if (isInvalidOutputType){
        toolMessages["Parameter"].info.push(`Output "${outputName}" is of an unexpected type "${detectedType}"`)
      }
    }

    updateNodeData(id, {toolMessages})
  }, [outputs]);

  // Ports sit at even intervals, so a node needs room for its longest name in
  // every interval, and one more for the two ends.
  function widthForPorts(ports) {
    if (ports.length < 2) return 0
    return (ports.length + 1) * Math.max(...ports.map(port => port.name.length)) * portCharWidth
  }

  function renderInputHandles() {
    return toolInputs.map((input, idx) => (
      <div
        key={input.name}
        style={{
          position: 'absolute',
          top: 0,
          left: `${((idx + 1) / (toolInputs.length + 1)) * 100}%`,
          transform: 'translateX(-50%)',
          textAlign: 'center'
        }}
      >
        {toolInputs.length > 1 && <div style={{ marginTop: 2, fontSize: 8 }}>{input.name}</div>}
        <OneConnectionHandle id={input.name} type="target" position={Position.Top} />
      </div>
    ));
  }

  function renderOutputHandles() {
    return toolOutputs.map((output, idx) => (
      <div
        key={output.name}
        style={{
          position: 'absolute',
          bottom: 0,
          left: `${((idx + 1) / (toolOutputs.length + 1)) * 100}%`,
          transform: 'translateX(-50%)',
          textAlign: 'center'
        }}
      >
        <Handle id={output.name} type="source" position={Position.Bottom} />
        {toolOutputs.length > 1 && <div style={{ marginBottom: 2, fontSize: 8 }}>{output.name}</div>}
      </div>
    ));
  }

  return (

    <div
      className="react-flow__node-default"
      style={{
        position: 'relative',
        width: Math.max(defaultNodeWidth, widthForPorts(toolInputs), widthForPorts(toolOutputs)),
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center">
        <label>{label}</label>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="center">
        <ToolMessageIcons
          messages={data.toolMessages}
          size={12}
          pulseEnabled={false}
          sx={{ ml: 0.25, height: 12 }}
        />
      </Box>

      {/* Render input and output handles */}
      {renderInputHandles()}
      {renderOutputHandles()}
    </div>
  )
})
