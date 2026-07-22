import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardExtraStats } from "@/types/dashboard";

type PlatformHealthProps = DashboardExtraStats & {
  activeUsers: number;
  totalUsers: number;
};

function HealthRow({
  label,
  value,
  total,
  badge,
}: {
  label: string;
  value: number;
  total?: number;
  badge?: string;
}) {
  const percentage = total && total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-semibold tabular-nums">{value}</span>
          {badge && <Badge variant="secondary">{badge}</Badge>}
        </div>
      </div>
      {total !== undefined && total > 0 && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function PlatformHealth({
  totalAdmins,
  totalFields,
  activeFields,
  inactiveUsers,
  activeUsers,
  totalUsers,
}: PlatformHealthProps) {
  const inactiveFields = totalFields - activeFields;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Health</CardTitle>
        <CardDescription>
          Overview of activity and configuration status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <HealthRow
          label="Active users"
          value={activeUsers}
          total={totalUsers}
          badge={`${totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%`}
        />
        <HealthRow
          label="Inactive / banned users"
          value={inactiveUsers}
          total={totalUsers}
        />
        <HealthRow
          label="Active fields"
          value={activeFields}
          total={totalFields}
        />
        <HealthRow label="Inactive fields" value={inactiveFields} />
        <HealthRow label="Admin accounts" value={totalAdmins} />
      </CardContent>
    </Card>
  );
}
