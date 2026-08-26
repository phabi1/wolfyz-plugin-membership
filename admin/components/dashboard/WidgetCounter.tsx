import { Card, CardBody, Flex, FlexItem } from "@wordpress/components";

export type DashboardWidgetCounterProps = {
    title: string;
    subtitle?: string;
    total: number;
};

export default function DashboardWidgetCounter({
    title,
    subtitle,
    total
}: DashboardWidgetCounterProps) {
    const formattedTotal = new Intl.NumberFormat("fr-FR").format(total);

    return (
        <Card
            style={{
                height: "100%",
                borderRadius: 12,
                border: "1px solid #dcdcde",
                background: "linear-gradient(145deg, #ffffff 0%, #f6f7f7 100%)",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
                overflow: "hidden",
            }}
        >
            <CardBody style={{ height: "100%", padding: 16 }}>
                <Flex style={{ height: "100%", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
                    <FlexItem style={{ minWidth: 0 }}>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "4px 8px",
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 600,
                                letterSpacing: "0.03em",
                                textTransform: "uppercase",
                                color: "#3858e9",
                                background: "#eef2ff",
                                marginBottom: 10,
                            }}
                        >
                            Total
                        </div>
                        <div
                            style={{
                                fontSize: "clamp(30px, 4vw, 42px)",
                                lineHeight: 1,
                                fontWeight: 700,
                                color: "#111827",
                                letterSpacing: "-0.02em",
                                margin: 0,
                            }}
                        >
                            {formattedTotal}
                        </div>
                    </FlexItem>
                    <FlexItem>
                        <div
                            style={{
                                width: 2,
                                alignSelf: "stretch",
                                minHeight: 64,
                                marginRight: 12,
                                background: "linear-gradient(180deg, #3858e9, #72aee6)",
                                borderRadius: 2,
                            }}
                        />
                    </FlexItem>
                    <FlexItem style={{ minWidth: 0, flex: 1 }}>
                        <div
                            style={{
                                fontSize: 17,
                                lineHeight: 1.25,
                                fontWeight: 600,
                                color: "#1d2327",
                                margin: 0,
                                wordBreak: "break-word",
                            }}
                        >
                            {title}
                        </div>
                        {subtitle && (
                            <div
                                style={{
                                    marginTop: 6,
                                    fontSize: 13,
                                    lineHeight: 1.35,
                                    color: "#50575e",
                                    wordBreak: "break-word",
                                }}
                            >
                                {subtitle}
                            </div>
                        )}
                    </FlexItem>
                </Flex>
            </CardBody>
        </Card>
    );
}
