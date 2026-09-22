import { ThemeProvider, createTheme } from "@mui/material/styles";
import App from "./app/App";
import { createRoot } from "react-dom/client";

document
  .querySelectorAll(".wp-block-wolf-membership-registration-form")
  .forEach((element) => {

    const searchParams = new URLSearchParams(window.location.search);
    const campaignId = searchParams.get("campaign_id");
    const requestId = searchParams.get("request_id");
    const token = searchParams.get("token");


    console.log(
      "Loading registration form with campaignId:",
      campaignId,
      "requestId:",
      requestId,
      "token:",
      token,
    );

    const theme = createTheme({});


    if (campaignId) {
      const root = createRoot(element);
      root.render(
        <ThemeProvider theme={theme}>
          <App campaignId={campaignId} requestId={requestId} token={token} />
        </ThemeProvider>,
      );
    }
  });
