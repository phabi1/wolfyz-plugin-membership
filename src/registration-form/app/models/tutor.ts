export type Tutor = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
};

export function emptyTutor(): Tutor {
  return {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  };
}
