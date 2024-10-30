import { MockedFunction, vi } from 'vitest'
import { chrome as vitestChrome } from 'vitest-chrome'

type ChromeMock = typeof vitestChrome & {
  scripting: {
    executeScript: MockedFunction<(typeof chrome.scripting)['executeScript']>
  }
}

Object.assign(vitestChrome.storage.sync, {
  ...vitestChrome.storage.sync,
  onChanged: { addListener: vi.fn() },
})

enum RuleActionType {
  BLOCK = 'block',
  REDIRECT = 'redirect',
  ALLOW = 'allow',
  UPGRADE_SCHEME = 'upgradeScheme',
  MODIFY_HEADERS = 'modifyHeaders',
  ALLOW_ALL_REQUESTS = 'allowAllRequests',
}

enum HeaderOperation {
  APPEND = 'append',
  SET = 'set',
  REMOVE = 'remove',
}

enum ResourceType {
  MAIN_FRAME = 'main_frame',
  SUB_FRAME = 'sub_frame',
  STYLESHEET = 'stylesheet',
  SCRIPT = 'script',
  IMAGE = 'image',
  FONT = 'font',
  OBJECT = 'object',
  XMLHTTPREQUEST = 'xmlhttprequest',
  PING = 'ping',
  CSP_REPORT = 'csp_report',
  MEDIA = 'media',
  WEBSOCKET = 'websocket',
  OTHER = 'other',
}

const vitestChromeWithMissingMethods = Object.assign(vitestChrome, {
  ...vitestChrome,

  declarativeNetRequest: {
    RuleActionType,
    HeaderOperation,
    ResourceType,

    updateSessionRules: vi.fn(),
    getSessionRules: vi.fn(),
  },

  scripting: {
    executeScript: vi.fn(),
  },
})

export const chromeMock: ChromeMock = vitestChromeWithMissingMethods
