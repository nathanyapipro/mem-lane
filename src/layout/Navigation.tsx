import * as React from 'react'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import { useQuery } from '@tanstack/react-query'
import { fetchLanes } from '../utils/api'
import {
  Divider,
  Drawer,
  List,
  Button,
  Toolbar,
  Typography,
  Box,
} from '@mui/material'
import { LaneItem } from './LaneItem'
import { useNavigate } from 'react-router-dom'
import { Add } from '@mui/icons-material'

export const drawerWidth = 300

export const Navigation: React.FC = () => {
  const listLanesQuery = useQuery({ queryKey: ['lanes'], queryFn: fetchLanes })

  const navigate = useNavigate()

  const handleCreateClick = () => {
    navigate('lanes/create')
  }

  const renderLaneItems = () => {
    if (listLanesQuery.data === undefined || listLanesQuery.data.length === 0) {
      return (
        <Box sx={{ ml: 2, mr: 2 }}>
          <Typography fontStyle={'italic'} variant='body2'>
            No Lanes found...
          </Typography>
        </Box>
      )
    }

    return (
      <>
        {listLanesQuery.data.map((lane) => (
          <LaneItem {...lane} key={lane.id} />
        ))}
      </>
    )
  }
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant='permanent'
      anchor='left'
    >
      <Toolbar>
        <AspectRatioOutlinedIcon fontSize='large' sx={{ mr: 2 }} />
        <Typography variant='subtitle1' fontWeight='bold'>
          Memory Lane
        </Typography>
      </Toolbar>
      <Divider />
      <Button
        sx={{ m: 2, textTransform: 'none' }}
        variant='contained'
        onClick={handleCreateClick}
        startIcon={<Add />}
      >
        Create Lane
      </Button>
      <List>{renderLaneItems()}</List>
    </Drawer>
  )
}
