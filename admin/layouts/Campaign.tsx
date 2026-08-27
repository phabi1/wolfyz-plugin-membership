import { Spinner } from "@wordpress/components";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router";

export default function LayoutCampaign() {
  const { campaignId } = useParams();

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const links = [
    { to: `/campaign/${campaignId || ""}`, label: "Dashboard", end: true },
    { to: `/campaign/${campaignId || ""}/subscriptions`, label: "Members" },
    { to: `/campaign/${campaignId || ""}/wheels`, label: "Wheels" },
    { to: `/campaign/${campaignId || ""}/lessons`, label: "Lessons" },
    { to: `/campaign/${campaignId || ""}/periods`, label: "Schedulers" },
    { to: `/campaign/${campaignId || ""}/requests`, label: "Requests" },
  ];

  useEffect(() => {
    if (!campaignId) {
      setCampaign(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/wp-json/wolf-memberships/v1/campaigns/${campaignId}`)
      .then((res) => res.json())
      .then((data) => setCampaign(data))
      .catch(() => setCampaign(null))
      .finally(() => setLoading(false));
  }, [campaignId]);

  const toolbarLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 6,
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 600,
    color: isActive ? "#fff" : "#1d2327",
    background: isActive ? "#2271b1" : "#f0f0f1",
    border: isActive ? "1px solid #2271b1" : "1px solid #dcdcde",
  });

  return (
    <div style={{ minHeight: "100vh", width: "100%" }}>
      <main style={{ width: "100%" }}>
        <div
          role="toolbar"
          aria-label="Campaign toolbar"
          style={{
            position: "sticky",
            top: 8,
            zIndex: 2,
            background: "#fff",
            border: "1px solid #dcdcde",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "#646970", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Campaign
              </p>
              {loading ? (
                <div style={{ marginTop: 4 }}><Spinner /></div>
              ) : (
                <strong>{campaign?.title || "Untitled campaign"}</strong>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {links.map((item) => (
                <NavLink key={`toolbar-${item.to}`} to={item.to} end={item.end} style={toolbarLinkStyle}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                fontWeight: 600,
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #dcdcde",
                color: "#1d2327",
                background: "#fff",
              }}
            >
              Back to campaigns
            </Link>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
