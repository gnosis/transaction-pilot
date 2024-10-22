import { MetaTransactionData } from '@safe-global/safe-core-sdk-types'
import { ContractInfo } from '../utils/abi'
import { ExecutionStatus } from './executionStatus'

interface AppendTransactionAction {
  type: 'APPEND_TRANSACTION'
  payload: {
    id: string
    transaction: MetaTransactionData
  }
}

interface DecodeTransactionAction {
  type: 'DECODE_TRANSACTION'
  payload: {
    id: string
    contractInfo: ContractInfo
  }
}

interface ConfirmTransactionAction {
  type: 'CONFIRM_TRANSACTION'
  payload: {
    id: string
    snapshotId: string
    transactionHash: string
  }
}

interface UpdateTransactionStatusAction {
  type: 'UPDATE_TRANSACTION_STATUS'
  payload: {
    id: string
    status: ExecutionStatus
  }
}

interface RemoveTransactionAction {
  type: 'REMOVE_TRANSACTION'
  payload: {
    id: string
  }
}

interface RemoveTransactionAction {
  type: 'REMOVE_TRANSACTION'
  payload: {
    id: string
  }
}

interface ClearTransactionsAction {
  type: 'CLEAR_TRANSACTIONS'
  payload: {
    lastTransactionId: string
  }
}

export type Action =
  | AppendTransactionAction
  | DecodeTransactionAction
  | ConfirmTransactionAction
  | UpdateTransactionStatusAction
  | RemoveTransactionAction
  | ClearTransactionsAction
