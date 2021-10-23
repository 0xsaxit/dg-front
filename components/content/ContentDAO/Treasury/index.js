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
import styles from './Treasury.module.scss';
import TooltipOne from 'components/tooltips/TreasuryTooltipDG/index.js';
import TooltipTwo from 'components/tooltips/TreasuryTooltipGameplay/index.js';
import TooltipThree from 'components/tooltips/TreasuryTooltipLP/index.js';


const Treasury = props => {
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
  const [dgTreasury, setDgTreasury] = useState(0);
  const [dgTreasuryPercent, setDgTreasuryPercent] = useState(0);
  const [landTreasury, setLandTreasury] = useState(0);
  const [landTreasuryPercent, setLandTreasuryPercent] = useState(0);
  const [nftTreasury, setNftTreasury] = useState(0);
  const [nftTreasuryPercent, setNftTreasuryPercent] = useState(0);
  const [liquidityTreasury, setLiquidityTreasury] = useState(0);
  const [liquidityTreasuryPercent, setLiquidityTreasuryPercent] = useState(0);
  const [maticTreasury, setMaticTreasury] = useState(0);
  const [maticTreasuryPercent, setMaticTreasuryPercent] = useState(0);
  const [maticTokens, setMaticTokens] = useState(0);
  const [visible, setVisible] = useState(true);
  const [unvestedDG, setUnvestedDG] = useState(0);
  const [wearableSales, setWearableSales] = useState(0);

  /// temp percentages
  const [gameplayHotPercent, setGameplayHotPercent] = useState(0);
  const [dgPercent, setDgPercent] = useState(0);
  const [lpPercent, setLpPercent] = useState(0);

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
      for (i = 0; i < usd.length; i += 4) {
        let temp_x = new Date(usd[i].primary);
        let temp_x2 = temp_x.toDateString();
        xAxis.push(temp_x2.slice(0, 1));
      }
      xAxis.push(0);

      let yAxis = [];
      let j;
      for (j = 0; j < usd.length; j += 4) {
        let temp_y = usd[j].secondary;
        yAxis.push(temp_y / 1000000);
      }
      yAxis.push(17.81);
      setStatsUSDX(xAxis);
      setStatsUSDY(yAxis);

      const totalUSD = state.treasuryNumbers.totalBalanceUSD.graph;
      const api_usd = Number(totalUSD.slice(-1)[0].secondary);
      const gameplay_ice = Number(state.DGBalances.BALANCE_ICE * state.DGPrices.ice);
      const unclaimed_1 = Number(state.DGBalances.UNVESTED_DG_1);
      const unclaimed_2 = Number(state.DGBalances.BALANCE_UNCLAIMED);
      const unvested_amount = (unclaimed_1 + unclaimed_2);
      const unvested_price = (unvested_amount * state.DGPrices.dg);
      const usdc = Number(state.DGBalances.USDC_BALANCE_LP);
      const ice = Number(state.DGBalances.ICE_BALANCE_LP * state.DGPrices.ice);
      const lp = (usdc + ice);
      const wearable_sales = Number(state.DGBalances.BALANCE_WETH_WEARABLES * state.DGPrices.eth);
      setWearableSales(props.formatPrice(wearable_sales, 0));

      const new_total = (api_usd + gameplay_ice + unvested_price + lp + wearable_sales);
      setTreasuryTotal(props.formatPrice(new_total, 0));

      const temp_start = totalUSD[0].secondary;
      const temp_end = new_total;
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
      const gameplay_old = Number(gameplay.graph.slice(-1)[0].secondary);
      const gameplay_new = (gameplay_old + gameplay_ice);
      setGameplayTreasury(
        props.formatPrice(gameplay_new, 0)
      );

      const gameplay_temp = gameplay.changes.weekly.percent.toFixed(2);
      setGameplayTreasuryPercent(Number(gameplay_temp));

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
      setDgTreasury(Number(dg.graph.slice(-1)[0].secondary));
      const totalDgWallet = (dgTreasury + unvested_price);
      setUnvestedDG(props.formatPrice(totalDgWallet, 0));

      const dg_temp = dg.changes.weekly.percent.toFixed(2);
      setDgTreasuryPercent(Number(dg_temp));

      const liq = state.treasuryNumbers.totalLiquidityProvided;
      const old_liq = Number(liq.graph.slice(-1)[0].secondary);
      const new_lp = (old_liq + lp);
      setLiquidityTreasury(
        props.formatPrice(new_lp, 0)
      );

      const liq_temp = liq.changes.weekly.percent.toFixed(2);
      setLiquidityTreasuryPercent(Number(liq_temp));

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

      //////////////////////////////////////////////////////////////////////
      // temporary percentages for dg wallet, gameplay hot wallet, and lp //
      //////////////////////////////////////////////////////////////////////
      const gameplay_percent = ((gameplay_new - gameplay_old) / gameplay_old) * 100;
      setGameplayHotPercent(gameplay_percent.toFixed(2));

      const dg_percent = ((totalDgWallet - dgTreasury) / dgTreasury) * 100;
      setDgPercent(dg_percent.toFixed(2));

      const lp_percent = ((new_lp - old_liq) / old_liq) * 100;
      setLpPercent(lp_percent.toFixed(2));

    }
  }, [state.treasuryNumbers, 
      state.DGBalances.UNVESTED_DG_1, 
      state.DGBalances.BALANCE_UNCLAIMED, 
      state.DGBalances.BALANCE_ICE,
      state.DGBalances.USDC_BALANCE_LP,
      state.DGBalances.ICE_BALANCE_LP,
      state.DGBalances.BALANCE_WETH_WEARABLES,
      dgTreasury
    ]);

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
        borderColor: '#67DD6C',
        borderWidth: 6,
        data: statsUSDY,
      },
    ],
  };

  return (
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
                      autoSkipPadding: 70,
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
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <p className={styles.stat_header}>Gameplay Hot Wallet</p>
            <TooltipTwo />
          </span>
          <div className="d-flex justify-content-center">
            <div>
              {gameplayTreasury ? (
                <p className={styles.stat_amount}>${gameplayTreasury}</p>
              ) : (
                getLoader()
              )}
            </div>
            <p className={styles.stat_percent}>
              {gameplayHotPercent > 0 && gameplayTreasury ? (
                <p className={styles.earned_percent_pos}>
                  +{gameplayHotPercent}%
                </p>
              ) : gameplayTreasury ? (
                <p className={styles.earned_percent_neg}>
                  {gameplayHotPercent}%
                </p>
              ) : null}
            </p>
          </div>
        </div>

        <div className={styles.stat}>
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <p className={styles.stat_header}>$DG Wallet</p>
            <TooltipOne />
          </span>
          <div className="d-flex justify-content-center">
            <div>
              {unvestedDG ? (
                <p className={styles.stat_amount}>${unvestedDG}</p>
              ) : (
                getLoader()
              )}
            </div>
            <p className={styles.stat_percent}>
              {dgPercent > 0 && dgTreasury ? (
                <p className={styles.earned_percent_pos}>
                  +{dgPercent}%
                </p>
              ) : dgTreasury ? (
                <p className={styles.earned_percent_neg}>
                  {dgPercent}%
                </p>
              ) : null}
            </p>
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.new_stat}>
            <p className={styles.new}> new </p>
          </div>
          <p className={styles.stat_header}>ICE Wearable Sales</p>
          <div className="d-flex justify-content-center">
            <div>
              {wearableSales ? (
                <p className={styles.stat_amount}>${wearableSales}</p>
              ) : (
                getLoader()
              )}
            </div>
            {/*<p className={styles.stat_percent}>
              {maticTreasuryPercent > 0 && maticTreasury ? (
                <p className={styles.earned_percent_pos}>
                  +{maticTreasuryPercent}%
                </p>
              ) : maticTreasury ? (
                <p className={styles.earned_percent_neg}>
                  {maticTreasuryPercent}%
                </p>
              ) : null}
            </p>*/}
            <p className={styles.stat_percent}>
              <p className={styles.earned_percent_pos}>
                +100%
              </p>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.stats_container}>
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
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <p className={styles.stat_header}>Liquidity Provided</p>
            <TooltipThree />
          </span>
          <div className="d-flex justify-content-center">
            <div>
              {liquidityTreasury ? (
                <p className={styles.stat_amount}>${liquidityTreasury}</p>
              ) : (
                getLoader()
              )}
            </div>
            <p className={styles.stat_percent}>
              {lpPercent > 0 && liquidityTreasury ? (
                <p className={styles.earned_percent_pos}>
                  +{lpPercent}%
                </p>
              ) : liquidityTreasury ? (
                <p className={styles.earned_percent_neg}>
                  {lpPercent}%
                </p>
              ) : null}
            </p>
          </div>
        </div>

        <div className={styles.stat}>
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
      </div>

    </div>
  );
};

export default Treasury;
