import { Card, CardBody, CardHeader, Flex } from "@wordpress/components";
import { __, _n, sprintf } from "@wordpress/i18n";
import type { Lesson } from "../../models/lesson";
import type { Request } from "../../models/request";
import { ParticipantInfo } from "./ParticipantInfo";
import { useMemo } from "react";
import { RequestParticipant } from "../../models/request-participant";

export function ParticipantsCard({ request, participants, lessons, onParticipantIdentityChange }: { request: Request, participants: (RequestParticipant & { member_status: string, member_suggestions: any[] })[], lessons: Lesson[], onParticipantIdentityChange?: (index: number, identity: { firstname: string; lastname: string; birthdate: string }) => Promise<boolean> | boolean }) {

    const items = useMemo(() => {
        return participants.map((participant) => {
            const lesson = lessons.find((lesson) => lesson.id === participant.lesson_id);

            const maxParticipants = lesson?.participant_max || 0;
            let currentParticipants = participants.reduce((count, p) => {
                return count + (p.lesson_id === lesson?.id ? 1 : 0);
            }, lesson?.participant_nb || 0);

            let status = 'ok';
            if (currentParticipants > maxParticipants) {
                status = 'error';
            } else if (currentParticipants > maxParticipants * 0.8) {
                status = 'warning';
            } else {
                status = 'ok';
            }

            return {
                ...participant,
                lesson_status: status,
            };
        });
    }, [participants, lessons]);

    const hideLessonStatus = useMemo(() => {
        if (request.status === "pending" || request.status === "rejected") {
            return false;
        }
        return true;
    }, [request]);

    if (items.length === 0) {
        return (
            <Card style={{ marginBottom: 16 }}>
                <CardBody>{__("No participants available.", "wolf-membership")}</CardBody>
            </Card>
        );
    }
    return (<Card style={{ marginBottom: 16 }}>
        <CardHeader>
            <Flex>
                <span style={{ fontSize: 16, fontWeight: 600, marginRight: 8 }}>
                    {__("Participants", "wolf-membership")}
                </span>
                <span style={{ fontSize: 14, color: "#50575e" }}>
                    {sprintf(_n("%d participant", "%d participants", items.length, "wolf-membership"), items.length)}
                </span>
            </Flex>
        </CardHeader>
        <CardBody>
            {items.map((participant, index) => (
                <ParticipantInfo
                    key={index}
                    participant={participant}
                    lessons={lessons}
                    title={sprintf(__("Participant %s", "wolf-membership"), (index + 1).toString())}
                    lessonStatus={participant.lesson_status || "not_selected"}
                    hideLessonStatus={hideLessonStatus}
                    onIdentityChanged={(identity) => onParticipantIdentityChange?.(index, identity)}
                />
            ))}
        </CardBody>
    </Card>
    );
}