import * as React from 'react'
import { Card } from '@mui/material'

interface Props {
  base64: string
}

export const ImageCard: React.FC<Props> = ({ base64 }) => {
  return (
    <Card
      elevation={0}
      sx={{
        maxHeight: 400,
        // maxWidth: 400,
        width: '100%',
        height: '100%',
        m: 1,
      }}
    >
      <img
        src={base64}
        style={{
          border: '1px solid gainsboro',
          objectFit: 'cover',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '8px',
        }}
      />
    </Card>
  )
}
