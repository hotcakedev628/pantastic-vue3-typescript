import type { Location } from '@/types'
import { API_KEY, API_URL } from '@/config'

interface Params {
  limit?: number
  query: string
}

export const fetchLocations = async ({
  limit = 5,
  query = '',
}: Params): Promise<Location[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${API_URL}?key=${API_KEY}&q=${query}&limit=${limit}`
      )

      resolve(response.json())
    } catch (err) {
      console.error('[Location Api]: ', err)
      reject(new Error('Internal server error'))
    }
  })
}
