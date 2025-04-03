import { useAuth } from '@/hooks/use-auth'
import React from 'react'
import { Navigate } from 'react-router-dom'

type Props = {
  children: React.ReactNode
  allowedRoles: string[]
  redirectPath?: string
}

const ProtectedRoute = ({ children, allowedRoles, redirectPath = "/sign-in" }: Props) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  console.log("ProtectedRoute", user, allowedRoles)
  if (!user || !allowedRoles.includes(user.user_role)) {
    return <Navigate to={redirectPath} />
  }

  return <>{children}</>
}

export default ProtectedRoute