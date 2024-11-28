import { ChainId, parsePrefixedAddress, PrefixedAddress } from 'ser-kit'
import { ConnectionProvider } from './connectTypes'

export const isConnected = (
  connection: ConnectionProvider,
  account: PrefixedAddress,
  chainId: ChainId
) => {
  if (connection.ready === false) {
    return false
  }

  if (connection.chainId !== chainId) {
    return false
  }

  const [, accountAddress] = parsePrefixedAddress(account)

  return connection.accounts.some(
    (account) => account.toLowerCase() === accountAddress.toLowerCase()
  )
}
