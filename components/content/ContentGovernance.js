import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from '../../store';
import Web3 from 'web3';
import { Button, Divider, Input, Loader, Popup, Icon } from 'semantic-ui-react';
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
  const [treasuryTotal, setTreasuryTotal] = useState(0);
  const [amountInput, setAmountInput] = useState('');
  const [percentGovernanceStaked, setPercentGovernanceStaked] = useState(0);
  const [percentGovernanceContract, setPercentGovernanceContract] = useState(0);
  const [APYGovernance, setAPYGovernance] = useState(0);
  const [priceUSD, setPriceUSD] = useState(0);
  const [stakeContractGovernance, setStakeContractGovernance] = useState({});
  const [DGTokenContract, setDGTokenContract] = useState({});
  const [manaBalance, setManaBalance] = useState(0);
  const [daiBalance, setDaiBalance] = useState(0);
  const [gameplayTreasury, setGameplayTreasury] = useState(0);
  const [dgTreasury, setDgTreasury] = useState(0);
  const [landTreasury, setLandTreasury] = useState(0);
  const [nftTreasury, setNftTreasury] = useState(0);
  const [statsUSD, setStatsUSD] = useState('');
  const [instances, setInstances] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  // fetch number of proposals

  function length(obj) {
    return Object.keys(obj).length;
  }

  // useEffect(() => {
  //   (async function () {
  //     let response_1 = await Fetch.PROPOSALS();
  //     let json_1 = await response_1.json();
  //     console.log('1!!!');
  //     console.log(length(json_1));
  //   })();
  // }, []);

  useEffect(() => {
    (async function () {
      // get treasury statistics
      if (state.userStatus) {
        let response_3 = await Fetch.TREASURY_STATS(state.userAddress);
        let json_3 = await response_3.json();
        let usd = json_3.totalBalanceUSD;

        setStatsUSD(usd);
      }
    })();
  }, []);

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

  useEffect(
    () => {
      if (state.DGBalances.BALANCE_CHILD_MANA) {
        (async () => {
          const manaTotal =
            Number(state.DGBalances.BALANCE_CHILD_MANA) +
            Number(state.DGBalances.CEO_MANA);
          const treasuryManaFormatted = props.formatPrice(manaTotal, 0);

          const daiTotal =
            Number(state.DGBalances.BALANCE_CHILD_DAI) +
            Number(state.DGBalances.CEO_DAI);
          const treasuryDaiFormatted = props.formatPrice(daiTotal, 0);

          setManaBalance(treasuryManaFormatted);
          setDaiBalance(treasuryDaiFormatted);
        })();
      }
    },
    [state.DGBalances.BALANCE_CHILD_MANA],
    [state.DGBalances.CEO_MANA]
  );

  useEffect(() => {
    if (state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) {
      const percentGovernanceContract = (
        (state.stakingBalances.BALANCE_USER_GOVERNANCE /
          state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) *
        100
      ).toFixed(2);

      setPercentGovernanceContract(percentGovernanceContract);

      const APYGovernance = (
        (20000 / state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) *
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

  useEffect(() => {
    if (state.DGBalances.BALANCE_CHILD_MANA) {
      (async () => {
        const response = await Fetch.MANA_PRICE();
        const json = await response.json();

        const priceMANA = json.market_data.current_price.usd;
        const balanceMANAUSD = state.DGBalances.BALANCE_CHILD_MANA * priceMANA;
        const balanceMANA_CEO_USD = state.DGBalances.CEO_MANA * priceMANA;
        const gameplayTotal =
          Number(state.DGBalances.BALANCE_CHILD_DAI) +
          Number(balanceMANAUSD) +
          Number(balanceMANA_CEO_USD) +
          Number(state.DGBalances.CEO_DAI);
        const gameplayTotalFormatted = props.formatPrice(gameplayTotal, 0);

        const dgTotal = Number(3000 * props.price);
        const dgTotalFormatted = props.formatPrice(dgTotal, 0);

        const landTotal = Number(403 * 1518.32);
        const landTotalFormatted = props.formatPrice(landTotal, 0);

        const nftPrice = 7500 * priceMANA;
        const nftTotal = Number(210 * nftPrice);
        const nftTotalFormatted = props.formatPrice(nftTotal, 0);

        const totalTreasury = gameplayTotal + dgTotal + landTotal + nftTotal;
        const treasuryTotalFormatted = props.formatPrice(totalTreasury, 0);

        setGameplayTreasury(gameplayTotalFormatted);
        setDgTreasury(dgTotalFormatted);
        setLandTreasury(landTotalFormatted);
        setNftTreasury(nftTotalFormatted);
        setTreasuryTotal(treasuryTotalFormatted);
      })();
    }
  }, [
    state.DGBalances.BALANCE_CHILD_MANA,
    props.price,
    state.DGBalances.CEO_MANA,
  ]);

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
                Stake $DG tokens, govern the $DG treasury, and earn $DG
                governance rewards. Proposal submissions for casino profits
                activate when the gameplay treasury surpasses $500,000 USD.
                Users can submit proposals for LAND and $DG treasury allocation
                immediately. Read more about $DG governance in our{' '}
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

        <div className="DG-liquidity-container gov">
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
                <img
                  src={Images.SNAPSHOT_ICON}
                  className="farming-logo"
                  id="snapshot"
                  alt="Snapshot Governance Logo"
                />
                <span className="farming-pool-span" style={{ width: '60%' }}>
                  <p className="welcome-text">total treasury</p>
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
                    width: '35%',
                    maxWidth: '48.5%',
                    height: '72px',
                  }}
                >
                  <Chart data={data} axes={axes} series={series} />
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
                <span style={{ display: 'flex' }}>
                  <p className="earned-text">Gameplay Treasury</p>
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
                {gameplayTreasury ? (
                  <p className="earned-amount">${gameplayTreasury}</p>
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

              <span
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                }}
              >
                <span style={{ display: 'flex' }}>
                  <p className="earned-text">$DG Treasury</p>
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
                        calculated as 3,000 $DG at market price{' '}
                      </p>
                    </div>
                  </Popup>
                </span>
                {dgTreasury ? (
                  <p className="earned-amount">${dgTreasury}</p>
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

              <span
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                }}
              >
                <span style={{ display: 'flex' }}>
                  <p className="earned-text">LAND Treasury</p>
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
                        calculated as 403 parcels times T30 avg LAND price{' '}
                      </p>
                    </div>
                  </Popup>
                </span>
                {landTreasury ? (
                  <p className="earned-amount">${landTreasury}</p>
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

              <span
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                }}
              >
                <span style={{ display: 'flex' }}>
                  <p className="earned-text">Wearables Treasury</p>
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
                        calculated as 210 wearables times 7,500 MANA at current
                        market price{' '}
                      </p>
                    </div>
                  </Popup>
                </span>
                {nftTreasury ? (
                  <p className="earned-amount">${nftTreasury}</p>
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
                <Button
                  href="https://discord.gg/VQ2ddfFBnu"
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
