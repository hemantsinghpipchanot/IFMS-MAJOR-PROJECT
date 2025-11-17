import { Badge } from "@/components/ui/badge";

export type Status = "pending" | "approved" | "rejected" | "released" | "sanctioned";

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variants: Record<Status, { label: string; className: string }> = {
    pending: {
      label: "Pending",
      className: "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20",
    },
    approved: {
      label: "Approved",
      className: "bg-success/10 text-success hover:bg-success/20 border-success/20",
    },
    rejected: {
      label: "Rejected",
      className: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
    },
    released: {
      label: "Released",
      className: "bg-info/10 text-info hover:bg-info/20 border-info/20",
    },
    sanctioned: {
      label: "Sanctioned",
      className: "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20",
    },
  };

  const variant = variants[status];

  return (
    <Badge variant="outline" className={variant.className}>
      {variant.label}
    </Badge>
  );
};
