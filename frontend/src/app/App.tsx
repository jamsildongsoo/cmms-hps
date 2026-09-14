import { useEffect, useState } from 'react'
import { applyTheme, getInitialTheme, type Theme } from '../core/theme/theme'
import type { LoginInfo } from '../modules/auth/types/types'
import LoginPage from '../modules/auth/pages/LoginPage'
import AppShell from '../widgets/app-shell/AppShell'
import ToastViewport from '../shared/toast/ToastViewport'
import { logout } from '../modules/auth/api/loginApi'

export default function App() {
  const [session, setSession] = useState<LoginInfo | null>(null)
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(function applyCurrentTheme(): void {
    applyTheme(theme)
  }, [theme])

  function toggleTheme(): void {
    setTheme(function changeTheme(current: Theme): Theme {
      return current === 'dark' ? 'light' : 'dark'
    })
  }

  function handleLogout(): void {
    logout()
    setSession(null)
  }

  return (
    <>
      {session ? (
          <AppShell
            session={session}
            theme={theme}
            onLogout={handleLogout}
          />
        )
        : (
          <LoginPage
            onLogin={setSession}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}

      <ToastViewport />
    </>
  )
}
