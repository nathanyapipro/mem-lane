import axios from 'axios'

export interface Lane {
  id: number
  name: string
  description: string
}

export type CreateLane = Pick<Lane, 'name' | 'description'>

const instance = axios.create({
  baseURL: 'http://localhost:4001',
})

export async function fetchLanes(): Promise<Array<Lane>> {
  try {
    const { data } = await instance.get('/lanes')
    console.log(data)

    return data.lanes as Array<Lane>
  } catch (error) {
    throw new Error('Failed to fetch lanes')
  }
}

export async function fetchLaneById(id: string): Promise<Lane> {
  try {
    const { data } = await instance.get(`/lanes/${id}`)
    console.log(data)

    return data.lane as Lane
  } catch (error) {
    throw new Error('Failed to fetch lanes')
  }
}

export async function postLane(params: CreateLane): Promise<void> {
  try {
    await instance.post('/lanes', params)
  } catch (error) {
    throw new Error('Failed to create lane')
  }
}

export async function putLane(id: number, params: CreateLane): Promise<void> {
  try {
    console.log(params)
    await instance.put(`/lanes/${id}`, params)
  } catch (error) {
    throw new Error('Failed to update lane')
  }
}
