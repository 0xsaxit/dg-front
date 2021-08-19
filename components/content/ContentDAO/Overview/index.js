import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import axios from 'axios';
import { Loader, Popup, Icon, Button, Table } from 'semantic-ui-react';
import { Line } from 'react-chartjs-2';
import { GlobalContext } from 'store';
import MetaTx from 'common/MetaTx';
import Global from 'components/Constants';
import Transactions from 'common/Transactions';
import styles from './Overview.module.scss';

const Overview = props => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const router = useRouter();

  // define local variables
  const [dgBalance, setDgBalance] = useState(0);
  const [treasuryTotal, setTreasuryTotal] = useState(0);
  const [statsUSDX, setStatsUSDX] = useState([]);
  const [statsUSDY, setStatsUSDY] = useState([]);
  const [gameplayTreasury, setGameplayTreasury] = useState(0);
  const [gameplayTreasuryPercent, setGameplayTreasuryPercent] = useState(0);
  const [weeklyChange, setWeeklyChange] = useState(0);
  const [gameplayAll, setGameplayAll] = useState(0);
  const [gameplayAllPercent, setGameplayAllPercent] = useState(0);
  const [manaBalance, setManaBalance] = useState(0);
  const [daiBalance, setDaiBalance] = useState(0);
  const [usdtBalance, setUSDTBalance] = useState(0);
  const [atriBalance, setAtriBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [dgTreasury, setDgTreasury] = useState(0);
  const [dgTreasuryPercent, setDgTreasuryPercent] = useState(0);
  const [landTreasury, setLandTreasury] = useState(0);
  const [landTreasuryPercent, setLandTreasuryPercent] = useState(0);
  const [nftTreasury, setNftTreasury] = useState(0);
  const [nftTreasuryPercent, setNftTreasuryPercent] = useState(0);
  const [liquidityTreasury, setLiquidityTreasury] = useState(0);
  const [liquidityTreasuryPercent, setLiquidityTreasuryPercent] = useState(0);
  const [uniTreasury, setUniTreasury] = useState(0);
  const [mviTreasury, setMviTreasury] = useState(0);
  const [maticTreasury, setMaticTreasury] = useState(0);
  const [maticTreasuryPercent, setMaticTreasuryPercent] = useState(0);
  const [maticTokens, setMaticTokens] = useState(0);

  const [snapshotOne, setSnapshotOne] = useState([]);
  const [dateOne, setDateOne] = useState('');
  const [activeOne, setActiveOne] = useState('');
  const [IDOne, setIDOne] = useState('');

  const [snapshotTwo, setSnapshotTwo] = useState([]);
  const [dateTwo, setDateTwo] = useState('');
  const [activeTwo, setActiveTwo] = useState('');
  const [IDTwo, setIDTwo] = useState('');

  const [snapshotThree, setSnapshotThree] = useState([]);
  const [dateThree, setDateThree] = useState('');
  const [activeThree, setActiveThree] = useState('');
  const [IDThree, setIDThree] = useState('');

  const [currentDate, setCurrentDate] = useState('');
  const [visible, setVisible] = useState(true);

  function formatPrice(balanceDG, units) {
    const priceFormatted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return priceFormatted;
  }

  useEffect(() => {
    (async () => {
      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API_1,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy);

      const snapshotData = await axios.post(
        `https://hub.snapshot.org/graphql`,
        {
          query: `{
            proposals (
              first: 3,
              skip: 0,
              where: {
                space_in: ["decentralgames.eth"],
                state: ""
              },
              orderBy: "created",
              orderDirection: desc
            ) {
              id
              title
              body
              choices
              start
              end
              snapshot
              state
              author
              space {
                id
                name
              }
            }
          }`,
        }
      );

      console.log('!!!');
      console.log(snapshotData);

      setSnapshotOne(snapshotData.data.data.proposals[0]);
      setSnapshotTwo(snapshotData.data.data.proposals[1]);
      setSnapshotThree(snapshotData.data.data.proposals[2]);
    })();
  }, []);

  useEffect(() => {
    const temp = new Date(snapshotOne.end * 1000);
    setDateOne(temp.toDateString());
    setIDOne(snapshotOne.id);

    const temp_two = new Date(snapshotTwo.end * 1000);
    setDateTwo(temp_two.toDateString());
    setIDTwo(snapshotTwo.id);

    const temp_three = new Date(snapshotThree.end * 1000);
    setDateThree(temp_three.toDateString());
    setIDThree(snapshotThree.id);

    var today = new Date();

    if (temp < today) {
      setActiveOne(true);
    }

    if (temp_two < today) {
      setActiveTwo(true);
    }

    if (temp_three < today) {
      setActiveThree(true);
    }
  }, [snapshotOne, snapshotTwo, snapshotThree, currentDate]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // use for both the graph and the stats
  // that'll just be week? to match discord bot 'in the past week'
  // that data will include the percent changes for both daily/weekly in the changes object
  // call .weekly to match labels
  useEffect(() => {
    if (Object.keys(state.treasuryNumbers).length !== 0) {
      const usd = state.treasuryNumbers.totalBalanceUSD.graph;
      let xAxis = [];
      let i;
      for (i = 0; i < usd.length; i += 7) {
        let temp_x = new Date(usd[i].primary);
        let temp_x2 = temp_x.toDateString();
        xAxis.push(temp_x2.slice(0, 1));
      }

      let yAxis = [];
      let j;
      for (j = 0; j < usd.length; j += 7) {
        let temp_y = usd[j].secondary;
        yAxis.push(temp_y / 1000000);
      }
      setStatsUSDX(xAxis);
      setStatsUSDY(yAxis);

      const totalUSD = state.treasuryNumbers.totalBalanceUSD.graph;
      setTreasuryTotal(props.formatPrice(totalUSD.slice(-1)[0].secondary, 0));

      const temp_start = totalUSD[0].secondary;
      const temp_end = totalUSD.slice(-1)[0].secondary;
      const change = temp_end - temp_start;
      setWeeklyChange(change);

      const gameplayTotal = state.treasuryNumbers.allTimeGameplayUSD;
      setGameplayAll(
        props.formatPrice(gameplayTotal.graph.slice(-1)[0].secondary, 0)
      );

      const gameplayTotal_temp =
        gameplayTotal.changes.weekly.percent.toFixed(2);
      setGameplayAllPercent(Number(gameplayTotal_temp));

      const gameplay = state.treasuryNumbers.totalGameplayUSD;
      setGameplayTreasury(
        props.formatPrice(gameplay.graph.slice(-1)[0].secondary, 0)
      );

      const gameplay_temp = gameplay.changes.weekly.percent.toFixed(2);
      setGameplayTreasuryPercent(Number(gameplay_temp));

      const mana = state.treasuryNumbers.manaBalance.graph;
      setManaBalance(props.formatPrice(mana.slice(-1)[0].secondary, 0));

      const dai = state.treasuryNumbers.daiBalance.graph;
      setDaiBalance(props.formatPrice(dai.slice(-1)[0].secondary, 0));

      const usdt = 149746;
      setUSDTBalance(props.formatPrice(usdt, 0));

      const atri = state.treasuryNumbers.atriBalance.graph;
      setAtriBalance(props.formatPrice(atri.slice(-1)[0].secondary, 0));

      const eth = state.treasuryNumbers.ethBalance.graph;
      setEthBalance(props.formatPrice(eth.slice(-1)[0].secondary, 3));

      const land = state.treasuryNumbers.totalLandUSD;
      setLandTreasury(props.formatPrice(land.graph.slice(-1)[0].secondary, 0));

      const land_temp = land.changes.weekly.percent.toFixed(2);
      setLandTreasuryPercent(Number(land_temp));

      const wearables = state.treasuryNumbers.totalWearablesUSD;
      setNftTreasury(
        props.formatPrice(wearables.graph.slice(-1)[0].secondary, 0)
      );

      const wearables_temp = wearables.changes.weekly.percent.toFixed(2);
      setNftTreasuryPercent(Number(wearables_temp));

      const dg = state.treasuryNumbers.totalDgUSD;
      setDgTreasury(props.formatPrice(dg.graph.slice(-1)[0].secondary, 0));

      const dg_temp = dg.changes.weekly.percent.toFixed(2);
      setDgTreasuryPercent(Number(dg_temp));

      const liq = state.treasuryNumbers.totalLiquidityProvided;
      setLiquidityTreasury(
        props.formatPrice(liq.graph.slice(-1)[0].secondary, 0)
      );

      const liq_temp = liq.changes.weekly.percent.toFixed(2);
      setLiquidityTreasuryPercent(Number(liq_temp));

      const uni = state.treasuryNumbers.totalDgEthUniswapBalance;
      setUniTreasury(props.formatPrice(uni.graph.slice(-1)[0].secondary, 0));

      const mvi = state.treasuryNumbers.totalMviEthLPBalance;
      setMviTreasury(props.formatPrice(mvi.graph.slice(-1)[0].secondary, 0));

      const maticBal = state.treasuryNumbers.totalMaticUSD;
      setMaticTreasury(
        props.formatPrice(maticBal.graph.slice(-1)[0].secondary, 0)
      );

      const maticTemp = state.treasuryNumbers.maticBalance.graph
        .slice(-1)[0]
        .secondary.toFixed(0);
      setMaticTokens(maticTemp);

      const matic_temp = maticBal.changes.weekly.percent.toFixed(2);
      setMaticTreasuryPercent(Number(matic_temp));

      const dgbal = state.treasuryNumbers.dgBalance.graph;
      setDgBalance(props.formatPrice(dgbal.slice(-1)[0].secondary, 0));
    }
  }, [state.treasuryNumbers]);


  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function getWeeklyChange() {
    return (
      <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {weeklyChange > 0 && treasuryTotal ? (
          <span
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '-6px',
              paddingBottom: '9px',
            }}
          >
            <p className={styles.earned_percent_pos}>
              +$
              {weeklyChange.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </p>
            <p className={styles.earned_text}>this week</p>
          </span>
        ) : treasuryTotal ? (
          <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <p className={styles.earned_percent_neg}>
              -$
              {(weeklyChange * -1)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </p>
            <p className={styles.earned_text}>this week</p>
          </span>
        ) : null}
      </span>
    );
  }

  async function metaTransaction() {
    try {
      console.log('Dispatching DG tokens to address: ' + state.userAddress);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = pointerContractNew.methods
        .distributeTokensForPlayer(state.userAddress)
        .encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(
        7,
        functionSignature,
        pointerContractNew,
        state.userAddress,
        window.ethereum
      );

      if (txHash === false) {
        console.log('Biconomy meta-transaction failed');
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        // update global state BPT balances
        const refresh = !state.refreshBalances;

        dispatch({
          type: 'refresh_balances',
          data: refresh,
        });
      }
    } catch (error) {
      console.log('Biconomy meta-transaction error: ' + error);
    }
  }

  function getLoader() {
    return (
      <Table.Cell textAlign="right">
        <Loader active inline size="small" className="treasury-loader" />
      </Table.Cell>
    );
  }

  function showDiv() {
    return (
      <div className={styles.blue_container}>
        <div className={styles.blue_text}>
          <p className={styles.blue_header}>
            Stake $DG to earn <br /> and ‘Be The House’
          </p>
          <p className={styles.blue_lower}>
            By staking $DG, you can govern the treasury, add proposals, and earn
            yield.
          </p>
          <Button 
            className={styles.blue_button}
            onClick={() => {
              router.push('/dg/liquidity');
            }}>Start Staking $DG
          </Button>
        </div>
        <img
          className={styles.blue_img}
          src="https://res.cloudinary.com/dnzambf4m/image/upload/v1627992941/Bitcoin_Dashboard_mhyajb.png"
        />
        <div className={styles.close_button} onClick={() => setVisible(false)}>
          <svg
            width="14"
            height="13"
            viewBox="0 0 14 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.18262 10.8501C0.772461 11.2676 0.750488 12.0366 1.19727 12.4761C1.64404 12.9229 2.40576 12.9082 2.82324 12.4907L6.9541 8.35986L11.0776 12.4834C11.5098 12.9229 12.2568 12.9155 12.6963 12.4688C13.1431 12.0293 13.1431 11.2822 12.7109 10.8501L8.5874 6.72656L12.7109 2.5957C13.1431 2.16357 13.1431 1.4165 12.6963 0.977051C12.2568 0.530273 11.5098 0.530273 11.0776 0.962402L6.9541 5.08594L2.82324 0.955078C2.40576 0.544922 1.63672 0.522949 1.19727 0.969727C0.757812 1.4165 0.772461 2.17822 1.18262 2.5957L5.31348 6.72656L1.18262 10.8501Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    );
  }

  const weekly = {
    labels: statsUSDX,
    datasets: [
      {
        fill: true,
        lineTension: 0.5,
        backgroundColor: '#000000',
        borderColor: '#67DD6C',
        borderWidth: 6,
        data: statsUSDY,
      },
    ],
  };

  return (
    <div>
      <div className={cn('row', styles.main_wrapper)}>
        <div className={cn('col-xl-8', styles.overview_container)}>
          <div className={styles.container_left}>
            {state.userInfo.name === null || state.userInfo.name === '' ? (
              <p className={styles.welcome_text}>Welcome,</p>
            ) : (
              <p className={styles.welcome_text}>Welcome {state.userInfo.name},</p>
            )}
            <h1 className={styles.dashboard_text}>Your DAO Dashboard</h1>
          </div>

          {visible ? showDiv() : null}

          <div className={styles.treasury_container}>
            <div className={styles.treasury_header}>
              <p className={styles.treasury_title}>Treasury Weekly</p>
              <div className="d-flex flex-column align-end">
                <p className={styles.treasury_total}>${treasuryTotal}</p>
                {getWeeklyChange()}
              </div>
            </div>

            <div className="d-flex">
              <span className={styles.treasury_graph}>
                <Line
                  height={150}
                  data={weekly}
                  options={{
                    maintainAspectRatio: false,
                    title: { display: false },
                    legend: { display: false },
                    scales: {
                      xAxes: [
                        {
                          display: true,
                          ticks: {
                            autoSkip: true,
                            autoSkipPadding: 60,
                            maxRotation: 0,
                            minRotation: 0,
                          },
                        },
                      ],
                      yAxes: [
                        {
                          display: true,
                          ticks: {
                            autoSkip: true,
                            autoSkipPadding: 22,
                            maxRotation: 0,
                            minRotation: 0,
                          },
                        },
                      ],
                    },
                    elements: {
                      point: { radius: 0 },
                    },
                  }}
                />
              </span>
            </div>

            <div className={styles.stats_container}>
              <div className={styles.stat}>
                <p className={styles.stat_header}>Gameplay Wallet</p>
                <div className="d-flex">
                  <div>
                    {gameplayTreasury ? (
                      <p className={styles.stat_amount}>${gameplayTreasury}</p>
                    ) : (
                      getLoader()
                    )}
                  </div>
                  <p className={styles.stat_percent}>
                    {gameplayTreasuryPercent > 0 && gameplayTreasury ? (
                      <p className={styles.earned_percent_pos}>
                        +{gameplayTreasuryPercent}%
                      </p>
                    ) : gameplayTreasury ? (
                      <p className={styles.earned_percent_neg}>
                        {gameplayTreasuryPercent}%
                      </p>
                    ) : null}
                  </p>
                </div>
              </div>

              <div className={styles.stat}>
                <p className={styles.stat_header}>$DG Wallet</p>
                <div className="d-flex">
                  <div>
                    {dgTreasury ? (
                      <p className={styles.stat_amount}>${dgTreasury}</p>
                    ) : (
                      getLoader()
                    )}
                  </div>
                  <p className={styles.stat_percent}>
                    {dgTreasuryPercent > 0 && dgTreasury ? (
                      <p className={styles.earned_percent_pos}>
                        +{dgTreasuryPercent}%
                      </p>
                    ) : dgTreasury ? (
                      <p className={styles.earned_percent_neg}>
                        {dgTreasuryPercent}%
                      </p>
                    ) : null}
                  </p>
                </div>
              </div>

              <div className={styles.stat}>
                <p className={styles.stat_header}>DCL Land</p>
                <div className="d-flex">
                  <div>
                    {landTreasury ? (
                      <p className={styles.stat_amount}>${landTreasury}</p>
                    ) : (
                      getLoader()
                    )}
                  </div>
                  <p className={styles.stat_percent}>
                    {landTreasuryPercent > 0 && landTreasury ? (
                      <p className={styles.earned_percent_pos}>
                        +{landTreasuryPercent}%
                      </p>
                    ) : landTreasury ? (
                      <p className={styles.earned_percent_neg}>
                        {landTreasuryPercent}%
                      </p>
                    ) : null}
                  </p>
                </div>
              </div>

              <Button className={styles.stat_button} href="/dg/treasury">
                See All&nbsp;&nbsp;
                <svg
                  width="7"
                  height="10"
                  viewBox="0 0 7 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.29492 5.47461C6.29004 5.21582 6.20215 5.01074 5.99219 4.80566L2.31543 1.21191C2.15918 1.06055 1.97852 0.982422 1.75391 0.982422C1.30469 0.982422 0.933594 1.34863 0.933594 1.79297C0.933594 2.01758 1.02637 2.22266 1.19727 2.39355L4.38086 5.46973L1.19727 8.55566C1.02637 8.72168 0.933594 8.92676 0.933594 9.15625C0.933594 9.60059 1.30469 9.9668 1.75391 9.9668C1.97363 9.9668 2.15918 9.89355 2.31543 9.7373L5.99219 6.14355C6.20215 5.93848 6.29492 5.72852 6.29492 5.47461Z"
                    fill="white"
                  />
                </svg>
              </Button>
            </div>
          </div>

          <div
            className={cn(
              'd-flex justify-content-between',
              styles.stake_DG_container
            )}
          >
            <div className={styles.lower}>
              <p className={styles.lower_header}>Stake Your $DG</p>
              <video
                src="https://res.cloudinary.com/dnzambf4m/video/upload/v1626798440/Wallet_1_k0dqit.webm"
                className={styles.lower_img}
                type="video/mp4"
                frameBorder="0"
                autoPlay={true}
                loop
                muted
              ></video>
              <p className={styles.lower_text}>
                Stake $DG to govern the treasury, vote on proposals, and earn
                yields.
              </p>
              <Button
                className={styles.lower_button}
                onClick={() => {
                  router.push('/dg/liquidity');
                }}
              >
                Stake Your DG
              </Button>
            </div>

            <div className={styles.lower}>
              <p className={styles.lower_header_two}>Governance Proposals</p>

              <div className={styles.governance_container}>
                <div className={styles.state_box}>
                  <p className={activeOne ? styles.state_closed : styles.state}>
                    {snapshotOne.state}
                  </p>
                </div>

                <a
                  href={`https://snapshot.org/#/decentralgames.eth/proposal/${IDOne}`}
                  target="_blank"
                >
                  <div className={styles.gov_right}>
                    <div className="d-flex flex-column mr-2" style={{ maxWidth: '150px' }}>
                      <p className={styles.gov_top}>{dateOne}</p>
                      <p className={styles.gov_title}>{snapshotOne.title}</p>
                    </div>
                    <svg
                      width="6"
                      height="10"
                      viewBox="0 0 6 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ display: 'flex', alignSelf: 'center' }}
                    >
                      <path
                        d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977"
                        stroke="white"
                        stroke-width="1.7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </a>
              </div>

              <div className={styles.governance_container}>
                <div className={styles.state_box}>
                  <p className={activeTwo ? styles.state_closed : styles.state}>
                    {snapshotTwo.state}
                  </p>
                </div>

                <a
                  href={`https://snapshot.org/#/decentralgames.eth/proposal/${IDTwo}`}
                  target="_blank"
                >
                  <div className={styles.gov_right}>
                    <div className="d-flex flex-column" style={{ maxWidth: '150px' }}>
                      <p className={styles.gov_top}>{dateTwo}</p>
                      <p className={styles.gov_title}>{snapshotTwo.title}</p>
                    </div>
                    <svg
                      width="6"
                      height="10"
                      viewBox="0 0 6 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ display: 'flex', alignSelf: 'center' }}
                    >
                      <path
                        d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977"
                        stroke="white"
                        stroke-width="1.7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </a>
              </div>

              <div className={styles.governance_container}>
                <div className={styles.state_box}>
                  <p className={activeThree ? styles.state_closed : styles.state}>
                    {snapshotThree.state}
                  </p>
                </div>

                <a
                  href={`https://snapshot.org/#/decentralgames.eth/proposal/${IDThree}`}
                  target="_blank"
                >
                  <div className={styles.gov_right}>
                    <div className="d-flex flex-column" style={{ maxWidth: '150px' }}>
                      <p className={styles.gov_top}>{dateThree}</p>
                      <p className={styles.gov_title}>{snapshotThree.title}</p>
                    </div>
                    <svg
                      width="6"
                      height="10"
                      viewBox="0 0 6 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ display: 'flex', alignSelf: 'center' }}
                    >
                      <path
                        d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977"
                        stroke="white"
                        stroke-width="1.7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </a>
              </div>

              <div className={styles.button_span}>
                <Button
                  className={styles.button_gov}
                  onClick={() => {
                    router.push('/discord');
                  }}
                >
                  Discussion
                </Button>
                <Button
                  className={styles.button_gov}
                  onClick={() => {
                    window.open(
                      'https://snapshot.org/#/decentralgames.eth ',
                      '_blank'
                    );
                  }}
                >
                  Proposals
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className={cn('col-xl-4', styles.sub_profile)}>
          <div className={cn(styles.lower)}>
            <p className={styles.lower_header}>Gameplay Rewards</p>
            <video
              src="https://res.cloudinary.com/dnzambf4m/video/upload/v1626409937/Play_to_Earn_w4deik.webm"
              className={styles.lower_img_gameplay}
              type="video/mp4"
              frameBorder="0"
              autoPlay={true}
              loop
              muted
            ></video>
            <p className={styles.lower_text}>
              All $DG-powered games earn back rewards. Play games and earn up to 50% of expected losses, win or lose.
            </p>
            <Button
              className={styles.lower_button}
              onClick={() => {
                router.push('/dg/mining');
              }}
            >
              Learn More
            </Button>
          </div>

          <div className={cn(styles.lower)}>
            <p className={styles.lower_header}>Liquidity Provision</p>
            <img
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1628854697/image_14_jshx1l.svg"
              className={styles.lower_img}
            />
            <p className={styles.lower_text}>
              Provide liquidity to the ETH-$DG Uniswap pool for yield rewards.
            </p>
            <Button
              className={styles.lower_button}
              onClick={() => {
                router.push('/dg/liquidity');
              }}
            >
              Provide Liquidity
            </Button>
          </div>
        </div>
      </div>






      <div className={styles.treasury_container_mobile}>
        <div className={styles.treasury_header}>
          <p className={styles.treasury_title}>Treasury Weekly</p>
          <div className="d-flex flex-column align-end">
            <p className={styles.treasury_total}>${treasuryTotal}</p>
            {getWeeklyChange()}
          </div>
        </div>

        <div className="d-flex">
          <span className={styles.treasury_graph}>
            <Line
              height={100}
              data={weekly}
              options={{
                maintainAspectRatio: false,
                title: { display: false },
                legend: { display: false },
                scales: {
                  xAxes: [
                    {
                      display: true,
                      ticks: {
                        autoSkip: true,
                        autoSkipPadding: 24,
                        maxRotation: 0,
                        minRotation: 0,
                      },
                    },
                  ],
                  yAxes: [
                    {
                      display: true,
                      ticks: {
                        autoSkip: true,
                        autoSkipPadding: 22,
                        maxRotation: 0,
                        minRotation: 0,
                      },
                    },
                  ],
                },
                elements: {
                  point: { radius: 0 },
                },
              }}
            />
          </span>
        </div>

      <div className={styles.stats_container}>
        <div className={styles.stat}>
          <p className={styles.stat_header}>All Time Game Profits</p>
          <div className="d-flex justify-content-center">
            <div>
              {gameplayAll ? (
                <p className={styles.stat_amount}>${gameplayAll}</p>
              ) : (
                getLoader()
              )}
            </div>
            <p className={styles.stat_percent}>
              {gameplayAllPercent > 0 && gameplayAll ? (
                <p className={styles.earned_percent_pos}>
                  +{gameplayAllPercent}%
                </p>
              ) : gameplayAll ? (
                <p className={styles.earned_percent_neg}>
                  {gameplayAllPercent}%
                </p>
              ) : null}
            </p>
          </div>
        </div>  

        <div className={styles.stat}>
          <p className={styles.stat_header}>Gameplay Hot Wallet</p>
          <div className="d-flex justify-content-center">
            <div>
              {gameplayTreasury ? (
                <p className={styles.stat_amount}>${gameplayTreasury}</p>
              ) : (
                getLoader()
              )}
            </div>
            <p className={styles.stat_percent}>
              {gameplayTreasuryPercent > 0 && gameplayTreasury ? (
                <p className={styles.earned_percent_pos}>
                  +{gameplayTreasuryPercent}%
                </p>
              ) : gameplayTreasury ? (
                <p className={styles.earned_percent_neg}>
                  {gameplayTreasuryPercent}%
                </p>
              ) : null}
            </p>
          </div>
        </div>

        <div className={styles.stat}>
          <p className={styles.stat_header}>$DG Wallet</p>
          <div className="d-flex justify-content-center">
            <div>
              {dgTreasury ? (
                <p className={styles.stat_amount}>${dgTreasury}</p>
              ) : (
                getLoader()
              )}
            </div>
            <p className={styles.stat_percent}>
              {dgTreasuryPercent > 0 && dgTreasury ? (
                <p className={styles.earned_percent_pos}>
                  +{dgTreasuryPercent}%
                </p>
              ) : dgTreasury ? (
                <p className={styles.earned_percent_neg}>
                  {dgTreasuryPercent}%
                </p>
              ) : null}
            </p>
          </div>
        </div>

        <div className={styles.stat}>
          <p className={styles.stat_header}>Decentraland Land</p>
          <div className="d-flex justify-content-center">
            <div>
              {landTreasury ? (
                <p className={styles.stat_amount}>${landTreasury}</p>
              ) : (
                getLoader()
              )}
            </div>
            <p className={styles.stat_percent}>
              {landTreasuryPercent > 0 && landTreasury ? (
                <p className={styles.earned_percent_pos}>
                  +{landTreasuryPercent}%
                </p>
              ) : landTreasury ? (
                <p className={styles.earned_percent_neg}>
                  {landTreasuryPercent}%
                </p>
              ) : null}
            </p>
          </div>
        </div>

        <div className={styles.stat}>
          <p className={styles.stat_header}>$DG Wearables</p>
          <div className="d-flex justify-content-center">
            <div>
              {nftTreasury ? (
                <p className={styles.stat_amount}>${nftTreasury}</p>
              ) : (
                getLoader()
              )}
            </div>
            <p className={styles.stat_percent}>
              {nftTreasuryPercent > 0 && nftTreasury ? (
                <p className={styles.earned_percent_pos}>
                  +{nftTreasuryPercent}%
                </p>
              ) : nftTreasury ? (
                <p className={styles.earned_percent_neg}>
                  {nftTreasuryPercent}%
                </p>
              ) : null}
            </p>
          </div>
        </div>

        <div className={styles.stat}>
          <p className={styles.stat_header}>Liquidity Provided</p>
          <div className="d-flex justify-content-center">
            <div>
              {liquidityTreasury ? (
                <p className={styles.stat_amount}>${liquidityTreasury}</p>
              ) : (
                getLoader()
              )}
            </div>
            <p className={styles.stat_percent}>
              {liquidityTreasuryPercent > 0 && liquidityTreasury ? (
                <p className={styles.earned_percent_pos}>
                  +{liquidityTreasuryPercent}%
                </p>
              ) : liquidityTreasury ? (
                <p className={styles.earned_percent_neg}>
                  {liquidityTreasuryPercent}%
                </p>
              ) : null}
            </p>
          </div>
        </div>

        <div className={styles.stat} style={{ marginBottom: '0px' }}>
          <p className={styles.stat_header}>Staked in Matic Node</p>
          <div className="d-flex justify-content-center">
            <div>
              {maticTreasury ? (
                <p className={styles.stat_amount}>${maticTreasury}</p>
              ) : (
                getLoader()
              )}
            </div>
            <p className={styles.stat_percent}>
              {maticTreasuryPercent > 0 && maticTreasury ? (
                <p className={styles.earned_percent_pos}>
                  +{maticTreasuryPercent}%
                </p>
              ) : maticTreasury ? (
                <p className={styles.earned_percent_neg}>
                  {maticTreasuryPercent}%
                </p>
              ) : null}
            </p>
          </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Overview;
