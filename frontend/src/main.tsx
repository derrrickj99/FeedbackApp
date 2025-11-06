import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import CreateFeedBackForm from './pages/CreateFeedBackForm.tsx'
import FillFeedbackForm from './pages/FillFeedbackForm.tsx'
import ToastProvider from './providers/ToastProvider.tsx'
import App from './App.tsx'
import Dashboard from './components/Dashboard.tsx'
import ListFeedbackPage from './pages/ListFeedbackForms.tsx'
import EditFeedbackPage from './pages/EditFeedbackForm.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<Dashboard />} />
            <Route path='/create' element={<CreateFeedBackForm />} />
            <Route path='/forms' element={<ListFeedbackPage />} />
            <Route path='/form/:id' element={<EditFeedbackPage />} />
            <Route path='/fill/:id' element={<FillFeedbackForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>,
)
