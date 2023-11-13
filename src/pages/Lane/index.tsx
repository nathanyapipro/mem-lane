import { useQuery } from '@tanstack/react-query'
import * as React from 'react'
import { fetchLaneById } from '../../utils/api'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'

import { LaneHeader } from './LaneHeader'

export const LanePage: React.FC = () => {
  const { laneId } = useParams<{ laneId: string }>()

  const { data } = useQuery({
    queryKey: ['lane', `${laneId}`],
    queryFn: () => fetchLaneById(laneId!),
  })

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        width: '100%',
      }}
    >
      <LaneHeader lane={data} />
    </Container>
  )
}
