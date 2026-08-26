import { TimePicker, TextControl, SelectControl } from "@wordpress/components";
import { useMemo } from "react";
import { __ } from "@wordpress/i18n";

export function LessonForm({ data, onChange }: { data: { day: number, title: string, lesson_start: number, lesson_end: number }, onChange: (data: { day: number, title: string, lesson_start: number, lesson_end: number }) => void }) {
    const handleInputChange = (field: string, value: any) => {
        if (field === "lesson_start" || field === "lesson_end") {
            value = new Date(0, 0, 0, value.hours, value.minutes).getHours() * 60 + new Date(0, 0, 0, value.hours, value.minutes).getTime() / 60000;
        }
        onChange({ ...data, [field]: value });
    };

    const startTime = useMemo(() => {
        const date = new Date();
        date.setHours(Math.floor(data.lesson_start / 60));
        date.setMinutes(data.lesson_start % 60);
        return {
            minutes: date.getMinutes(),
            hours: date.getHours(),
        };
    }, [data.lesson_start]);

    const endTime = useMemo(() => {
        const date = new Date();
        date.setHours(Math.floor(data.lesson_end / 60));
        date.setMinutes(data.lesson_end % 60);
        return {
            minutes: date.getMinutes(),
            hours: date.getHours(),
        };
    }, [data.lesson_end]);

    return (
        <div>
            <SelectControl
                label={__("Day", "wolf-membership")}
                value={data.day.toString()}
                options={[
                    { label: __("Monday", "wolf-membership"), value: "1" },
                    { label: __("Tuesday", "wolf-membership"), value: "2" },
                    { label: __("Wednesday", "wolf-membership"), value: "3" },
                    { label: __("Thursday", "wolf-membership"), value: "4" },
                    { label: __("Friday", "wolf-membership"), value: "5" },
                    { label: __("Saturday", "wolf-membership"), value: "6" },
                    { label: __("Sunday", "wolf-membership"), value: "7" },
                ]}
                onChange={(value) => handleInputChange("day", parseInt(value))}
            />
            <TextControl
                label={__("Title", "wolf-membership")}
                value={data.title}
                onChange={(value) => handleInputChange("title", value)}
            />
            <TimePicker.TimeInput
                label={__("Start Time", "wolf-membership")}
                value={startTime}
                onChange={(value) => handleInputChange("lesson_start", value.hours * 60 + value.minutes)}
            />
            <TimePicker.TimeInput
                label={__("End Time", "wolf-membership")}
                value={endTime}
                onChange={(value) => handleInputChange("lesson_end", value.hours * 60 + value.minutes)}
            />
        </div>
    );
}   