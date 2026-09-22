import { TEXT_DOMAIN } from "../../utils";
import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { __ } from "@wordpress/i18n";

export function UploadField({ file, url, onChange }: {
    file: string | null,
    url: string,
    onChange: (file: string | null) => void
}) {

    const filename = useMemo(() => {
        if (!file) {
            return null;
        }
        return file.split('/').pop() || file;
    }, [file]);


    const [uploading, setUploading] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [previewing, setPreviewing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePreviewFile = () => {
        if (!file) {
            return;
        }
        setPreviewing(true);
        fetch(url + '?file=' + encodeURIComponent(file), {
            method: 'GET',
        }).then((response) => response.json())
            .then((data) => {
                if (data.success && data.url) {
                    window.open(data.url, "_blank", "noopener,noreferrer");
                }
            }).finally(() => {
                setPreviewing(false);
            });
    };

    const handleRemoveFile = () => {
        setRemoving(true);
        fetch(url, {
            method: "DELETE",
            body: JSON.stringify({ file }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                return fetch(data.url, {
                    method: "DELETE",
                    body: JSON.stringify({ file }),
                }).then((response) => response.json());
            })
            .then((data) => {
                if (!data.success) {
                    console.error("File removal failed:", data.error);
                }
            })
            .catch((error) => {
                console.error("File removal error:", error);
            }).finally(() => {
                setRemoving(false);
                onChange(null);
            });

    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        // Upload file
        setUploading(true);

        const file = event.target.files ? event.target.files[0] : null;

        if (!file) {
            setUploading(false);
            return;
        }

        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                file: file.name,
                mime_type: file.type
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => response.json())
            .then((data) => {
                // Upload the file to the presigned URL provided by the server into binary format
                return fetch(data.url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": file.type,
                    },
                    body: file,
                }).then((response) => response.json())
            })
            .then((data) => {
                setUploading(false);
                onChange(data.uri);
            })
            .catch((error) => {
                setUploading(false);
                console.error("File upload error:", error);
            });

        const selectedFile = event.target.files ? event.target.files[0] : null;
        onChange(selectedFile ? selectedFile.name : null);
    };

    if (uploading) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body2">
                    {__("Uploading...", TEXT_DOMAIN)}
                </Typography>
            </Box>
        );
    }

    if (removing) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body2">
                    {__("Removing...", TEXT_DOMAIN)}
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {file ? (
                <Box>
                    <Typography variant="body2">
                        {filename}
                    </Typography>
                    <Button variant="outlined" color="primary" disabled={!file || previewing} onClick={handlePreviewFile}>{__("Preview", TEXT_DOMAIN)}</Button>
                    <Button variant="outlined" color="secondary" onClick={handleRemoveFile}>
                        {__("Remove", TEXT_DOMAIN)}
                    </Button>
                </Box>
            ) : (
                <Button variant="contained" component="label">
                    {__("Upload", TEXT_DOMAIN)}
                    <input type="file" hidden onChange={handleFileChange} />
                </Button>
            )}
        </Box>
    );
}