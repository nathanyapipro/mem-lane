import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import * as React from 'react'
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postMemory } from '../../utils/api'
import { useNavigate, useParams } from 'react-router-dom'
import { Add, Delete } from '@mui/icons-material'
import { v4 as uuidv4 } from 'uuid'
import { getBase64 } from '../../utils/images'

export type CreateMemoryFormInputs = {
  name: string
  description: string
  images: Array<{ imageId: string; imageUrl: string; base64: string }>
}

const schema = yup
  .object({
    name: yup.string().required(),
    description: yup.string().required(),
    images: yup
      .array()
      .required()
      .of(
        yup.object({
          imageId: yup.string().required(),
          imageUrl: yup.string().required(),
          base64: yup.string().required(),
        })
      ),
  })
  .required()

export const CreateMemoryPage: React.FC = () => {
  const { laneId } = useParams<{ laneId: string }>()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateMemoryFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      images: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
    keyName: 'imageId',
  })

  const hiddenFileInput = React.useRef<any | undefined>(undefined)

  const onAddImages = () => {
    hiddenFileInput.current?.click()
  }

  const handleAddImages = async (event: any) => {
    // @ts-ignore
    const uploadedFiles = Array.from(event.target.files)

    const files = await Promise.all(
      uploadedFiles.map(async (file) => {
        // @ts-ignore
        const imageUrl = URL.createObjectURL(file)
        // @ts-ignore
        const base64 = await getBase64(file)

        return {
          imageId: uuidv4(),
          imageUrl,
          base64,
        }
      })
    )

    append(files)

    hiddenFileInput.current.value = ''
  }

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const createLaneMutation = useMutation({
    mutationFn: postMemory,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['memories', `${laneId}`] })
      navigate(`/lanes/${laneId}`)
    },
  })

  const onSubmit: SubmitHandler<CreateMemoryFormInputs> = async (data) => {
    const timestamp = new Date().getTime()

    const images = data.images.map((img) => img.base64)

    if (laneId !== undefined) {
      createLaneMutation.mutate({
        ...data,
        timestamp,
        laneId,
        images,
      })
    }
  }

  const handleCancel = () => {
    navigate(`/lanes/${laneId}`)
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
          Create Memory
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

          <Typography sx={{ mt: 2 }}>Images</Typography>
          <input
            style={{ visibility: 'hidden' }}
            ref={hiddenFileInput}
            type='file'
            multiple
            onChange={handleAddImages}
          />
          <Box
            sx={{
              display: 'flex',
              position: 'relative',
              flexDirection: 'row',
              flexWrap: 'wrap',
              mt: -3,
            }}
          >
            {fields.map(({ imageId, imageUrl }, index) => {
              return (
                <Box
                  key={imageId}
                  sx={{ display: 'flex', position: 'relative', m: 1 }}
                >
                  <Controller
                    control={control}
                    name={`images.${index}`}
                    render={() => (
                      <Card
                        sx={{
                          p: 1,
                          height: 240,
                          width: 240,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={imageUrl}
                          style={{
                            objectFit: 'cover',
                            height: '100%',
                            width: '100%',
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 1,
                            right: 1,
                            background: 'rgba(255,255,255,1)',
                            borderBottomLeftRadius: '50%',
                          }}
                        >
                          <IconButton
                            size='small'
                            onClick={() => remove(index)}
                          >
                            <Delete fontSize='small' />
                          </IconButton>
                        </Box>
                      </Card>
                    )}
                  />
                </Box>
              )
            })}
          </Box>

          <Button
            sx={{ textTransform: 'unset', mt: 2 }}
            variant='outlined'
            startIcon={<Add />}
            onClick={onAddImages}
          >
            Add Images
          </Button>

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
            <Button variant='outlined' onClick={handleCancel} sx={{ mr: 2 }}>
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
