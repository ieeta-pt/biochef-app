import {
    ChevronRight,
    Close,
    CreateNewFolder,
    Delete,
    DriveFolderUpload,
    ExpandMore,
    FileUpload,
    FolderZip,
    Info,
    InsertDriveFile,
    LibraryAddCheck,
    MoreVert,
    NoteAdd,
    Visibility
} from '@mui/icons-material';
import {
    Box,
    Button,
    Checkbox,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Select,
    Tooltip,
    Typography
} from '@mui/material';
import JSZip from 'jszip';
import React, { useContext, useRef, useState } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { getUploadExtensions } from '../utils/typeDefinitions';
import { processFile } from '../utils/fileProcessor';

const FileExplorer = ({ selectedFiles, setSelectedFiles, tree, setTree }) => {

    const [expandedFolders, setExpandedFolders] = useState(new Set());
    const [contextMenu, setContextMenu] = useState(null);
    const [activeNode, setActiveNode] = useState(null);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState('');
    const fileInputRef = useRef(null);
    const folderInputRef = useRef(null);
    const zipInputRef = useRef(null);
    const [showFileContent, setShowFileContent] = useState(false);

    // Old variables
    const [isAcceptable, setIsAcceptable] = useState(true);
    const [openMetadataDialog, setOpenMetadataDialog] = useState(false);
    const showNotification = useContext(NotificationContext);

    const acceptableExtensions = getUploadExtensions();

    // Function to insert files into a folder
    const insertFilesIntoFolder = (nodes, folderId, newFiles) => {
        if (folderId === 'root') {
            return [...nodes, ...newFiles];
        }

        return nodes.map(node => {
            if (node.id === folderId && node.type === 'folder') {
                // Insert new file nodes here with updated paths
                return {
                    ...node,
                    children: [...(node.children || []), ...newFiles],
                };
            } else if (node.children) {
                // Recursively check subfolders
                return {
                    ...node,
                    children: insertFilesIntoFolder(node.children, folderId, newFiles),
                };
            }
            return node;
        });
    };

    // Helper function to check if a node with the same name exists at the same level
    const doesNameExistInFolder = (nodes, name, targetFolderId) => {
        // If we're at the root level
        if (targetFolderId === 'root') {
            return nodes.some(node => node.name === name);
        }

        // Find the target folder
        const findFolder = (nodes, id) => {
            for (const node of nodes) {
                if (node.id === id) {
                    return node;
                }
                if (node.children) {
                    const found = findFolder(node.children, id);
                    if (found) return found;
                }
            }
            return null;
        };

        const targetFolder = findFolder(nodes, targetFolderId);
        if (!targetFolder || !targetFolder.children) return false;

        // Check if name exists in target folder
        return targetFolder.children.some(node => node.name === name);
    };

    // Helper function to get the full path of a node in the tree
    const getNodePath = (nodeId, nodes) => {
        if (nodeId === 'root') return '';

        const findNodePath = (currentNodes, id, parentPath = '') => {
            for (const node of currentNodes) {
                if (node.id === id) {
                    return parentPath + node.name;
                }
                if (node.children) {
                    const result = findNodePath(node.children, id, parentPath + node.name + '/');
                    if (result) return result;
                }
            }
            return null;
        };

        return findNodePath(nodes, nodeId);
    };

    // Handle multiple file uploads
    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        try {
            const targetFolderId = activeNode?.type === 'folder' ? activeNode.id : 'root';
            // Get the parent path for the target folder
            const parentPath = getNodePath(targetFolderId, tree.children || []);

            const currentTreeNodes = targetFolderId === 'root' ?
                tree.children || [] :
                // Find the children of the target folder
                (() => {
                    const findFolder = (nodes, id) => {
                        for (const node of nodes) {
                            if (node.id === id) return node;
                            if (node.children) {
                                const found = findFolder(node.children, id);
                                if (found) return found;
                            }
                        }
                        return null;
                    };
                    const folder = findFolder(tree.children || [], targetFolderId);
                    return folder?.children || [];
                })();

            // Check for duplicate file names before processing
            const duplicateNames = files.filter(file =>
                doesNameExistInFolder(tree.children || [], file.name, targetFolderId)
            ).map(file => file.name);

            if (duplicateNames.length > 0) {
                const message = duplicateNames.length === 1
                    ? `Upload failed: The file "${duplicateNames[0]}" already exists at this location.`
                    : `Upload failed: The following files already exist at this location: ${duplicateNames.join(', ')}`;
                showNotification(message, 'error');
                return; // Stop processing
            }

            const processedFiles = await Promise.all(files.map(file => processFile(file, (message, type) => showNotification(message, type))));
            const validFiles = processedFiles.filter((file) => file !== null);

            // Set correct relativePath with parent folder path
            validFiles.forEach(file => {
                file.relativePath = parentPath ? parentPath + '/' + file.name : file.name;
            });

            setTree((prev) => ({
                ...prev,
                children: insertFilesIntoFolder(
                    prev.children || [],
                    targetFolderId,
                    validFiles
                ),
            }));

            showNotification(`${validFiles.length} file(s) uploaded successfully.`, 'success');

        } catch (error) {
            console.error('File processing error:', error);
        }
    };

    // Helper: Recursively adds a file node into the tree based on its path parts
    const addFileToTree = (pathParts, fileNode, tree) => {
        if (pathParts.length === 1) {
            // Base case: add the file node
            tree.push(fileNode);
            return;
        }

        const folderName = pathParts.shift();
        // Check if the folder already exists in the current level of the tree
        let folder = tree.find(item => item.type === 'folder' && item.name === folderName);

        if (!folder) {
            folder = {
                id: `${folderName}-${Date.now()}`,
                name: folderName,
                type: 'folder',
                children: [],
            };
            tree.push(folder);
        }
        // Recursively add the file to the subfolder with updated parent path
        addFileToTree(pathParts, fileNode, folder.children);
    };

    // Handle directory upload
    const handleDirectoryUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        try {
            const targetFolderId = activeNode?.type === 'folder' ? activeNode.id : 'root';
            const parentPath = getNodePath(targetFolderId, tree.children || []);

            // Extract the top-level folder name from the first file's relative path
            const firstFilePath = files[0].webkitRelativePath;
            const topFolderName = firstFilePath.split('/')[0];

            // Check if this folder name already exists
            if (doesNameExistInFolder(tree.children || [], topFolderName, targetFolderId)) {
                showNotification(`Upload failed: A folder named "${topFolderName}" already exists at this location.`, 'error');
                return;
            }

            const newFilesTree = [];
            let processedFilesCount = 0;

            // Process each file from the uploaded directory
            for (const file of files) {
                try {
                    const processedFile = await processFile(file, (message, type) => showNotification(message, type));
                    if (processedFile) {
                        const relativePath = file.webkitRelativePath;
                        const pathParts = relativePath.split('/');

                        // Set the correct relativePath that includes parent path
                        processedFile.relativePath = parentPath ? parentPath + '/' + relativePath : relativePath;

                        // Use original pathParts for tree structure
                        addFileToTree([...pathParts], processedFile, newFilesTree);
                        processedFilesCount++;
                    }
                } catch (error) {
                    console.error(`Error processing file ${file.name}:`, error);
                }
            }

            // Merge the new files tree with the existing tree structure
            setTree((prev) => ({
                ...prev,
                children: insertFilesIntoFolder(prev.children || [], targetFolderId, newFilesTree),
            }));

            if (processedFilesCount === 0) {
                showNotification('No files were uploaded due to unsupported file types.', 'warning');
            } else {
                showNotification(`${processedFilesCount} file(s) uploaded successfully from directory.`, 'success');
            }
        } catch (error) {
            console.error('Directory upload error:', error);
        }
    };

    const withTimeout = (promise, timeout) => {
        return Promise.race([
            promise,
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Processing timeout')), timeout)
            )
        ]);
    };

    const handleZipUpload = async (event) => {
        const MAX_ZIP_SIZE = 500 * 1024 * 1024; // 500MB
        const MAX_FILES = 100;
        const PROCESSING_TIMEOUT = 120000; // 2 minutes

        const files = event.target.files;
        if (files.length === 0) return;

        const zipFile = files[0];
        if (zipFile.size > MAX_ZIP_SIZE) {
            showNotification('Zip file is too large.', 'error');
            return;
        }

        try {
            const zip = await withTimeout(JSZip.loadAsync(zipFile), PROCESSING_TIMEOUT);
            const fileNames = Object.keys(zip.files);

            if (fileNames.length > MAX_FILES) {
                showNotification(`Zip file contains too many files. Maximum allowed is ${MAX_FILES}.`, 'error');
                return;
            }

            const targetFolderId = activeNode?.type === 'folder' ? activeNode.id : 'root';
            const parentPath = getNodePath(targetFolderId, tree.children || []);

            // Extract all top-level folder/file names from the zip
            const topLevelNames = new Set();
            fileNames.forEach(fileName => {
                const parts = fileName.split('/');
                topLevelNames.add(parts[0]);
            });

            // Check for duplicates
            const duplicateNames = Array.from(topLevelNames).filter(name =>
                doesNameExistInFolder(tree.children || [], name, targetFolderId)
            );

            if (duplicateNames.length > 0) {
                const message = duplicateNames.length === 1
                    ? `Upload failed: An item named "${duplicateNames[0]}" already exists at this location.`
                    : `Upload failed: The following items already exist at this location: ${duplicateNames.join(', ')}`;
                showNotification(message, 'error');
                return;
            }

            const newFilesTree = [];
            let processedFilesCount = 0;

            for (const fileName of fileNames) {
                const zipEntry = zip.files[fileName];
                if (zipEntry.dir) continue;

                await new Promise(resolve => setTimeout(resolve, 0));

                const blob = await zipEntry.async('blob');
                const baseName = fileName.split('/').pop();
                const simulatedFile = new File([blob], baseName, {
                    lastModified: Date.now(),
                    type: blob.type,
                });

                try {
                    const processedFile = await processFile(simulatedFile, (message, type) => showNotification(message, type));
                    if (processedFile) {
                        const pathParts = fileName.split('/');

                        // Set the correct relativePath that includes parent path
                        processedFile.relativePath = parentPath ? parentPath + '/' + fileName : fileName;

                        // Use original pathParts for tree structure
                        addFileToTree([...pathParts], processedFile, newFilesTree);
                        processedFilesCount++;
                    }
                } catch (error) {
                    console.error(`Error processing file ${fileName}:`, error);
                }
            }

            setTree((prev) => ({
                ...prev,
                children: insertFilesIntoFolder(prev.children || [], targetFolderId, newFilesTree),
            }));

            showNotification(`${processedFilesCount} file(s) uploaded from zip.`, 'success');
        } catch (error) {
            console.error('Zip processing error:', error);
            showNotification('Failed to process zip file.', 'error');
        }
    };

    // Function to open metadata dialog and store the index of the file
    const handleViewMetadata = (file) => {
        setOpenMetadataDialog(true);
    };

    // Function to close metadata dialog
    const handleCloseMetadataDialog = () => {
        setOpenMetadataDialog(false);
    };

    const handleToggle = (node) => {
        setExpandedFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(node.id)) {
                newSet.delete(node.id);
            } else {
                newSet.add(node.id);
            }
            return newSet;
        });
    };

    const handleSelect = (node) => {
        setSelectedFiles((prev) => {
            const newSet = new Set(prev);

            // Helper to collect all file nodes from a node recursively
            const collectFiles = (n) => {
                let files = [];
                if (n.type === 'file') {
                    files.push(n);
                } else if (n.type === 'folder' && n.children) {
                    n.children.forEach(child => {
                        files = files.concat(collectFiles(child));
                    });
                }
                return files;
            };

            // Get the file type of already selected files (if any)
            const getCurrentSelectedType = () => {
                for (let file of newSet) {
                    return file.fileType;
                }
                return null;
            };

            // Toggle a single file node
            const toggleFile = (file, isFolder) => {
                if (newSet.has(file) && !isFolder) {
                    newSet.delete(file);
                } else {
                    newSet.clear();
                    newSet.add(file);
                }
            };

            // Toggle selection based on node type
            const toggleSelection = (n) => {
                if (n.type === 'file') {
                    toggleFile(n, false);
                } else if (n.type === 'folder') {
                    const files = collectFiles(n);
                    if (files.length === 0) return; // Nothing to add

                    const currentType = getCurrentSelectedType();

                    // If nothing is selected yet, ensure the folder is homogeneous
                    if (!currentType) {
                        const uniqueTypes = new Set(files.map(file => file.fileType));
                        if (uniqueTypes.size > 1) {
                            showNotification("Folder contains multiple file types. Please select files with the same type.", "error");
                            return;
                        }
                    } else {
                        // If something is already selected, ensure all folder files match
                        const incompatible = files.find(file => file.fileType !== currentType);
                        if (incompatible) {
                            showNotification("Folder contains files of a different type from the selected files.", "error");
                            return;
                        }
                    }

                    // If the folder is already selected, unselect all its files
                    if (files.every(file => newSet.has(file))) {
                        files.forEach(file => newSet.delete(file));
                    } else {
                        // If checks pass, toggle each file in the folder
                        files.forEach(file => toggleFile(file, true));
                    }
                }
            };

            toggleSelection(node);
            return newSet;
        });
    };

    const isFolderChecked = (folder) => {
        if (!folder.children || folder.children.length === 0) return false;
        return folder.children.every(child => {
            if (child.type === 'file') {
                return selectedFiles.has(child);
            } else if (child.type === 'folder') {
                return isFolderChecked(child);
            }
            return false;
        });
    };

    const handleContextMenu = (event, node) => {
        event.preventDefault();
        setActiveNode(node);
        setContextMenu(
            contextMenu === null
                ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
                : null,
        );
    };

    const handleClose = () => {
        setContextMenu(null);
        setActiveNode(null);
    };

    const handleDelete = () => {
        if (activeNode) {
            const deleteNode = (nodes) => {
                return nodes.filter(node => node.id !== activeNode.id).map(node => {
                    if (node.children) {
                        return { ...node, children: deleteNode(node.children) };
                    }
                    return node;
                });
            };
            setTree(prev => ({ ...prev, children: deleteNode(prev.children || []) }));

            // if the node is a file, remove it from selectedFiles, if it's a folder, remove it's file children from selectedFiles
            if (activeNode.type === 'file') {
                // Remove the file directly from selectedFiles if it exists
                setSelectedFiles(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(activeNode)) {
                        newSet.delete(activeNode);
                    }
                    return newSet;
                });
            } else if (activeNode.type === 'folder') {
                // For folders, we need to recursively collect all file nodes and remove them from selectedFiles
                const collectFilesFromFolder = (folder) => {
                    let files = [];
                    if (folder.children) {
                        folder.children.forEach(child => {
                            if (child.type === 'file') {
                                files.push(child);
                            } else if (child.type === 'folder') {
                                files = files.concat(collectFilesFromFolder(child));
                            }
                        });
                    }
                    return files;
                };

                const filesToRemove = collectFilesFromFolder(activeNode);

                setSelectedFiles(prev => {
                    const newSet = new Set(prev);
                    filesToRemove.forEach(file => {
                        if (newSet.has(file)) {
                            newSet.delete(file);
                        }
                    });
                    return newSet;
                });
            }
        }
        handleClose();
    };

    const handleViewContent = (file) => {
        setActiveNode(file);
        setShowFileContent(true);
        setContextMenu(null);
    };

    const handleCloseFileContent = () => {
        setShowFileContent(false);
    };

    const handleMenuItemFileUpload = () => {
        fileInputRef.current.click();
    };

    const handleMenuItemFolderUpload = () => {
        folderInputRef.current.click();
    };

    const handleMenuItemZipUpload = () => {
        zipInputRef.current.click();
    };

    const renderTree = (nodes) => (
        <List>
            {nodes.map((node) => (
                <React.Fragment key={node.id}>
                    <ListItem
                        button
                        onClick={() => node.type === 'folder' && handleToggle(node)}
                        onContextMenu={(event) => handleContextMenu(event, node)}
                    >
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={node.type === 'folder' ? isFolderChecked(node) : selectedFiles.has(node)}
                                tabIndex={-1}
                                disableRipple
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleSelect(node);
                                }}
                            />
                        </ListItemIcon>
                        <ListItemIcon>
                            {node.type === 'folder' ? (
                                expandedFolders.has(node.id) ? <ExpandMore /> : <ChevronRight />
                            ) : (
                                <InsertDriveFile />
                            )}
                        </ListItemIcon>
                        <ListItemText primary={
                            node.name && node.name.length > 30
                                ? `${node.name.substring(0, 12)}...${node.name.substring(node.name.length - 7)}`
                                : node.name
                        }
                        />
                        <ListItemSecondaryAction>
                            {node.type === 'file' && node.content?.kind == "text" && (
                                <IconButton edge="end" onClick={() => handleViewContent(node)} style={{ marginRight: '8px' }}>
                                    <Visibility fontSize="small" />
                                </IconButton>
                            )}
                            <IconButton edge="end" onClick={(event) => handleContextMenu(event, node)}>
                                <MoreVert />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    {node.type === 'folder' && (
                        <Collapse in={expandedFolders.has(node.id)} timeout="auto" unmountOnExit>
                            <Box ml={4}>
                                {node.children && renderTree(node.children)}
                            </Box>
                        </Collapse>
                    )}
                </React.Fragment>
            ))}
        </List>
    );

    return (
        <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                {tree.children && tree.children.length > 0 ? (
                    renderTree(tree.children)
                ) : (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '80%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="body1" sx={{ padding: '16px', textAlign: 'center' }}>
                            The file manager is empty. Please upload files to appear here.
                        </Typography>
                    </Box>
                )}
            </Box>

            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                {activeNode?.type === 'folder' && (
                    <MenuItem onClick={handleMenuItemFileUpload}>
                        <ListItemIcon>
                            <NoteAdd fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>New File</ListItemText>
                        <input
                            type="file"
                            hidden
                            multiple
                            accept={acceptableExtensions.join(',')}
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                        />
                    </MenuItem>
                )}
                {activeNode?.type === 'folder' && (
                    <MenuItem onClick={handleMenuItemFolderUpload}>
                        <ListItemIcon>
                            <CreateNewFolder fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>New Folder</ListItemText>
                        <input
                            type="file"
                            webkitdirectory="true"
                            mozdirectory="true"
                            hidden
                            multiple
                            onChange={handleDirectoryUpload}
                            ref={folderInputRef}
                        />
                    </MenuItem>
                )}
                {activeNode?.type === 'folder' && (
                    <MenuItem onClick={handleMenuItemZipUpload}>
                        <ListItemIcon>
                            <FolderZip fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>New ZIP</ListItemText>
                        <input
                            type="file"
                            hidden
                            accept=".zip"
                            onChange={handleZipUpload}
                            ref={zipInputRef}
                        />
                    </MenuItem>
                )}
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
                {activeNode?.type === 'file' && (
                    <MenuItem onClick={() => handleViewMetadata(activeNode)}>
                        <ListItemIcon>
                            <Info fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>File Info</ListItemText>
                    </MenuItem>
                )}
            </Menu>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    position: 'sticky',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'white',
                    margin: 2, // Ajuste a margem conforme necessário
                    justifyContent: 'flex-end', // Adicionado para alinhar à direita
                    paddingBottom: 1, // Adicionado para melhorar o visual
                }}
            >
                {/* File Counter */}
                <Typography variant="caption" color="textSecondary" sx={{ marginRight: 1 }}>
                    {selectedFiles.size} file(s) selected
                </Typography>
                {/* File Selection Dropdown */}
                <Tooltip
                    title="Selected Files"
                    placement="top"
                    PopperProps={{
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, -8], // Ajuste a margem conforme necessário
                                },
                            },
                        ],
                    }}>
                    <IconButton
                        color="primary"
                        sx={{
                            padding: '6px',
                            backgroundColor: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                            color: 'white',
                        }}
                    >
                        <LibraryAddCheck fontSize="small" />
                        <Select
                            displayEmpty
                            sx={{
                                position: 'absolute',
                                opacity: 0,
                                width: '100%',
                                height: '100%',
                                top: 0,
                                left: 0,
                            }}
                        >
                            {selectedFiles.size > 0 ? (
                                Array.from(selectedFiles).map((file, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "4px 8px",
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ flexGrow: 1, marginRight: "10px" }}>
                                            {file.name}
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" sx={{ padding: 1, textAlign: "center", color: "gray" }}>
                                    No files selected
                                </Typography>
                            )}
                        </Select>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Upload Files"
                    placement="top"
                    PopperProps={{
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, -8], // Ajuste a margem conforme necessário
                                },
                            },
                        ],
                    }}>
                    <IconButton
                        color="primary"
                        component="label"
                        sx={{
                            padding: '6px',
                            backgroundColor: isAcceptable ? 'primary.main' : 'grey.500',
                            '&:hover': {
                                backgroundColor: isAcceptable ? 'primary.dark' : 'grey.500',
                            },
                            cursor: isAcceptable ? 'pointer' : 'not-allowed',
                            color: 'white',
                        }}
                        disabled={!isAcceptable}
                    >
                        <FileUpload fontSize="small" />
                        <input type="file" hidden multiple accept={acceptableExtensions.join(',')} onChange={handleFileUpload} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Upload Folder"
                    placement="top"
                    PopperProps={{
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, -8], // Ajuste a margem conforme necessário
                                },
                            },
                        ],
                    }}>
                    <IconButton
                        color="primary"
                        component="label"
                        sx={{
                            padding: '6px',
                            backgroundColor: isAcceptable ? 'primary.main' : 'grey.500',
                            '&:hover': {
                                backgroundColor: isAcceptable ? 'primary.dark' : 'grey.500',
                            },
                            cursor: isAcceptable ? 'pointer' : 'not-allowed',
                            color: 'white',
                        }}
                        disabled={!isAcceptable}
                    >
                        <DriveFolderUpload fontSize="small" />
                        <input type="file" webkitdirectory="true" mozdirectory="true" hidden multiple onChange={handleDirectoryUpload} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Upload Zip" placement="top">
                    <IconButton
                        color="primary"
                        component="label"
                        sx={{
                            padding: '6px',
                            backgroundColor: isAcceptable ? 'primary.main' : 'grey.500',
                            '&:hover': { backgroundColor: isAcceptable ? 'primary.dark' : 'grey.500' },
                            cursor: isAcceptable ? 'pointer' : 'not-allowed',
                            color: 'white',
                        }}
                        disabled={!isAcceptable}
                    >
                        {/* You can use a zip icon if you have one, or fallback to FileUpload */}
                        <FolderZip fontSize="small" />
                        <input
                            type="file"
                            hidden
                            accept=".zip"
                            onChange={handleZipUpload}
                        />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* File Content Dialog */}
            <Dialog
                open={showFileContent}
                onClose={handleCloseFileContent}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText'
                    }}
                >
                    <Visibility />
                    File Content: {activeNode?.name && activeNode.name.length > 40 ?
                        `${activeNode.name.substring(0, 25)}...${activeNode.name.substring(activeNode.name.length - 10)}` :
                        activeNode?.name}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 2,
                            bgcolor: 'grey.100',
                            maxHeight: '500px',
                            overflowY: 'auto',
                            '&:hover': {
                                boxShadow: 6,
                            },
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all'
                            }}
                        >
                            {activeNode?.content?.data || 'No content available'}
                        </Typography>
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseFileContent}
                        color="primary"
                        variant="contained"
                        startIcon={<Close />}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Metadata Dialog */}
            <Dialog open={openMetadataDialog} onClose={handleCloseMetadataDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText'
                }}>
                    <Info /> File Information
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {activeNode ? (
                        <Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {activeNode?.name && activeNode.name.length > 25 ?
                                            `${activeNode.name.substring(0, 15)}...${activeNode.name.substring(activeNode.name.length - 7)}` :
                                            activeNode?.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                                    <Typography variant="body1" gutterBottom>{activeNode.fileType}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Size</Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {(activeNode.size / 1024).toFixed(2)} KB
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">RelativePath</Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {activeNode.relativePath}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : (
                        <Typography>Loading...</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseMetadataDialog}
                        color="primary"
                        variant="contained"
                        startIcon={<Close />}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper >
    );
};

export default FileExplorer;