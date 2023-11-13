import {
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
} from '@mui/material'
import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postLane } from '../../utils/api'
import { useNavigate } from 'react-router-dom'

type Inputs = {
  name: string
  description: string
}

const schema = yup
  .object({
    name: yup.string().required(),
    description: yup.string().required(),
  })
  .required()

export const CreateLanePage: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({ resolver: yupResolver(schema) })

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: postLane,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['lanes'] })
    },
  })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate(data)
    navigate('/')
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <Container
      sx={{
        display: 'flex',
        flex: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <Card
        sx={{ flex: 'column', alignItems: 'center', width: 800, p: 3 }}
        elevation={1}
      >
        <Typography variant='h6' sx={{ mb: 1 }}>
          Create Lane
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography sx={{ mt: 2 }}>Name</Typography>
          <Controller
            render={({ field: { ...props } }) => (
              <TextField
                fullWidth={true}
                variant='outlined'
                size='small'
                autoComplete='off'
                error={Boolean(errors?.name)}
                {...props}
              />
            )}
            name={`name`}
            control={control}
          />

          <Typography sx={{ mt: 2 }}>Description</Typography>
          <Controller
            render={({ field: { ...props } }) => (
              <TextField
                multiline={true}
                rows={4}
                fullWidth={true}
                variant='outlined'
                size='small'
                autoComplete='off'
                error={Boolean(errors?.description)}
                {...props}
              />
            )}
            name={`description`}
            control={control}
          />
          <Box
            sx={{
              display: 'flex',
              flex: 'row',
              justifyContent: 'end',
              gap: [16, 0],
              width: '100%',
              mt: 4,
            }}
          >
            <Button
              type='submit'
              variant='outlined'
              onClick={handleCancel}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button type='submit' variant='contained'>
              Create
            </Button>
          </Box>
        </form>
      </Card>
    </Container>
  )
}
