import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from './components/common/Toast'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Pencereye dönünce tekrar çekme
      retry: 1, // Hata olursa 1 kere daha dene
      staleTime: 1000 * 60 * 5, // 5 dakika boyunca veriyi taze kabul et (cache'den oku)
    },
  },
})

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </QueryClientProvider>
  // </StrictMode>,
)
