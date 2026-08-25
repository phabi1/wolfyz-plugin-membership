import { useState, useMemo } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { __ } from "@wordpress/i18n";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import type { SelectChangeEvent } from "@mui/material/Select";

export function RequestStatusSwitcher({ value, onChange }: {
    value: string; onChange: (res: {
        status: string;
        reason?: string;
    }) => void
}) {

    const [status, setStatus] = useState('');
    const [rejectionReason, setRejectionReason] = useState("");

    const newStatus = useMemo<{ name: string, label: string }[]>(() => {
        switch (value) {
            case "pending":
                return [
                    { name: "approved", label: __("Approve", "wolf-membership") },
                    { name: "rejected", label: __("Reject", "wolf-membership") },
                ];
            case "approved":
                return [
                    { name: "paid", label: __("Mark as Paid", "wolf-membership") },
                    { name: "cancelled", label: __("Cancel", "wolf-membership") },
                ];
            case "rejected":
                return [
                    { name: "cancelled", label: __("Cancel", "wolf-membership") },
                ];
            default:
                return [];
        }
    }, [value]);

    const canApply = useMemo(() => {
        if (!status) {
            return false;
        }
        if (status === "rejected" && !rejectionReason) {
            return false;
        }
        return true;
    }, [status, rejectionReason]);

    const handleStatusChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Select value={status} onChange={handleStatusChange}>
                {newStatus.map((statusOption) => (
                    <MenuItem key={statusOption.name} value={statusOption.name}>
                        {statusOption.label}
                    </MenuItem>
                ))}
            </Select>
            {status === "rejected" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <InputLabel htmlFor="rejection-reason">{__("Reason", "wolf-membership")}</InputLabel>
                    <TextField
                        id="rejection-reason"
                        label={__("Reason", "wolf-membership")}
                        placeholder={__("Enter reason for rejection", "wolf-membership")}
                        value={rejectionReason}
                        onChange={(e) => {
                            setRejectionReason(e.target.value);
                        }}
                    />
                </Box>
            )}
            <Button variant="contained" disabled={!canApply} onClick={() => onChange({ status, reason: rejectionReason })}>
                Apply
            </Button>
        </Box>
    );
}