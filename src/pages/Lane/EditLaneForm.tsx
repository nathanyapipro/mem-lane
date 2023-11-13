import { Box, Button, TextField, Typography } from '@mui/material'
import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateLane, Lane, putLane } from '../../utils/api'

type Inputs = {
  name: string
  description: string
}

type Props = {
  lane: Lane
  onExit: () => void
}

const schema = yup
  .object({
    name: yup.string().required(),
    description: yup.string().required(),
  })
  .required()

export const EditLaneForm: React.FC<Props> = ({ lane, onExit }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: lane.name,
      description: lane.description,
    },
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (params: CreateLane) => putLane(lane.id, params),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['lane', `${lane.id}`] })
      queryClient.invalidateQueries({ queryKey: ['lanes'] })
      onExit()
    },
  })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate(data)
  }

  const handleCancel = () => {
    onExit()
  }

  return (
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
          Update
        </Button>
      </Box>
    </form>
  )
}
