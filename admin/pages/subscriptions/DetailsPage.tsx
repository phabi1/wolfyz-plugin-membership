import { __ } from "@wordpress/i18n";
import { useEffect, useReducer } from "react";
import { Link, useParams } from "react-router";
import { SubscriptionDetails } from "../../components/subscriptions/Details";
import UiPage from "../../components/ui/Page";
import type { Lesson } from "../../models/lesson";
import type { Member } from "../../models/member";
import { Subscription } from "../../models/subscription";
import { Wheel } from "../../models/wheel";
import type { WheelAssignment } from "../../models/wheel-assignment";
import LessonService from "../../services/lessons";
import MemberService from "../../services/members";
import SubscriptionService from "../../services/subscriptions";
import WheelService from "../../services/wheel";
import WheelAssignmentService from "../../services/wheel-assignments";

type State = {
  loading: boolean;
  subscription: Subscription | null;
  member: Member | null;
  wheelAssignments: WheelAssignment[];
  wheels: Wheel[];
  sessions: any[];
  lessons: Lesson[];
};

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SUBSCRIPTION'; payload: Subscription }
  | { type: 'SET_MEMBER'; payload: Member }
  | { type: 'SET_LESSONS'; payload: Lesson[] }
  | { type: 'SET_WHEEL_ASSIGNMENTS'; payload: WheelAssignment[] }
  | { type: 'SET_WHEELS'; payload: Wheel[] };

export default function SubscriptionDetailsPage() {
  const { campaignId, subscriptionId } = useParams();

  const [state, dispatch] = useReducer((state: State, action: Action) => {
    switch (action.type) {
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      case 'SET_SUBSCRIPTION':
        return { ...state, subscription: action.payload };
      case 'SET_MEMBER':
        return { ...state, member: action.payload };
      case 'SET_LESSONS':
        return { ...state, lessons: action.payload };
      case 'SET_WHEEL_ASSIGNMENTS':
        return { ...state, wheelAssignments: action.payload };
      case 'SET_WHEELS':
        return { ...state, wheels: action.payload };
      default:
        return state;
    }
  }, {
    loading: true,
    subscription: null,
    member: null,
    sessions: [],
    lessons: [],
    wheelAssignments: [],
    wheels: [],
  });

  const fetchLessons = async () => {
    try {
      const lessons = await LessonService.items(campaignId!);
      dispatch({ type: 'SET_LESSONS', payload: lessons.items });
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  }

  const fetchWheels = async () => {
    try {
      const wheels = await WheelService.items();
      dispatch({ type: 'SET_WHEELS', payload: wheels.items });
    } catch (error) {
      console.error("Error fetching wheels:", error);
    }
  }

  const fetchSubscriptionDetails = async (campaignId: string, subscriptionId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const subscription = await SubscriptionService.item(campaignId, subscriptionId);
      const member = await MemberService.item(subscription.member.id.toString());
      const wheelAssignments = await WheelAssignmentService.items(subscription.member.id);
      dispatch({ type: 'SET_SUBSCRIPTION', payload: subscription });
      dispatch({ type: 'SET_MEMBER', payload: member });
      dispatch({ type: 'SET_WHEEL_ASSIGNMENTS', payload: wheelAssignments.items });
    } catch (error) {
      console.error("Error fetching subscription details:", error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

  useEffect(() => {
    fetchWheels();
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [campaignId]);

  useEffect(() => {
    fetchSubscriptionDetails(campaignId!, subscriptionId!);
  }, [campaignId, subscriptionId]);

  return (
    <UiPage title={''} topAction={
      <Link to={`/campaign/${campaignId}/subscriptions`}>
        {__('Back to Subscriptions', 'wolf-membership')}
      </Link>
    }>
      {state.loading ? (
        <div>Loading...</div>
      ) : (
        state.subscription && state.member && (
          <SubscriptionDetails
            subscription={state.subscription}
            member={state.member}
            lessons={state.lessons}
            wheelAssignments={state.wheelAssignments}
            wheels={state.wheels}
          />
        )
      )}
    </UiPage>
  );
}
