import {
  getDeBankChainId,
  getTokenBalances,
  type TokenBalance,
} from '@/balances-server'
import { invariantResponse } from '@epic-web/invariant'
import { verifyChainId } from '@zodiac/chains'
import { verifyHexAddress, type HexAddress } from '@zodiac/schema'
import {
  createPublicClient,
  erc20Abi,
  formatUnits,
  http,
  type PublicClient,
} from 'viem'
import type { Route } from './+types/balances'

export const loader = async ({
  request,
  params: { chainId, address },
}: Route.LoaderArgs): Promise<TokenBalance[]> => {
  const url = new URL(request.url)

  const nativeChainId = await getDeBankChainId(verifyChainId(parseInt(chainId)))
  const mainNetBalances = await getTokenBalances(
    verifyChainId(parseInt(chainId)),
    verifyHexAddress(address),
  )

  if (url.searchParams.has('fork')) {
    const fork = url.searchParams.get('fork')

    invariantResponse(fork != null, `Fork param was no URL`)

    const client = createPublicClient({
      transport: http(fork),
    })

    return Promise.all(
      mainNetBalances.map(async (balance) => {
        // @ts-expect-error the PublicClient type from viem is weird
        const forkBalance = await getForkBalance(client, {
          contractId: balance.contractId,
          nativeChainId,
          address: verifyHexAddress(address),
        })

        const amount = formatUnits(BigInt(forkBalance), balance.decimals)

        return {
          ...balance,

          amount,
          usdValue: parseFloat(amount) * balance.usdPrice,
        }
      }),
    )
  }

  return mainNetBalances
}

type GetForkBalanceOptions = {
  address: HexAddress
  contractId: string
  nativeChainId: string
}

const getForkBalance = (
  client: PublicClient,
  { contractId, address, nativeChainId }: GetForkBalanceOptions,
): Promise<bigint> => {
  if (contractId === nativeChainId) {
    return client.getBalance({ address })
  }

  return client.readContract({
    address: contractId,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
  })
}
