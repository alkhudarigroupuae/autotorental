import { Routes, Route } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HomePage from '@/pages/HomePage'
import VehiclesPage from '@/pages/VehiclesPage'
import VehicleDetailPage from '@/pages/VehicleDetailPage'
import BookingPage from '@/pages/BookingPage'
import BookingConfirmationPage from '@/pages/BookingConfirmationPage'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
          <Route path="/book/:vehicleId" element={<BookingPage />} />
          <Route path="/booking/:id" element={<BookingConfirmationPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
