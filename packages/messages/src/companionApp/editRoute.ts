import type { ExecutionRoute } from '@zodiac/schema'

export enum CompanionAppMessageType {
  SAVE_ROUTE = 'COMPANION::SAVE_ROUTE',
  OPEN_PILOT = 'COMPANION::OPEN_PILOT',
  SUBMIT_SUCCESS = 'COMPANION::SUBMIT_SUCCESS',
  CONNECT = 'COMPANION::CONNECT',
  FORK_UPDATED = 'COMPANION::FORK_UPDATED',
}

type CompanionAppSaveRouteMessage = {
  type: CompanionAppMessageType.SAVE_ROUTE
  data: ExecutionRoute
}

type CompanionAppOpenPilotMessage = {
  type: CompanionAppMessageType.OPEN_PILOT
}

type CompanionAppSubmitSuccessMessage = {
  type: CompanionAppMessageType.SUBMIT_SUCCESS
}

type CompanionAppConnectMessage = {
  type: CompanionAppMessageType.CONNECT
}

type CompanionAppForkUpdateMessage = {
  type: CompanionAppMessageType.FORK_UPDATED
  forkUrl: string | null
}

export type CompanionAppMessage =
  | CompanionAppSaveRouteMessage
  | CompanionAppOpenPilotMessage
  | CompanionAppSubmitSuccessMessage
  | CompanionAppConnectMessage
  | CompanionAppForkUpdateMessage
