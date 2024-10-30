import { Message, PILOT_DISCONNECT, PROBE_CHAIN_ID } from '../messages'
import {
  INJECTED_PROVIDER_EVENT,
  INJECTED_PROVIDER_REQUEST,
  InjectedProviderMessage,
  InjectedProviderResponse,
} from './messages'
import { probeChainId } from './probeChainId'

// The content script is injected on tab update events, which can be triggered multiple times for the same page load.
// That's why we need to check if the script has already been injected before injecting it again.

const alreadyInjected =
  '__zodiacPilotInjected' in document.documentElement.dataset

function inject(scriptPath: string) {
  const node = document.createElement('script')
  node.type = 'text/javascript'
  node.async = false
  node.src = chrome.runtime.getURL(scriptPath)

  const parent = document.head || document.documentElement
  parent.insertBefore(node, parent.children[0])
  node.remove()
}

if (
  !alreadyInjected &&
  window.location.origin !== 'https://connect.pilot.gnosisguild.org' &&
  !window.location.href.startsWith('about:') &&
  !window.location.href.startsWith('chrome:')
) {
  document.documentElement.dataset.__zodiacPilotInjected = 'true'
  document.documentElement.dataset.__zodiacPilotConnected = 'true'
  inject('build/inject/injectedScript.js')

  // relay rpc requests from the InjectedProvider in the tab to the Eip1193Provider in the panel
  window.addEventListener(
    'message',
    async (event: MessageEvent<InjectedProviderMessage>) => {
      const message = event.data
      if (!message) return

      if (message.type === INJECTED_PROVIDER_REQUEST) {
        // Prevent the same request from being handled multiple times through other instances of this content script
        event.stopImmediatePropagation()

        const { requestId, request } = message

        const logDetails = { request, response: '⏳' } as any
        const requestIndex = requestId.split('_').pop()
        console.debug(
          `🧑‍✈️ request #${requestIndex}: \x1B[34m${request.method}\x1B[m %O`,
          logDetails
        )

        const responseMessage: InjectedProviderResponse | undefined =
          await chrome.runtime.sendMessage(message)

        // This can happen if the panel is closed before the response is received
        if (!responseMessage) return

        const { response } = responseMessage
        Object.assign(logDetails, { response })

        window.postMessage(responseMessage, '*')
      }
    }
  )

  // Relay panel toggling and events from the Eip1193Provider in the panel to the InjectedProvider in the tab
  chrome.runtime.onMessage.addListener(
    (message: InjectedProviderMessage | Message, sender, respond) => {
      if (sender.id !== chrome.runtime.id) {
        return
      }

      switch (message.type) {
        // when the panel is closed, we trigger an EIP1193 'disconnect' event
        case PILOT_DISCONNECT: {
          console.debug('Pilot disconnected')
          window.postMessage(
            {
              type: INJECTED_PROVIDER_EVENT,
              eventName: 'disconnect',
              eventData: {
                error: {
                  message: 'Zodiac Pilot disconnected',
                  code: 4900,
                },
              },
            } as InjectedProviderMessage,
            '*'
          )

          break
        }

        case INJECTED_PROVIDER_EVENT: {
          console.debug(
            `🧑‍✈️ event: \x1B[34m${message.eventName}\x1B[m %O`,
            message.eventData
          )
          window.postMessage(message, '*')

          break
        }

        case PROBE_CHAIN_ID: {
          probeChainId(message.url).then(respond)

          // without this the response won't be sent
          return true
        }
      }
    }
  )
}

export {}
