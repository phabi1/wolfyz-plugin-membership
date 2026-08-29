import { useCallback, useEffect, useReducer } from "react";
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
import MemberService from "../../services/members";
import RequestService from "../../services/requests";
import { RequestParticipant } from "../../models/request-participant";
import useToast from "../../hooks/use-toast";


interface State {
    lessons: Lesson[];
    item: Request | null;
    participants: (RequestParticipant & { member_status: string, member_suggestions: any[] })[];
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
            participants: (RequestParticipant & { member_status: string, member_suggestions: any[] })[];
        };
    }
    | {
        type: "setMember";
        payload: {
            index: number;
            status: string;
            suggestions: any[];
        };
    }
    | {
        type: "setPay";
        payload: any | null;
    }
    | {
        type: "setHistory";
        payload: RequestHistoryItem[];
    }
    | {
        type: "setLoading";
        payload: boolean;
    }
    | {
        type: "updateParticipantIdentity";
        payload: {
            index: number;
            identity: {
                firstname: string;
                lastname: string;
                birthdate: string;
            };
        };
    }
    ;

export default function RequestDetailsPage() {
    const { campaignId, requestId } = useParams();
    const showToast = useToast();

    const [state, dispatch] = useReducer(
        (state: State, action: Action) => {
            switch (action.type) {
                case "setLoading":
                    return { ...state, loading: action.payload };
                case "fetchItem":
                    return {
                        ...state,
                        item: action.payload.item,
                        participants: action.payload.item?.data.participants?.map((participant: any, index: number) => ({
                            ...participant,
                            member_status: 'loading',
                            member_suggestions: [],
                        })) as (RequestParticipant & { member_status: string, member_suggestions: any[] })[] ?? [],
                    };
                case "setPay":
                    return {
                        ...state,
                        pay: action.payload,
                    };
                case "setHistory":
                    return {
                        ...state,
                        history: action.payload,
                    };
                case "setLessons":
                    return { ...state, lessons: action.payload };
                case "setMember":
                    return {
                        ...state,
                        participants: state.participants.map((participant, index) =>
                            index === action.payload.index
                                ? {
                                    ...participant,
                                    member_status: action.payload.status,
                                    member_suggestions: action.payload.suggestions,
                                }
                                : participant
                        ),
                    };
                case "updateParticipantIdentity":
                    return {
                        ...state,
                        item: state.item
                            ? {
                                ...state.item,
                                data: {
                                    ...state.item.data,
                                    participants: state.item.data.participants.map((participant, index) =>
                                        index === action.payload.index
                                            ? {
                                                ...participant,
                                                firstname: action.payload.identity.firstname,
                                                lastname: action.payload.identity.lastname,
                                                birthdate: action.payload.identity.birthdate,
                                            }
                                            : participant,
                                    ),
                                },
                            }
                            : state.item,
                        participants: state.participants.map((participant, index) =>
                            index === action.payload.index
                                ? {
                                    ...participant,
                                    firstname: action.payload.identity.firstname,
                                    lastname: action.payload.identity.lastname,
                                    birthdate: action.payload.identity.birthdate,
                                }
                                : participant
                        ),
                    };
                default:
                    return state;
            }
        },
        {
            lessons: [],
            item: null,
            participants: [],
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

    const fetchRequestDetails = async (campaignId: number, requestId: number) => {
        dispatch({ type: "setLoading", payload: true });
        try {
            const item = await RequestService.item(campaignId, requestId);
            const [history, pay] = await Promise.all([
                RequestService.history(campaignId, requestId),
                RequestService.calculatePay(campaignId, item.data, item.discount_amount),
            ]);
            dispatch({ type: "fetchItem", payload: { item, participants: item.data.participants.map((p: any) => ({ ...p, member_status: "loading", member_suggestions: [] })) } });
            dispatch({ type: "setHistory", payload: history });
            dispatch({ type: "setPay", payload: pay });
            const existingsMembers = await Promise.all(item.data.participants.map((participant: any) => MemberService.exists({
                firstname: participant.firstname,
                lastname: participant.lastname,
                birthdate: participant.birthdate,
            }, true, 50)));

            existingsMembers.forEach((data, index) => {
                dispatch({
                    type: "setMember",
                    payload: {
                        index,
                        status: data.exists ? "member" : data.suggestions.length > 0 ? "suggested" : "anonymous",
                        suggestions: data.suggestions,
                    },
                });
            });
        } catch (error) {
            console.error("Error fetching request details:", error);
            dispatch({ type: "fetchItem", payload: { item: null, participants: [] } });
            dispatch({ type: "setHistory", payload: [] });
            dispatch({ type: "setPay", payload: null });
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

        fetchRequestDetails(+campaignId, +requestId);
    }, [campaignId, requestId]);

    const handleStatusChanged = async ({ status, reason }: { status: string; reason?: string }) => {
        if (!campaignId || !requestId) {
            return;
        }
        switch (status) {
            case "approved":
                await RequestService.approve(+campaignId, +requestId);
                break;
            case "rejected":
                await RequestService.reject(+campaignId, +requestId, reason || "");
                break;
            case "paid":
                await RequestService.paid(+campaignId, +requestId);
                break;
            case "cancelled":
                await RequestService.cancel(+campaignId, +requestId);
                break;
            default:
                break;
        }
        // Refresh the request details after status change
        fetchRequestDetails(+campaignId, +requestId);
    };

    const handleParticipantIdentityChange = async (
        index: number,
        identity: { firstname: string; lastname: string; birthdate: string },
    ): Promise<boolean> => {
        if (!campaignId || !requestId || !state.item) {
            return false;
        }

        dispatch({
            type: "updateParticipantIdentity",
            payload: {
                index,
                identity,
            },
        });

        const updatedParticipants: RequestParticipant[] = state.participants.map((participant, participantIndex) =>
            participantIndex === index
                ? {
                    ...participant,
                    firstname: identity.firstname,
                    lastname: identity.lastname,
                    birthdate: identity.birthdate,
                    member_status: undefined,
                    member_suggestions: undefined,
                }
                : participant
        );

        try {
            await RequestService.update(+campaignId, +requestId, {
                ...state.item,
                data: {
                    ...state.item.data,
                    participants: updatedParticipants,
                },
            });
        } catch (error) {
            console.error("Error persisting participant identity:", error);
            showToast("Error while saving participant identity", "error");
            fetchRequestDetails(+campaignId, +requestId);
            return false;
        }

        try {
            const data = await MemberService.exists(
                {
                    firstname: identity.firstname,
                    lastname: identity.lastname,
                    birthdate: identity.birthdate,
                },
                true,
                0,
            );
            dispatch({
                type: "setMember",
                payload: {
                    index,
                    status: data.exists ? "member" : data.suggestions.length > 0 ? "suggested" : "anonymous",
                    suggestions: data.suggestions,
                },
            });
            showToast("Participant identity updated", "success");
            return true;
        } catch (error) {
            console.error("Error checking participant identity:", error);
            showToast("Identity saved, but status refresh failed", "warning");
            return true;
        }
    };

    const handleApplyPayment = useCallback(async (discount: number) => {
        try {
            if (campaignId && requestId && state.item) {
                const pay = await RequestService.calculatePay(+campaignId, state.item.data, discount);
                dispatch({ type: "setPay", payload: pay });
            }
        } catch (error) {
            console.error("Error applying payment:", error);
            showToast("Error while applying payment", "error");
        }
    }, [campaignId, requestId, state.item, showToast]);

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
                    <ParticipantsCard
                        request={state.item}
                        participants={state.participants}
                        lessons={state.lessons}
                        onParticipantIdentityChange={handleParticipantIdentityChange}
                    />
                    {state.pay && <RequestPayCard
                        campaignId={state.item.campaign_id}
                        requestId={state.item.id} pay={state.pay}
                        onApplyDiscount={handleApplyPayment} />}
                </div>
                <div style={{ width: 320, flex: "0 1 320px" }}>
                    <RequestStatusSwitcher value={state.item.status} onChange={handleStatusChanged} />
                    <RequestHistory history={state.history} />
                </div>
            </div>
        </Page >
    );
}