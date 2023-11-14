import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline, Typography } from '@mui/material'
import theme from './theme'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LanePage } from './pages/Lane'
import { CreateLanePage } from './pages/CreateLane'
import Root from './layout/Root'
import ErrorPage from './pages/ErrorPage'
import { HomePage } from './pages/Home'
import { CreateMemoryPage } from './pages/CreateMemory'

// Create a client
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,

    children: [
      {
        path: 'lanes/create',
        element: <CreateLanePage />,
      },
      {
        path: 'lanes/:laneId',
        element: <LanePage />,
      },
      {
        path: `/lanes/:laneId/memory-create`,
        element: <CreateMemoryPage />,
      },
      {
        path: '',
        element: <HomePage />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
)
