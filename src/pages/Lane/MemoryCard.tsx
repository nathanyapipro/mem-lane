import { useQuery } from '@tanstack/react-query'
import * as React from 'react'
import { MemoryWithImages, fetchMemories } from '../../utils/api'
import {
  Box,
  Button,
  Card,
  Container,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Typography,
} from '@mui/material'

import { Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface Props {
  memory: MemoryWithImages
}

export const MemoryCard: React.FC<Props> = ({ memory }) => {
  const [isEdit, setIsEdit] = React.useState<boolean>(false)
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  )
  const navigate = useNavigate()

  const renderImages = () => {
    if (memory.images.length === 0) {
      return (
        <Typography
          variant='body1'
          fontStyle='italic'
          sx={{ textAlign: 'center' }}
        >
          No Images found in this memory...
        </Typography>
      )
    }

    return (
      <>
        {memory.images.map(({ base64 }) => (
          <Box
            sx={{
              maxHeight: 400,
              maxWidth: 400,
              width: '100%',
              height: '100%',
              m: 1,
            }}
          >
            <img
              src={base64}
              style={{
                objectFit: 'cover',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                borderRadius: '8px',
              }}
            />
          </Box>
        ))}
      </>
    )
  }

  const renderContent = () => {
    if (isEdit === false) {
      return (
        <>
          {/* <LaneMenuButton
            anchorElement={anchorElement}
            handleClickOptionsMenu={handleClickOptionsMenu}
            handleCloseOptionsMenu={handleCloseOptionsMenu}
            handleUpdateButtonClick={handleUpdateButtonClick}
            handleDeleteButtonClick={handleDeleteButtonClick}
          /> */}
          <Typography variant='h6' sx={{ mb: 1 }}>
            {memory.name}
          </Typography>
          <Typography variant='body2' sx={{ mb: 2 }}>
            {memory.description}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {renderImages()}
          </Box>
        </>
      )
    } else {
      return <noscript /> // <EditLaneForm lane={memory} onExit={handleCancelUpdate} />
    }
  }

  return (
    <Card
      elevation={1}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        p: 3,
      }}
    >
      {renderContent()}
    </Card>
  )
}
