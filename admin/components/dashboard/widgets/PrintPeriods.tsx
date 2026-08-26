import { Button, SelectControl } from "@wordpress/components";
import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardWidgetCard from "../WidgetCard";

export default function DashboardWidgetPrintPeriods({ settings }: any) {
  const [periods, setPeriods] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const canPrint = useMemo(() => selectedPeriod !== "", [selectedPeriod]);

  const handlePrint = useCallback(() => {
    if (!canPrint) return;

    const campaignId = settings.campaignId;

    fetch(`/wp-json/wolf-memberships/v1/campaigns/${campaignId}/periods/${selectedPeriod}/print`, {
      method: "POST",
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `period_${selectedPeriod}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }, [canPrint, selectedPeriod, settings.campaignId]);

  useEffect(() => {
    fetch(
      "/wp-json/wolf-memberships/v1/dashboard/source?type=get_periods_for_print&campaign_id=" +
      settings.campaignId,
    )
      .then((res) => res.json())
      .then((data) => {
        setPeriods(data.periods);
      });
  }, [settings.campaignId]);

  return (
    <DashboardWidgetCard title="Print Periods">
      <div style={{ marginBottom: "16px" }}>
        <SelectControl
          label="Period"
          value={selectedPeriod}
          options={[
            { label: "Select a period", value: "" },
            ...periods.map((period) => ({
              label: period.title,
              value: String(period.id),
            })),
          ]}
          onChange={(value) => setSelectedPeriod(value)}
        />
      </div>
      <div>
        <Button
          variant="primary"
          disabled={!canPrint}
          onClick={handlePrint}
          style={{ width: "100%" }}
        >
          Print
        </Button>
      </div>
    </DashboardWidgetCard>
  );
}
