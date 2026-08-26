import { useMemo } from "react";
import { Card, CardBody } from "@wordpress/components";
import ContactsForm from "./ContactsForm";
import SessionsForm from "./SessionsForm";
import WheelAssigmentsForm from "./WheelAssigmentsForm";
import { MemberAvatar } from "../ui/Avatar";
import type { Lesson } from "../../models/lesson";
import type { Member } from "../../models/member";
import type { Subscription } from "../../models/subscription";
import type { Wheel } from "../../models/wheel";
import type { WheelAssignment } from "../../models/wheel-assignment";

export function SubscriptionDetails({
  subscription, member, wheelAssignments, lessons, wheels, onRefetch
}: {
  subscription: Subscription, member: Member | null, wheelAssignments: WheelAssignment[], lessons: Lesson[], wheels: Wheel[], onRefetch?: () => void
}) {

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
    onRefetch?.();
  }

  const handleRemoveContact = (contact: any) => {
    // Implement contact removal logic here
    onRefetch?.();
  }

  const handleAddSession = async (data: any) => {
    // Implement session addition logic here
    onRefetch?.();
  };

  const handleRemoveSession = async (session: any) => {
    // Implement session removal logic here
    onRefetch?.();
  };

  const handleAddWheelAssignment = async (data: any) => {
    // Implement wheel assignment addition logic here
    onRefetch?.();
  };

  const handleRemoveWheelAssignment = async (data: any) => {
    // Implement wheel assignment removal logic here
    onRefetch?.();
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
        <WheelAssigmentsForm
          memberId={subscription.member_id}
          wheelAssignments={wheelAssignments || []}
          wheels={wheels}
          onAddWheelAssignment={handleAddWheelAssignment}
          onRemoveWheelAssignment={handleRemoveWheelAssignment} />
      </CardBody></Card>
    </>
  );
}