import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { Lane, MemoriesSort, fetchMemories } from '../../utils/api'
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { MemoryCard } from '../../components/MemoryCard'

interface Props {
  lane?: Lane
}

export const MemoryList: React.FC<Props> = ({ lane }) => {
  const [sort, setSort] = React.useState<MemoriesSort>('ASC')

  const queryClient = useQueryClient()
  const { data: memories } = useQuery({
    queryKey: ['memories', `${lane?.id}`],
    queryFn: () => fetchMemories(`${lane!.id}`, sort),
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
    setSort(value as MemoriesSort)

    queryClient.resetQueries({ queryKey: ['lane', `${lane?.id}`] })
  }

  const renderMemories = () => {
    if (memories === undefined || memories?.length === 0) {
      return (
        <Typography
          variant='body1'
          fontStyle='italic'
          sx={{ textAlign: 'center' }}
        >
          No Memories found... try creating one
        </Typography>
      )
    }

    return (
      <>
        {memories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
      </>
    )
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

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          mb: 2,
          mt: 2,
        }}
      >
        {renderMemories()}
      </Box>
    </Container>
  )
}
