import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { Lesson } from "../../models/lesson";
import LessonService from "../../services/lessons";
import { Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export default function LessonListPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);

  const days = useMemo(() => {
    const daysOfWeek = [
      { day: 1, title: "Monday" },
      { day: 2, title: "Tuesday" },
      { day: 3, title: "Wednesday" },
      { day: 4, title: "Thursday" },
      { day: 5, title: "Friday" },
      { day: 6, title: "Saturday" },
      { day: 7, title: "Sunday" },
    ];
    return daysOfWeek.map((day) => {
      const dayLessons = lessons.filter((lesson) => lesson.day === day.day);
      return {
        day: day.day,
        title: day.title,
        lessons: dayLessons,
      };
    });
  }, [lessons]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    LessonService.items(campaignId!).then((data) => {
      setLessons(data.items);
    });
  }, [campaignId]);

  return (
    <>
      <h1>Lessons</h1>
      <div>
        {days.map((day) => (
          <div key={day.day} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ margin: 0 }}>
                {day.title}
              </h2>
              <Button variant="secondary" onClick={() => navigate(`/campaign/${campaignId}/lessons/new?day=${day.day}`)}>
                {__("Add Lesson", "wolf-membership")}
              </Button>
            </div>
            <div style={{ border: '1px solid #dcdcde', borderRadius: 8, overflow: 'hidden', background: "#fff" }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '50%', textAlign: 'left', padding: 10, borderBottom: '1px solid #dcdcde' }}>Title</th>
                      <th style={{ width: '10%', textAlign: 'left', padding: 10, borderBottom: '1px solid #dcdcde' }}>Start Time</th>
                      <th style={{ width: '10%', textAlign: 'left', padding: 10, borderBottom: '1px solid #dcdcde' }}>End Time</th>
                      <th style={{ width: '10%', textAlign: 'left', padding: 10, borderBottom: '1px solid #dcdcde' }}>Age Range</th>
                      <th style={{ width: '10%', textAlign: 'left', padding: 10, borderBottom: '1px solid #dcdcde' }}>Max Participants</th>
                      <th style={{ width: '10%', textAlign: 'right', padding: 10, borderBottom: '1px solid #dcdcde' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.lessons.length > 0 ? (
                      day.lessons.map((lesson) => (
                        <tr
                          key={lesson.id}
                          onClick={() =>
                            navigate(
                              `/campaigns/${campaignId}/lessons/${lesson.id}`,
                            )
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          <td style={{ padding: 10, borderBottom: '1px solid #f0f0f1' }}>{lesson.title}</td>
                          <td style={{ padding: 10, borderBottom: '1px solid #f0f0f1' }}>
                            {formatTime(lesson.lesson_start)}
                          </td>
                          <td style={{ padding: 10, borderBottom: '1px solid #f0f0f1' }}>{formatTime(lesson.lesson_end)}</td>
                          <td style={{ padding: 10, borderBottom: '1px solid #f0f0f1' }}>
                            {lesson.age_min && lesson.age_max
                              ? `${lesson.age_min} - ${lesson.age_max} years`
                              : "All Ages"}
                          </td>
                          <td style={{ padding: 10, borderBottom: '1px solid #f0f0f1' }}>
                            {lesson.participant_max || "Unlimited"}
                          </td>
                          <td style={{ padding: 10, borderBottom: '1px solid #f0f0f1', textAlign: 'right' }}>
                            <Button
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/campaign/${campaignId}/lessons/${lesson.id}/edit`,
                                );
                              }}
                            >
                              {__("Edit", "wolf-membership")}
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: 12 }}>
                          {__("No lessons available", "wolf-membership")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Outlet />
    </>
  );
}
