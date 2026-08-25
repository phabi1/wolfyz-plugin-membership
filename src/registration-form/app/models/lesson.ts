export type Lesson = {
  id: string;
  title: string;
  day: number;
  lesson_start: number | null;
  lesson_end: number | null;
  participant_max: number;
  participant_nb: number;
};
