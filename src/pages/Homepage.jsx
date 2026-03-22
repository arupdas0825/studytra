import { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Countries from '../components/Countries'
import Features from '../components/Features'
import StatsSection from '../components/StatsSection'
import StudentSpotlight from '../components/StudentSpotlight'
import Reviews from '../components/Reviews'
import Footer from '../components/Footer'
import CostEstimator from '../components/dashboard/CostPlanner'
import TopLoader from '../components/TopLoader'
import ToggleExplore from '../components/ToggleExplore'

export default function HomePage() {
  const [exploreMode, setExploreMode] = useState(false)

  const handleExplore = () => {
    setExploreMode(true)
    setTimeout(() => {
      document.getElementById('countries-scrollytelling')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div>
      <TopLoader />
      <Navbar />
      <Hero />
      <StatsSection />
      <HowItWorks />
      
      {!exploreMode && <ToggleExplore onExplore={handleExplore} />}
      <Countries exploreMode={exploreMode} />
      
      <Features />
      <CostEstimator />
      <StudentSpotlight />
      <Reviews />
      <Footer />
    </div>
  )
}
