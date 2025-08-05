import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '../src/assets/css/App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './components/HomePage/Home'
import ParentLogin from './components/Auth/Parent/ParentLogin'
import Navbar from './components/headers/Navbar'
import ParentDashbord from './components/Auth/Parent/ParentDashbord'
import EducatorLogin from './components/Auth/Educator/EducatorLogin'
import EducatorDashbord from './components/Auth/Educator/EducatorDashbord'
import Parentsignup from './components/Auth/Parent/Parentsignup'
import ExploreClassPage from './components/Pages/Exploreclasses/ExploreClassPage'
import LearnonmeekoPage from './components/Pages/LearnonMeeko/LearnonmeekoPage'
import EarnMeeko from './components/Pages/EarnonMeeko/EarnMeeko'

const queryClient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />

            <Route path='/parent/login' element={<ParentLogin />} />
            <Route path='/parent/dashboard' element={<ParentDashbord />} />
            <Route path='/parent/signup' element={<Parentsignup />} />
            
            <Route path='/educator/login' element={<EducatorLogin />} />
            <Route path='/educator/dashboard' element={<EducatorDashbord />} />

            {/* explore class page */}
            <Route path='/explore-class' element={<ExploreClassPage />} />
            {/* learn on meeko page */}
            <Route path='/learn-on-meeko' element={<LearnonmeekoPage />} />
            {/* earn on meeko page */}
            <Route path='/earn-on-meeko' element={<EarnMeeko />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  )
}

export default App
