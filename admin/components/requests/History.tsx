import { Card, CardBody, CardHeader } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import React, { useMemo } from "react";
import { RequestHistoryItem } from "../../models/request-history";

type ActionProps = { item: RequestHistoryItem };


const RejectedAction = ({ item }: ActionProps) => {
    return (
        <div>
            {item.params['reason'] && <p style={{ margin: "4px 0 0" }}>Reason: {item.params['reason']}</p>}
        </div>
    );
}

const actions: { [key: string]: React.ComponentType<ActionProps> } = {
    rejected: RejectedAction,
};

export function RequestHistory({ history }: { history: RequestHistoryItem[] }) {

    const items = useMemo(() => {
        return [...history].reverse();
    }, [history]);

    const render = items.length > 0 ? (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
            {items.map((item) => {
                const ActionComponent = actions[item.status] || (() => <></>);
                return (
                    <li key={item.id} style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 6 }}>
                        <p style={{ margin: 0, fontWeight: 600 }}>{item.status}</p>
                        <ActionComponent item={item} />
                        <p style={{ margin: "6px 0 0", color: "#50575e", fontSize: 12 }}>
                            {sprintf(
                                __( "By %s on %s", 'wolf-membership'),
                                item.changed_by?.display_name || "Unknown",
                                new Date(item.created_at).toLocaleString()
                            )}
                        </p>
                    </li>
                );
            })}
        </ul>
    ) : (
        <p>{__('No history available.', 'wolf-membership')}</p>
    );

    return (
        <Card style={{ marginBottom: 16 }}>
            <CardHeader>{__('Request History', 'wolf-membership')}</CardHeader>
            <CardBody>
                {render}
            </CardBody>
        </Card>
    );
}