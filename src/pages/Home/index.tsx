import { Box, Container, Typography } from '@mui/material'
import * as React from 'react'

export const HomePage: React.FC = () => {
  return (
    <Container
      sx={{
        display: 'flex',
        flex: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <Box>
        <Typography
          variant='body1'
          fontStyle='italic'
          sx={{ textAlign: 'center' }}
        >
          Create or select a lane to continue
        </Typography>
      </Box>
    </Container>
  )
}
