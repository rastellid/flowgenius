import { useState, Fragment } from 'react'
import { Icon } from '@/components/layout/Icon'

// Wizard a 2 step in stile Apex (porting di apex-dashboard/wizard.html, ridotto).
// Al completamento fa POST a /v1/assessment/responses (endpoint mock, risponde ok).

type StepId = 1 | 2
type StepKey = 'first' | 'second'

const STEPS: { id: StepId; key: StepKey; label: string; question: string }[] = [
  {
    id: 1,
    key: 'first',
    label: 'first',
    question:
      "Anteporre le esigenze aziendali a quelle personali con spirito di dedizione e senso di appartenenza all'azienda.",
  },
  {
    id: 2,
    key: 'second',
    label: 'second',
    question: "Adattarsi alle esigenze dell'azienda, con flessibilità e disponibilità.",
  },
]

// Valori ammessi per le risposte: da 1 a 5.
const SCALE = [1, 2, 3, 4, 5]

type Answers = { first: string; second: string }

export default function AssessmentPage() {
  const [step, setStep] = useState<StepId>(1)
  const [answers, setAnswers] = useState<Answers>({ first: '', second: '' })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const current = STEPS[step - 1]
  const currentValue = answers[current.key]

  function setAnswer(key: StepKey, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }))
    setError(null)
  }

  function goNext() {
    if (!currentValue) {
      setError('Seleziona un valore per continuare.')
      return
    }
    setError(null)
    setStep(2)
  }

  function goBack() {
    setError(null)
    setStep(1)
  }

  async function submit() {
    if (!answers.second) {
      setError('Seleziona un valore per continuare.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/v1/assessment/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          first: Number(answers.first),
          second: Number(answers.second),
        }),
      })
      if (res.ok) {
        setDone(true)
      } else {
        setError('Invio non riuscito. Riprova.')
      }
    } catch {
      setError('Invio non riuscito. Riprova.')
    } finally {
      setSubmitting(false)
    }
  }

  function restart() {
    setAnswers({ first: '', second: '' })
    setStep(1)
    setError(null)
    setDone(false)
  }

  // Pannello di successo (dopo l'invio).
  if (done) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="apex-card">
          <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Icon name="check-check" className="size-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight">Fatto!</h2>
              <p className="text-muted-foreground">Risposte inviate correttamente.</p>
            </div>
            <button type="button" onClick={restart} className="apex-btn apex-btn-outline">
              Ricomincia
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      {/* Header pagina */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assessment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Rispondi alle domande e invia la valutazione.
        </p>
      </div>

      {/* Step indicator */}
      <div className="apex-card">
        <div className="flex w-full items-center justify-center px-4 py-6">
          {STEPS.map((s, i) => {
            const isCompleted = step > s.id
            const isCurrent = step === s.id
            return (
              <Fragment key={s.id}>
                <div className="flex min-w-20 flex-col items-center gap-2">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-primary text-primary-foreground'
                        : isCurrent
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : 'border-2 border-muted-foreground/30 text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? <Icon name="check-check" className="size-5" /> : s.id}
                  </div>
                  <span
                    className={`text-center text-xs font-medium transition-colors duration-300 ${
                      isCurrent
                        ? 'text-primary'
                        : isCompleted
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 transition-colors duration-300 ${
                      step > s.id ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </Fragment>
            )
          })}
        </div>
      </div>

      {/* Form card */}
      <div className="apex-card">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">{current.label}</h3>
          <p className="text-sm text-muted-foreground">
            Domanda {current.id} di {STEPS.length}
          </p>
        </div>

        <div className="p-6 pt-0">
          <div className="space-y-2">
            <label htmlFor="answer" className="apex-label">
              {current.question}
            </label>
            <div className="relative">
              <select
                id="answer"
                className="apex-select"
                value={currentValue}
                onChange={(e) => setAnswer(current.key, e.target.value)}
              >
                <option value="" disabled hidden>
                  Seleziona un valore (1–5)
                </option>
                {SCALE.map((n) => (
                  <option key={n} value={String(n)}>
                    {n}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron-down"
                className="pointer-events-none absolute inset-e-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
            </div>
            {error && <p className="apex-field-error">{error}</p>}
          </div>
        </div>

        {/* Footer navigazione */}
        <div className="flex items-center justify-between p-6 pt-2">
          {step > 1 ? (
            <button type="button" onClick={goBack} className="apex-btn apex-btn-outline">
              <Icon name="chevron-left" className="me-1.5 size-4" />
              Indietro
            </button>
          ) : (
            <span />
          )}

          {step < 2 ? (
            <button type="button" onClick={goNext} className="apex-btn apex-btn-primary">
              Avanti
              <Icon name="chevron-right" className="ms-1.5 size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="apex-btn apex-btn-primary"
            >
              {submitting ? 'Invio…' : 'Completa'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
