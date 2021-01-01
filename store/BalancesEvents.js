import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

const BalancesEvents = () => {
  // dispatch message box status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [historyParams, setHistoryParams] = useState([]);

  useEffect(() => {
    if (state.userStatus >= 4) {
      // write transaction to database
      if (historyParams.length) updateHistory(historyParams);
    }
  }, [state.userStatus, historyParams]);

  useEffect(() => {
    if (window) {
      window.maticWidgetEventsListener = maticWidgetEventsListener;
    }
  }, []);

  // Listen to the events from widget
  function maticWidgetEventsListener(event) {
    console.log('Matic Widget event listener');

    // 'onDepositTxHash' event
    if (event.data.type === 'onDepositTxHash') {
      const txHash = event.data.data;
      console.log('Received transaction hash: ' + txHash);

      // write to database and message box pending message
      setHistoryParams(['Deposit', txHash]);
      dispatchToStore(txHash);

      // close the widget
      closeWidgetOnTransaction(event);
    }

    // 'onWithdrawExitTxHash' event
    if (event.data.type === 'onWithdrawExitTxHash') {
      const txHash = event.data.data;
      console.log('Received transaction hash: ' + txHash);

      // write to database and message box pending message
      setHistoryParams(['Withdraw', txHash]);
      dispatchToStore(txHash);

      // close the widget
      closeWidgetOnTransaction(event);
    }
  }

  function dispatchToStore(txHash) {
    // update message box
    // dispatch({
    //   type: 'message_box',
    //   data: value,
    // })

    // dispatch transaction hash
    dispatch({
      type: 'tx_hash',
      data: txHash,
    });

    // start pinging token contract for updated balances
    dispatch({
      type: 'token_pings',
      data: 1,
    });
  }

  // update transaction history in the database
  async function updateHistory(params) {
    console.log('Writing to database: ' + params[0]);

    // console.log('user address: ' + userAddress)
    // console.log('type: ' + params[0])
    // console.log('tx hash: ' + params[1])
    // console.log('user status: ' + state.userStatus)

    try {
      const response = await Fetch.POST_HISTORY(
        state.userAddress,
        0,
        params[0],
        'Pending',
        params[1],
        state.userStatus
      );

      const json = await response.json();
      console.log('Update history complete: ' + json.status);
    } catch (error) {
      console.log('Update history error: ' + error);
    }
  }

  function closeWidgetOnTransaction(event) {
    const iframeId = event.data.iframeId;

    try {
      document.body.removeChild(document.getElementById(iframeId));
      document.body.removeChild(
        document.getElementById('matic-iframe-backdrop')
      );
    } catch (error) {
      console.log('Matic Widget is already closed');
    }
  }

  return null;
};

export default BalancesEvents;
