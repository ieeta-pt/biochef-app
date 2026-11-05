import { makeBinaryDataValue, makeTextDataValue } from './dataValue';
import { detectIsBinaryFile } from './detectDataType';
import { getUploadExtensions } from './typeDefinitions';

export const acceptableExtensions = getUploadExtensions();

// TODO deal with file sizes
export const processFile = async (file, showNotification) => {
    const extension = `.${file.name.split('.').pop().toLowerCase()}`;
    if (!acceptableExtensions.includes(extension)) {
        showNotification(`Unsupported file ${file.name} with type ${extension}.`, 'error');
        return null;
    }

    try {
        let content;

        const reader = new FileReader();
        content = await new Promise((resolve, reject) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsArrayBuffer(file);
        });
        
        const bytes = new Uint8Array(content);
        const isBinary = detectIsBinaryFile(bytes)

        if (isBinary) {
            content = makeBinaryDataValue(bytes)
        }
        else {
            const text = new TextDecoder("utf-8").decode(bytes);
            content = makeTextDataValue(text)
        }

        return {
            id: `${file.name}-${Date.now()}`,
            name: file.name,
            type: "file",
            content,
            size: file.size,
            lastModified: new Date(file.lastModified),
            relativePath: '',
        };
    } catch (error) {
        showNotification(`Failed to read file: ${file.name} with error ${error}`, 'error');
        return null;
    }
}; 