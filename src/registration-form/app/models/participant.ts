import { emptyTutor, type Tutor } from './tutor';
import { emptyAddress, type Address } from './address';

export type Participant = {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    birthdate: string;
    gender: string;
    address: Address;
    nationality: string;
    license_type: 'hobby' | 'competition';
    lesson_id: string;
    comment: string;
    health_questionnaire: string | null;
    identity_photo: string | null;
    medical_certificate: string | null;
    tutor1: Tutor;
    tutor2: Tutor;
    agree_photo: boolean;
    agree_exit: boolean;
};

export function emptyParticipant(): Participant {
    return {
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        birthdate: '',
        gender: '',
        address: emptyAddress(),
        nationality: '',
        license_type: 'hobby',
        lesson_id: '',
        health_questionnaire: null,
        identity_photo: null,
        medical_certificate: null,
        tutor1: emptyTutor(),
        tutor2: emptyTutor(),
        comment: "",
        agree_photo: false,
        agree_exit: false,
    };
}   