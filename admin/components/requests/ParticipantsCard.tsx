import { Card, CardBody, CardHeader, Flex } from "@wordpress/components";
import { __, _n, sprintf } from "@wordpress/i18n";
import type { Lesson } from "../../models/lesson";
import type { Request } from "../../models/request";
import { ParticipantInfo } from "./ParticipantInfo";
import { useMemo } from "react";

export function ParticipantsCard({ request, lessons }: { request: Request, lessons: Lesson[] }) {

    const participants = useMemo(() => {
        if (!request.data.participants) {
            return [];
        }
        return request.data.participants.map((participant) => {
            const lesson = lessons.find((lesson) => lesson.id === participant.lesson_id);

            const maxParticipants = lesson?.participant_max || 0;
            let currentParticipants = request.data.participants.reduce((count, p) => {
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
    }, [request, lessons]);

    const hideLessonStatus = useMemo(() => {
        if (request.status === "pending" || request.status === "rejected") {
            return false;
        }
        return true;
    }, [request]);

    if (participants.length === 0) {
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
                    {sprintf(_n("%d participant", "%d participants", participants.length, "wolf-membership"), participants.length)}
                </span>
            </Flex>
        </CardHeader>
        <CardBody>
            {participants.map((participant, index) => (
                <ParticipantInfo
                    key={index}
                    participant={participant}
                    lessons={lessons}
                    title={sprintf(__("Participant %s", "wolf-membership"), (index + 1).toString())}
                    lessonStatus={participant.lesson_status || "not_selected"}
                    hideLessonStatus={hideLessonStatus}
                />
            ))}
        </CardBody>
    </Card>
    );
}