import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from '../../store';
import Web3 from 'web3';
import { Button, Divider, Input, Loader, Popup, Icon, Table } from 'semantic-ui-react';
import Transactions from '../../common/Transactions';
import Aux from '../_Aux';
import Images from '../../common/Images';
import Fetch from '../../common/Fetch';
import Global from '../Constants';
import { Chart } from 'react-charts';

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
  const [statsUSD, setStatsUSD] = useState('');

  const [gameplayTreasury, setGameplayTreasury] = useState(0);
  const [gameplayTreasuryPercent, setGameplayTreasuryPercent] = useState(0);

  const [gameplayAll, setGameplayAll] = useState(0);
  const [gameplayAllPercent, setGameplayAllPercent] = useState(0);

  const [manaBalance, setManaBalance] = useState(0);
  const [daiBalance, setDaiBalance] = useState(0);

  const [dgTreasury, setDgTreasury] = useState(0);
  const [dgTreasuryPercent, setDgTreasuryPercent] = useState(0);
  const [treasuryDG, setTreasuryDG] = useState(0);
  const [treasuryDGPercent, setTreasuryDGPercent] = useState(0);

  const [landTreasury, setLandTreasury] = useState(0);
  const [landTreasuryPercent, setLandTreasuryPercent] = useState(0);

  const [nftTreasury, setNftTreasury] = useState(0);
  const [nftTreasuryPercent, setNftTreasuryPercent] = useState(0);

  const [uniTreasury, setUniTreasury] = useState(0);
  const [percentageUniswap, setPercentageUniswap] = useState(0);
  const [uniTreasuryPercent, setUniTreasuryPercent] = useState(0);

  const [daiTreasury, setDaiTreasury] = useState(0);
  const [daiTreasuryPercent, setDaiTreasuryPercent] = useState(0);


  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  function length(obj) {
    return Object.keys(obj).length;
  }

  useEffect(() => {

    (async function () {
      // get treasury statistics
      if (state.userStatus 
        && state.stakingBalances.BALANCE_STAKED_UNISWAP_TREASURY 
        && state.stakingBalances.BALANCE_CONTRACT_UNISWAP) {

        const percentageTreasuryUniswap = Number(
          (state.stakingBalances.BALANCE_STAKED_UNISWAP_TREASURY /
            state.stakingBalances.BALANCE_CONTRACT_UNISWAP)
        );

        setPercentageUniswap((percentageTreasuryUniswap * 100).toFixed(2));

        let response = await Fetch.ETH_PRICE();
        let json = await response.json();

        const priceETH = json.market_data.current_price.usd;
        const locked_ETH = state.DGBalances.BALANCE_UNISWAP_ETH * priceETH;
        const locked_DG = state.DGBalances.BALANCE_UNISWAP_DG * props.price;
        const total_locked = locked_DG + locked_ETH;

        let response_2 = await Fetch.MANA_PRICE();
        let json_2 = await response_2.json();

        const priceMANA = json_2.market_data.current_price.usd;
        const manaTemp = priceMANA * 400000;
        setGameplayMana(manaTemp);

        let response_3 = await Fetch.TREASURY_STATS_GRAPH(state.userAddress);
        let json_3 = await response_3.json();

        let usd = json_3.totalBalanceUSD.graph;
        setStatsUSD(usd);

        let response_4 = await Fetch.TREASURY_STATS_NUMBERS(state.userAddress);
        let json_4 = await response_4.json();
        console.log('!!!');
        console.log(json_4);

        let totalUSD = json_4.totalBalanceUSD.graph;
        setTreasuryTotal(formatPrice(totalUSD.slice(-1)[0].secondary, 0));

        let gameplayTotal = json_4.allTimeGameplayUSD;
        setGameplayAll(formatPrice(gameplayTotal.graph.slice(-1)[0].secondary, 0));
        let gameplayTotal_temp = (gameplayTotal.changes.daily.percent).toFixed(2);
        setGameplayAllPercent(Number(gameplayTotal_temp));

        let gameplay = json_4.totalGameplayUSD;
        setGameplayTreasury(formatPrice(gameplay.graph.slice(-1)[0].secondary, 0));
        let gameplay_temp = (gameplay.changes.daily.percent).toFixed(2)
        setGameplayTreasuryPercent(Number(gameplay_temp));

        let mana = json_4.manaBalance.graph;
        setManaBalance(formatPrice(mana.slice(-1)[0].secondary, 0));

        let dai = json_4.daiBalance.graph;
        setDaiBalance(formatPrice(dai.slice(-1)[0].secondary, 0));

        let land = json_4.totalLandUSD;
        setLandTreasury(formatPrice(land.graph.slice(-1)[0].secondary, 0));
        let land_temp = (land.changes.daily.percent).toFixed(2);
        setLandTreasuryPercent(Number(land_temp));

        let wearables = json_4.totalWearablesUSD;
        setNftTreasury(formatPrice(wearables.graph.slice(-1)[0].secondary, 0));
        let wearables_temp = (wearables.changes.daily.percent).toFixed(2);
        setNftTreasuryPercent(Number(wearables_temp));

        let dg = json_4.totalDgUSD;
        setDgTreasury(formatPrice(dg.graph.slice(-1)[0].secondary, 0));
        let dg_temp = (dg.changes.daily.percent).toFixed(2);
        setDgTreasuryPercent(Number(dg_temp));

        let uni = json_4.totalDgEthUniswapBalance;
        setUniTreasury(formatPrice(uni.graph.slice(-1)[0].secondary, 0));
        let uni_temp = (uni.changes.daily.percent).toFixed(2);
        setUniTreasuryPercent(Number(uni_temp));

        let daiYield = json_4.totalCurveAaveBalance;
        setDaiTreasury(formatPrice(daiYield.graph.slice(-1)[0].secondary, 0));
        let daiYield_temp = (daiYield.changes.daily.percent).toFixed(2);
        setDaiTreasuryPercent(Number(daiYield_temp));

        let dgbal = json_4.dgBalance.graph;
        setDgBalance(formatPrice(dgbal.slice(-1)[0].secondary, 0));

        setTreasuryDG(formatPrice(state.DGBalances.BALANCE_TREASURY_DG));
      }
    })()
  }, [
    state.stakingBalances.BALANCE_STAKED_UNISWAP_TREASURY,
    state.stakingBalances.BALANCE_CONTRACT_UNISWAP,
    props.price,
    state.DGBalances.BALANCE_UNISWAP_ETH,
    state.DGBalances.BALANCE_UNISWAP_DG,
    uniTreasury,
    percentageUniswap,
    treasuryTotal,
    treasuryDG,
    daiTreasury,
    gameplayAll,
    dgBalance,
    gameplayMana,
  ]);

  let data;
  let axes;
  let primaryCursor;
  let secondaryCursor;

  if (statsUSD.length > 0) {
    statsUSD.map((stat) => (stat.primary = new Date(stat.primary)));

    data = [
      {
        label: 'USD',
        color: '#16c784',

        data: [
          ...new Array(
            statsUSD.map((stat, i) => {
              return {
                primary: stat.primary,
                secondary: stat.secondary,
              };
            })
          )[0],
        ],
      },
    ];

    axes = [
      { primary: true, type: 'time', position: 'bottom', show: false },
      {
        type: 'linear',
        id: 'Second Metric',
        min: 0,
        position: 'left',
        format: (d) => `$${d}`,
        show: false,
      },
    ];

  } else {
    data = [
      {
        label: 'Loading USD',
        data: [],
      },
    ];

    axes = [
      { primary: true, type: 'utc', position: 'bottom', show: false },
      { type: 'linear', position: 'left', show: false },
    ];
  }

  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const stakeContractGovernance = await Transactions.stakingContractGovernance(
          web3
        );
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
      showPoints: false,
      type: 'line',
    };

    return (
      <Aux>

        <div className="DG-liquidity-container">
          <div className="DG-column unclaimed">
            <p className="earned-amount">Treasury All Time</p>

            <Divider className="divider-dg-top" />

            <span style={{ display: 'flex' }}>
              <img
                src={Images.DG_COIN_LOGO}
                className="farming-logo-small"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text-top">Total</p>
                {treasuryTotal ? (
                  <p className="earned-amount">${treasuryTotal}</p>
                ) : (
                  <Loader
                    active
                    inline
                    size="medium"
                    style={{
                      fontSize: '12px',
                      marginTop: '12px',
                      marginLeft: '15px',
                    }}
                  />
                )}
              </span>
            </span>

            <Divider className="divider-dg-top" />

            <div
              style={{
                width: '100%',
                height: '150px',
                marginTop: '5px',
              }}
            >
              <Chart
                data={data}
                series={series}
                axes={axes}
                tooltip
              />
            </div>
          </div>

            <div
              className="DG-column treasury-stats"
              style={{
                position: 'relative',
                height: '100%',
              }}
            >

            <p className="earned-amount" id="treasury-breakdown">Treasury Breakdown</p>

            <Divider />

            <Table unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell textAlign="right" style={{ paddingLeft: '100px' }}>Amount</Table.HeaderCell>
                  <Table.HeaderCell textAlign="right">Weekly Change</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <span style={{ display: 'flex' }}>
                      <p className="earned-amount">Gameplay All Time</p>
                      <Popup
                        className="dai-mana-popup"
                        trigger={
                          <Icon
                            className="dai-mana-icon"
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
                    <Table.Cell textAlign="right">
                      <p className="earned-amount">${gameplayAll}</p>
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

                  {gameplayAllPercent > 0 ? (
                    <Table.Cell textAlign="right">
                      <span style={{ display: 'flex' }}>
                        <p className="earned-percent pos">
                          {gameplayAllPercent}%
                        </p>
                        <Icon
                          name="caret up"
                          className="percent-icon pos"
                        />
                      </span>
                    </Table.Cell>
                  ) : (
                    <Table.Cell textAlign="right">
                      <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <p className="earned-percent neg">
                          {gameplayAllPercent}%
                        </p>
                        <Icon
                          name="caret down"
                          className="percent-icon neg"
                        />
                      </span>
                    </Table.Cell>
                  )}
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    <span style={{ display: 'flex' }}>
                      <p className="earned-amount">Gameplay Current</p>
                      <Popup
                        className="dai-mana-popup"
                        trigger={
                          <Icon
                            className="dai-mana-icon"
                            name="info circle"
                            style={{ fontSize: '10px', marginLeft: '6px' }}
                          />
                        }
                      >
                        <div>
                          <p className="earned-text">DAI: {daiBalance}</p>
                          <p className="earned-text">MANA: {manaBalance}</p>
                        </div>
                      </Popup>
                    </span>
                  </Table.Cell>

                  {gameplayTreasury ? (
                    <Table.Cell textAlign="right">
                      <p className="earned-amount">${gameplayTreasury}</p>
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

                  {gameplayAllPercent > 0 ? (
                    <Table.Cell textAlign="right">
                      <span style={{ display: 'flex' }}>
                        <p className="earned-percent pos">
                          {gameplayTreasuryPercent}%
                        </p>
                        <Icon
                          name="caret up"
                          className="percent-icon pos"
                        />
                      </span>
                    </Table.Cell>
                  ) : (
                    <Table.Cell textAlign="right">
                      <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <p className="earned-percent neg">
                          {gameplayTreasuryPercent}%
                        </p>
                        <Icon
                          name="caret down"
                          className="percent-icon neg"
                        />
                      </span>
                    </Table.Cell>
                  )}
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    <span style={{ display: 'flex' }}>
                      <p className="earned-amount">$DG Treasury</p>
                      <Popup
                        className="dai-mana-popup"
                        trigger={
                          <Icon
                            className="dai-mana-icon"
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
                    <Table.Cell textAlign="right">
                      <p className="earned-amount">${dgTreasury}</p>
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

                  {dgTreasuryPercent > 0 ? (
                    <Table.Cell textAlign="right">
                      <span style={{ display: 'flex' }}>
                        <p className="earned-percent pos">
                          {dgTreasuryPercent}%
                        </p>
                        <Icon
                          name="caret up"
                          className="percent-icon pos"
                        />
                      </span>
                    </Table.Cell>
                  ) : (
                    <Table.Cell textAlign="right">
                      <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <p className="earned-percent neg">
                          {dgTreasuryPercent}%
                        </p>
                        <Icon
                          name="caret down"
                          className="percent-icon neg"
                        />
                      </span>
                    </Table.Cell>
                  )}
                </Table.Row>

              </Table.Body>
            </Table>

          </div>

        </div>
      </Aux>
    );
  }

  return contentTreasury();
};

export default ContentTreasury;
