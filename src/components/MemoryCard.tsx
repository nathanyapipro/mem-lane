import * as React from 'react'
import { MemoryWithImages, deleteMemory } from '../utils/api'
import { Box, Card, Typography } from '@mui/material'

import { useNavigate } from 'react-router-dom'
import { ImageCard } from './ImageCard'
import { EllipsisMenuButton } from './EllipsisMenuButton'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Props {
  memory: MemoryWithImages
}

export const MemoryCard: React.FC<Props> = ({ memory }) => {
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  )

  const queryClient = useQueryClient()

  const deleteMemoryMutation = useMutation({
    mutationFn: (params: { id: string }) => deleteMemory(params.id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ['memories', `${memory.lane_id}`],
      })
    },
  })

  const handleClickOptionsMenu = (e: any) => {
    e.stopPropagation()
    setAnchorElement(e.currentTarget)
  }

  const handleCloseOptionsMenu = (e: any) => {
    e.stopPropagation()
    setAnchorElement(null)
  }

  const handleDeleteButtonClick = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    if (memory !== undefined) {
      deleteMemoryMutation.mutate({ id: `${memory.id}` })
    }

    handleCloseOptionsMenu(e)
  }

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
        {memory.images.map(({ id, base64 }) => (
          <ImageCard key={id} base64={base64} />
        ))}
      </>
    )
  }

  const renderContent = () => {
    return (
      <>
        <EllipsisMenuButton
          anchorElement={anchorElement}
          handleClickOptionsMenu={handleClickOptionsMenu}
          handleCloseOptionsMenu={handleCloseOptionsMenu}
          handleDeleteButtonClick={handleDeleteButtonClick}
        />

        <Typography variant='h6' sx={{ mb: 1 }}>
          {memory.name}
        </Typography>
        <Typography variant='body2' sx={{ mb: 2 }}>
          {memory.description}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}
        >
          {renderImages()}
        </Box>
      </>
    )
  }

  return (
    <Card
      elevation={1}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        p: 2,
        mb: 4,
      }}
    >
      {renderContent()}
    </Card>
  )
}
