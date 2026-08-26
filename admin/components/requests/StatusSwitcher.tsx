import { useState, useMemo } from "react";
import { __ } from "@wordpress/i18n";
import { Card, CardHeader, CardBody, Button, SelectControl, TextareaControl } from "@wordpress/components";

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

    const handleStatusChange = (newValue: string) => {
        setStatus(newValue);
    };

    return (
        <Card>
            <CardHeader>{__('Change Request Status', 'wolf-membership')}</CardHeader>
            <CardBody>
                <SelectControl
                    value={status}
                    label={__("New status", "wolf-membership")}
                    options={newStatus.map((statusOption) => ({
                        label: statusOption.label,
                        value: statusOption.name,
                    }))}
                    onChange={handleStatusChange}
                />
                {status === "rejected" && (
                    <div style={{ marginBottom: 12 }}>
                        <TextareaControl
                            label={__("Reason", "wolf-membership")}
                            help={__("Enter reason for rejection", "wolf-membership")}
                            value={rejectionReason}
                            onChange={(value) => {
                                setRejectionReason(value);
                            }}
                        />
                    </div>
                )}
                <Button variant="primary" disabled={!canApply} onClick={() => onChange({ status, reason: rejectionReason })}>
                    {__("Apply", "wolf-membership")}
                </Button>
            </CardBody>
        </Card>
    );
}