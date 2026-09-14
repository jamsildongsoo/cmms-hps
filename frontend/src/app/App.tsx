import { useEffect, useState } from 'react'
import { applyTheme, getInitialTheme, type Theme } from '../core/theme/theme'
import type { LoginInfo } from '../modules/auth/types/types'
import LoginPage from '../modules/auth/pages/LoginPage'
import AppShell from '../widgets/app-shell/AppShell'
import ToastViewport from '../shared/toast/ToastViewport'
import { logout } from '../modules/auth/api/loginApi'

export default function App() {
  // 현재는 메모리 세션입니다. 백엔드 연계 후에는 로그인 응답을 저장하고,
  // 새로고침 시 /api/auth/me 등으로 세션을 복원하는 흐름을 추가합니다.
  const [session, setSession] = useState<LoginInfo | null>(null)
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = () => setTheme((current) => current === 'dark' ? 'light' : 'dark')

  return <>
    {session
      ? <AppShell session={session} theme={theme} onLogout={() => { logout(); setSession(null) }} />
      : <LoginPage onLogin={setSession} theme={theme} onToggleTheme={toggleTheme} />}
    <ToastViewport />
  </>
}
