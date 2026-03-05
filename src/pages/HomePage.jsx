import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Countries from '../components/Countries'
import Features from '../components/Features'
import StudentSpotlight from '../components/StudentSpotlight'
import Reviews from '../components/Reviews'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Countries />
      <Features />
      <StudentSpotlight />
      <Reviews />
      <Footer />
    </div>
  )
}