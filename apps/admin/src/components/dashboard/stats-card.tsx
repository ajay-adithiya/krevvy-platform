import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <h2 className="text-3xl font-bold">{value}</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}