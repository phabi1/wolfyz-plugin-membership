export type Contact = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  notes: string;
}

export function emptyContact(): Contact {
  return {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    notes: "",
  };
}