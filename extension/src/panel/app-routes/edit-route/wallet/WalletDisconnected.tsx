import { Alert, Button } from '@/components'
import { useInjectedWallet } from '@/providers'
import { PropsWithChildren } from 'react'
import { Section } from './Section'

type WalletDisconnectedProps = PropsWithChildren<{
  onReconnect: () => void
  onDisconnect: () => void
}>

export const WalletDisconnected = ({
  children,
  onReconnect,
  onDisconnect,
}: WalletDisconnectedProps) => {
  const injectedWallet = useInjectedWallet()

  return (
    <Section>
      <Alert title="Wallet disconnected">
        Your wallet is disconnected from Pilot. Reconnect it to use the selected
        account with Pilot.
      </Alert>

      {children}

      <Section.Actions>
        <Button
          fluid
          disabled={!injectedWallet.connected}
          onClick={onReconnect}
        >
          Connect
        </Button>
        <Button fluid onClick={onDisconnect}>
          Disconnect
        </Button>
      </Section.Actions>
    </Section>
  )
}
