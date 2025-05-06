import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DSAbasics from './DSAbasics.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Additionals from './Additionals.jsx';
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Analytics></Analytics>
    <Router>
      <Routes>
        <Route path='/' element={<DSAbasics />} />
        <Route path='/additionals' element={<Additionals />} />
      </Routes>
    </Router>
  </StrictMode>,
)
