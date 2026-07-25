import StatsCard from "@/components/dashboard/stats-card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Welcome back to Krevvy Admin.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatsCard
          title="Products"
          value="0"
          subtitle="Products in catalog"
        />

        <StatsCard
          title="Categories"
          value="0"
          subtitle="Available categories"
        />

        <StatsCard
          title="Orders"
          value="0"
          subtitle="Orders today"
        />

        <StatsCard
          title="Revenue"
          value="₹0"
          subtitle="Today's revenue"
        />

      </div>

    </div>
  );
}