import { useEffect, useReducer } from "react";
import { useParams } from "react-router";
import { RequestHistory } from "../../components/requests/History";
import { ParticipantsCard } from "../../components/requests/ParticipantsCard";
import { RequestPayCard } from "../../components/requests/PayCard";
import { PayerCard } from "../../components/requests/PayerCard";
import { RequestStatusSwitcher } from "../../components/requests/StatusSwitcher";
import Page from "../../components/ui/Page";
import { Lesson } from "../../models/lesson";
import { Request } from "../../models/request";
import { RequestHistoryItem } from "../../models/request-history";
import LessonService from "../../services/lessons";
import RequestService from "../../services/requests";

interface State {
    lessons: Lesson[];
    item: Request | null;
    history: RequestHistoryItem[];
    pay: any | null;
    loading: boolean;
}

type Action =
    | {
        type: "setLessons";
        payload: Lesson[];
    }
    | {
        type: "fetchItem";
        payload: {
            item: Request | null;
            history: RequestHistoryItem[];
            pay: any | null;
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
                        pay: action.payload.pay,
                    };
                case "setLessons":
                    return { ...state, lessons: action.payload };
                default:
                    return state;
            }
        },
        {
            lessons: [],
            item: null,
            history: [],
            pay: null,
            loading: false,
        },
    );

    const fetchLessons = async () => {
        try {
            const lessons = await LessonService.items(campaignId!);
            dispatch({ type: "setLessons", payload: lessons.items });
        } catch (error) {
            console.error("Error fetching lessons:", error);
        }
    }

    const fetchRequestDetails = async (campaignId: string, requestId: string) => {
        dispatch({ type: "setLoading", payload: true });
        try {
            const item = await RequestService.item(campaignId, requestId);
            const [history, pay] = await Promise.all([
                RequestService.history(campaignId, requestId),
                RequestService.calculatePay(campaignId, item.data),
            ]);
            dispatch({ type: "fetchItem", payload: { item, history, pay } });
        } catch (error) {
            console.error("Error fetching request details:", error);
            dispatch({ type: "fetchItem", payload: { item: null, history: [], pay: null } });
        } finally {
            dispatch({ type: "setLoading", payload: false });
        }
    };

    useEffect(() => {
        if (!campaignId) {
            return;
        }
        fetchLessons();
    }, [campaignId]);

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
            <div style={{ display: "flex", flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 640px", minWidth: 320 }}>
                    <PayerCard request={state.item} />
                    <ParticipantsCard request={state.item} lessons={state.lessons} />
                    {state.pay && <RequestPayCard pay={state.pay} />}
                </div>
                <div style={{ width: 320, flex: "0 1 320px" }}>
                    <RequestStatusSwitcher value={state.item.status} onChange={handleStatusChanged} />
                    <RequestHistory history={state.history} />
                </div>
            </div>
        </Page >
    );
}