import { ZERO_ADDRESS } from '@zodiac/chains'
import { getRolesWaypoint } from '@zodiac/modules'
import type { ExecutionRoute } from '@zodiac/schema'
import type { JsonRpcProvider } from 'ethers'
import { AccountType, parsePrefixedAddress } from 'ser-kit'
import { decodeGenericError } from './decodeError'
import { handleRolesV1Error } from './handleRolesV1Error'
import { handleRolesV2Error } from './handleRolesV2Error'
import { isSmartContractAddress } from './isSmartContractAddress'
import { isJsonRpcError } from './JsonRpcError'
import { maybeGetRoleId } from './maybeGetRoleId'
import { wrapRequest } from './wrapRequest'

type Error = { error: true; message: string }
type Success = { error: false }

type Result = Error | Success

export async function dryRun(
  provider: JsonRpcProvider,
  route: ExecutionRoute,
): Promise<Result> {
  if (
    route.initiator == null ||
    parsePrefixedAddress(route.initiator) === ZERO_ADDRESS
  ) {
    return { error: true, message: 'This route is not connected to a wallet.' }
  }

  if (parsePrefixedAddress(route.avatar) === ZERO_ADDRESS) {
    return { error: true, message: 'This route has no target.' }
  }

  const rolesWaypoint = getRolesWaypoint(route)

  if (
    rolesWaypoint != null &&
    !(await isSmartContractAddress(rolesWaypoint.account.address, provider))
  ) {
    return { error: true, message: 'Module address is not a smart contract.' }
  }

  if (
    !(await isSmartContractAddress(
      parsePrefixedAddress(route.avatar),
      provider,
    ))
  ) {
    return { error: true, message: 'Avatar is not a smart contract.' }
  }

  const request = wrapRequest({
    request: {
      to: ZERO_ADDRESS,
      data: '0x00000000',
      from: parsePrefixedAddress(route.avatar),
    },
    route,
    revertOnError: false,
  })

  // TODO enable this once we can query role members from ser
  // if (!request.from && connection.roleId) {
  //   // If pilotAddress is not yet determined, we will use a random member of the specified role
  //   request.from = await getRoleMember(connection)
  // }

  try {
    await provider.estimateGas(request)

    return { error: false }
  } catch (error) {
    if (!isJsonRpcError(error)) {
      return { error: true, message: 'Unknown dry run error.' }
    }

    if (
      rolesWaypoint == null ||
      rolesWaypoint.account.type !== AccountType.ROLES
    ) {
      return { error: true, message: decodeGenericError(error) }
    }
    // For the Roles mod, we actually expect the dry run to fail with TargetAddressNotAllowed()
    // In case we see any other error, we try to help the user identify the problem.

    const { account } = rolesWaypoint

    switch (account.version) {
      case 1: {
        const message = handleRolesV1Error(
          error,
          maybeGetRoleId(rolesWaypoint) ?? '0',
        )

        if (message == null) {
          return { error: false }
        }

        return {
          error: true,
          message,
        }
      }
      case 2: {
        const message = handleRolesV2Error(
          error,
          maybeGetRoleId(rolesWaypoint) ?? '0',
        )

        if (message == null) {
          return { error: false }
        }

        return {
          error: true,
          message,
        }
      }
      default: {
        console.warn('Unexpected dry run error', error)

        return { error: true, message: 'Unexpected dry run error' }
      }
    }
  }
}
