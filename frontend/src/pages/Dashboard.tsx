import { useRequiredCurrentUser } from '@/lib/currentUser'

export default function Dashboard() {
  // /home è protetta dal firewall: qui l'utente è garantito (tipo non-null).
  const user = useRequiredCurrentUser()

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {`Bentornato, ${user.name} ${user.surname}`}
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
