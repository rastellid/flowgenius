// Segnaposto in stile Apex, gemello di HomePage. Il questionario vero (fetch su
// /v1/assessment/… del backend Symfony) arriva nella fase successiva.
export default function AssessmentPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Assessment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Valuta la maturità dei tuoi processi e ottieni un punteggio.
        </p>
      </div>

      <div className="apex-card grid min-h-64 place-items-center p-8 text-center">
        <div>
          <p className="text-sm font-medium text-foreground">Questionario in arrivo</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Prossima fase: domande, step wizard e invio al contesto Assessment del backend.
          </p>
        </div>
      </div>
    </>
  )
}