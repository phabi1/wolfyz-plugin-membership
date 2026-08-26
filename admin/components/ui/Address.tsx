import type { Address } from "../../models/address";

export function Address({ value }: { value: Address }) {
    return (
        <span>
            {[
                value.line1,
                value.line2,
                value.zipcode,
                value.city,
                value.country,
            ].filter(Boolean).join(", ")}
        </span>
    );
}