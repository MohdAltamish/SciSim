import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LabProvider } from './context/LabContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import LabPage from './pages/LabPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <BrowserRouter>
      <LabProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Footer />
      </LabProvider>
    </BrowserRouter>
  )
}

export default App
