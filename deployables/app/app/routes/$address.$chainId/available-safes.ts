import { validateAddress } from '@/utils'
import { invariantResponse } from '@epic-web/invariant'
import { verifyChainId } from '@zodiac/chains'
import { getOptionalString } from '@zodiac/form-data'
import type { ShouldRevalidateFunctionArgs } from 'react-router'
import { queryAvatars, splitPrefixedAddress, unprefixAddress } from 'ser-kit'
import { Intent } from '../edit/intents'
import type { Route } from './+types/available-safes'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { address, chainId } = params

  const verifiedChainId = verifyChainId(parseInt(chainId))
  const validatedAddress = validateAddress(address)

  invariantResponse(validatedAddress != null, `Invalid address: ${address}`)

  try {
    const avatars = await queryAvatars(validatedAddress)

    const possibleAvatars = avatars.filter((avatar) => {
      const [chainId] = splitPrefixedAddress(avatar)

      return chainId === verifiedChainId
    })

    return Response.json(
      possibleAvatars.map((avatar) => unprefixAddress(avatar)),
    )
  } catch {
    return Response.json([])
  }
}

export const shouldRevalidate = ({
  formData,
  currentParams,
  nextParams,
}: ShouldRevalidateFunctionArgs) => {
  if (currentParams.chainId !== nextParams.chainId) {
    return true
  }

  if (formData == null) {
    return false
  }

  const intent = getOptionalString(formData, 'intent')

  if (intent == null) {
    return false
  }

  return intent === Intent.ConnectWallet || intent === Intent.DisconnectWallet
}
