import { getTool } from "./toolUtils";
import { detectAllDataTypes } from "./detectDataType";
import { isTypeBinary } from "./typeDefinitions";
import { makeReferenceDataValue } from "./dataValue";
import { putBlob } from "./blobStore"

function sanitizeWorkflowNodes(nodes, { keepText = true, keepBinaryAsReference = false } = {}) {
  return nodes.map(node => {
    const outputs = {};

    if (node.type === "inputWorkflowNode") {
      for (const [key, value] of Object.entries(node.data.outputs || {})) {
        if (value?.kind === "text" && keepText) {
          outputs[key] = value;
        }
        else if (value?.kind === "binary" && keepBinaryAsReference) {
          const blobId = node.id + key
          putBlob(blobId, value.data, "binary")
          outputs[key] = makeReferenceDataValue(blobId);
        }
      }
    }

    return {
      ...node,
      data: {
        ...node.data,
        outputs,
        output: {},
        toolMessages: {},
        isRunning: false,
        runCalled: false
      }
    };
  });
}

export function prepareWorkflowNodesForLocalStorage(nodes) {
  return sanitizeWorkflowNodes(nodes, {
    keepBinaryAsReference: true
  });
}

// Input data stays out of an exported file unless the user asks for it:
// the file is meant to be shared, and the data may be private.
export function prepareWorkflowNodesForExport(nodes, { includeData = false } = {}) {
  return sanitizeWorkflowNodes(nodes, {
    keepText: includeData,
    keepBinaryAsReference: false
  });
}

export function workflowHasInputData(nodes) {
  return nodes.some(node =>
    node.type === "inputWorkflowNode" &&
    Object.values(node.data.outputs || {}).some(value => value?.kind === "text")
  );
}

export function isValidConnection(sourceTypes, targetTypes) {
  let _sourceTypes = [...sourceTypes];

  // here we add TEXT as a sourceType if any of the current sourceTypes are not binary
  // this is so that we can have tools like GREP only have the TEXT type and still work
  for (const type of _sourceTypes) {
    if (!_sourceTypes.includes("TEXT") && !isTypeBinary(type)) {
      _sourceTypes.push("TEXT")
      break
    }
  }

  return _sourceTypes.some((type) =>
    targetTypes.includes(type)
  );
}

export function isValidWorkflowConnection(sourceNode, sourceHandle, targetNode, targetHandle) {
  if (!sourceNode || !targetNode) return false;

  if (targetNode.type == "outputWorkflowNode") return true;

  let sourceTypes = null;
  if (sourceNode.type == "inputWorkflowNode") {
    sourceTypes = detectAllDataTypes(sourceNode.data.outputs?.["out"])
  }
  else if (sourceNode.type === "workflowNode") {
    const toolConfig = getTool(sourceNode.data.label);
    sourceTypes = toolConfig.io.outputs.find((n) => n.name === sourceHandle).types;
  }
  if (!sourceTypes) return false

  let targetTypes = null;
  if (targetNode.type === "workflowNode") {
    const toolConfig = getTool(targetNode.data.label);
    targetTypes = toolConfig.io.inputs.find((n) => n.name === targetHandle).types;
  }
  if (!targetTypes) return false

  return isValidConnection(sourceTypes, targetTypes)
};

export function getNodeHandles(node) {
  if (node.type == "inputWorkflowNode") {
    return [
      [],
      ["out"]
    ]
  }
  else if (node.type == "outputWorkflowNode") {
    return [
      [undefined],
      []
    ]
  }
  else if (node.type == "workflowNode") {
    const toolData = getTool(node.data.label)
    const { inputs: toolInputs = [], outputs: toolOutputs = [] } = toolData.io ?? {};

    return [
      toolInputs.map((input, idx) => input.name),
      toolOutputs.map((output, idx) => output.name)
    ]
  }
}