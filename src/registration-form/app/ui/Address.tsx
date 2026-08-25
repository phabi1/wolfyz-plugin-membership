import Typography from "@mui/material/Typography";
import type { Address } from "../models/address";

export function Address({ value }: { value: Address }) {
    return (
        <Typography>
            {[
                value.line1,
                value.line2,
                value.zipcode,
                value.city,
                value.country,
            ].filter(Boolean).join(", ")}
        </Typography>
    );
}