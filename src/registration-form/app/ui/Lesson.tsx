import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { __ } from "@wordpress/i18n";
import type { Lesson } from "../models/lesson";
import { formatDay, formatTime } from "../pipes";
import { TEXT_DOMAIN } from "../utils";


export function Lesson({ lesson }: { lesson: Lesson }) {
    const title = lesson.title || `Cours #${lesson.id}`;
    const sessionInfo = formatDay(lesson.day) + " " + formatTime(lesson.lesson_start) + " - " + formatTime(lesson.lesson_end);
    const availableSpots = Math.max((lesson.participant_max ?? 0) - (lesson.participant_nb ?? 0), 0);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 0.75 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                {title}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", alignItems: "center" }}>
                {sessionInfo && (
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {sessionInfo}
                    </Typography>
                )}
                <Chip
                    label={`${availableSpots} ${__("Available spots", TEXT_DOMAIN)}`}
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                />
            </Stack>
        </Box>
    );
}