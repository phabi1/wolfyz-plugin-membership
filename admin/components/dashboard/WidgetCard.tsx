import { PropsWithChildren } from "react";
import { Card, CardHeader, CardBody } from "@wordpress/components";

export type DashboardWidgetCardProps = PropsWithChildren<{
  title: string;
}>;

export default function DashboardWidgetCard({
  title,
  children,
}: DashboardWidgetCardProps) {
  return (
    <Card style={{ height: "100%" }}>
      {title ? <CardHeader>{title}</CardHeader> : null}
      <CardBody>
        {children}
      </CardBody>
    </Card>
  );
}
