import React from 'react'
import { useAuth } from '../context/AuthContext'
import AppLayout from './AppLayout'
import PublicLayout from './PublicLayout'

export default function AuthConditionalLayout() {
  const { user, loading } = useAuth()

  // During initial auth state loading, render a placeholder or let AppLayout handle it
  if (loading) {
    return null
  }

  return user ? <AppLayout /> : <PublicLayout />
}
