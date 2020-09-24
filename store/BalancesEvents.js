import { useState, useEffect, useContext } from 'react'
import { GlobalContext } from './index'
import Web3 from 'web3'
import Global from '../components/Constants'

const BalancesEvents = () => {
  // dispatch message box status to the Context API store
  const [state, dispatch] = useContext(GlobalContext)

  // define local variables
  const [historyParams, setHistoryParams] = useState([])

  let userAddress = ''
  let txHash = ''
  const web3 = new Web3()
  const abiCoder = web3.eth.abi

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress

      // write transaction to database
      if (historyParams.length) updateHistory(historyParams)
    }
  }, [state.userStatus, historyParams])

  useEffect(() => {
    if (window) {
      window.maticWidgetEventsListener = maticWidgetEventsListener
    }
  }, [])

  // Listen to the events from widget
  function maticWidgetEventsListener(event) {
    console.log('Matic Widget event listener')

    console.log(event.eventTypes)
    console.log(event.data.type, event)

    // console.log('onReceipt')
    // if (event.data && event.data.type === event.eventTypes.TRANSFER.onReceipt) {
    //   console.log('event data')
    //   console.log(event.data)
    // }

    console.log('Start condition handling...')

    // 'onReceipt' event
    if (event.data.type === 'onReceipt') {
      console.log('Received receipt amount')
      console.log(event.data)
    }

    // 'onDepositTxHash' event
    if (event.data.type === 'onDepositTxHash') {
      txHash = event.data.data
      console.log('Received transaction hash: ' + txHash)

      dispatchToStore(1) // message box pending transaction

      // close the widget
      // closeWidgetOnTransaction(event);
    }

    // 'onDeposit' event
    if (event.data.type === 'onDeposit') {
      const blockHash = event.data.data.blockHash
      console.log('Received block hash: ' + blockHash)

      dispatchToStore(2) // message box deposit confirmed

      // set amount parameter for database insert
      const { 0: amount } = abiCoder.decodeParameters(['uint256'], blockHash)
      setHistoryParams([amount, 'Deposit', 'Confirmed', txHash])
    }

    // 'onWithdrawExitTxHash' event
    if (event.data.type === 'onWithdrawExitTxHash') {
      txHash = event.data.data
      console.log('Received transaction hash: ' + txHash)

      dispatchToStore(1) // message box pending transaction

      // close the widget
      // closeWidgetOnTransaction(event);
    }

    // 'onWithdrawExit' event
    if (event.data.type === 'onWithdrawExit') {
      const blockHash = event.data.data.blockHash
      console.log('Received block hash: ' + blockHash)

      dispatchToStore(3) // message box withdrawal confirmed

      // set amount parameter for database insert
      const { 0: amount } = abiCoder.decodeParameters(['uint256'], blockHash)
      setHistoryParams([amount, 'Withdraw', 'Confirmed', txHash])
    }
  }

  // update message box
  function dispatchToStore(value) {
    dispatch({
      type: 'message_box',
      data: value,
    })
  }

  // update transaction history in the database
  async function updateHistory(params) {
    console.log('Writing to database: ' + params[1])

    console.log('user address: ' + userAddress)
    console.log('amount: ' + params[0])
    console.log('type: ' + params[1])
    console.log('state: ' + params[2])
    console.log('tx hash: ' + params[3])
    console.log('user status: ' + state.userStatus)

    try {
      const response = await Global.FETCH.POST_HISTORY(
        userAddress,
        params[0],
        params[1],
        params[2],
        params[3],
        state.userStatus,
      )

      const json = await response.json()
      console.log('Update history complete: ' + json.status)
    } catch (error) {
      console.log('Update history error: ' + error)
    }
  }

  function closeWidgetOnTransaction(event) {
    const iframeId = event.data.iframeId

    try {
      document.body.removeChild(document.getElementById(iframeId))
      document.body.removeChild(
        document.getElementById('matic-iframe-backdrop'),
      )
    } catch (error) {
      console.log('Matic Widget is already closed')
    }
  }

  return null
}

export default BalancesEvents
