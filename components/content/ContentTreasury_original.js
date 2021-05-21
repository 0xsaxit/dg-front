import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from '../../store';
import Web3 from 'web3';
import {
  Button,
  Divider,
  Input,
  Loader,
  Popup,
  Icon,
  Table,
} from 'semantic-ui-react';
import Transactions from '../../common/Transactions';
import Aux from '../_Aux';
import Images from '../../common/Images';
import Fetch from '../../common/Fetch';
import Global from '../Constants';
import { Line } from 'react-chartjs-2';

const ContentTreasury = (props) => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [amountInput, setAmountInput] = useState('');
  const [percentGovernanceStaked, setPercentGovernanceStaked] = useState(0);
  const [percentGovernanceContract, setPercentGovernanceContract] = useState(0);
  const [APYGovernance, setAPYGovernance] = useState(0);
  const [priceUSD, setPriceUSD] = useState(0);
  const [stakeContractGovernance, setStakeContractGovernance] = useState({});
  const [DGTokenContract, setDGTokenContract] = useState({});
  const [dgBalance, setDgBalance] = useState(0);
  const [gameplayMana, setGameplayMana] = useState(0);
  const [instances, setInstances] = useState(false);

  // define treasury variables
  const [treasuryTotal, setTreasuryTotal] = useState(0);
  const [statsUSDX, setStatsUSDX] = useState('');
  const [statsUSDY, setStatsUSDY] = useState('');
  const [statsUSDX1, setStatsUSDX1] = useState('');
  const [statsUSDY1, setStatsUSDY1] = useState('');
  const [statsUSDX2, setStatsUSDX2] = useState('');
  const [statsUSDY2, setStatsUSDY2] = useState('');

  const [gameplayTreasury, setGameplayTreasury] = useState(0);
  const [gameplayTreasuryPercent, setGameplayTreasuryPercent] = useState(0);

  const [weeklyChange, setWeeklyChange] = useState(0);

  const [gameplayAll, setGameplayAll] = useState(0);
  const [gameplayAllPercent, setGameplayAllPercent] = useState(0);
  const [gameplayAllStats, setGameplayAllStats] = useState(0);

  const [manaBalance, setManaBalance] = useState(0);
  const [daiBalance, setDaiBalance] = useState(0);
  const [usdtBalance, setUSDTBalance] = useState(0);
  const [atriBalance, setAtriBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);

  const [dgTreasury, setDgTreasury] = useState(0);
  const [dgTreasuryPercent, setDgTreasuryPercent] = useState(0);
  const [treasuryDG, setTreasuryDG] = useState(0);
  const [treasuryDGPercent, setTreasuryDGPercent] = useState(0);

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

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  function length(obj) {
    return Object.keys(obj).length;
  }

  useEffect(() => {
    (async function () {
      // get treasury statistics
      if (
        state.userStatus &&
        state.stakingBalances.BALANCE_STAKED_UNISWAP_TREASURY &&
        state.stakingBalances.BALANCE_CONTRACT_UNISWAP
      ) {
        try {
          const response = await Fetch.ETH_PRICE();
          const json = await response.json();

          const priceETH = json.market_data.current_price.usd;
          const locked_ETH = state.DGBalances.BALANCE_UNISWAP_ETH * priceETH;
          const locked_DG = state.DGBalances.BALANCE_UNISWAP_DG * props.price;
          const total_locked = locked_DG + locked_ETH;

          let response_2 = await Fetch.MANA_PRICE();
          let json_2 = await response_2.json();

          const priceMANA = json_2.market_data.current_price.usd;
          const manaTemp = priceMANA * 400000;
          setGameplayMana(manaTemp);
        } catch (error) {
          console.log('coingecko api error: ' + error);
        }

        // use for both the graph and the stats
        // that'll just be week? to match discord bot 'in the past week'
        // that data will include the percent changes for both daily/weekly in the changes object
        // call .weekly to match labels
        let response_3 = await Fetch.TREASURY_STATS_NUMBERS(state.userAddress);
        let json_3 = await response_3.json();

        let usd = json_3.totalBalanceUSD.graph;
        var xAxis = [];
        var yAxis = [];
        var i;
        var j;

        for (i = 0; i < usd.length; i += 2) {
          var temp_x = new Date(usd[i].primary);
          var temp_x2 = temp_x.toDateString();
          xAxis.push(temp_x2);
        }

        for (j = 0; j < usd.length; j += 2) {
          var temp_y = usd[j].secondary;
          yAxis.push(temp_y.toFixed(2));
        }

        setStatsUSDX(xAxis);
        setStatsUSDY(yAxis);

        let gameplayAll = json_3.allTimeGameplayUSD.graph;
        setGameplayAllStats(gameplayAll);

        let totalUSD = json_3.totalBalanceUSD.graph;
        setTreasuryTotal(formatPrice(totalUSD.slice(-1)[0].secondary, 0));

        let temp_start = totalUSD[0].secondary;
        let temp_end = totalUSD.slice(-1)[0].secondary;
        let change = temp_end - temp_start;

        setWeeklyChange(change);

        let gameplayTotal = json_3.allTimeGameplayUSD;
        setGameplayAll(
          formatPrice(gameplayTotal.graph.slice(-1)[0].secondary, 0)
        );
        let gameplayTotal_temp =
          gameplayTotal.changes.weekly.percent.toFixed(2);
        setGameplayAllPercent(Number(gameplayTotal_temp));

        let gameplay = json_3.totalGameplayUSD;
        setGameplayTreasury(
          formatPrice(gameplay.graph.slice(-1)[0].secondary, 0)
        );
        let gameplay_temp = gameplay.changes.weekly.percent.toFixed(2);
        setGameplayTreasuryPercent(Number(gameplay_temp));

        let mana = json_3.manaBalance.graph;
        setManaBalance(formatPrice(mana.slice(-1)[0].secondary, 0));

        let dai = json_3.daiBalance.graph;
        setDaiBalance(formatPrice(dai.slice(-1)[0].secondary, 0));

        let usdt = 149746;
        setUSDTBalance(formatPrice(usdt, 0));

        let atri = json_3.atriBalance.graph;
        setAtriBalance(formatPrice(atri.slice(-1)[0].secondary, 0));

        let eth = json_3.ethBalance.graph;
        setEthBalance(formatPrice(eth.slice(-1)[0].secondary, 3));

        let land = json_3.totalLandUSD;
        setLandTreasury(formatPrice(land.graph.slice(-1)[0].secondary, 0));
        let land_temp = land.changes.weekly.percent.toFixed(2);
        setLandTreasuryPercent(Number(land_temp));

        let wearables = json_3.totalWearablesUSD;
        setNftTreasury(formatPrice(wearables.graph.slice(-1)[0].secondary, 0));
        let wearables_temp = wearables.changes.weekly.percent.toFixed(2);
        setNftTreasuryPercent(Number(wearables_temp));

        let dg = json_3.totalDgUSD;
        setDgTreasury(formatPrice(dg.graph.slice(-1)[0].secondary, 0));
        let dg_temp = dg.changes.weekly.percent.toFixed(2);
        setDgTreasuryPercent(Number(dg_temp));

        let liq = json_3.totalLiquidityProvided;
        setLiquidityTreasury(formatPrice(liq.graph.slice(-1)[0].secondary, 0));
        console.log(liq.changes.weekly.percent);
        setLiquidityTreasuryPercent(0);

        let uni = json_3.totalDgEthUniswapBalance;
        setUniTreasury(formatPrice(uni.graph.slice(-1)[0].secondary, 0));

        let mvi = json_3.totalMviEthLPBalance;
        setMviTreasury(formatPrice(mvi.graph.slice(-1)[0].secondary, 0));

        let maticBal = json_3.totalMaticUSD;
        setMaticTreasury(formatPrice(maticBal.graph.slice(-1)[0].secondary, 0));
        let maticTemp = json_3.maticBalance.graph
          .slice(-1)[0]
          .secondary.toFixed(0);
        setMaticTokens(maticTemp);
        let matic_temp = maticBal.changes.weekly.percent.toFixed(2);
        setMaticTreasuryPercent(Number(matic_temp));

        let dgbal = json_3.dgBalance.graph;
        setDgBalance(formatPrice(dgbal.slice(-1)[0].secondary, 0));

        setTreasuryDG(formatPrice(state.DGBalances.BALANCE_TREASURY_DG));
      }
    })();
  }, [state.stakingBalances]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  let data;
  let axes;

  const weekly = {
    labels: statsUSDX,
    datasets: [
      {
        fill: true,
        lineTension: 0.5,
        backgroundColor: '#000000',
        borderColor: '#16c784',
        borderWidth: 2,
        data: statsUSDY,
      },
    ],
  };

  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const stakeContractGovernance =
          await Transactions.stakingContractGovernance(web3);
        setStakeContractGovernance(stakeContractGovernance);

        const DGTokenContract = await Transactions.DGTokenContract(web3);
        setDGTokenContract(DGTokenContract);

        setInstances(true); // contract instantiation complete
      }

      fetchData();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) {
      const percentGovernanceContract = (
        (state.stakingBalances.BALANCE_USER_GOVERNANCE /
          state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) *
        100
      ).toFixed(2);

      setPercentGovernanceContract(percentGovernanceContract);

      const APYGovernance = (
        (50000 / state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) *
        100
      ).toFixed(2);

      setAPYGovernance(APYGovernance);
    }
  }, [state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE]);

  useEffect(() => {
    if (instances) {
      (async () => {
        const stakedTotal = await Transactions.getTotalSupply(
          stakeContractGovernance
        );

        if (stakedTotal) {
          const percentGovernanceStaked =
            (state.stakingBalances.BALANCE_USER_GOVERNANCE / stakedTotal) * 100;

          setPercentGovernanceStaked(percentGovernanceStaked);
        } else {
          setPercentageGov(0);
        }
      })();
    }
  }, [instances, state.stakingBalances.BALANCE_USER_GOVERNANCE]);

  useEffect(() => {
    if (props.price && state.DGBalances.BALANCE_STAKING_GOVERNANCE) {
      const priceUSD = Number(
        props.price * state.DGBalances.BALANCE_STAKING_GOVERNANCE
      );
      const priceUSDAdjusted = priceUSD
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      setPriceUSD(priceUSDAdjusted);
    }
  }, [props.price, state.DGBalances.BALANCE_STAKING_GOVERNANCE]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function handleChange(e) {
    setAmountInput(e.target.value);
  }

  function formatPrice(balanceDG, units) {
    const priceFormatted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return priceFormatted;
  }

  function contentTreasury() {
    const series = {
      showPoints: true,
      type: 'line',
    };

    return (
      <Aux>
        <div>
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            {treasuryTotal ? (
              <p className="treasury-amount">${treasuryTotal}</p>
            ) : (
              <Loader
                active
                inline
                size="large"
                style={{
                  fontSize: '12px',
                  marginTop: '48px',
                  marginBottom: '48px',
                  marginLeft: '0px',
                }}
              />
            )}
          </span>

          <span style={{ display: 'flex', justifyContent: 'center' }}>
            {weeklyChange > 0 && treasuryTotal ? (
              <Table.Cell textAlign="right">
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '-6px',
                    paddingBottom: '9px',
                  }}
                >
                  <p className="earned-percent pos">
                    +$
                    {weeklyChange
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                  <p className="earned-week-text">This Week</p>
                </span>
              </Table.Cell>
            ) : treasuryTotal ? (
              <Table.Cell textAlign="right">
                <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <p className="earned-percent neg">
                    -$
                    {(weeklyChange * -1)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                  <p className="earned-week-text">This Week</p>
                </span>
              </Table.Cell>
            ) : null}
          </span>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span className="treasury-graph">
              <Line
                height={150}
                data={weekly}
                options={{
                  maintainAspectRatio: false,
                  title: { display: false },
                  legend: { display: false },
                  scales: {
                    xAxes: [{ display: false }],
                    yAxes: [{ display: false }],
                  },
                  elements: {
                    point: { radius: 0 },
                  },
                }}
              />
            </span>
          </div>

          <span
            style={{ display: 'flex', justifyContent: 'center' }}
            className="treasury-table"
          >
            <div
              className="treasury-stats"
              style={{
                position: 'relative',
                height: '100%',
              }}
            >
              <Table unstackable className="treasury-table">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell style={{ paddingRight: '22.5vw' }}>
                      Name
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      textAlign="right"
                      className="treasury-left-padding"
                    >
                      Amount
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="right">
                      Weekly
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <span style={{ display: 'flex' }}>
                        all time gameplay profits
                        <Popup
                          className="dai-mana-popup"
                          trigger={
                            <Icon
                              className="dai-mana-icon one"
                              name="info circle"
                              style={{ fontSize: '10px', marginLeft: '6px' }}
                            />
                          }
                        >
                          <div>
                            <p className="earned-text">
                              {' '}
                              All time gameplay earnings, not counting earnings
                              allocated elsewhere by the DG DAO (not used in
                              total treasury calculation)
                            </p>
                          </div>
                        </Popup>
                      </span>
                    </Table.Cell>

                    {gameplayAll ? (
                      <Table.Cell textAlign="right">${gameplayAll}</Table.Cell>
                    ) : (
                      <Table.Cell textAlign="right">
                        <Loader
                          active
                          inline
                          size="small"
                          className="treasury-loader"
                        />
                      </Table.Cell>
                    )}

                    {gameplayAllPercent > 0 && gameplayAll ? (
                      <Table.Cell textAlign="right">
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <p className="earned-percent pos">
                            {gameplayAllPercent}%
                          </p>
                          <Icon name="caret up" className="percent-icon pos" />
                        </span>
                      </Table.Cell>
                    ) : gameplayAll ? (
                      <Table.Cell textAlign="right">
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <p className="earned-percent neg">
                            {gameplayAllPercent}%
                          </p>
                          <Icon
                            name="caret down"
                            className="percent-icon neg"
                          />
                        </span>
                      </Table.Cell>
                    ) : (
                      <Table.Cell textAlign="right">
                        <Loader
                          active
                          inline
                          size="small"
                          className="treasury-loader"
                        />
                      </Table.Cell>
                    )}
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>
                      <span style={{ display: 'flex' }}>
                        Gameplay hot wallet
                        <Popup
                          className="dai-mana-popup"
                          trigger={
                            <Icon
                              className="dai-mana-icon two"
                              name="info circle"
                              style={{ fontSize: '10px', marginLeft: '6px' }}
                            />
                          }
                        >
                          <div>
                            <p className="earned-text">DAI: {daiBalance}</p>
                            <p className="earned-text">MANA: {manaBalance}</p>
                            <p className="earned-text">USDT: {usdtBalance}</p>
                            <p className="earned-text">ATRI: {atriBalance}</p>
                            <p className="earned-text">ETH: {ethBalance}</p>
                          </div>
                        </Popup>
                      </span>
                    </Table.Cell>

                    {gameplayTreasury ? (
                      <Table.Cell textAlign="right">
                        ${gameplayTreasury}
                      </Table.Cell>
                    ) : (
                      <Table.Cell textAlign="right">
                        <Loader
                          active
                          inline
                          size="small"
                          className="treasury-loader"
                        />
                      </Table.Cell>
                    )}

                    {gameplayTreasuryPercent > 0 && gameplayTreasury ? (
                      <Table.Cell textAlign="right">
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <p className="earned-percent pos">
                            {gameplayTreasuryPercent}%
                          </p>
                          <Icon name="caret up" className="percent-icon pos" />
                        </span>
                      </Table.Cell>
                    ) : gameplayTreasury ? (
                      <Table.Cell textAlign="right">
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <p className="earned-percent neg">
                            {gameplayTreasuryPercent}%
                          </p>
                          <Icon
                            name="caret down"
                            className="percent-icon neg"
                          />
                        </span>
                      </Table.Cell>
                    ) : (
                      <Table.Cell textAlign="right">
                        <Loader
                          active
                          inline
                          size="small"
                          className="treasury-loader"
                        />
                      </Table.Cell>
                    )}
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>
                      <span style={{ display: 'flex' }}>
                        $DG Token
                        <Popup
                          className="dai-mana-popup"
                          trigger={
                            <Icon
                              className="dai-mana-icon three"
                              name="info circle"
                              style={{ fontSize: '10px', marginLeft: '6px' }}
                            />
                          }
                        >
                          <div>
                            <p className="earned-text">
                              Treasury holdings of $DG calculated as {dgBalance}{' '}
                              $DG at market price{' '}
                            </p>
                          </div>
                        </Popup>
                      </span>
                    </Table.Cell>

                    {dgTreasury ? (
                      <Table.Cell textAlign="right">${dgTreasury}</Table.Cell>
                    ) : (
                      <Table.Cell textAlign="right">
                        <Loader
                          active
                          inline
                          size="small"
                          className="treasury-loader"
                        />
                      </Table.Cell>
                    )}

                    {dgTreasuryPercent > 0 && dgTreasury ? (
                      <Table.Cell textAlign="right">
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <p className="earned-percent pos">
                            {dgTreasuryPercent}%
                          </p>
                          <Icon name="caret up" className="percent-icon pos" />
                        </span>
                      </Table.Cell>
                    ) : dgTreasury ? (
                      <Table.Cell textAlign="right">
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <p className="earned-percent neg">
                            {dgTreasuryPercent}%
                          </p>
                          <Icon
                            name="caret down"
                            className="percent-icon neg"
                          />
                        </span>
                      </Table.Cell>
                    ) : (
                      <Table.Cell textAlign="right">
                        <Loader
                          active
                          inline
                          size="small"
                          className="treasury-loader"
                        />
                      </Table.Cell>
                    )}
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>
                      <span style={{ display: 'flex' }}>
                        Decentraland LAND
                        <Popup
                          className="dai-mana-popup"
                          trigger={
                            <Icon
                              className="dai-mana-icon four"
                              name="info circle"
                              style={{ fontSize: '10px', marginLeft: '6px' }}
                            />
                          }
                        >
                          <div>
                            <p className="earned-text">
                              Treasury holdings of LAND calculated as 1,007
                              parcels times T30 avg LAND price{' '}
                            </p>
                          </div>
                        </Popup>
                      </span>
                    </Table.Cell>

                    {landTreasury ? (
                      <Table.Cell textAlign="right">${landTreasury}</Table.Cell>
                    ) : (
                      <Table.Cell textAlign="right">
                        <Loader
                          active
                          inline
                          size="small"
                          className="treasury-loader"
                        />
                      </Table.Cell>
                    )}

                    {landTreasuryPercent > 0 && landTreasury ? (
                      <Table.Cell textAlign="right">
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <p className="earned-percent pos">
                            {landTreasuryPercent}%
                          </p>
                          <Icon name="caret up" className="percent-icon pos" />
                        </span>
                      </Table.Cell>
                    ) : landTreasury ? (
                      <Table.Cell textAlign="right">
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <p className="earned-percent neg">
                            {landTreasuryPercent}%
                          </p>
                          <Icon
                            name="caret down"
                            className="percent-icon neg"
                          />
                        </span>
                      </Table.Cell>
                    ) : (
                      <Table.Cell textAlign="right">
                        <Loader
                          active
                          inline
                          size="small"
                          className="treasury-loader"
                        />
                      </Table.Cell>
                    )}
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>
                      <span style={{ display: 'flex' }}>
                        $DG Wearables
                        <Popup
                          className="dai-mana-popup"
                          trigger={
                            <Icon
                              className="dai-mana-icon five"
                              name="info circle"
                              style={{ fontSize: '10px', marginLeft: '6px' }}
                            />
                          }
                        >
                          <div>
                            <p className="earned-text">
                              Treasury holdings of wearable NFTs calculated as
                              210 wearables times average bid at current MANA
                              price{' '}
                            </p>
                          </div>
                        </Popup>
                      </span>
                    </Table.Cell>

                    {nftTreasury ? (
                      <Table.Cell textAlign="right">${nftTreasury}</Table.Cell>
                    ) : (
                      <Table.Cell textAlign="right">
                        <Loader
                          active
                          inline
                          size="small"
                          className="treasury-loader"
                        />
                      </Table.Cell>
                    )}

                    {nftTreasuryPercent > 0 && nftTreasury ? (
                      <Table.Cell textAlign="right">
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <p className="earned-percent pos">
                            {nftTreasuryPercent}%
                          </p>
                          <Icon name="caret up" className="percent-icon pos" />
                        </span>
                      </Table.Cell>
                    ) : nftTreasury ? (
                      <Table.Cell textAlign="right">
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <p className="earned-percent neg">
                            {nftTreasuryPercent}%
                          </p>
                          <Icon
                            name="caret down"
                            className="percent-icon neg"
                          />
                        </span>
                      </Table.Cell>
                    ) : (
                      <Table.Cell textAlign="right">
                        <Loader
                          active
                          inline
                          size="small"
                          className="treasury-loader"
                        />
                      </Table.Cell>
                    )}
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>
                      <span style={{ display: 'flex' }}>
                        Liquidity Provided
                        <Popup
                          className="dai-mana-popup"
                          trigger={
                            <Icon
                              className="dai-mana-icon six"
                              name="info circle"
                              style={{ fontSize: '10px', marginLeft: '6px' }}
                            />
                          }
                        >
                          <div>
                            <p className="earned-text">
                              {' '}
                              ETH-DG v3: ${uniTreasury}{' '}
                            </p>
                            <p className="earned-text">
                              {' '}
                              MVI-ETH v2: ${mviTreasury}{' '}
                            </p>
                          </div>
                        </Popup>
                      </span>
                    </Table.Cell>

                    {liquidityTreasury ? (
                      <Table.Cell textAlign="right">
                        ${liquidityTreasury}
                      </Table.Cell>
                    ) : (
                      <Table.Cell textAlign="right">
                        <Loader
                          active
                          inline
                          size="small"
                          className="treasury-loader"
                        />
                      </Table.Cell>
                    )}

                    <Table.Cell textAlign="right">
                      <span
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <p className="earned-percent neutral">0.00%</p>
                      </span>
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>
                      <span style={{ display: 'flex' }}>
                        Matic staked in Matic Node
                        <Popup
                          className="dai-mana-popup"
                          trigger={
                            <Icon
                              className="dai-mana-icon seven"
                              name="info circle"
                              style={{ fontSize: '10px', marginLeft: '6px' }}
                            />
                          }
                        >
                          <div>
                            <p className="earned-text">
                              Calculated as{' '}
                              {Number(maticTokens).toLocaleString()} delegated
                              tokens times current Matic token price{' '}
                            </p>
                          </div>
                        </Popup>
                      </span>
                    </Table.Cell>

                    {maticTreasury ? (
                      <Table.Cell textAlign="right">
                        ${maticTreasury}
                      </Table.Cell>
                    ) : (
                      <Table.Cell textAlign="right">
                        <Loader
                          active
                          inline
                          size="small"
                          className="treasury-loader"
                        />
                      </Table.Cell>
                    )}

                    {maticTreasuryPercent > 0 && maticTreasury ? (
                      <Table.Cell textAlign="right">
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <p className="earned-percent pos">
                            {maticTreasuryPercent}%
                          </p>
                          <Icon name="caret up" className="percent-icon pos" />
                        </span>
                      </Table.Cell>
                    ) : maticTreasury ? (
                      <Table.Cell textAlign="right">
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <p className="earned-percent neg">
                            {maticTreasuryPercent}%
                          </p>
                          <Icon
                            name="caret down"
                            className="percent-icon neg"
                          />
                        </span>
                      </Table.Cell>
                    ) : (
                      <Table.Cell textAlign="right">
                        <Loader
                          active
                          inline
                          size="small"
                          className="treasury-loader"
                        />
                      </Table.Cell>
                    )}
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </span>
        </div>
      </Aux>
    );
  }

  return contentTreasury();
};

export default ContentTreasury;
