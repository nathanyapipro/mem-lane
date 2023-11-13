import * as React from 'react'

import { Lane } from '../../utils/api'
import { Box, Card, IconButton, Skeleton, Typography } from '@mui/material'
import { Edit } from '@mui/icons-material'
import { EditLaneForm } from './EditLaneForm'

interface Props {
  lane?: Lane
}

export const LaneHeader: React.FC<Props> = ({ lane }) => {
  const [isEdit, setIsEdit] = React.useState<boolean>(false)

  const handleEdit = () => {
    setIsEdit(true)
  }

  const handleCancel = () => {
    setIsEdit(false)
  }
  const renderContent = () => {
    if (lane === undefined) {
      return (
        <>
          <Skeleton variant='rectangular' width={'100%'} height={40} />
          <Skeleton variant='rectangular' width={'100%'} height={120} />
        </>
      )
    }

    if (isEdit === false) {
      return (
        <>
          <IconButton
            sx={{ position: 'absolute', right: 2, top: 1 }}
            size='small'
            onClick={handleEdit}
          >
            <Edit fontSize='small' />
          </IconButton>
          <Typography variant='h6'>{lane.name}</Typography>
          <Typography variant='body2'>{lane.description}</Typography>
        </>
      )
    } else {
      return <EditLaneForm lane={lane} onExit={handleCancel} />
    }
  }

  return (
    <Card
      sx={{
        position: 'relative',
        m: 3,
        width: '600',
        display: 'flex',
        flexDirection: 'column',
        gap: [0, 2],
        padding: 3,
      }}
      elevation={1}
    >
      {renderContent()}
    </Card>
  )
}
