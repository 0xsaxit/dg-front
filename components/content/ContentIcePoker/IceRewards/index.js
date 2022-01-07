import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { GlobalContext } from '../../../../store';
import { Table, Button } from 'semantic-ui-react';
import { Bar } from 'react-chartjs-2';
import cn from 'classnames';
import { useMediaQuery } from 'hooks';
import styles from './IceRewards.module.scss';
import Fetch from '../../../../common/Fetch';
import FoxAnimation from 'components/lottieAnimation/animations/fox';
import EmptyResultAnimation from 'components/lottieAnimation/animations/emptyResult';
import ModalIceBreakdown from 'components/modal/ModalIceBreakDown';
import SpinnerAnimation from 'components/lottieAnimation/animations/spinner';
import HourglassAnimation from 'components/lottieAnimation/animations/hourglass'

const IceRewards = () => {
  // dispatch user's ICE amounts to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  const isTablet = useMediaQuery('(min-width: 1200px)');
  const isMobile = useMediaQuery('(min-width: 576px)');

  // define local variables
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payoutTime, setPayoutTime] = useState('--');
  const [totalICE, setTotalICE] = useState(0);
  const [statsUSDX, setStatsUSDX] = useState([]);
  const [statsUSDY, setStatsUSDY] = useState([]);
  const [iceEarned, setIceEarned] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [iceRewardHistory, setHistory] = useState([]);
  const [showBreakDown, setShowingBreakDown] = useState(-1);

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

  useEffect(async () => {
    if (state.userStatus) {
      setLoading(true);

      // Get Gameplay Reports from the API
      let response = await Fetch.GAMEPLAY_REPORTS();
      console.log(response);

      // Set xAxis
      let xAxis = [];
      const today = new Date();
      const todayMoment = moment(new Date(today));
      for (var i = 7; i >= 1; i--) {
        var date = new Date(today);
        date.setDate(date.getDate() - i);
        xAxis.push(date.toDateString().slice(0, 1));
      }
      setStatsUSDX(xAxis);

      // Set yAxis
      let datasets = [
        {
          label: 'Gameplay',
          data: [0, 0, 0, 0, 0, 0, 0],
          backgroundColor: ['#B0E6FF', '#B0E6FF', '#B0E6FF', '#B0E6FF', '#B0E6FF', '#B0E6FF', '#B0E6FF'],
          barThickness: 20,
          borderWidth: 2,
          borderRadius: 10,
        },
        {
          label: 'Delegation',
          data: [0, 0, 0, 0, 0, 0, 0],
          backgroundColor: ['#5EBFF5', '#5EBFF5', '#5EBFF5', '#5EBFF5', '#5EBFF5', '#5EBFF5', '#5EBFF5'],
          barThickness: 20,
          borderWidth: 2,
          borderRadius: 10,
        },
      ];

      var i, j, totalIceEarned = 0, totalXpEarned = 0, history = [];
      for (i = response.length - 1; i >= 0; i--) {
        var gamePlayIceEarned = 0, gamePlayXpEarned = 0, delegationIceEarned = 0, delegationXpEarned = 0;
        const day = moment(new Date(response[i].day));
        const xAxisIndex = day.diff(todayMoment, 'days') + 6;

        // get GamePlay
        if (response[i].gameplay && Object.keys(response[i].gameplay).length !== 0) {
          gamePlayIceEarned += response[i].gameplay.iceEarnedPlayer;
          gamePlayXpEarned = response[i].gameplay.xpEarned;
        }
        // get Delegation
        for (j = 0; j < response[i].delegation.length; j++) {
          delegationIceEarned += response[i].delegation[j].iceEarnedDelegator;
          delegationXpEarned += response[i].delegation[j].xpEarned;
        }
        totalIceEarned += gamePlayIceEarned + delegationIceEarned;
        totalXpEarned += gamePlayXpEarned + delegationXpEarned;

        // set yAxis data
        datasets[0].data[xAxisIndex] = gamePlayIceEarned;
        datasets[1].data[xAxisIndex] = delegationIceEarned;

        // add Gameplay history
        if (gamePlayIceEarned !== 0 || gamePlayXpEarned !== 0 || Object.keys(response[i].gameplay).length !== 0) {
          history.push({
            date: moment(response[i].day).format('MM/DD/YY'),
            type: 'Gameplay',
            iceEarned: gamePlayIceEarned,
            xpEarned: gamePlayXpEarned,
            records: Object.keys(response[i].gameplay).length !== 0 ? [].concat(response[i].gameplay) : []
          })
        }

        // add Delegation history
        if (delegationIceEarned !== 0 || delegationXpEarned !== 0 || response[i].delegation.length > 0) {
          history.push({
            date: moment(response[i].day).format('MM/DD/YY'),
            type: 'Delegation',
            iceEarned: delegationIceEarned,
            xpEarned: delegationXpEarned,
            records: response[i].delegation
          })
        }
      }

      setIceEarned(totalIceEarned);
      setXpEarned(totalXpEarned);
      setStatsUSDY(datasets);
      setHistory(history);
      setLoading(false);
    }
  }, [state.userStatus]);

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
        setTotalICE(0);
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
      {!state.userStatus ? (
        <div className={styles.fullWidth}>
          <FoxAnimation />
        </div>
      ) : (
        <div className={styles.main_wrapper}>
          <div className={styles.topDiv}>
            <div className={styles.claimICEDiv}>
              <div className={styles.title}>
                <h1>Claim ICE Rewards</h1>
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
                    <p className={styles.ICE_value}>{totalICE}</p>
                    <img
                      style={{ marginTop: '-4px' }}
                      src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg"
                    />
                  </div>
                  <p className={styles.price}>
                    ${formatPrice(totalICE * state.DGPrices.ice, 2)}
                  </p>
                </div>

                <Button
                  className={cn(styles.claim_ICE, styles.lower_button)}
                  onClick={() => claimTokens()}
                  disabled={clicked}
                >
                  {!clicked ? (
                    <>Claim {formatPrice(totalICE, 0)} ICE</>
                  ) : (
                    <SpinnerAnimation />
                  )}
                </Button>
              </div>
            </div>

            <div className={styles.iceEarnedDiv}>
              <div className={styles.title}>
                <h1>ICE Earned (past 7 Days)</h1>
              </div>
              <div className={styles.graph}>
                {loading ?
                  <div style={{ marginTop: '50px' }}>
                    <HourglassAnimation />
                  </div>
                  :
                  <>
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
                          <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                          {iceEarned} ICE
                        </div>
                        <div className={styles.xp}>
                          <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_XP_ICN_f9w2se.svg" alt="xp" />
                          {xpEarned} XP
                        </div>
                      </div>
                    </div>
                  </>
                }
              </div>
            </div>
          </div>
          <div className={styles.history}>
            <div className={styles.title}>
              <h1>ICE Reward History</h1>
            </div>
            {loading ?
              <Table fixed unstackable style={{ marginBottom: '0px' }}>
                <Table.Header>
                  <Table.Row>
                    <HourglassAnimation />
                  </Table.Row>
                </Table.Header>
              </Table>
              : iceRewardHistory && iceRewardHistory.length > 0 ?
                <>
                  <Table fixed unstackable style={{ marginBottom: '0px' }}>
                    <Table.Header>
                      <Table.Row>
                        {isTablet && (
                          <Table.HeaderCell style={{ width: '15%' }}>
                            Date
                          </Table.HeaderCell>
                        )}
                        <Table.HeaderCell style={{ width: '18%' }}>
                          Type
                        </Table.HeaderCell>
                        <Table.HeaderCell style={{ width: '18%' }}>
                          ICE Earned
                        </Table.HeaderCell>
                        <Table.HeaderCell style={{ width: '18%' }}>
                          XP Earned
                        </Table.HeaderCell>
                        {isTablet && (
                          <Table.HeaderCell style={{ width: '30%' }}>
                            Breakdown
                          </Table.HeaderCell>
                        )}
                      </Table.Row>
                    </Table.Header>
                  </Table>
                  <Table fixed unstackable>
                    <Table.Body>
                      {iceRewardHistory.map((row, i) => {
                        let style = '';
                        {
                          i % 2 === 0
                            ? (style = 'rgba(255, 255, 255, 0.08)')
                            : (style = 'black');
                        }
                        return (
                          <Table.Row key={i} style={{ background: style }}>
                            {isTablet && (
                              <Table.Cell style={{ width: '15%' }}>
                                {row.date}
                              </Table.Cell>
                            )}
                            <Table.Cell style={{ width: '18%' }}>
                              {row.type}
                            </Table.Cell>
                            <Table.Cell className={styles.iceEarned} style={{ width: '18%' }}>
                              <div className={styles.earnedDiv}>{row.iceEarned.toLocaleString()}</div>
                              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                            </Table.Cell>
                            <Table.Cell className={styles.xpEarned} style={{ width: '18%' }}>
                              <div className={styles.earnedDiv}>{row.xpEarned.toLocaleString()}</div>
                              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_XP_ICN_f9w2se.svg" alt="xp" />
                            </Table.Cell>
                            {isTablet && (
                              <Table.Cell style={{ width: '30%', textAlign: 'right' }}>
                                <Button
                                  className={styles.breakdown}
                                  onClick={() => setShowingBreakDown(i)}
                                  disabled={row.records && row.records.length > 0 ? false : true}
                                >
                                  See Complete Breakdown
                                </Button>
                              </Table.Cell>
                            )}
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table>
                </>
                :
                <div style={{ marginTop: '50px' }}>
                  <EmptyResultAnimation />
                </div>
            }
          </div>

          {showBreakDown !== -1 ? (
            <ModalIceBreakdown
              history={iceRewardHistory[showBreakDown]}
              setShowingBreakDown={setShowingBreakDown}
            />
          ) : null}
        </div>
      )}
    </>
  );
};

export default IceRewards;
