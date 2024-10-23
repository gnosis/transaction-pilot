import { Button, Flex, IconButton } from '@/components'
import React, { useEffect, useRef, useState } from 'react'
import { RiFileCopy2Line, RiRefreshLine } from 'react-icons/ri'
import { toast } from 'react-toastify'
import { ForkProvider } from '../providers'
import { useProvider } from '../providers/ProvideProvider'
import { useRoute } from '../routes'
import { useDispatch, useTransactions } from '../state'
import { RouteBubble } from './RouteBubble'
import Submit from './Submit'
import { Transaction } from './Transaction'
import classes from './style.module.css'

const Transactions: React.FC = () => {
  const transactions = useTransactions()
  const dispatch = useDispatch()
  const provider = useProvider()
  const { route } = useRoute()

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const [scrollItemIntoView, setScrollItemIntoView] = useState<
    number | undefined
  >(undefined)

  const lengthRef = useRef(0)
  useEffect(() => {
    if (transactions.length > lengthRef.current) {
      setScrollItemIntoView(transactions.length - 1)
    }

    lengthRef.current = transactions.length
  }, [transactions])

  const reforkAndRerun = async () => {
    // remove all transactions from the store
    dispatch({
      type: 'REMOVE_TRANSACTION',
      payload: { id: transactions[0].id },
    })

    if (!(provider instanceof ForkProvider)) {
      throw new Error('This is only supported when using ForkProvider')
    }

    await provider.deleteFork()

    // re-simulate all new transactions (assuming the already submitted ones have already been mined on the fresh fork)
    for (const transaction of transactions) {
      await provider.sendMetaTransaction(transaction.transaction)
    }
  }

  const copyTransactionData = async () => {
    const metaTransactions = transactions.map((txState) => txState.transaction)

    navigator.clipboard.writeText(
      JSON.stringify(metaTransactions, undefined, 2)
    )
    toast(<>Transaction data has been copied to clipboard.</>)
  }

  return (
    <>
      <Flex justifyContent="end" gap={0}>
        <RouteBubble />
      </Flex>

      <div className="flex items-center justify-between">
        <h4 className={classes.header}>Recording Transactions</h4>

        <div className="flex gap-1">
          <IconButton
            title="Copy batch transaction data to clipboard"
            disabled={transactions.length === 0}
            onClick={copyTransactionData}
          >
            <RiFileCopy2Line />
          </IconButton>
          <IconButton
            title="Re-simulate on current blockchain head"
            disabled={transactions.length === 0}
            onClick={reforkAndRerun}
          >
            <RiRefreshLine />
          </IconButton>

          <div className={classes.recordingIcon} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-8 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="exp flex flex-grow flex-col gap-4 overflow-y-auto"
        >
          {transactions.map((transactionState, index) => (
            <Transaction
              key={transactionState.id}
              transactionState={transactionState}
              index={index}
              scrollIntoView={scrollItemIntoView === index}
            />
          ))}

          {transactions.length === 0 && (
            <p className={classes.hint}>
              As you interact with apps in the browser, transactions will be
              recorded here. You can then sign and submit them as a batch.
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {!route.initiator && (
            <Button
              secondary
              onClick={copyTransactionData}
              disabled={transactions.length === 0}
            >
              Copy transaction data
            </Button>
          )}
          <Submit />
        </div>
      </div>
    </>
  )
}

export default Transactions
