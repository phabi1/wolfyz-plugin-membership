import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { __ } from "@wordpress/i18n";
import React from "react";
import { RequestHistoryItem } from "../../models/request-history";

type ActionProps = { item: RequestHistoryItem };


const RejectedAction = ({ item }: ActionProps) => {
    return (
        <Box>
            {item.params['reason'] && <Typography>Reason: {item.params['reason']}</Typography>}
        </Box>
    );
}

const actions: { [key: string]: React.ComponentType<ActionProps> } = {
    rejected: RejectedAction,
};

export function RequestHistory({ history }: { history: RequestHistoryItem[] }) {
    if (history.length === 0) {
        return <p>No history available.</p>;
    }

    return (
        <Timeline>
            {history.map((item) => {
                const ActionComponent = actions[item.status] || (() => <></>);
                return (
                    <TimelineItem key={item.id}>
                        <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="body2">{item.status}</Typography>
                            <ActionComponent item={item} />
                            <Typography variant="body2">{__(`By {name} on {date}`, 'wolf-membership')
                                .replace('{name}', item.changed_by?.display_name || "Unknown")
                                .replace('{date}', new Date(item.created_at).toLocaleString())
                            }</Typography>
                        </TimelineContent>
                    </TimelineItem>
                );
            })}
        </Timeline>
    );
}