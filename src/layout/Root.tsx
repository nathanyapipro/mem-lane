import { Box } from '@mui/material'
import { Navigation } from './Navigation'
import { Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <Navigation />
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  )
}
