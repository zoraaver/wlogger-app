import * as React from "react";
import { LayoutAnimation } from "react-native";

interface CollapsibleProps {
  children: React.ReactNode;
  duration?: number;
  collapsed: boolean;
  onCollapsed?: () => void;
  onExpanded?: () => void;
}

export function Collapsible({
  children,
  duration = 300,
  collapsed,
  onCollapsed,
  onExpanded,
}: CollapsibleProps) {
  const [layoutCollapse, setLayoutCollapse] = React.useState(collapsed);

  React.useEffect(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration,
    });
    setLayoutCollapse(collapsed);
    if (collapsed) {
      onCollapsed && setTimeout(onCollapsed, duration);
    } else {
      onExpanded && setTimeout(onExpanded, duration);
    }
  }, [collapsed]);

  return layoutCollapse ? null : <>{children}</>;
}
