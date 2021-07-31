import cn from 'classnames';
import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from '../../../../store';
import { Loader, Popup, Icon, Button, Table } from 'semantic-ui-react';
import { Line } from 'react-chartjs-2';
import Aux from '../../../_Aux';
import styles from './Overview.module.scss';

const Overview = (props) => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [dgBalance, setDgBalance] = useState(0);
  const [treasuryTotal, setTreasuryTotal] = useState(0);
  const [statsUSDX, setStatsUSDX] = useState([]);
  const [statsUSDY, setStatsUSDY] = useState([]);
  const [gameplayTreasury, setGameplayTreasury] = useState(0);
  const [gameplayTreasuryPercent, setGameplayTreasuryPercent] = useState(0);
  const [weeklyChange, setWeeklyChange] = useState(0);
  const [dgTreasury, setDgTreasury] = useState(0);
  const [dgTreasuryPercent, setDgTreasuryPercent] = useState(0);
  const [landTreasury, setLandTreasury] = useState(0);
  const [landTreasuryPercent, setLandTreasuryPercent] = useState(0);

  function formatPrice(balanceDG, units) {
    const priceFormatted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return priceFormatted;
  }

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
      setTreasuryTotal(formatPrice(totalUSD.slice(-1)[0].secondary, 0));

      const temp_start = totalUSD[0].secondary;
      const temp_end = totalUSD.slice(-1)[0].secondary;
      const change = temp_end - temp_start;
      setWeeklyChange(change);

      const gameplay = state.treasuryNumbers.totalGameplayUSD;
      setGameplayTreasury(
        formatPrice(gameplay.graph.slice(-1)[0].secondary, 0)
      );

      const gameplay_temp = gameplay.changes.weekly.percent.toFixed(2);
      setGameplayTreasuryPercent(Number(gameplay_temp));

      const dg = state.treasuryNumbers.totalDgUSD;
      setDgTreasury(formatPrice(dg.graph.slice(-1)[0].secondary, 0));

      const dg_temp = dg.changes.weekly.percent.toFixed(2);
      setDgTreasuryPercent(Number(dg_temp));

      const land = state.treasuryNumbers.totalLandUSD;
      setLandTreasury(formatPrice(land.graph.slice(-1)[0].secondary, 0));

      const land_temp = land.changes.weekly.percent.toFixed(2);
      setLandTreasuryPercent(Number(land_temp));
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

  function getLoader() {
    return (
      <Table.Cell textAlign="right">
        <Loader active inline size="small" className="treasury-loader" />
      </Table.Cell>
    );
  }

  const weekly = {
    labels: statsUSDX,
    datasets: [
      {
        fill: true,
        lineTension: 0.5,
        backgroundColor: '#000000',
        borderColor: '#16c784',
        borderWidth: 4,
        data: statsUSDY,
      },
    ],
  };

  return (
    <Aux>
      <div className={styles.overview_container}>
        <div className={styles.container_left}>
          <p className={styles.welcome_text}>
            Welcome Name,
          </p>
          <h1 className={styles.dashboard_text}>
            Your DAO Dashboard
          </h1>
        </div>

        <div className={styles.treasury_container} >

          <div className={styles.treasury_header}>
            <p className={styles.treasury_title}>
              Treasury Weekly
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <p className={styles.treasury_total}>
                ${treasuryTotal}
              </p>
              {getWeeklyChange()}
            </div>
          </div> 

          <div style={{ display: 'flex' }}>
            <span className={styles.treasury_graph}>
              <Line
                height={150}
                data={weekly}
                options={{
                  maintainAspectRatio: false,
                  title: { display: false },
                  legend: { display: false },
                  scales: {
                    xAxes: [{
                        display: true,
                        ticks: {
                            autoSkip: true,
                            autoSkipPadding: 60,
                            maxRotation: 0,
                            minRotation: 0
                        }
                    }],
                    yAxes: [{
                        display: true,
                        ticks: {
                            autoSkip: true,
                            autoSkipPadding: 22,
                            maxRotation: 0,
                            minRotation: 0
                        }
                    }],
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
              <p className={styles.stat_header}>
                Gameplay Wallet 
              </p>
              <div style={{ display: 'flex' }}>
                <div>
                  {gameplayTreasury ? (
                    <p className={styles.stat_amount}>
                      ${gameplayTreasury}
                    </p>
                  ) : (
                    getLoader()
                  )}
                </div>
                <p className={styles.stat_percent}>
                  {gameplayTreasuryPercent > 0 && gameplayTreasury ? (
                    <p className={styles.earned_percent_pos}>+{gameplayTreasuryPercent}%</p>
                  ) : gameplayTreasury ? (
                    <p className={styles.earned_percent_neg}>-{gameplayTreasuryPercent}%</p>
                  ) : (
                    getLoader()
                  )}
                </p>
              </div>
            </div>

            <div className={styles.stat}>
              <p className={styles.stat_header}>
                $DG Wallet 
              </p>
              <div style={{ display: 'flex' }}>
                <div>
                  {dgTreasury ? (
                    <p className={styles.stat_amount}>
                      ${dgTreasury}
                    </p>
                  ) : (
                    getLoader()
                  )}
                </div>
                <p className={styles.stat_percent}>
                  {dgTreasuryPercent > 0 && dgTreasury ? (
                    <p className={styles.earned_percent_pos}>+{dgTreasuryPercent}%</p>
                  ) : dgTreasury ? (
                    <p className={styles.earned_percent_neg}>-{dgTreasuryPercent}%</p>
                  ) : (
                    getLoader()
                  )}
                </p>
              </div>
            </div>

            <div className={styles.stat}>
              <p className={styles.stat_header}>
                DCL Land
              </p>
              <div style={{ display: 'flex' }}>
                <div>
                  {landTreasury ? (
                    <p className={styles.stat_amount}>
                      ${landTreasury}
                    </p>
                  ) : (
                    getLoader()
                  )}
                </div>
                <p className={styles.stat_percent}>
                  {landTreasuryPercent > 0 && landTreasury ? (
                    <p className={styles.earned_percent_pos}>+{landTreasuryPercent}%</p>
                  ) : landTreasury ? (
                    <p className={styles.earned_percent_neg}>-{landTreasuryPercent}%</p>
                  ) : (
                    getLoader()
                  )}
                </p>
              </div>
            </div>

            <Button 
              className={styles.stat_button} 
              href="/dg/treasury"
            >
              See All 
              <svg style={{ marginLeft: '4px' }} width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.29492 5.47461C6.29004 5.21582 6.20215 5.01074 5.99219 4.80566L2.31543 1.21191C2.15918 1.06055 1.97852 0.982422 1.75391 0.982422C1.30469 0.982422 0.933594 1.34863 0.933594 1.79297C0.933594 2.01758 1.02637 2.22266 1.19727 2.39355L4.38086 5.46973L1.19727 8.55566C1.02637 8.72168 0.933594 8.92676 0.933594 9.15625C0.933594 9.60059 1.30469 9.9668 1.75391 9.9668C1.97363 9.9668 2.15918 9.89355 2.31543 9.7373L5.99219 6.14355C6.20215 5.93848 6.29492 5.72852 6.29492 5.47461Z" fill="white"/>
              </svg>
            </Button>
          </div>

        </div> 
      </div>
    </Aux>
  );
}

export default Overview;