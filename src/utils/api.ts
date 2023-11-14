import axios from 'axios'

export interface Lane {
  id: string
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

    return data.lanes as Array<Lane>
  } catch (error) {
    throw new Error('Failed to fetch lanes')
  }
}

export async function fetchLaneById(id: string): Promise<Lane> {
  try {
    const { data } = await instance.get(`/lanes/${id}`)

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

export async function putLane(id: string, params: CreateLane): Promise<void> {
  try {
    await instance.put(`/lanes/${id}`, params)
  } catch (error) {
    throw new Error('Failed to update lane')
  }
}

export async function deleteLane(id: string): Promise<{ id: string }> {
  try {
    await instance.delete(`/lanes/${id}`)

    return { id }
  } catch (error) {
    throw new Error('Failed to update lane')
  }
}

export interface Memory {
  id: number
  lane_id: string
  name: string
  description: string
  timestamp: number | string
  images: Array<string>
}

export interface MemoryWithImages extends Omit<Memory, 'images'> {
  images: Array<{
    id: string
    base64: string
  }>
}

export type CreateMemory = Omit<Memory, 'id' | 'lane_id'> & { laneId: string }

export async function fetchMemories(
  id: string,
  sort: 'ASC' | 'DESC'
): Promise<Array<MemoryWithImages>> {
  try {
    const { data } = await instance.get(`/memories/${id}?sort=${sort}`)

    return data.memories as Array<MemoryWithImages>
  } catch (error) {
    throw new Error('Failed to fetch memories')
  }
}

export async function postMemory(params: CreateMemory): Promise<void> {
  try {
    await instance.post('/memories', params)
  } catch (error) {
    throw new Error('Failed to create lane')
  }
}

export async function deleteMemory(id: string): Promise<{ id: string }> {
  try {
    await instance.delete(`/memories/${id}`)

    return { id }
  } catch (error) {
    throw new Error('Failed to update lane')
  }
}
