import type { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function PropValue({ label, children }: PropsWithChildren<{ label: string }>) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">
        {children}
      </Typography>
    </Box>
  );
}