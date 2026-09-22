import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { __ } from "@wordpress/i18n";
import { isParticipantMinor } from '../helpers';
import type { Contact } from "../models/contact";
import type { Lesson as LessonModel } from '../models/lesson';
import type { Participant } from '../models/participant';
import { formatPrice } from '../pipes';
import { Address } from "../ui/Address";
import { FilePreview } from "../ui/FilePreview";
import { Lesson } from "../ui/Lesson";
import { PropValue } from "../ui/PropValue";
import { TEXT_DOMAIN } from "../utils";

export function ReviewStep({
  contact,
  participants,
  lessons,
  totalToPay,
  onBack,
  onSubmit,
  submitting,
}: {
  contact: Contact;
  participants: Participant[];
  lessons: LessonModel[];
  totalToPay: number;
  submitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const formattedTotal = formatPrice(totalToPay);

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {__("Review Your Registration", TEXT_DOMAIN)}
      </Typography>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>{__("Contact", TEXT_DOMAIN)}</Typography>
          <Typography>
            {contact.firstname} {contact.lastname}
          </Typography>
          <Typography>{contact.email}</Typography>
          <Typography>{contact.phone}</Typography>
          {contact.notes && <Typography sx={{ mt: 1 }}>{contact.notes}</Typography>}
        </CardContent>
      </Card>



      {participants.map((participant, index) => {
        const lesson = lessons.find((item) => String(item.id) === participant.lesson_id);

        return (
          <Card key={index} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {__("Person", TEXT_DOMAIN)} {index + 1}
              </Typography>
              <PropValue label={__("Name", TEXT_DOMAIN)}>
                {participant.firstname} {participant.lastname}
              </PropValue>
              <PropValue label={__("Birthdate", TEXT_DOMAIN)}>
                {participant.birthdate}
              </PropValue>
              <PropValue label={__("Gender", TEXT_DOMAIN)}>
                {participant.gender}
              </PropValue>
              <PropValue label={__("Nationality", TEXT_DOMAIN)}>
                {participant.nationality}
              </PropValue>
              <PropValue label={__("Email", TEXT_DOMAIN)}>
                {participant.email}
              </PropValue>
              <PropValue label={__("Phone", TEXT_DOMAIN)}>
                {participant.phone}
              </PropValue>
              <PropValue label={__("Address", TEXT_DOMAIN)}>
                {participant.address ? (
                  <Address value={participant.address} />
                ) : (
                  __("Not provided", TEXT_DOMAIN)
                )}
              </PropValue>
              <PropValue label={__("License Type", TEXT_DOMAIN)}>
                {participant.license_type === "hobby"
                  ? __("Hobby", TEXT_DOMAIN)
                  : __("Competition", TEXT_DOMAIN)}
              </PropValue>
              <PropValue label={__("Lesson", TEXT_DOMAIN)}>
                {lesson ? (
                  <Lesson lesson={lesson} />
                ) : __("Not selected", TEXT_DOMAIN)}
              </PropValue>

              {isParticipantMinor(participant.birthdate) && (
                <>
                  <PropValue label={__("Guardian 1", TEXT_DOMAIN)}>
                    {participant.tutor1?.firstname || __("Not provided", TEXT_DOMAIN)} {participant.tutor1?.lastname || ""}
                  </PropValue>
                  <PropValue label={__("Guardian 2", TEXT_DOMAIN)}>
                    {participant.tutor2?.firstname || __("Not provided", TEXT_DOMAIN)} {participant.tutor2?.lastname || ""}
                  </PropValue>
                </>
              )}
              {participant.license_type === "hobby" && (
                <PropValue label={__("Health Questionnaire", TEXT_DOMAIN)}>
                  {participant.health_questionnaire ? (
                    <FilePreview file={participant.health_questionnaire} />
                  ) : (
                    __("File not added", TEXT_DOMAIN)
                  )}
                </PropValue>
              )}
              {participant.license_type === "competition" && (
                <>
                  <PropValue label={__("Identity Photo", TEXT_DOMAIN)}>
                    {participant.identity_photo ? (
                      <FilePreview file={participant.identity_photo} />
                    ) : (
                      __("File not added", TEXT_DOMAIN)
                    )}
                  </PropValue>
                  <PropValue label={__("Medical Certificate", TEXT_DOMAIN)}>
                    {participant.medical_certificate ? (
                      <FilePreview file={participant.medical_certificate} />
                    ) : (
                      __("File not added", TEXT_DOMAIN)
                    )}
                  </PropValue>
                </>
              )}
              {participant.comment && (
                <PropValue label={__("Comment", TEXT_DOMAIN)}>
                  {participant.comment}
                </PropValue>
              )}
            </CardContent>
          </Card>
        );
      })}

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>{__("Total to Pay", TEXT_DOMAIN)}</Typography>
          <Typography variant="h5" color="primary">
            {formattedTotal}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button onClick={onBack} disabled={submitting}>
          {__("Back", TEXT_DOMAIN)}
        </Button>
        <Button variant="contained" color="success" onClick={onSubmit} disabled={submitting}>
          {submitting ? __("Saving...", TEXT_DOMAIN) : __("Confirm", TEXT_DOMAIN)}
        </Button>
      </Box>
    </Box >
  );
}
