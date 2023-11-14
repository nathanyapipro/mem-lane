import * as React from 'react'

import { Lane, deleteLane } from '../../utils/api'
import { Card, Skeleton, Typography } from '@mui/material'
import { EditLaneForm } from './EditLaneForm'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { EllipsisMenuButton } from '../../components/EllipsisMenuButton'
interface Props {
  lane?: Lane
}

export const LaneHeader: React.FC<Props> = ({ lane }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const deleteLaneMutation = useMutation({
    mutationFn: (params: { id: string }) => deleteLane(params.id),
    onSuccess: ({ id }) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['lane', `${id}`] })
      queryClient.invalidateQueries({ queryKey: ['lanes'] })
      navigate('/')
    },
  })

  const [isEdit, setIsEdit] = React.useState<boolean>(false)
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  )

  const handleClickOptionsMenu = (e: any) => {
    e.stopPropagation()
    setAnchorElement(e.currentTarget)
  }

  const handleCloseOptionsMenu = (e: any) => {
    e.stopPropagation()
    setAnchorElement(null)
  }

  const handleUpdateButtonClick = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    setIsEdit(true)
    handleCloseOptionsMenu(e)
  }

  const handleCancelUpdate = () => {
    setIsEdit(false)
  }

  const handleDeleteButtonClick = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    if (lane !== undefined) {
      deleteLaneMutation.mutate({ id: `${lane.id}` })
    }

    handleCloseOptionsMenu(e)
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
          <EllipsisMenuButton
            anchorElement={anchorElement}
            handleClickOptionsMenu={handleClickOptionsMenu}
            handleCloseOptionsMenu={handleCloseOptionsMenu}
            handleUpdateButtonClick={handleUpdateButtonClick}
            handleDeleteButtonClick={handleDeleteButtonClick}
          />
          <Typography variant='h6'>{lane.name}</Typography>
          <Typography variant='body2'>{lane.description}</Typography>
        </>
      )
    } else {
      return <EditLaneForm lane={lane} onExit={handleCancelUpdate} />
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
