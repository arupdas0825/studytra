// src/pages/HomePage.jsx
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import Countries from '../components/Countries'
import StatsSection from '../components/StatsSection'
import CurrencyExchange from '../components/CurrencyExchange'
import StudentSpotlight from '../components/StudentSpotlight'
import Reviews from '../components/Reviews'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Countries />
        <Features />
        <StatsSection />
        <CurrencyExchange />
        <StudentSpotlight />
        <Reviews />
      </main>
      <Footer />
    </div>
  )
}