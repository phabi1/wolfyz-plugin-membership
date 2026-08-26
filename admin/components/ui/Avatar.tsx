import { Member } from "../../models/member";
import { useMemo } from "react";

import { forwardRef } from "react";

const MemberAvatar = forwardRef<HTMLDivElement, { url?: string; gender?: "male" | "female" }>(({ url, gender }, ref) => {

    const avatarUrl = useMemo(() => {
        if (url) {
            return url;
        } else if (gender === "male") {
            return "/wp-content/plugins/wolf-membership/public/images/avatar-male.jpg";
        } else if (gender === "female") {
            return "/wp-content/plugins/wolf-membership/public/images/avatar-female.jpg";
        }
        return "/wp-content/plugins/wolf-membership/public/images/avatar-default.png";
    }, [url, gender]);

    return (
        <img
            ref={ref}
            src={avatarUrl}
            alt="Member avatar"
            style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
            }}
        />
    );
});

export { MemberAvatar };