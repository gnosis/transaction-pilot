import type { ExecutionRoute } from '@/types'
import { Chain, ZERO_ADDRESS } from '@zodiac/chains'
import { createEoaStartingPoint } from '@zodiac/modules'
import { getStorageEntries } from '../utils'

export const getRoutes = async (): Promise<ExecutionRoute[]> => {
  const routes = await getStorageEntries<ExecutionRoute>('routes')

  return Object.values(routes).map((route) =>
    route.waypoints == null
      ? {
          ...route,
          waypoints: [
            createEoaStartingPoint({
              chainId: Chain.ETH,
              address: ZERO_ADDRESS,
            }),
          ],
        }
      : route,
  )
}
