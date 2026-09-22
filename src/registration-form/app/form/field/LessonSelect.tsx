import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { __ } from "@wordpress/i18n";
import type { Lesson as LessonModel } from "../../models/lesson";
import { TEXT_DOMAIN } from "../../utils";
import { Lesson } from "../../ui/Lesson";

export function LessonSelect({
    value,
    lessons,
    onChange,
}: {
    value: string | number;
    lessons: LessonModel[];
    onChange: (event: any) => void;
}) {
    const normalizedValue = value !== undefined && value !== null ? String(value) : "";

    return (
        <TextField
            select
            fullWidth
            required
            label={__("Desired Course", TEXT_DOMAIN)}
            value={normalizedValue}
            onChange={onChange}
            sx={{
                gridColumn: { xs: "auto", sm: "1 / -1" },
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                },
            }}
        >
            <MenuItem value="">
                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                    {__("Choose a course", TEXT_DOMAIN)}
                </Typography>
            </MenuItem>

            {lessons.length === 0 && (
                <MenuItem value="" disabled>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {__("No course available", TEXT_DOMAIN)}
                    </Typography>
                </MenuItem>
            )}

            {lessons.map((lesson) => (
                <MenuItem key={lesson.id} value={String(lesson.id)} sx={{ py: 1.5, px: 1.5 }}>
                    <Lesson lesson={lesson} />
                </MenuItem>
            ))}
        </TextField>
    );
}
