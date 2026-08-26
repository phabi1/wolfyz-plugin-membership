import { Card, CardBody } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { RequestParticipant } from "../../models/request-participant";
import { ParticipantInfo } from "./ParticipantInfo";

export function ParticipantsCard({ participants }: { participants: RequestParticipant[] }) {

    if (participants.length === 0) {
        return (
            <Card>
                <CardBody>{__("No participants available.", "wolf-membership")}</CardBody>
            </Card>
        );
    }
    return (<>
        {participants.map((participant, index) => (
            <Card key={index}>
                <CardBody>
                    <details>
                        <summary style={{ cursor: "pointer", fontWeight: 600, marginBottom: 12 }}>
                            {sprintf(__("Participant %s", "wolf-membership"), (index + 1).toString())}
                        </summary>
                    <ParticipantInfo participant={participant} />
                    </details>
                </CardBody>
            </Card>
        ))}
    </>
    );
}