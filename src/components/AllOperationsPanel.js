import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
    Collapse,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import debounce from 'lodash.debounce';
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { getToolsByCategory, getTool } from '../utils/toolUtils';

import { TourContext } from '../contexts/TourContext';

const AllOperationsPanel = ({ onToolClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCategories, setExpandedCategories] = useState({});
    const showNotification = useContext(NotificationContext);
    const { tourRegisterSteps, tourIsActive } = useContext(TourContext);

    const tourOperationName = 'Fasta Extract (GTO)';

    useEffect(() => {
        tourRegisterSteps("t-tools", [
            {
                element: '[data-tour="tool-section"]',
                popover: {
                    title: "Selecting Tools",
                    description: "This panel lists all available tools.<br /><br />Hover a tool to see a brief description, collapse categories to simplify the view, and use the search box to quickly find a specific tool.",
                },
            },
            {
                element: '[data-tour="selected-tool"]',
                popover: {
                    title: "Select a Tool",
                    description: "For this tour, let's select this tool.",
                    showButtons: ["previous", "exit"]
                },
            },
        ]);
    }, []);

    useEffect(() => {
        if (tourIsActive) {
            const toolConfig = getTool(tourOperationName)

            setExpandedCategories(prev => ({
                ...prev,
                [toolConfig?.category]: true,
            }));
        }
    }, [tourIsActive]);


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
        return operations.filter(
            (op) =>
                op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                op.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <Paper elevation={3} sx={{ padding: 2, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }} data-tour="tool-section">
            <Typography variant="h6" align="center" gutterBottom>
                All Tools
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
                {Object.entries(getToolsByCategory()).map(([category, tools]) => {
                    const filteredOps = filterOperations(tools);
                    if (filteredOps.length === 0 && searchTerm !== '') return null;

                    return (
                        <React.Fragment key={category}>
                            <ListItemButton onClick={() => handleCategoryClick(category)}>
                                <ListItemText primary={category} />
                                {expandedCategories[category] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={expandedCategories[category] || searchTerm !== ''} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {filteredOps.map((operation) => (
                                        <Tooltip
                                            key={operation.name}
                                            title={
                                                <React.Fragment>
                                                    {operation.description.split('\n').map((line, index) => (
                                                        <Typography key={index} variant="body2" color="inherit">
                                                            {line}
                                                        </Typography>
                                                    ))}
                                                </React.Fragment>
                                            }
                                            placement="right">
                                            <ListItemButton
                                                data-tour={operation.name === tourOperationName ? "selected-tool" : undefined}
                                                sx={{
                                                    pl: 4,
                                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2), // Use primary color with 10% opacity
                                                    '&:hover': {
                                                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.4), // Slightly darker on hover
                                                    },
                                                }}
                                                onClick={() => onToolClick(operation)}
                                            >
                                                <ListItemText primary={operation.name} />
                                            </ListItemButton>
                                        </Tooltip>
                                    ))}
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

export default AllOperationsPanel;