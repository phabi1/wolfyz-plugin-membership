import { Card, CardBody } from "@wordpress/components";
import { useEffect, useReducer, useMemo } from "react";
import { useParams, Link } from "react-router";
import type { Lesson } from "../../models/lesson";
import ContactsForm from "../../components/subscriptions/ContactsForm";
import SessionsForm from "../../components/subscriptions/SessionsForm";
import { MemberAvatar } from "../../components/ui/Avatar";
import UiCollection from "../../components/ui/Collection";
import UiPage from "../../components/ui/Page";
import { MemberDetails } from "../../models/member-details";
import { Subscription } from "../../models/subscription";
import MemberService from "../../services/members";
import SubscriptionService from "../../services/subscriptions";
import LessonService from "../../services/lessons";
import { __ } from "@wordpress/i18n";


function WheelItem({ wheel }: { wheel: any }) {
  return (
    <div>{wheel.name}</div>
  );
}

function SubscriptionDetails({ subscription, member, lessons, onRefetch }: { subscription: Subscription, member: MemberDetails | null, lessons: Lesson[], onRefetch: () => void }) {

  const sessions = useMemo(() => {
    if (!subscription.sessions) {
      return [];
    }
    return subscription.sessions.map((session) => {
      const lesson = lessons.find((lesson) => lesson.id === session.lesson_id);
      return {
        ...session,
        lesson: lesson || { id: session.lesson_id, title: "Unknown Lesson" },
      };
    });
  }, [subscription, lessons]);

  const handleAddContact = () => {
    // Implement contact addition logic here
  }

  const handleRemoveContact = (contact: any) => {
    // Implement contact removal logic here
  }

  const handleAddSession = async (data: any) => {
    // onRefetch();
  };

  const handleRemoveSession = async (session: any) => {
    // Implement session removal logic here
    // onRefetch();
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <MemberAvatar url={member?.avatar_url} gender={member?.gender} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <h2 style={{ margin: 0 }}>
            {member ? `${member.firstname} ${member.lastname}` : ''}
          </h2>
        </div>
      </div>
      <Card style={{ marginBottom: 12 }}><CardBody>
        <p>
          License type: {subscription ? subscription.license_type : ''}
        </p>
        <p>
          Subscribed at: {subscription ? new Date(subscription.subscribed_at * 1000).toLocaleString() : ''}
        </p>
      </CardBody></Card>
      <Card style={{ marginBottom: 12 }}><CardBody>
        <h3 style={{ marginTop: 0 }}>
          Contacts
        </h3>
        <ContactsForm member={member} contacts={subscription?.contacts || []} onAddContact={handleAddContact} onRemoveContact={handleRemoveContact} />
      </CardBody></Card>
      <Card style={{ marginBottom: 12 }}><CardBody>
        <h3 style={{ marginTop: 0 }}>
          Sessions
        </h3>
        <SessionsForm campaignId={subscription.campaign_id} subscriptionId={subscription.id} memberId={subscription.member_id} sessions={sessions} lessons={lessons} onAddSession={handleAddSession} onRemoveSession={handleRemoveSession} />
      </CardBody></Card>
      <Card style={{ marginBottom: 12 }}><CardBody>
        <h3 style={{ marginTop: 0 }}>
          Wheels
        </h3>
        <UiCollection items={member?.wheels || []} renderItem={(wheel) => (
          <WheelItem wheel={wheel} />
        )} />
      </CardBody></Card>
    </>
  );
}

type State = {
  loading: boolean;
  subscription: Subscription | null;
  member: MemberDetails | null;
  sessions: any[];
  lessons: Lesson[];
};

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SUBSCRIPTION'; payload: Subscription }
  | { type: 'SET_MEMBER'; payload: MemberDetails }
  | { type: 'SET_LESSONS'; payload: Lesson[] };

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
      default:
        return state;
    }
  }, {
    loading: true,
    subscription: null,
    member: null,
    sessions: [],
    lessons: [],
  });

  const fetchLessons = async () => {
    try {
      const lessons = await LessonService.items(campaignId!);
      dispatch({ type: 'SET_LESSONS', payload: lessons.items });
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  }

  const fetchSubscriptionDetails = async (campaignId: string, subscriptionId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const subscription = await SubscriptionService.item(campaignId, subscriptionId);
      const member = await MemberService.item(subscription.member.id.toString());
      dispatch({ type: 'SET_SUBSCRIPTION', payload: subscription });
      dispatch({ type: 'SET_MEMBER', payload: member });
    } catch (error) {
      console.error("Error fetching subscription details:", error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

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
          <SubscriptionDetails subscription={state.subscription} member={state.member} lessons={state.lessons} onRefetch={() => fetchSubscriptionDetails(campaignId!, subscriptionId!)} />
        )
      )}
    </UiPage>
  );
}
