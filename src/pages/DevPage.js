import { Button, Box, CircularProgress, Typography, CardActions, TextField, Select, MenuItem } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React, { useState, useEffect, useRef } from 'react';
import {
  getAllTools,
  loadToolIndex,
  runTools,
  loadTool,
  getTool,
  getToolRuntimes,
} from '../utils/toolUtils';
import ToolParameterSection from '../components/ToolParameterSection';
import { makeTextDataValue } from '../utils/dataValue';
import { prepareWorkflowNodesForExport } from '../utils/workflowUtils';
import logger from '../utils/logger';
import { detectIsBinaryFile } from '../utils/detectDataType';
import { diffChars, createPatch, diffLines } from 'diff';
import { getTypeExampleInput } from '../utils/typeDefinitions';

const DevPage = () => {
  const [toolIndexLoaded, setToolIndexLoaded] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [paramValues, setParamValues] = useState({});

  const [inputValue, setInputValue] = useState({});
  const [selectedInput, setSelectedInput] = useState("");

  const [showOnlyTimers, setShowOnlyTimers] = useState(false)

  const [outputValue, setOutputValue] = useState({});
  const [agentOutputValue, setAgentOutputValue] = useState({});
  const [diffValue, setDiffValue] = useState({});
  const [selectedOutput, setSelectedOutput] = useState("");

  const [wasmTime, setWasmTime] = useState();
  const [agentTime, setAgentTime] = useState();

  const [inputPreviewValue, setInputPreviewValue] = useState({});
  const [inputTruncated, setInputTruncated] = useState({});
  const fileInputRef = useRef(null);

  const MAX_PREVIEW_LINES = 100;

  function getInputPreview(text) {
    const lines = text.split(/\r\n|\n|\r/);

    return {
      text: lines.slice(0, MAX_PREVIEW_LINES).join('\n'),
      truncated: lines.length > MAX_PREVIEW_LINES,
    };
  }

  async function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file || !selectedInput) return;

    try {
      const content = await file.text();
      const preview = getInputPreview(content);

      // Keep the FULL content for tool execution.
      setInputValue((prev) => ({
        ...prev,
        [selectedInput]: makeTextDataValue(content),
      }));

      // Keep only the preview for rendering in the editor.
      setInputPreviewValue((prev) => ({
        ...prev,
        [selectedInput]: makeTextDataValue(preview.text),
      }));

      setInputTruncated((prev) => ({
        ...prev,
        [selectedInput]: preview.truncated,
      }));
    } catch (error) {
      console.error("Failed to read input file:", error);
    } finally {
      // Allow selecting the same file again.
      event.target.value = "";
    }
  }

  async function runWorkflowWithAgent(flow, fileData, url) {
    const formData = new FormData();
    formData.append("biochef_workflow", JSON.stringify(flow));

    for (const [filename, dataValue] of Object.entries(fileData)) {
      const content = dataValue.data;

      const mimeType =
        dataValue.kind === "binary"
          ? "application/octet-stream"
          : "text/plain";

      const file =
        dataValue.kind === "binary"
          ? new File([content], filename, { type: mimeType })
          : new File([String(content)], filename, { type: mimeType });

      formData.append("files", file);
    }

    let response = null
    let elapsed;
    try {
      const startTime = performance.now();
      response = await fetch(url, {
        method: "POST",
        body: formData
      });
      const endTime = performance.now();
      elapsed = endTime - startTime;
      setAgentTime(elapsed);
    }
    catch {
      logger.error("Could not send request to agent")
      return { outputs: {}, time: -1 };
    }

    if (!response) {
      logger.error("Did not get a response from agent agent")
      return { outputs: {}, time: -1 };
    }

    let data = null
    try {
      data = await response.json();
    }
    catch {
      logger.error("Could not process response from agent")
      return { outputs: {}, time: -1 };
    }

    for (const [node_id, outputs] of Object.entries(data)) {
      const processedOutputs = {};

      for (const [name, base64data] of Object.entries(outputs)) {
        const bytes = Uint8Array.from(atob(base64data), c => c.charCodeAt(0));

        processedOutputs[name] = detectIsBinaryFile(bytes)
          ? { kind: "binary", data: bytes }
          : { kind: "text", data: new TextDecoder().decode(bytes) };
      }

      return {
        outputs: processedOutputs,
        time: elapsed,
      };
    }
  }

  async function handleRun(fileInputs = inputValue) {
    const initialOutputValues = {};
    currentTool.io.outputs.forEach((output) => {
      initialOutputValues[output.name] = makeTextDataValue("");
    });

    setOutputValue(initialOutputValues);
    setAgentOutputValue(initialOutputValues);
    setDiffValue(initialOutputValues);
    setAgentTime(0);
    setWasmTime(0);

    let args = [];

    currentTool.parameters.forEach((param) => {
      if (param.required || paramValues[param.name].enabled) {
        if (param.flag) {
          args.push(param.flag);
        }

        if (param.type !== "flag") {
          args.push(paramValues[param.name].value);
        }
      }
    });

    const inputs = {};

    for (const [key, value] of Object.entries(fileInputs)) {
      inputs[key] = {
        mode: "text",
        value,
      };
    }

    // Run native tool
    let timedOut = false;
    let timeoutId;

    const startTime = performance.now();

    const result = await Promise.race([
      runTools([
        {
          toolName: currentTool.name,
          uniqueId: currentTool.name,
          toolArguments: args,
          inputs,
        },
      ]),
      new Promise((resolve) => {
        timeoutId = setTimeout(() => {
          timedOut = true;

          logger.error(`Tool ${currentTool.name} timed out`);

          resolve({
            outputs: {
              [currentTool.name]: "",
            },
          });
        }, 5 * 60000);
      }),
    ]);

    clearTimeout(timeoutId);

    const endTime = performance.now();
    const currentWasmTime = timedOut ? -1 : endTime - startTime;

    setWasmTime(currentWasmTime);

    const nativeResult = result.outputs[currentTool.name];
    setOutputValue(nativeResult);

    // Prepare workflow for agent
    const fileData = {};
    const time_var = Date.now();
    const tool_id = `${currentTool.id}-${time_var}`;

    const flow = {
      nodes: [
        {
          id: tool_id,
          type: "workflowNode",
          data: {
            repo: currentTool.repo,
            paramValues: paramValues,
          },
        },
      ],
      edges: [],
    };

    currentTool.io.inputs?.forEach((input, index) => {
      const node = {
        id: `input-${time_var}-${index}`,
        type: "inputWorkflowNode",
      };

      const edge = {
        id: `edge-input-${time_var}-${index}`,
        source: `input-${time_var}-${index}`,
        sourceHandle: "out",
        target: tool_id,
        targetHandle: input.name,
      };

      fileData[`input-${time_var}-${index}-out`] = fileInputs[input.name];

      flow.nodes.push(node);
      flow.edges.push(edge);
    });

    currentTool.io.outputs?.forEach((output, index) => {
      const node = {
        id: `output-${time_var}-${index}`,
        type: "outputWorkflowNode",
      };

      const edge = {
        id: `edge-output-${time_var}-${index}`,
        source: tool_id,
        sourceHandle: output.name,
        target: `output-${time_var}-${index}`,
        targetHandle: "in",
      };

      flow.nodes.push(node);
      flow.edges.push(edge);
    });

    // Run agent
    const agentResponse = await runWorkflowWithAgent(
      flow,
      fileData,
      "http://localhost:8000/convert"
    );

    const agentResult = agentResponse?.outputs ?? {};
    const awaitAgentTime = agentResponse?.time ?? -1;

    setAgentOutputValue(agentResult);

    // Calculate diffs
    const diffValues = {};

    for (const output of currentTool.io.outputs) {
      const outputName = output.name;

      const nativeText = nativeResult?.[outputName]?.data ?? "";
      const agentText = agentResult?.[outputName]?.data ?? "";

      const diffText = createPatch(
        currentTool.name + " - " + outputName,
        nativeText,
        agentText
      );

      diffValues[outputName] = makeTextDataValue(diffText);
    }

    setDiffValue(diffValues);

    return {
      wasm: currentWasmTime,
      agent: awaitAgentTime,
    };
  }

  async function batchRun() {
    const folderInput = document.createElement("input");
    folderInput.type = "file";
    folderInput.webkitdirectory = true;
    folderInput.multiple = true;

    setShowOnlyTimers(true);

    folderInput.onchange = async (event) => {
      const files = Array.from(event.target.files).sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      );

      if (!files.length) return;

      const results = [];

      function median(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);

        return sorted.length % 2
          ? sorted[mid]
          : (sorted[mid - 1] + sorted[mid]) / 2;
      }

      for (const file of files) {
        const content = await file.text();
        const fileInput = makeTextDataValue(content);

        const fileInputs = {};

        currentTool.io.inputs.forEach((input) => {
          fileInputs[input.name] = fileInput;
        });

        const wasmTimes = [];
        const agentTimes = [];

        for (let i = 0; i < 5; i++) {
          logger.info(`[BatchRun] Running run ${i} for file ${file.name}`)
          const times = await handleRun(fileInputs);

          wasmTimes.push(times.wasm);
          agentTimes.push(times.agent);
        }

        results.push({
          file: file.webkitRelativePath || file.name,
          wasmMedian: median(wasmTimes),
          agentMedian: median(agentTimes),
        });
      }

      console.table(results);
    };

    folderInput.click();
  }

  const SEEN_TOOLS_STORAGE_KEY = "devPage.seenTools";

  function getSeenTools() {
    try {
      return JSON.parse(
        localStorage.getItem(SEEN_TOOLS_STORAGE_KEY) || "[]"
      );
    } catch {
      return [];
    }
  }

  function markToolAsSeen(tool) {
    const seenTools = getSeenTools();

    if (!seenTools.includes(tool.name)) {
      localStorage.setItem(
        SEEN_TOOLS_STORAGE_KEY,
        JSON.stringify([...seenTools, tool.name])
      );
    }
  }

  function getToolList() {
    const seenTools = getSeenTools();

    return getAllTools().filter((tool) => {
      return (
        tool.runtime.modes.includes("native") &&
        !seenTools.includes(tool.name) && (tool.name.includes("(SEQTK)") || tool.name.includes("(muscle)"))
      );
    });
  }

  async function selectTool(index) {
    const allTools = getToolList();
    if (!allTools[index]) return;

    await loadTool(allTools[index].name);

    const tool = getTool(allTools[index].name);
    const initialParamValues = {};

    tool.parameters.forEach(param => {
      initialParamValues[param.name] = {
        enabled: param.required ?? false,
        value: param.default !== undefined ? param.default : '',
      };
    });
    setParamValues(initialParamValues);

    const initialInputValues = {};
    tool.io.inputs.forEach((input) => {
      initialInputValues[input.name] = makeTextDataValue("");
    });
    setInputValue(initialInputValues);
    setInputTruncated({});
    setSelectedInput(tool.io.inputs[0]?.name);

    const initialOutputValues = {};
    tool.io.outputs.forEach((output) => {
      initialOutputValues[output.name] = makeTextDataValue("");
    });
    setOutputValue(initialOutputValues)
    setAgentOutputValue(initialOutputValues)
    setDiffValue(initialOutputValues)
    setSelectedOutput(tool.io.outputs[0]?.name);

    setSelectedTool(index);
  }

  useEffect(() => {
    const fetchToolIndex = async () => {
      const result = await loadToolIndex();

      if (result) {
        selectTool(0)
      }

      setToolIndexLoaded(!!result);
    };

    fetchToolIndex();
  }, []);

  async function selectNextTool() {
    const allTools = getToolList();
    const nextIndex = (selectedTool + 1) % allTools.length;
    selectTool(nextIndex)
  }

  async function selectPreviousTool() {
    const allTools = getToolList();
    const previousIndex = (selectedTool - 1 + allTools.length) % allTools.length;
    selectTool(previousIndex)
  }

  const allTools = getToolList();

  const currentTool =
    selectedTool !== null
      ? getTool(allTools[selectedTool].name)
      : null;

  if (!toolIndexLoaded || currentTool == null) {
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
    <Box sx={{ m: 2 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          width: '100%',
        }}
      >
        {/* Left column */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Tool information */}
          <Card variant="outlined">
            <CardActions>
              <Button onClick={selectPreviousTool}>
                Previous Tool
              </Button>

              <Button onClick={selectNextTool}>
                Next Tool
              </Button>

              <Button onClick={() => selectTool(0)}>
                Go To Start
              </Button>

              <Button onClick={() => selectTool(allTools.length - 1)}>
                Go To End
              </Button>

              <Button
                color="error"
                onClick={() => {
                  localStorage.removeItem(SEEN_TOOLS_STORAGE_KEY);
                  window.location.reload();
                }}
              >
                Reset Seen Tools
              </Button>

            </CardActions>

            <CardContent>
              <Typography
                gutterBottom
                sx={{
                  color: 'text.secondary',
                  fontSize: 14,
                }}
              >
                Current Tool: {selectedTool + 1}/{allTools.length} ({getSeenTools().length} hidden) ({getToolList().length} total)
              </Typography>

              <Typography variant="h5" component="div">
                {currentTool.name}
              </Typography>

              <Typography
                sx={{
                  color: 'text.secondary',
                  mb: 1.5,
                }}
              >
                {currentTool.category}
              </Typography>

              <Typography
                sx={{
                  color: 'text.secondary',
                  mb: 1.5,
                }}
              >
                {Array.from(new Set(currentTool.inputTypes)).join(", ")}
              </Typography>

              <Typography variant="body2">
                {currentTool.description}
              </Typography>
            </CardContent>

            <CardActions>
              <Button
                variant="outlined"
                onClick={async () => {
                  setShowOnlyTimers(false)
                  handleRun()
                }}
              >
                Run
              </Button>

              <Button
                variant="outlined"
                onClick={async () => {
                  setShowOnlyTimers(true)
                  handleRun()
                }}
              >
                Run (Timers)
              </Button>

              <Button
                variant="outlined"
                onClick={async () => {
                  batchRun()
                }}
              >
                Batch Run
              </Button>

              <Button
                variant="outlined"
                color="success"
                onClick={() => {
                  markToolAsSeen(currentTool);
                  selectTool(selectedTool);
                }}
              >
                Done
              </Button>
            </CardActions>
          </Card>

          {/* Input */}
          <Card variant="outlined">
            <CardContent>
              {selectedInput && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <Select
                      value={selectedInput}
                      onChange={(e) => setSelectedInput(e.target.value)}
                      displayEmpty
                      fullWidth
                      size="small"
                    >
                      {currentTool.io.inputs.map((input) => (
                        <MenuItem key={input.name} value={input.name}>
                          {input.name}
                        </MenuItem>
                      ))}
                    </Select>

                    <Select
                      data-tour="example-input"
                      value=""
                      onChange={(e) => {
                        const exampleInput = getTypeExampleInput(e.target.value);

                        if (exampleInput) {
                          const preview = getInputPreview(exampleInput);

                          setInputValue((prev) => ({
                            ...prev,
                            [selectedInput]: makeTextDataValue(exampleInput),
                          }));

                          setInputPreviewValue((prev) => ({
                            ...prev,
                            [selectedInput]: makeTextDataValue(preview.text),
                          }));

                          setInputTruncated((prev) => ({
                            ...prev,
                            [selectedInput]: preview.truncated,
                          }));
                        }
                      }}
                      displayEmpty
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="" disabled>
                        Select Example Format
                      </MenuItem>

                      {Array.from(new Set(currentTool.inputTypes)).map((format) => (
                        <MenuItem key={format} value={format}>
                          {format}
                        </MenuItem>
                      ))}
                    </Select>

                    <Button
                      variant="outlined"
                      onClick={() => fileInputRef.current?.click()}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      Upload File
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      onChange={handleFileUpload}
                    />
                  </Box>

                  {inputTruncated[selectedInput] && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      Showing the first 1,000 lines. The complete file is retained
                      and will be used when running the tool.
                    </Typography>
                  )}

                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    variant="outlined"
                    value={inputPreviewValue[selectedInput]?.data ?? ""}
                    onChange={(event) => {
                      const text = event.target.value;
                      const preview = getInputPreview(text);

                      setInputValue((prev) => ({
                        ...prev,
                        [selectedInput]: makeTextDataValue(text),
                      }));

                      setInputPreviewValue((prev) => ({
                        ...prev,
                        [selectedInput]: makeTextDataValue(preview.text),
                      }));

                      setInputTruncated((prev) => ({
                        ...prev,
                        [selectedInput]: preview.truncated,
                      }));
                    }}
                    InputProps={{
                      readOnly: !!inputTruncated[selectedInput],
                    }}
                    sx={{ mt: 1 }}
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Parameters */}
          <ToolParameterSection
            toolConfig={currentTool}
            parameters={paramValues}
            validationErrors={{}}
            handleParameterChange={(name, value) => {
              setParamValues((prev) => ({
                ...prev,
                [name]: {
                  ...(prev[name] ?? {}),
                  enabled: prev[name]?.enabled ?? true,
                  value,
                },
              }));
            }}
            toggleParameter={(name) => {
              setParamValues((prev) => ({
                ...prev,
                [name]: {
                  ...(prev[name] ?? {}),
                  enabled: !(prev[name]?.enabled ?? true),
                },
              }));
            }}
          />
        </Box>

        {/* Right column */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Output */}
          <Card variant="outlined">
            <CardContent>
              <Select
                value={selectedOutput}
                onChange={(e) => setSelectedOutput(e.target.value)}
                displayEmpty
                fullWidth
                size="small"
              >
                {currentTool.io.outputs.map((output) => (
                  <MenuItem key={output.name} value={output.name}>
                    {output.name}
                  </MenuItem>
                ))}
              </Select>

              {/* WASM Output / Timer */}
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                InputProps={{ readOnly: true }}
                value={
                  showOnlyTimers
                    ? (wasmTime > 0 ? `Browser took ${wasmTime} ms` : '')
                    : (outputValue[selectedOutput]?.data ?? '')
                }
                sx={{ mt: 1 }}
              />

              {/* Agent Output / Timer */}
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                InputProps={{ readOnly: true }}
                value={
                  showOnlyTimers
                    ? (agentTime > 0 ? `Agent took ${agentTime} ms` : '')
                    : (agentOutputValue[selectedOutput]?.data ?? '')
                }
                sx={{ mt: 1 }}
              />

              {/* Diff */}
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                value={
                  showOnlyTimers
                    ? ''
                    : (diffValue[selectedOutput]?.data ?? '')
                }
                InputProps={{
                  readOnly: true,
                  sx: {
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                  },
                }}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default DevPage;