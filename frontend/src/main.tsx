import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import CreateFeedBackForm from './pages/CreateFeedBackForm.tsx'
import { FeedbackProvider } from './providers/FeedbackProvider.tsx'
import ListFeedback from './pages/ListFeedback.tsx'
import FillFeedbackForm from './pages/FillFeedbackForm.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FeedbackProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/create' element={<CreateFeedBackForm />} />
          <Route path='/fill' element={<ListFeedback />} />
          <Route path='/fill/:id' element={<FillFeedbackForm />} />
        </Routes>
      </BrowserRouter>
    </FeedbackProvider>
  </StrictMode>,
)
