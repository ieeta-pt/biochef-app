import { getTool } from "./toolUtils";
import { detectAllDataTypes } from "./detectDataType";
import { isTypeBinary } from "./typeDefinitions";
import { makeReferenceDataValue } from "./dataValue";
import { putBlob } from "./blobStore"
import logger from "./logger"

// Text up to this length stays inline in localStorage, larger text goes to IndexedDB like binary data
const INLINE_TEXT_LIMIT = 100000

// The workflow is saved on every change, so only write a value that changed since it was last stored
const storedValues = new Map()

function storeBlobOnce(blobId, value) {
  if (storedValues.get(blobId) === value.data) return
  storedValues.set(blobId, value.data)
  putBlob(blobId, value.data, value.kind).catch((error) => {
    storedValues.delete(blobId)
    logger.error(error)
  })
}

function storeAsReference(value) {
  return value?.kind === "binary" || (value?.kind === "text" && value.data.length > INLINE_TEXT_LIMIT)
}

function sanitizeWorkflowNodes(nodes, { keepValuesAsReference = false } = {}) {
  const referencedIds = new Set()

  const sanitized = nodes.map(node => {
    const outputs = {};

    if (node.type === "inputWorkflowNode") {
      for (const [key, value] of Object.entries(node.data.outputs || {})) {
        if (keepValuesAsReference && storeAsReference(value)) {
          const blobId = node.id + key
          referencedIds.add(blobId)
          storeBlobOnce(blobId, value)
          outputs[key] = makeReferenceDataValue(blobId);
        }
        else if (value?.kind === "text") {
          outputs[key] = value;
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

  // forget values of inputs that are gone, so a deleted large input is not kept in memory
  if (keepValuesAsReference) {
    for (const blobId of storedValues.keys()) {
      if (!referencedIds.has(blobId)) storedValues.delete(blobId)
    }
  }

  return sanitized
}

export function prepareWorkflowNodesForLocalStorage(nodes) {
  return sanitizeWorkflowNodes(nodes, {
    keepValuesAsReference: true
  });
}

export function prepareWorkflowNodesForExport(nodes) {
  return sanitizeWorkflowNodes(nodes, {
    keepValuesAsReference: false
  });
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