import { useState, type SubmitEvent } from 'react'
import { login } from '../../features/login/api/loginApi'
import ThemeToggle from '../../shared/ui/ThemeToggle'
import type { Theme } from '../../core/theme/theme'
import type { LoginInfo } from '../../entities/auth/types'

type LoginPageProps = {
  onLogin: (session: LoginInfo) => void
  theme: Theme
  onToggleTheme: () => void
}

export default function LoginPage({ onLogin, theme, onToggleTheme }: LoginPageProps) {
  const [companyId, setCompanyId] = useState('')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!companyId.trim() || !userId.trim() || !password) {
      setMessage('회사코드, 사용자 ID, 비밀번호를 입력해 주세요.')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const session = await login({ companyId, id: userId, password })
      onLogin(session)
      setMessage('로그인되었습니다.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={theme === 'dark' ? 'auth-page' : 'auth-page light-theme'}>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      <div className="auth-layout">
        <section className="auth-brand-card" aria-label="시스템명">
          <div className="auth-heading">
            <div
              id="login-title"
              role="heading"
              aria-level={1}
            >
              설비관리시스템
            </div>
          </div>
        </section>
        <section className="auth-card" aria-labelledby="login-title">
          <form className="auth-form" onSubmit={submit}>
            <label>
              회사코드
              <input
                value={companyId}
                onChange={(event) => setCompanyId(event.target.value)}
                placeholder="회사코드 입력"
                autoComplete="organization"
              />
            </label>
            <label>
              사원번호
              <input
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                placeholder="사원코드 입력"
                autoComplete="username"
              />
            </label>
            <label>
              패스워드
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="패스워드 입력"
                autoComplete="current-password"
              />
            </label>
            <button className="button button--login" type="submit" disabled={isSubmitting}>
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {message && <p className="auth-message" role="alert">{message}</p>}
        </section>
        <p className="auth-security">
          본 시스템은 회사 업무용 시스템입니다.<br />
          승인된 사용자만 접근할 수 있으며, 권한을 초과한 접근·정보의 무단 열람·변경 및 부당한 사용을 금지합니다.<br />
          시스템 이용 시 관련 보안 규정을 준수해 주세요.
          <span lang="en">
            This system is intended for company business use only.<br />
            Access is limited to authorized users. Unauthorized access, viewing, modification, or misuse of information is prohibited.<br />
            Please comply with all applicable security policies when using this system.
          </span>
        </p>
      </div>
      <p className="auth-copyright">© HANKOOK PLANT SERVICE</p>
    </main>
  )
}
