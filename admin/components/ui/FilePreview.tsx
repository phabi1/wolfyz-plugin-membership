import { __ } from "@wordpress/i18n";
import { TEXT_DOMAIN } from "../../utils";
import { useMemo } from "react";

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
            fileIcon = "IMG";
            break;
        case 'pdf':
            fileIcon = "PDF";
            break;
        default:
            fileIcon = "FILE";
            break;
    }

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
        }}>
            <span
                style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    padding: '2px 6px',
                    borderRadius: 999,
                    border: '1px solid #dcdcde',
                }}
            >
                {fileIcon}
            </span>
            <span>{filename}</span>
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                {__("Preview", TEXT_DOMAIN)}
            </a>
        </span>
    );
}