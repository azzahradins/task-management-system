import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './authContextValue'

function getStoredToken() {
  return localStorage.getItem('accessToken')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [token, setTokenState] = useState<string | null>(getStoredToken)

  function setToken(nextToken: string) {
    localStorage.setItem('accessToken', nextToken)
    setTokenState(nextToken)
  }

  function clearToken() {
    localStorage.removeItem('accessToken')
    setTokenState(null)
  }

  useEffect(() => {
    function handleUnauthorized() {
      clearToken()
      navigate('/login', { replace: true })
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [navigate])

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