import { Button, Modal } from "@wordpress/components";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { LessonForm } from "../../components/lesson/LessonForm";
import LessonService from "../../services/lessons";
import { __ } from "@wordpress/i18n";

export default function LessonFormPage() {
  const { lessonId, campaignId } = useParams();
  const navigate = useNavigate();

  const modalTitle = useMemo(() => {
    return lessonId ? __("Edit Lesson", "wolf-membership") : __("New Lesson", "wolf-membership");
  }, [lessonId]);

  const [data, setData] = useState<{ day: number, title: string, lesson_start: number, lesson_end: number }>({
    day: 0,
    title: "",
    lesson_start: 0,
    lesson_end: 0,
  });

  const handleSave = () => {
    if (!campaignId) {
      console.error("Campaign ID is missing");
      return;
    }

    if (!lessonId) {
      // Create new lesson
      LessonService.create(campaignId, data)
        .then((data) => {
          navigate(-1);
        })
        .catch((error) => {
          // Handle error, e.g., show an error message
        });
      return;
    } else {
      // Update existing lesson
      LessonService.update(campaignId as string, lessonId as string, data)
        .then((data) => {
          navigate(-1);
        })
        .catch((error) => {
          // Handle error, e.g., show an error message
        });
    }
  };

  useEffect(() => {
    if (lessonId) {
      LessonService.item(campaignId as string, lessonId as string)
        .then((lesson) => {
          setData({
            day: lesson.day,
            title: lesson.title,
            lesson_start: lesson.lesson_start,
            lesson_end: lesson.lesson_end,
          });
        })
        .catch(() => {
          // Handle error, e.g., show an error message
        });
    }
  }, [lessonId, campaignId]);

  return (
    <Modal title={modalTitle} onRequestClose={() => navigate(-1)}>
      <LessonForm data={data} onChange={(data) => {
        setData(data);
      }} />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <Button
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </div>
    </Modal>
  );
}
