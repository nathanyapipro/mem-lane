import * as React from 'react'
import { Lane } from '../utils/api'
import { ListItem, ListItemText } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

interface Props extends Lane {}

export const LaneItem: React.FC<Props> = (props) => {
  const { laneId } = useParams<{ laneId: string }>()
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`lanes/${props.id}`)
  }
  return (
    <ListItem
      onClick={handleClick}
      selected={laneId === `${props.id}`}
      button={true}
    >
      <ListItemText>{props.name}</ListItemText>
    </ListItem>
  )
}
