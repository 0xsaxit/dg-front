import React, { useState, useEffect, useContext } from 'react'
import { GlobalContext } from '../../../../store'
import { Button } from 'semantic-ui-react'
import cn from 'classnames'
import styles from './IceRewards.module.scss'
import Fetch from '../../../../common/Fetch';

const IceRewards = () => {
  // dispatch user's ICE amounts to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [clicked, setClicked] = useState(false);
  const [payoutTime, setPayoutTime] = useState('--');
  const [totalICE, setTotalICE] = useState(0);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // after claiming rewards this code gets executed
  useEffect(() => {
    setClicked(false);
  }, [state.iceAmounts]);

  useEffect(() => {
    (async () => {
      let json = await Fetch.ICE_AMOUNTS(state.userAddress);
      const unclaimed = json.totalUnclaimedAmount;
      setTotalICE(formatPrice(unclaimed, 0));
    })();
  }, []);

  useEffect(() => {
    let id = setInterval(() => {
      var remainingTime = getRemainingTime() / 60;

      // Set Remain Time Text
      if (remainingTime >= 60) {
        remainingTime = Math.floor(remainingTime / 60);
        setPayoutTime(
          remainingTime > 1
            ? remainingTime + ' hours.'
            : remainingTime + ' hour.'
        );
      } else {
        setPayoutTime(
          remainingTime > 1
            ? Math.floor(remainingTime) + ' minutes.'
            : '1 minute.'
        );
      }
    }, 1000);
    return () => clearInterval(id);
  });

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function formatPrice(balanceDG, units) {
    const balanceAdjusted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return balanceAdjusted;
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get Remaining Time
  function getRemainingTime() {
    const today = new Date();
    const todayUTC = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      today.getUTCHours(),
      today.getUTCMinutes(),
      today.getUTCSeconds()
    );
    const tomorrowUTC = new Date(todayUTC.getTime());
    tomorrowUTC.setDate(tomorrowUTC.getDate() + 1);
    tomorrowUTC.setHours(0);
    tomorrowUTC.setMinutes(0);
    tomorrowUTC.setSeconds(0);

    return (tomorrowUTC.getTime() - todayUTC.getTime()) / 1000;
  }

  async function claimTokens() {
    console.log('Claiming ICE Rewards: ' + state.iceAmounts.ICE_CLAIM_AMOUNT);
    setClicked(true);

    let msg = '';

    try {
      const json = await Fetch.CLAIM_REWARDS();

      if (json.status) {
        console.log('Claim ICE rewards request successful');
        console.log('Claim ICE transaction hash: ' + json.txHash);

        // update global state ice amounts
        const refresh = !state.refreshICEAmounts;

        dispatch({
          type: 'refresh_ice_amounts',
          data: refresh,
        });
        msg = 'ICE claimed successfully!';

      } else {
        console.log('Claim ICE rewards request error: ' + json.reason);
        msg = 'ICE claimed failed!';

        setClicked(false);
      }
    } catch (error) {
      console.log(error); // API request timeout error
      msg = 'ICE claimed failed!';

      setClicked(false);
    }

    dispatch({
        type: 'show_toastMessage',
        data: msg,
    });
  }

  return (
    <div className={styles.main_wrapper}>
      <div className={styles.title}>
        <h1>Claim Your ICE Rewards!</h1>
        <p>
          Payouts at midnight UTC daily. Next payout in{' '}
          <abbr>{payoutTime}</abbr>
        </p>
      </div>

      <div className={styles.lower}>
        <p className={styles.lower_header}>Claim ICE Rewards</p>
        <div className={styles.lower_value}>
          <p className={styles.ICE_value}>
            {totalICE}
          </p>
          <img
            style={{ marginTop: '-4px' }}
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_Diamond_ICN_kxkaqj.svg"
          />
        </div>
        <p className={styles.price}>
          $
          {formatPrice(
            totalICE * state.DGPrices.ice,
            2
          )}
        </p>

        <p className={styles.lower_text}>
          ICE Earnings vary based on your total equipped wearables, wearable
          ranks, and your placement in daily ICE Poker tournaments.
        </p>

        {!clicked ? (
          <Button
            className={cn(styles.claim_ICE, styles.lower_button)}
            onClick={() => claimTokens()}
          >
            Claim {formatPrice(totalICE, 0)} ICE
          </Button>
        ) : (
          <Button
            className={cn(styles.claim_ICE, styles.lower_button)}
            disabled
          >
            Claim {formatPrice(totalICE, 0)} ICE
          </Button>
        )}
      </div>
    </div>
  );
};

export default IceRewards;
