import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function PublicLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, paddingTop: 64 }}>
        <Outlet />
      </div>
    </div>
  )
}
