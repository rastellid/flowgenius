// Deve combaciare con i campi serializzati in templates/home/index.html.twig.
export type CurrentUser = {
  id: number
  email: string
  name: string
  surname: string
  roles: string[]
}

/**
 * Legge il blocco JSON iniettato da Twig (<script id="app-current-user">).
 * Ritorna null se assente o malformato (es. pagine servite senza bootstrap).
 */
function readCurrentUser(): CurrentUser | null {
  const el = document.getElementById('app-current-user')
  if (!el?.textContent) return null
  try {
    return JSON.parse(el.textContent) as CurrentUser
  } catch {
    return null
  }
}

// Letto una sola volta al caricamento del modulo: i dati sono statici nell'HTML.
export const currentUser = readCurrentUser()

/** Utente loggato, oppure null. Per pagine dove potrebbe non esserci. */
export function useCurrentUser(): CurrentUser | null {
  return currentUser
}

/**
 * Come useCurrentUser() ma per le pagine dove l'utente è GARANTITO (tutto ciò
 * che sta sotto /home, protetto dal firewall Symfony): lancia se manca, così il
 * tipo restituito è `CurrentUser` (non-null) e nei componenti non servono
 * guardie né il non-null assertion `!`.
 */
export function useRequiredCurrentUser(): CurrentUser {
  if (!currentUser) {
    throw new Error(
      'useRequiredCurrentUser: nessun utente nel bootstrap (#app-current-user assente). ' +
        'Usalo solo in pagine autenticate servite da HomeController.',
    )
  }
  return currentUser
}
