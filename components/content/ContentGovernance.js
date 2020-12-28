import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store';
import Web3 from 'web3';
import { Button, Divider, Input, Loader } from 'semantic-ui-react';
import Transactions from '../../common/Transactions';
import Aux from '../_Aux';
import Images from '../../common/Images';
import Fetch from '../../common/Fetch';

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
  const [instances, setInstances] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const stakeContractGovernance = await Transactions.stakingContractGovernance(
          web3
        );
        setStakeContractGovernance(stakeContractGovernance);

        setInstances(true); // contract instantiation complete
      }

      fetchData();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (state.DGBalances.BALANCE_CHILD_MANA) {
      (async () => {
        const response = await Fetch.MANA_PRICE();
        const json = await response.json();

        const priceMANA = json.market_data.current_price.usd;
        const balanceMANAUSD = state.DGBalances.BALANCE_CHILD_MANA * priceMANA;
        const treasuryTotal =
          Number(state.DGBalances.BALANCE_CHILD_DAI) + Number(balanceMANAUSD);
        const treasuryTotalFormatted = props.formatPrice(treasuryTotal, 0);

        setTreasuryTotal(treasuryTotalFormatted);
      })();
    }
  }, [state.DGBalances.BALANCE_CHILD_MANA]);

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
        const stakedTotal = Transactions.getTotalSupply(
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
    console.log('New amount: ' + e.target.value);

    setAmountInput(e.target.value);
  }

  function contentGovernance() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG Governance</h3>
              <p>
                Stake $DG tokens, govern the casino bankroll, and earn $DG
                governance rewards. Proposal submission activates when the
                treasury surpasses $500,000 USD. Read more about $DG governance
                in our{' '}
                <a
                  href="https://www.decentral.games/blog/governance-staking-is-now-live-start-earning-dg-gov-rewards"
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

          <span className="DG-tablet-container">
            <div className="DG-column one">
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
                  {state.DGBalances.BALANCE_ROOT_DG} DG
                </p>
                <p
                  className="bpt-text"
                  onClick={() =>
                    setAmountInput(
                      state.stakingBalances.BALANCE_USER_GOVERNANCE
                    )
                  }
                >
                  {state.stakingBalances.BALANCE_USER_GOVERNANCE} DG STAKED
                </p>
              </span>

              <span className="DG-button-span">
                {Number(amountInput) ? (
                  <Button
                    className="DG-stake-button"
                    id="balances-padding-correct"
                    onClick={() => {
                      props.staking(
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

            <div
              className="DG-column two"
              style={{
                position: 'relative',
                height: '100%',
                maxHeight: '258px',
              }}
            >
              <span style={{ display: 'flex' }}>
                <img
                  src={Images.SNAPSHOT_ICON}
                  className="farming-logo"
                  id="snapshot"
                  alt="Snapshot Governance Logo"
                />
                <span className="farming-pool-span">
                  <p className="welcome-text">treasury balance</p>
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
                    <p className="earned-text">MANA</p>
                    {state.DGBalances.BALANCE_CHILD_MANA ? (
                      <p className="earned-amount">
                        {props.formatPrice(
                          state.DGBalances.BALANCE_CHILD_MANA,
                          2
                        )}
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
                    <p className="earned-text">dai</p>
                    {state.DGBalances.BALANCE_CHILD_DAI ? (
                      <p className="earned-amount">
                        {props.formatPrice(
                          state.DGBalances.BALANCE_CHILD_DAI,
                          2
                        )}
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
          </span>
        </div>
      </Aux>
    );
  }

  return contentGovernance();
};

export default ContentGovernance;
