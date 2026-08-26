import { PropsWithChildren, useMemo } from "react";
import { Button } from "@wordpress/components";

export type Action = {
  name: string;
  label: string;
  primary?: boolean;
  handler?: () => void;
};

export type PageProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  actions?: Action[];
  topAction?: React.ReactNode;
}>;

function PageActions({ actions }: { actions: Action[] }) {
  const primaryActions = useMemo(() => actions.filter((action) => action.primary), [actions]);

  const hasPrimaryActions = useMemo(
    () => primaryActions.length > 0,
    [primaryActions],
  );

  const secondaryActions = useMemo(
    () => actions.filter((action) => !action.primary),
    [actions],
  );

  const hasSecondaryAction = useMemo(
    () => secondaryActions.length > 0,
    [secondaryActions],
  );

  const handleActionClick = (action: Action) => {
    if (action.handler) {
      action.handler();
    }
  };

  return (
    <div>
      {hasPrimaryActions && primaryActions.map((action) => (
        <Button
          key={action.name}
          variant="primary"
          onClick={() => handleActionClick(action)}
        >
          {action.label}
        </Button>
      ))}
      {hasSecondaryAction &&
        secondaryActions.map((action) => (
          <Button key={action.name} onClick={() => handleActionClick(action)}>
            {action.label}
          </Button>
        ))}
    </div>
  );
}

function PageHeader({
  title,
  subtitle,
  actions,
  topAction,
}: {
  title: string;
  subtitle?: string;
  actions?: Action[];
}) {
  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 16, flexWrap: "wrap" }}
    >
      <div style={{ marginBottom: 8 }}>
        <h1 style={{ margin: 0 }}>{title}</h1>
        {subtitle && (
          <p style={{ margin: "6px 0 0", color: "#50575e" }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <PageActions actions={actions} />}
    </div>
  );
}

export default function Page({
  title,
  subtitle,
  actions,
  topAction,
  children,
}: PageProps) {
  return (
    <div>
      {topAction && <div>{topAction}</div>}
      <PageHeader title={title} subtitle={subtitle} actions={actions} />
      <div>{children}</div>
    </div>
  );
}
