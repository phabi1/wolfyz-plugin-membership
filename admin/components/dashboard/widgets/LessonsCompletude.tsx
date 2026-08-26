import { Spinner } from "@wordpress/components";
import { useEffect, useState, useMemo } from "react";
import DashboardWidgetCard from "../WidgetCard";

interface Lesson {
  id: number;
  title: string;
  max_participants: number;
  total: number;
  completude: number;
}

export default function DashboardWidgetLessonsCompletude({ settings }: any) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const empty = useMemo(() => {
    if (loading) return false;
    return lessons.length === 0;
  }, [lessons, loading]);

  useEffect(() => {
    fetch(
      "/wp-json/wolf-memberships/v1/dashboard/source?type=lessons_completude&campaign_id=" + settings.campaignId,
    )
      .then((res) => res.json())
      .then((data) => {
        setLessons(
          data.sessions.map((session: any) => ({
            id: session.id,
            title: session.title,
            max_participants: session.max_participants,
            total: session.total,
            completude: session.completude,
          })),
        );

        setLoading(false);
      });
  }, [settings.campaignId]);

  return (
    <DashboardWidgetCard title="Lessons Completude">
      {loading ? <Spinner /> : null}
      {empty ? <p>No lessons available</p> : (
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
          {lessons.map((lesson) => (
            <li key={lesson.id} style={{ border: "1px solid #dcdcde", borderRadius: 8, padding: 10 }}>
              <div style={{ marginBottom: 6 }}>
                {lesson.title}{" "}
              <span style={{ fontSize: "0.8em", color: "#666" }}>
                ({lesson.total}/{lesson.max_participants})
              </span>
              </div>
              <div style={{ width: "100%", height: 8, background: "#f0f0f1", borderRadius: 999, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.max(0, Math.min(100, lesson.completude))}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #2271b1 0%, #72aee6 100%)",
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardWidgetCard>
  );
}
