import { useQuery } from '@tanstack/react-query'
import * as React from 'react'
import { Lane, fetchMemories } from '../../utils/api'
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'

import { Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface Props {
  lane?: Lane
}

export const MemoryList: React.FC<Props> = ({ lane }) => {
  const [sort, setSort] = React.useState<string>('ASC')

  const { data } = useQuery({
    queryKey: ['memories', `${lane?.id}`],
    queryFn: () => fetchMemories(`${lane!.id}`),
  })

  const navigate = useNavigate()

  const handleCreateMemory = () => {
    if (lane === undefined) {
      return
    }
    navigate(`/lanes/${lane.id}/memory-create`)
  }

  const handleSortChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value
    setSort(value)
  }

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        p: 2,
        height: '100%',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          mb: 1,
          justifyContent: 'space-between',
        }}
      >
        <Select value={sort} size='small' onChange={handleSortChange}>
          <MenuItem value={'ASC'}>Oldest to New</MenuItem>
          <MenuItem value={'DESC'}>New to Oldest</MenuItem>
        </Select>

        <Button
          variant='contained'
          sx={{ textTransform: 'none' }}
          onClick={handleCreateMemory}
          startIcon={<Add />}
        >
          Create Memory
        </Button>
      </Box>
    </Container>
  )
}