import { __ } from "@wordpress/i18n";
import type { Lesson } from "../models/lesson";
import { formatDay, formatTime } from "../pipes";
import { TEXT_DOMAIN } from "../utils";


export function Lesson({ lesson }: { lesson: Lesson }) {
    const title = lesson.title || `Cours #${lesson.id}`;
    const sessionInfo = formatDay(lesson.day) + " " + formatTime(lesson.lesson_start) + " - " + formatTime(lesson.lesson_end);
    const availableSpots = Math.max((lesson.participant_max ?? 0) - (lesson.participant_nb ?? 0), 0);

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 6 }}>
            <div style={{ fontWeight: 700, lineHeight: 1.3 }}>
                {title}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {sessionInfo && (
                    <span style={{ color: "#50575e", fontSize: 12 }}>
                        {sessionInfo}
                    </span>
                )}
                <span
                    style={{
                        display: "inline-block",
                        borderRadius: 999,
                        padding: "2px 8px",
                        background: "#e5f5fa",
                        color: "#135e96",
                        fontWeight: 600,
                        fontSize: 12,
                    }}
                >
                    {`${availableSpots} ${__("Available spots", TEXT_DOMAIN)}`}
                </span>
            </div>
        </div>
    );
}