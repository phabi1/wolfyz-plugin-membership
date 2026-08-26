import { Button, Card, CardBody, CardHeader } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useMemo, useState, type ReactNode } from "react";
import type { RequestParticipant } from "../../models/request-participant";
import type { Lesson as LessonModel } from "../../models/lesson";
import { FilePreview } from "../ui/FilePreview";
import { Address } from "../ui/Address";
import { isParticipantMinor } from "../../helpers";
import { Lesson } from '../ui/Lesson';

export function ParticipantInfo({ participant, lessons, title, lessonStatus, hideLessonStatus }: { participant: RequestParticipant, lessons: LessonModel[], title?: string, lessonStatus: string, hideLessonStatus?: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const normalize = (value?: string | null) => value?.trim() || "N/A";
    const isProvided = (value?: string | null) => Boolean(value?.trim());

    const firstname = normalize(participant.firstname);
    const lastname = normalize(participant.lastname);
    const email = normalize(participant.email);
    const phone = normalize(participant.phone);
    const birthdate = normalize(participant.birthdate);
    const gender = normalize(participant.gender);
    const nationality = normalize(participant.nationality);
    const isMinor = isParticipantMinor(participant.birthdate || "");
    const licenseType = participant.license_type === "competition"
        ? __("Competition", "wolf-membership")
        : participant.license_type === "hobby"
            ? __("Hobby", "wolf-membership")
            : "N/A";

    const lessonId = participant.lesson_id !== undefined && participant.lesson_id !== null
        ? String(participant.lesson_id).trim()
        : "";
    const selectedLesson = useMemo<LessonModel | null>(() => {
        if (!lessonId) {
            return null;
        }
        return lessons.find((l) => String(l.id) === lessonId) || null;
    }, [lessonId, lessons]);

    const comment = normalize(participant.comment);

    const tutor1Name = participant.tutor1
        ? `${normalize(participant.tutor1.firstname)} ${normalize(participant.tutor1.lastname)}`.trim()
        : "N/A";
    const tutor1Email = normalize(participant.tutor1?.email);
    const tutor1Phone = normalize(participant.tutor1?.phone);

    const tutor2Name = participant.tutor2
        ? `${normalize(participant.tutor2.firstname)} ${normalize(participant.tutor2.lastname)}`.trim()
        : "N/A";
    const tutor2Email = normalize(participant.tutor2?.email);
    const tutor2Phone = normalize(participant.tutor2?.phone);

    const hasLesson = selectedLesson !== null;
    const hasHealthQuestionnaire = isProvided(participant.health_questionnaire);
    const hasIdentityPhoto = isProvided(participant.identity_photo);
    const hasMedicalCertificate = isProvided(participant.medical_certificate);

    const agreePhoto = participant.agree_photo === true ? __("Yes", "wolf-membership") : __("No", "wolf-membership");
    const agreeExit = participant.agree_exit === true ? __("Yes", "wolf-membership") : __("No", "wolf-membership");

    const badgeStyle = (status: string) => {
        let style: React.CSSProperties = {};
        switch (status) {
            case "ok":
                style = {
                    background: "#dff6dd",
                    color: "#14532d",
                    border: "1px solid #86efac",
                };
                break;
            case "warning":
                style = {
                    background: "#fff4e5",
                    color: "#7a4b00",
                    border: "1px solid #fed7aa",
                };
                break;
            case "error":
                style = {
                    background: "#fef2f2",
                    color: "#991b1b",
                    border: "1px solid #fca5a5",
                };
                break;
            default:
                style = {
                    background: "#f3f4f6",
                    color: "#374151",
                    border: "1px solid #d1d5db",
                };
                break;
        }

        return {
            display: "inline-block",
            padding: "4px 8px",
            borderRadius: 12,
            fontSize: 12,
            lineHeight: "16px",
            fontWeight: 600,
            ...style,
        };
    };

    const sectionTitleStyle = {
        margin: "0 0 8px",
        fontSize: 13,
        color: "#50575e",
        textTransform: "uppercase" as const,
        letterSpacing: "0.04em",
    };

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 12,
    };

    const DetailItem = ({ label, value }: { label: string; value: ReactNode }) => (
        <div>
            <p style={{ margin: 0, fontSize: 12, color: "#50575e" }}>{label}</p>
            <div style={{ marginTop: 2 }}>{value}</div>
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", width: "100%" }}>
                    <div>
                        {title && <p style={{ margin: "0 0 4px", fontSize: 12, color: "#50575e", fontWeight: 600 }}>{title}</p>}
                        <strong>{firstname} {lastname}</strong>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center" }}>
                        {hideLessonStatus ? null : (<div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                            <span style={badgeStyle(lessonStatus)}>
                                {hasLesson ? __("Lesson selected", "wolf-membership") : __("Lesson not selected", "wolf-membership")}
                            </span>
                        </div>)}
                        <Button
                            variant="secondary"
                            onClick={() => setIsExpanded((open) => !open)}
                            aria-expanded={isExpanded}
                            icon={isExpanded ? "arrow-up-alt2" : "arrow-down-alt2"}
                        >
                            {isExpanded ? __("Collapse", "wolf-membership") : __("Expand", "wolf-membership")}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            {isExpanded && <CardBody>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <section>
                        <p style={sectionTitleStyle}>{__("Identity", "wolf-membership")}</p>
                        <div style={gridStyle}>
                            <DetailItem label={__("First Name", "wolf-membership")} value={firstname} />
                            <DetailItem label={__("Last Name", "wolf-membership")} value={lastname} />
                            <DetailItem label={__("Birthdate", "wolf-membership")} value={birthdate} />
                            <DetailItem label={__("Minor", "wolf-membership")} value={isMinor ? __("Yes", "wolf-membership") : __("No", "wolf-membership")} />
                            <DetailItem label={__("Gender", "wolf-membership")} value={gender} />
                            <DetailItem label={__("Nationality", "wolf-membership")} value={nationality} />
                        </div>
                    </section>

                    <section>
                        <p style={sectionTitleStyle}>{__("Contact", "wolf-membership")}</p>
                        <div style={gridStyle}>
                            <DetailItem label={__("Email", "wolf-membership")} value={email} />
                            <DetailItem label={__("Phone", "wolf-membership")} value={phone} />
                            <DetailItem label={__("Address", "wolf-membership")} value={participant.address ? <Address value={participant.address} /> : "N/A"} />
                        </div>
                    </section>

                    <section>
                        <p style={sectionTitleStyle}>{__("Registration", "wolf-membership")}</p>
                        <div style={gridStyle}>
                            <DetailItem label={__("License Type", "wolf-membership")} value={licenseType} />
                            <DetailItem label={__("Comment", "wolf-membership")} value={comment} />
                        </div>
                    </section>

                    <section>
                        <p style={sectionTitleStyle}>{__("Sessions", "wolf-membership")}</p>
                        <div>
                            {selectedLesson ? <Lesson lesson={selectedLesson} /> : __("Not selected", "wolf-membership")}
                        </div>
                    </section>

                    <section>
                        <p style={sectionTitleStyle}>{__("Documents", "wolf-membership")}</p>
                        <div style={gridStyle}>
                            <DetailItem
                                label={__("Health Questionnaire", "wolf-membership")}
                                value={hasHealthQuestionnaire ? <FilePreview file={participant.health_questionnaire || null} /> : __("Not provided", "wolf-membership")}
                            />
                            <DetailItem
                                label={__("Identity Photo", "wolf-membership")}
                                value={hasIdentityPhoto ? __("Provided", "wolf-membership") : __("Not provided", "wolf-membership")}
                            />
                            <DetailItem
                                label={__("Medical Certificate", "wolf-membership")}
                                value={hasMedicalCertificate ? __("Provided", "wolf-membership") : __("Not provided", "wolf-membership")}
                            />
                        </div>
                    </section>

                    {isMinor && (
                        <section>
                            <p style={sectionTitleStyle}>{__("Minor information", "wolf-membership")}</p>
                            <div style={gridStyle}>
                                <div>
                                    <p style={{ margin: "0 0 8px", fontWeight: 600 }}>{__("Guardian 1", "wolf-membership")}</p>
                                    <div style={{ display: "grid", gap: 8 }}>
                                        <DetailItem label={__("Name", "wolf-membership")} value={tutor1Name} />
                                        <DetailItem label={__("Email", "wolf-membership")} value={tutor1Email} />
                                        <DetailItem label={__("Phone", "wolf-membership")} value={tutor1Phone} />
                                    </div>
                                </div>
                                <div>
                                    <p style={{ margin: "0 0 8px", fontWeight: 600 }}>{__("Guardian 2", "wolf-membership")}</p>
                                    <div style={{ display: "grid", gap: 8 }}>
                                        <DetailItem label={__("Name", "wolf-membership")} value={tutor2Name} />
                                        <DetailItem label={__("Email", "wolf-membership")} value={tutor2Email} />
                                        <DetailItem label={__("Phone", "wolf-membership")} value={tutor2Phone} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: 12 }}>
                                <DetailItem label={__("Exit Consent", "wolf-membership")} value={agreeExit} />
                            </div>
                        </section>
                    )}

                    <section>
                        <p style={sectionTitleStyle}>{__("Consents", "wolf-membership")}</p>
                        <div style={gridStyle}>
                            <DetailItem label={__("Photo Consent", "wolf-membership")} value={agreePhoto} />
                        </div>
                    </section>

                </div>
            </CardBody>}
        </Card>
    );
}