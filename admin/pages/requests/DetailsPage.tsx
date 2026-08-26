import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { __ } from "@wordpress/i18n";
import { useEffect, useMemo, useReducer } from "react";
import { useParams } from "react-router";
import { RequestHistory } from "../../components/requests/History";
import { ParticipantsCard } from "../../components/requests/ParticipantsCard";
import { PayerCard } from "../../components/requests/PayerCard";
import Page, { Action as PageAction } from "../../components/ui/Page";
import { Request } from "../../models/request";
import { RequestHistoryItem } from "../../models/request-history";
import RequestService from "../../services/requests";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import { RequestStatusSwitcher } from "../../components/requests/StatusSwitcher";

interface State {
    item: Request | null;
    history: RequestHistoryItem[]; // Replace 'any' with the appropriate type for history items
    loading: boolean;
}

type Action =
    | {
        type: "fetchItem";
        payload: {
            item: Request | null;
            history: RequestHistoryItem[];
        };
    }
    | {
        type: "setLoading";
        payload: boolean;
    }
    ;

export default function RequestDetailsPage() {
    const { campaignId, requestId } = useParams();

    const [state, dispatch] = useReducer(
        (state: State, action: Action) => {
            switch (action.type) {
                case "setLoading":
                    return { ...state, loading: action.payload };
                case "fetchItem":
                    return {
                        ...state,
                        item: action.payload.item,
                        history: action.payload.history,
                    };
                default:
                    return state;
            }
        },
        {
            item: null,
            history: [],
            loading: false,
        },
    );

    const fetchRequestDetails = async (campaignId: string, requestId: string) => {
        dispatch({ type: "setLoading", payload: true });
        try {
            const item = await RequestService.item(campaignId, requestId);
            const history = await RequestService.history(campaignId, requestId);
            dispatch({ type: "fetchItem", payload: { item, history } });
        } catch (error) {
            console.error("Error fetching request details:", error);
            dispatch({ type: "fetchItem", payload: { item: null, history: [] } });
        } finally {
            dispatch({ type: "setLoading", payload: false });
        }
    };

    useEffect(() => {
        if (!campaignId || !requestId) {
            return;
        }

        fetchRequestDetails(campaignId, requestId);
    }, [campaignId, requestId]);

    const handleStatusChanged = async ({ status, reason }: { status: string; reason?: string }) => {
        if (!campaignId || !requestId) {
            return;
        }
        switch (status) {
            case "approved":
                await RequestService.approve(campaignId, requestId);
                break;
            case "rejected":
                await RequestService.reject(campaignId, requestId, reason || "");
                break;
            case "paid":
                await RequestService.paid(campaignId, requestId);
                break;
            case "cancelled":
                await RequestService.cancel(campaignId, requestId);
                break;
            default:
                break;
        }
        // Refresh the request details after status change
        fetchRequestDetails(campaignId, requestId);
    };

    if (state.loading) {
        return <div>Loading...</div>;
    }

    if (!state.item) {
        return <div>No request found.</div>;
    }

    return (
        <Page title={`Request Details - ${state.item.id}`}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <PayerCard request={state.item} />
                    <ParticipantsCard participants={state.item.data.participants} />
                </Box>
                <Box sx={{ width: 320 }}>
                    <Paper sx={{ padding: 2, marginBottom: 2 }}>
                        <RequestStatusSwitcher value={state.item.status} onChange={handleStatusChanged} />
                    </Paper>
                    <Typography variant="h6">{__('Request History', 'wolf-membership')}</Typography>
                    <Paper sx={{ padding: 2, marginTop: 1 }}>
                        <RequestHistory history={state.history} />
                    </Paper>
                </Box>
            </Box>
        </Page >
    );
}