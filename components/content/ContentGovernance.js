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
  Grid,
} from 'semantic-ui-react';
import Transactions from '../../common/Transactions';
import Aux from '../_Aux';
import Images from '../../common/Images';
import Fetch from '../../common/Fetch';
import Global from '../Constants';
import { Chart } from 'react-charts';

const ContentGovernance = (props) => {
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
        const percentageTreasuryUniswap = Number(
          state.stakingBalances.BALANCE_STAKED_UNISWAP_TREASURY /
            state.stakingBalances.BALANCE_CONTRACT_UNISWAP
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

        let totalUSD = json_4.totalBalanceUSD.graph;
        setTreasuryTotal(props.formatPrice(totalUSD.slice(-1)[0].secondary, 0));

        let gameplayTotal = json_4.allTimeGameplayUSD;
        setGameplayAll(
          props.formatPrice(gameplayTotal.graph.slice(-1)[0].secondary, 0)
        );
        let gameplayTotal_temp = gameplayTotal.changes.weekly.percent.toFixed(
          2
        );
        setGameplayAllPercent(Number(gameplayTotal_temp));

        let gameplay = json_4.totalGameplayUSD;
        setGameplayTreasury(
          props.formatPrice(gameplay.graph.slice(-1)[0].secondary, 0)
        );
        let gameplay_temp = gameplay.changes.weekly.percent.toFixed(2);
        setGameplayTreasuryPercent(Number(gameplay_temp));

        let mana = json_4.manaBalance.graph;
        setManaBalance(props.formatPrice(mana.slice(-1)[0].secondary, 0));

        let dai = json_4.daiBalance.graph;
        setDaiBalance(props.formatPrice(dai.slice(-1)[0].secondary, 0));

        let land = json_4.totalLandUSD;
        setLandTreasury(
          props.formatPrice(land.graph.slice(-1)[0].secondary, 0)
        );
        let land_temp = land.changes.weekly.percent.toFixed(2);
        setLandTreasuryPercent(Number(land_temp));

        let wearables = json_4.totalWearablesUSD;
        setNftTreasury(
          props.formatPrice(wearables.graph.slice(-1)[0].secondary, 0)
        );
        let wearables_temp = wearables.changes.weekly.percent.toFixed(2);
        setNftTreasuryPercent(Number(wearables_temp));

        let dg = json_4.totalDgUSD;
        setDgTreasury(props.formatPrice(dg.graph.slice(-1)[0].secondary, 0));
        let dg_temp = dg.changes.weekly.percent.toFixed(2);
        setDgTreasuryPercent(Number(dg_temp));

        let uni = json_4.totalDgEthUniswapBalance;
        setUniTreasury(props.formatPrice(uni.graph.slice(-1)[0].secondary, 0));
        let uni_temp = uni.changes.weekly.percent.toFixed(2);
        setUniTreasuryPercent(Number(uni_temp));

        let daiYield = json_4.totalCurveAaveBalance;
        setDaiTreasury(
          props.formatPrice(daiYield.graph.slice(-1)[0].secondary, 0)
        );
        let daiYield_temp = daiYield.changes.weekly.percent.toFixed(2);
        setDaiTreasuryPercent(Number(daiYield_temp));

        let dgbal = json_4.dgBalance.graph;
        setDgBalance(props.formatPrice(dgbal.slice(-1)[0].secondary, 0));

        let maticBal = json_4.totalMaticUSD;
        setMaticTreasury(props.formatPrice(maticBal.graph.slice(-1)[0].secondary, 0));
        let maticTemp = (json_4.maticBalance.graph.slice(-1)[0].secondary.toFixed(0));
        setMaticTokens(maticTemp);
        // let maticPercent = maticBal.changes.weekly.percent.toFixed(2);
        // setMaticTreasuryPercent(Number(maticPercent));

        setTreasuryDG(props.formatPrice(state.DGBalances.BALANCE_TREASURY_DG));
      }
    })();
  }, [state.stakingBalances]);

  let data;
  let axes;

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

  function contentGovernance() {
    const series = {
      showPoints: false,
      type: 'line',
    };

    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG Governance</h3>
              <p>
                Stake $DG tokens, govern the treasury, and earn governance
                rewards. Read more about $DG governance in our{' '}
                <a
                  href={`${Global.CONSTANTS.BASE_URL}/blog/governance-staking-is-now-live-start-earning-dg-gov-rewards`}
                  style={{ color: '#2085f4' }}
                  target="_blank"
                >
                  announcement{' '}
                </a>
                and get $DG{' '}
                <a
                  href="https://info.uniswap.org/pair/0x44c21f5dcb285d92320ae345c92e8b6204be8cdf"
                  style={{ color: '#2085f4' }}
                  target="_blank"
                >
                  here
                </a>
                .
              </p>
            </span>
          </div>
        </div>

        <div
          className="DG-liquidity-container gov"
          style={{ marginBottom: '30px' }}
        >
          <div
            className="DG-column unclaimed"
            style={{ position: 'relative', height: '100%' }}
          >
            <span style={{ display: 'flex' }}>
              <img
                src={Images.DG_COIN_LOGO}
                className="farming-logo"
                alt="Decentral Games Coin Logo"
              />

              <span className="farming-pool-span">
                <p className="welcome-text">Unclaimed $DG</p>
                {state.DGBalances.BALANCE_STAKING_GOVERNANCE ? (
                  <p className="account-name">
                    {props.formatPrice(
                      state.DGBalances.BALANCE_STAKING_GOVERNANCE,
                      3
                    )}
                  </p>
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

            <Divider />

            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: '12px',
                paddingBottom: '12px',
              }}
            >
              <p className="earned-text">Value USD</p>
              {state.DGBalances.BALANCE_STAKING_GOVERNANCE ? (
                <p className="earned-amount">${priceUSD}</p>
              ) : (
                <Loader
                  active
                  inline
                  size="small"
                  style={{
                    fontSize: '12px',
                    marginTop: '1px',
                    marginBottom: '2px',
                  }}
                />
              )}
            </span>

            <Divider />

            <span className="DG-button-span">
              {Number(state.DGBalances.BALANCE_STAKING_GOVERNANCE) ? (
                <Button
                  className="DG-claim-button"
                  id="balances-padding-correct"
                  onClick={() => props.reward(stakeContractGovernance)}
                >
                  CLAIM $DG
                </Button>
              ) : (
                <Button disabled className="DG-claim-button">
                  CLAIM $DG
                </Button>
              )}
            </span>
          </div>

          <span className="DG-tablet-container-gov">
            <div
              className="DG-column-treasury one"
              style={{
                position: 'relative',
                height: '100%',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  className="farming-pool-span"
                  style={{ width: '60%', marginLeft: '-15px' }}
                >
                  <p className="welcome-text">treasury</p>
                  {treasuryTotal ? (
                    <p className="account-name">${treasuryTotal}</p>
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

                <span
                  style={{
                    width: '40%',
                    maxWidth: '48.5%',
                    height: '75px',
                    marginTop: '5px',
                  }}
                >
                  <Chart data={data} axes={axes} series={series} />
                </span>
              </span>

              <Divider />

              <Table unstackable>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="treasury-cell">
                      <span style={{ display: 'flex' }}>
                        <p className="earned-text">Gameplay total</p>
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
                      <span
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <Table.Cell className="treasury-cell" textAlign="right">
                          <p className="earned-amount">${gameplayAll}</p>
                        </Table.Cell>
                        <Table.Cell
                          className="treasury-cell two"
                          textAlign="right"
                        >
                          {gameplayAllPercent > 0 ? (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent pos">
                                {gameplayAllPercent}%
                              </p>
                              <Icon
                                name="caret up"
                                className="percent-icon pos"
                              />
                            </span>
                          ) : (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent neg">
                                {gameplayAllPercent}%
                              </p>
                              <Icon
                                name="caret down"
                                className="percent-icon neg"
                              />
                            </span>
                          )}
                        </Table.Cell>
                      </span>
                    ) : (
                      <span>
                        <Table.Cell
                          className="treasury-cell two"
                          textAlign="right"
                        >
                          <Loader
                            active
                            inline
                            size="small"
                            className="treasury-loader"
                          />
                        </Table.Cell>
                      </span>
                    )}
                  </Table.Row>
                </Table.Body>
              </Table>

              <Divider />

              <Table unstackable>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="treasury-cell-lower">
                      <span style={{ display: 'flex' }}>
                        <p className="earned-text">Gameplay</p>
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
                      <span
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <Table.Cell
                          className="treasury-cell-lower"
                          textAlign="right"
                        >
                          <p className="earned-amount">${gameplayTreasury}</p>
                        </Table.Cell>
                        <Table.Cell
                          className="treasury-cell-lower two"
                          textAlign="right"
                        >
                          {gameplayTreasuryPercent > 0 ? (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent pos">
                                {gameplayTreasuryPercent}%
                              </p>
                              <Icon
                                name="caret up"
                                className="percent-icon pos"
                              />
                            </span>
                          ) : (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent neg">
                                {gameplayTreasuryPercent}%
                              </p>
                              <Icon
                                name="caret down"
                                className="percent-icon neg"
                              />
                            </span>
                          )}
                        </Table.Cell>
                      </span>
                    ) : (
                      <span>
                        <Table.Cell
                          className="treasury-cell-lower two"
                          textAlign="right"
                        >
                          <Loader
                            active
                            inline
                            size="small"
                            className="treasury-loader"
                          />
                        </Table.Cell>
                      </span>
                    )}
                  </Table.Row>
                </Table.Body>
              </Table>

              <Table unstackable>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="treasury-cell-lower">
                      <span style={{ display: 'flex' }}>
                        <p className="earned-text">$DG Token</p>
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
                      <span
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <Table.Cell
                          className="treasury-cell-lower"
                          textAlign="right"
                        >
                          <p className="earned-amount">${dgTreasury}</p>
                        </Table.Cell>
                        <Table.Cell
                          className="treasury-cell-lower two"
                          textAlign="right"
                        >
                          {dgTreasuryPercent > 0 ? (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent pos">
                                {dgTreasuryPercent}%
                              </p>
                              <Icon
                                name="caret up"
                                className="percent-icon pos"
                              />
                            </span>
                          ) : (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent neg">
                                {dgTreasuryPercent}%
                              </p>
                              <Icon
                                name="caret down"
                                className="percent-icon neg"
                              />
                            </span>
                          )}
                        </Table.Cell>
                      </span>
                    ) : (
                      <span>
                        <Table.Cell
                          className="treasury-cell two"
                          textAlign="right"
                        >
                          <Loader
                            active
                            inline
                            size="small"
                            className="treasury-loader"
                          />
                        </Table.Cell>
                      </span>
                    )}
                  </Table.Row>
                </Table.Body>
              </Table>

              <Table unstackable>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="treasury-cell-lower">
                      <span style={{ display: 'flex' }}>
                        <p className="earned-text">LAND</p>
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
                              Treasury holdings of LAND calculated as 403
                              parcels times T30 avg LAND price{' '}
                            </p>
                          </div>
                        </Popup>
                      </span>
                    </Table.Cell>

                    {landTreasury ? (
                      <span
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <Table.Cell
                          className="treasury-cell-lower"
                          textAlign="right"
                        >
                          <p className="earned-amount">${landTreasury}</p>
                        </Table.Cell>
                        <Table.Cell
                          className="treasury-cell-lower two"
                          textAlign="right"
                        >
                          {landTreasuryPercent > 0 ? (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent pos">
                                {landTreasuryPercent}%
                              </p>
                              <Icon
                                name="caret up"
                                className="percent-icon pos"
                              />
                            </span>
                          ) : (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent neg">
                                {landTreasuryPercent}%
                              </p>
                              <Icon
                                name="caret down"
                                className="percent-icon neg"
                              />
                            </span>
                          )}
                        </Table.Cell>
                      </span>
                    ) : (
                      <span>
                        <Table.Cell
                          className="treasury-cell two"
                          textAlign="right"
                        >
                          <Loader
                            active
                            inline
                            size="small"
                            className="treasury-loader"
                          />
                        </Table.Cell>
                      </span>
                    )}
                  </Table.Row>
                </Table.Body>
              </Table>

              <Table unstackable>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="treasury-cell-lower">
                      <span style={{ display: 'flex' }}>
                        <p className="earned-text">Wearables</p>
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
                              Treasury holdings of wearable NFTs calculated as
                              210 wearables times average bid at current MANA
                              price{' '}
                            </p>
                          </div>
                        </Popup>
                      </span>
                    </Table.Cell>

                    {nftTreasury ? (
                      <span
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <Table.Cell
                          className="treasury-cell-lower"
                          textAlign="right"
                        >
                          <p className="earned-amount">${nftTreasury}</p>
                        </Table.Cell>
                        <Table.Cell
                          className="treasury-cell-lower two"
                          textAlign="right"
                        >
                          {nftTreasuryPercent > 0 ? (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent pos">
                                {nftTreasuryPercent}%
                              </p>
                              <Icon
                                name="caret up"
                                className="percent-icon pos"
                              />
                            </span>
                          ) : (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent neg">
                                {nftTreasuryPercent}%
                              </p>
                              <Icon
                                name="caret down"
                                className="percent-icon neg"
                              />
                            </span>
                          )}
                        </Table.Cell>
                      </span>
                    ) : (
                      <span>
                        <Table.Cell
                          className="treasury-cell two"
                          textAlign="right"
                        >
                          <Loader
                            active
                            inline
                            size="small"
                            className="treasury-loader"
                          />
                        </Table.Cell>
                      </span>
                    )}
                  </Table.Row>
                </Table.Body>
              </Table>

              <Table unstackable>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="treasury-cell-lower">
                      <span style={{ display: 'flex' }}>
                        <p className="earned-text">Uniswap LP</p>
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
                              Treasury holdings of ETH-DG Uniswap LP calculated
                              as {percentageUniswap}% of the UNI V2 ETH-DG pool
                            </p>
                          </div>
                        </Popup>
                      </span>
                    </Table.Cell>

                    {uniTreasury ? (
                      <span
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <Table.Cell
                          className="treasury-cell-lower"
                          textAlign="right"
                        >
                          <p className="earned-amount">${uniTreasury}</p>
                        </Table.Cell>
                        <Table.Cell
                          className="treasury-cell-lower two"
                          textAlign="right"
                        >
                          {uniTreasuryPercent > 0 ? (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent pos">
                                {uniTreasuryPercent}%
                              </p>
                              <Icon
                                name="caret up"
                                className="percent-icon pos"
                              />
                            </span>
                          ) : (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent neg">
                                {uniTreasuryPercent}%
                              </p>
                              <Icon
                                name="caret down"
                                className="percent-icon neg"
                              />
                            </span>
                          )}
                        </Table.Cell>
                      </span>
                    ) : (
                      <span>
                        <Table.Cell
                          className="treasury-cell two"
                          textAlign="right"
                        >
                          <Loader
                            active
                            inline
                            size="small"
                            className="treasury-loader"
                          />
                        </Table.Cell>
                      </span>
                    )}
                  </Table.Row>
                </Table.Body>
              </Table>

              <Table unstackable>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="treasury-cell-lower">
                      <span style={{ display: 'flex' }}>
                        <p className="earned-text">DAI Yield</p>
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
                              Treasury balance locked in Curve Aave vault{' '}
                            </p>
                          </div>
                        </Popup>
                      </span>
                    </Table.Cell>

                    {daiTreasury ? (
                      <span
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <Table.Cell
                          className="treasury-cell-lower"
                          textAlign="right"
                        >
                          <p className="earned-amount">${daiTreasury}</p>
                        </Table.Cell>
                        <Table.Cell
                          className="treasury-cell-lower two"
                          textAlign="right"
                        >
                          {daiTreasuryPercent > 0 ? (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent pos">
                                {daiTreasuryPercent}%
                              </p>
                              <Icon
                                name="caret up"
                                className="percent-icon pos"
                              />
                            </span>
                          ) : (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent neg">
                                {daiTreasuryPercent}%
                              </p>
                              <Icon
                                name="caret down"
                                className="percent-icon neg"
                              />
                            </span>
                          )}
                        </Table.Cell>
                      </span>
                    ) : (
                      <span>
                        <Table.Cell
                          className="treasury-cell two"
                          textAlign="right"
                        >
                          <Loader
                            active
                            inline
                            size="small"
                            className="treasury-loader"
                          />
                        </Table.Cell>
                      </span>
                    )}
                  </Table.Row>
                </Table.Body>
              </Table>

              <Table unstackable>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="treasury-cell-lower">
                      <span style={{ display: 'flex' }}>
                        <p className="earned-text">Matic Node</p>
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
                              Calculated as {Number(maticTokens).toLocaleString()} delegated tokens times current Matic token price{' '}
                            </p>
                          </div>
                        </Popup>
                      </span>
                    </Table.Cell>

                    {maticTreasury ? (
                      <span
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <Table.Cell
                          className="treasury-cell-lower"
                          textAlign="right"
                        >
                          <p className="earned-amount">${maticTreasury}</p>
                        </Table.Cell>
                        <Table.Cell
                          className="treasury-cell-lower two"
                          textAlign="right"
                        >
                          {maticTreasuryPercent > 0 ? (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent pos">
                                {maticTreasuryPercent}%
                              </p>
                              <Icon
                                name="caret up"
                                className="percent-icon pos"
                              />
                            </span>
                          ) : (
                            <span style={{ display: 'flex' }}>
                              <p className="earned-percent neg">
                                {maticTreasuryPercent}%
                              </p>
                              <Icon
                                name="caret down"
                                className="percent-icon neg"
                              />
                            </span>
                          )}
                        </Table.Cell>
                      </span>
                    ) : (
                      <span>
                        <Table.Cell
                          className="treasury-cell two"
                          textAlign="right"
                        >
                          <Loader
                            active
                            inline
                            size="small"
                            className="treasury-loader"
                          />
                        </Table.Cell>
                      </span>
                    )}
                  </Table.Row>
                </Table.Body>
              </Table>

              <Divider />

              <span className="DG-button-span">
                <Button
                  href="https://gov.decentral.games"
                  target="_blank"
                  className="DG-stake-button"
                >
                  DISCUSSION
                </Button>
                <Button
                  href="https://snapshot.page/#/decentralgames.eth"
                  target="_blank"
                  className="DG-stake-button"
                >
                  VOTING
                </Button>
              </span>
            </div>

            <div
              className="DG-column-treasury two"
              style={{
                position: 'relative',
                height: '100%',
                maxHeight: '330px',
              }}
            >
              <span style={{ display: 'flex' }}>
                <img
                  src={Images.DG_COIN_LOGO}
                  className="farming-logo"
                  alt="Decentral Games Coin Logo"
                />
                <span className="farming-pool-span">
                  <p className="welcome-text">Total $DG Staked</p>
                  {state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE ? (
                    <p className="account-name">
                      {props.formatPrice(
                        state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE,
                        0
                      )}
                    </p>
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

              <Divider />

              <div style={{ display: 'flex' }}>
                <span className="gameplay-left-column">
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      paddingBottom: '17px',
                    }}
                  >
                    <p className="earned-text">APY</p>
                    {APYGovernance ? (
                      <p className="earned-amount">{APYGovernance}%</p>
                    ) : (
                      <Loader
                        active
                        inline
                        size="small"
                        style={{
                          fontSize: '12px',
                          marginTop: '5px',
                          marginLeft: '-1px',
                          marginBottom: '-2px',
                        }}
                      />
                    )}
                  </span>
                </span>

                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '50%',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <p className="earned-text">% of gov pool</p>
                    {percentGovernanceContract ? (
                      <p className="earned-amount">
                        {percentGovernanceContract}%
                      </p>
                    ) : (
                      <Loader
                        active
                        inline
                        size="small"
                        style={{
                          fontSize: '12px',
                          marginTop: '5px',
                          marginLeft: '-1px',
                          marginBottom: '-2px',
                        }}
                      />
                    )}
                  </span>
                </span>
              </div>

              <Divider />

              <Input
                className="liquidity-input"
                fluid
                placeholder="Amount"
                value={amountInput}
                onChange={handleChange}
              />

              <span
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <p
                  className="bpt-text"
                  onClick={() =>
                    setAmountInput(state.DGBalances.BALANCE_ROOT_DG)
                  }
                >
                  {props.formatPrice(state.DGBalances.BALANCE_ROOT_DG, 3)} DG
                </p>
                <p
                  className="bpt-text"
                  onClick={() =>
                    setAmountInput(
                      state.stakingBalances.BALANCE_USER_GOVERNANCE
                    )
                  }
                >
                  {props.formatPrice(
                    state.stakingBalances.BALANCE_USER_GOVERNANCE,
                    3
                  )}{' '}
                  DG STAKED
                </p>
              </span>

              <span className="DG-button-span">
                {Number(amountInput) ? (
                  <Button
                    className="DG-stake-button"
                    id="balances-padding-correct"
                    onClick={() => {
                      props.staking(
                        DGTokenContract,
                        Global.ADDRESSES.DG_STAKING_GOVERNANCE_ADDRESS,
                        stakeContractGovernance,
                        amountInput
                      );
                      setAmountInput('');
                    }}
                  >
                    STAKE $DG
                  </Button>
                ) : (
                  <Button disabled className="DG-stake-button">
                    STAKE $DG
                  </Button>
                )}

                {percentGovernanceStaked && Number(amountInput) ? (
                  <Button
                    className="DG-stake-button"
                    id="balances-padding-correct"
                    onClick={() => {
                      props.withdrawal(stakeContractGovernance, amountInput);
                      setAmountInput('');
                    }}
                  >
                    UNSTAKE $DG
                  </Button>
                ) : (
                  <Button disabled className="DG-stake-button">
                    UNSTAKE $DG
                  </Button>
                )}
              </span>
            </div>
          </span>
        </div>
      </Aux>
    );
  }

  return contentGovernance();
};

export default ContentGovernance;
