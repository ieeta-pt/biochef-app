import { Terminal, Upload } from '@mui/icons-material';
import {
  Box,
  Divider,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { detectDataType, detectAllDataTypes } from '../utils/detectDataType';
import FileExplorer from './FileExplorer';
import { TourContext } from '../contexts/TourContext';
import CLIInputPanel from './CLIInputPanel';
import { dataValueToString, makeTextDataValue } from '../utils/dataValue';

const InputPanel = ({
  inputData, setInputData,
  selectedFiles, setSelectedFiles, tree, setTree
}) => {
  const [inputDataTypes, setInputDataTypes] = useState([])
  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    if (!inputData) {
      setInputDataTypes([])
      return
    }
    const detectedTypes = detectAllDataTypes(inputData);
    setInputDataTypes(detectedTypes);
  }, [inputData]);

  useEffect(() => {
    if (tabIndex != 1) return

    if (selectedFiles.size == 0) {
      return
    }

    const arr = Array.from(selectedFiles);
    const lastSelectedFile = arr[arr.length - 1];
    setInputData(lastSelectedFile.content);
  }, [selectedFiles]);

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, flexShrink: 0 }}>
        <Box data-tour="input-type" sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6">Input:</Typography>
          <Typography variant="body1" color="textSecondary" sx={{ marginLeft: 1 }}>
            {inputDataTypes.join(', ')}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
        <Tabs
          value={tabIndex}
          onChange={(e, newIndex) => { setTabIndex(newIndex) }}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            flexShrink: 0,
            '& .MuiTab-root': {
              minHeight: 64,
              fontWeight: 'bold',
            },
          }}
        >
          <Tab
            icon={<Terminal />}
            label="CLI Mode"
            iconPosition="start"
          />
          <Tab
            icon={<Upload />}
            label="File Manager"
            iconPosition="start"
          />
        </Tabs>


        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {tabIndex === 0 && (
            <CLIInputPanel
              inputData={dataValueToString(inputData)}
              setInputData={(newInputData) => {
                setInputData(makeTextDataValue(newInputData))
              }}
            />
          )}

          {tabIndex === 1 && (
            <FileExplorer
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              tree={tree}
              setTree={setTree}
            />
          )}
        </Box>
      </Box>

    </Paper >
  );
};

export default InputPanel;