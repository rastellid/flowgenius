// Segnaposto in stile Apex. I widget della dashboard (StatsCards, RevenueChart,
// OrdersTable, ecc.) verranno portati nella fase successiva con react-apexcharts.
export default function HomePage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back — here's what's happening with your store today.
        </p>
      </div>

      <div className="apex-card grid min-h-64 place-items-center p-8 text-center">
        <div>
          <p className="text-sm font-medium text-foreground">Widget della dashboard in arrivo</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Shell Apex attivo. Prossima fase: StatsCards, RevenueChart e le tabelle.
          </p>
        </div>
      </div>
    </>
  )
}
