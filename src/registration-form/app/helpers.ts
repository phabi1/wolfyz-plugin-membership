import { Participant } from "./models/participant";

export function isParticipantMinor(birthdate: string | number | Date): boolean {
  if (!birthdate) {
    return false;
  }

  const today = new Date();

  if (typeof birthdate === "string" || typeof birthdate === "number") {
    birthdate = new Date(birthdate);
  }

  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age < 18;
}

export function isValidParticipant(participant: Participant): boolean {
  const basicInfo =
    !!participant.firstname &&
    !!participant.lastname &&
    !!participant.birthdate &&
    !!participant.lesson_id &&
    !!participant.address?.line1 &&
    !!participant.address?.zipcode &&
    !!participant.address?.city &&
    !!participant.address?.country &&
    !!participant.gender &&
    !!participant.nationality;

  const minorInfo =
    !isParticipantMinor(participant.birthdate) ||
    !!(
      participant.tutor1 &&
      participant.tutor1.firstname &&
      participant.tutor1.lastname &&
      participant.tutor1.email &&
      participant.tutor1.phone &&
      participant.tutor2 &&
      participant.tutor2.firstname &&
      participant.tutor2.lastname &&
      participant.tutor2.email &&
      participant.tutor2.phone
    );

  if (participant.license_type === "hobby") {
    return basicInfo && minorInfo && !!participant.health_questionnaire;
  }

  if (participant.license_type === "competition") {
    return (
      basicInfo &&
      minorInfo &&
      !!participant.identity_photo &&
      !!participant.medical_certificate
    );
  }

  return basicInfo && minorInfo;
}
