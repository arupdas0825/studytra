import React from 'react'
import Navbar from '../components/Navbar'
import Countries from '../components/Countries'
import Footer from '../components/Footer'

export default function CountriesPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      <div style={{ paddingTop: 78 }}>
        <Countries />
      </div>
      <Footer />
    </div>
  )
}
