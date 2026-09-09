import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './authContextValue'

function getStoredToken() {
  return localStorage.getItem('accessToken')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getStoredToken)

  function setToken(nextToken: string) {
    localStorage.setItem('accessToken', nextToken)
    setTokenState(nextToken)
  }

  function clearToken() {
    localStorage.removeItem('accessToken')
    setTokenState(null)
  }

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      setToken,
      clearToken,
    }),
    [token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}