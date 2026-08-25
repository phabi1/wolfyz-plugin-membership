import { __ } from "@wordpress/i18n";
import { TEXT_DOMAIN } from "../utils";
import { useMemo } from "react";
import Box from "@mui/material/Box";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AttachFileIcon from "@mui/icons-material/AttachFile";

export function FilePreview({ file }: { file: string | null }) {

    const filename = useMemo(() => {
        if (!file) {
            return null;
        }
        return file.split('/').pop() || file;
    }, [file]);

    const fileType = useMemo(() => {
        if (!file) {
            return null;
        }
        const extension = file.split('.').pop()?.toLowerCase();
        if (!extension) {
            return null;
        }
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return 'image';
        }
        if (['pdf'].includes(extension)) {
            return 'pdf';
        }
        return 'other';
    }, [file]);

    const previewUrl = useMemo(() => {
        if (!file) {
            return '#';
        }
        return file.startsWith("http") ? file : `/wp-content/uploads/${file}`;
    }, [file]);

    if (!file) {
        return <span>{__("No file selected", TEXT_DOMAIN)}</span>;
    }

    let fileIcon;
    switch (fileType) {
        case 'image':
            fileIcon = <ImageIcon />;
            break;
        case 'pdf':
            fileIcon = <PictureAsPdfIcon />;
            break;
        default:
            fileIcon = <AttachFileIcon />;
            break;
    }

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
        }}>
            <span>{fileIcon}</span>
            <span>{filename}</span>
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                {__("Preview", TEXT_DOMAIN)}
            </a>
        </Box>
    );
}