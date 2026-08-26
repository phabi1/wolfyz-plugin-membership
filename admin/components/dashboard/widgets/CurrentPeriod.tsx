import { __ } from "@wordpress/i18n";
import { useEffect, useMemo, useState } from "react";
import DashboardWidgetCard from "../WidgetCard";

export default function DashboardWidgetCurrentPeriod({ settings }: any) {
    const [periods, setPeriods] = useState<any[]>([]);
    const currentPeriod = useMemo(() => {
        if (periods.length === 0) {
            return null;
        }
        const now = new Date();
        const currentPeriod = periods.find((period) => {
            const startDate = new Date(period.start_date);
            const endDate = new Date(period.end_date);
            return startDate <= now && now <= endDate;
        });
        return currentPeriod || null;
    }, [periods]);

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
        <DashboardWidgetCard title={__("Current Period", "wolf-membership")}>
            <div>
                {currentPeriod ? (
                    <div>
                        <div>
                            {__("Start Date", "wolf-membership")}:{" "}
                            {new Date(currentPeriod.start_date).toLocaleDateString()}
                        </div>
                        <div>
                            {__("End Date", "wolf-membership")}:{" "}
                            {new Date(currentPeriod.end_date).toLocaleDateString()}
                        </div>
                    </div>
                ) : (
                    <p>{__("No current period", "wolf-membership")}</p>
                )}
            </div>
        </DashboardWidgetCard>
    );
}
