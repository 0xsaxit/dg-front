import React, { useState, useEffect, useContext } from 'react'
import { GlobalContext } from '../../../../store'
import { Button } from 'semantic-ui-react'
import { Bar } from 'react-chartjs-2';
import cn from 'classnames'
import styles from './IceRewards.module.scss'
import Fetch from '../../../../common/Fetch';
import FoxAnimation from 'components/lottieAnimation/animations/fox'

const IceRewards = () => {
  // dispatch user's ICE amounts to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [clicked, setClicked] = useState(false);
  const [payoutTime, setPayoutTime] = useState('--');
  const [totalICE, setTotalICE] = useState(0);
  const [statsUSDX, setStatsUSDX] = useState([]);
  const [statsUSDY, setStatsUSDY] = useState([]);

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
  }, [totalICE]);

  useEffect(() => {
    let id = setInterval(() => {
      var remainingTime = getRemainingTime() / 60;

      // Set Remain Time Text
      if (remainingTime >= 60) {
        remainingTime = Math.floor(remainingTime / 60);
        setPayoutTime(remainingTime + 'h');
      } else {
        setPayoutTime(Math.floor(remainingTime) + 'min');
      }
    }, 1000);
    return () => clearInterval(id);
  });

  useEffect(() => {
    // Set xAxis
    let xAxis = [];
    const today = new Date();
    for (var i = 7; i >= 1; i--) {
      var date = new Date(today)
      date.setDate(date.getDate() - i);
      console.log(date);
      xAxis.push(date.toDateString().slice(0, 1));
    }
    setStatsUSDX(xAxis);

    // Set yAxis
    let datasets = [
      {
        label: 'Gameplay',
        data: [10, 50, 80, 60, 50, 90, 50],
        backgroundColor: ['#B0E6FF', '#B0E6FF', '#B0E6FF', '#B0E6FF', '#B0E6FF', '#B0E6FF', '#B0E6FF'],
        barThickness: 20,
        borderWidth: 2,
        borderRadius: 10,
      },
      {
        label: 'Delegation',
        data: [100, 100, 100, 100, 100, 100, 100],
        backgroundColor: ['#5EBFF5', '#5EBFF5', '#5EBFF5', '#5EBFF5', '#5EBFF5', '#5EBFF5', '#5EBFF5'],
        barThickness: 20,
        borderWidth: 2,
        borderRadius: 10,
      }
    ]
    setStatsUSDY(datasets);
  }, [])

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
    <>
      {!state.userStatus ?
        <div className={styles.fullWidth}>
          <FoxAnimation />
        </div>
        :
        <div className={styles.main_wrapper}>
          <div className={styles.topDiv}>
            <div className={styles.claimICEDiv}>
              <div className={styles.title}>
                <h1>Claim ICE Reward!</h1>
              </div>

              <div className={styles.lower}>
                <div className={styles.lower_header}>
                  <h1>Play-to-Earn ICE Rewards</h1>
                  <p>
                    Payouts at midnight UTC daily&nbsp;
                    <abbr>(in {payoutTime})</abbr>
                  </p>
                </div>

                <div>
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
                </div>

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

            <div className={styles.iceEarnedDiv}>
              <div className={styles.title}>
                <h1>ICE Earned (past 7 Days)</h1>
              </div>
              <div className={styles.graph}>
                <Bar
                  height={180}
                  data={{
                    labels: statsUSDX,
                    datasets: statsUSDY,
                  }}
                  options={{
                    maintainAspectRatio: false,
                    cornerRadius: 10,
                    title: { display: false },
                    legend: { display: false },
                    scales: {
                      xAxes: [
                        {
                          stacked: true,
                        }
                      ],
                      yAxes: [
                        {
                          stacked: true,
                          ticks: {
                            autoSkip: true,
                            autoSkipPadding: 25,
                            maxRotation: 0,
                            minRotation: 0,
                          },
                        },
                      ],
                    },
                    elements: {
                      point: { radius: 10 },
                    }
                  }}
                />

                <div className={styles.bottomDiv}>
                  <div className={styles.legend}>
                    <div>
                      <section className={styles.delegationBG} />
                      Delegation
                    </div>
                    <div>
                      <section className={styles.gamePlayBG} />
                      Gameplay
                    </div>
                  </div>
                  <div className={styles.info}>
                    <div className={styles.ice}>
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                      2091 ICE
                    </div>
                    <div className={styles.xp}>
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_XP_ICN_f9w2se.svg" alt="ice" />
                      3 XP
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
      }
    </>
  );
};

export default IceRewards;