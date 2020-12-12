import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store';
import { Button, Divider, Input, Icon, Loader } from 'semantic-ui-react';
import Aux from '../_Aux';
import Images from '../../common/Images';
import ButtonReward1 from '../button/ButtonReward1';
import ButtonReward2 from '../button/ButtonReward2';
import Global from '../Constants';
import Transactions from '../../common/Transactions';
import Fetch from '../../common/Fetch';

const ContentFarming = (props) => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [poolSelect, setPoolSelect] = useState(1);
  const [currenReward, setCurrentReward] = useState(0);
  const [finishTime, setFinishTime] = useState(0);
  const [amountInput, setAmountInput] = useState('');
  const [amountInput2, setAmountInput2] = useState('');
  const [amountInput3, setAmountInput3] = useState('10000000000000000000');
  const [amountInput4, setAmountInput4] = useState('');

  const [percentagePool1, setPercentagePool1] = useState(0);
  const [percentagePool2, setPercentagePool2] = useState(0);
  const [percentageGov, setPercentageGov] = useState(0);

  const [manaPrice, setManaPrice] = useState(0);

  // fetch total bet from API
  useEffect(() => {
    (async function () {
      // calculate price of mana
      let response_2 = await Fetch.MANA_PRICE();
      let json_2 = await response_2.json();
      setManaPrice(json_2.market_data.current_price.usd);
    })();
  }, [manaPrice]);

  // usd value calculations
  const price = Number(state.DGBalances[5] / (49 * state.DGBalances[4]));
  const USDToken = Number(price * state.DGBalances[3]);
  const USDGameplay = Number(price * state.DGBalances[0]);
  const PoolOneUSD = Number(price * state.DGBalances[1]);
  const PoolTwoUSD = Number(price * state.DGBalances[2]);

  // pool percentage calculations
  const PoolOnePercentage = Number(
    (state.stakingBalances[2] / state.stakingBalances[0]) * 100
  );
  const PoolTwoPercentage = Number(
    (state.stakingBalances[6] / state.stakingBalances[4]) * 100
  );
  const PercentageGov = Number(
    (state.stakingBalances[9] / state.stakingBalances[8]) * 100
  ).toFixed(2);

  // APY value calculations for pool 1
  const numerator = 51 * 2400 * price * state.DGBalances[10];
  const total_locked =
    state.DGBalances[4] * price + Number(state.DGBalances[8]);
  const denominator = total_locked * state.stakingBalances[0];
  const APY_temp = (numerator / denominator) * 100;
  const manaAPY = Number(APY_temp);

  // APY value calculations for pool 2
  const num = 51 * 2400 * price * state.DGBalances[11];
  const total_locked_2 =
    state.DGBalances[9] * price + Number(state.DGBalances[5]);
  const denom = total_locked_2 * state.stakingBalances[4];
  const APY_temp_2 = (num / denom) * 100;
  const daiAPY = Number(APY_temp_2);

  // treasury stuff
  const treasury_dai = state.DGBalances[13];
  const treasury_mana = state.DGBalances[12] * manaPrice;
  const treasury = Number(treasury_dai) + Number(treasury_mana);

  // get initial reward and timestamp values
  useEffect(() => {
    if (props.instances) {
      // const rewardAdjusted = rewardAmount / Global.CONSTANTS.FACTOR;
      const rewardAdjusted = amountInput3 / Global.CONSTANTS.FACTOR;

      rewardData(rewardAdjusted);
    }
  }, [props.instances]);

  useEffect(() => {
    if (props.instances) {
      (async () => {
        const stakedTotal = await props.stakingContract.methods
          .totalSupply()
          .call();
        const stakedTotalAdjusted = stakedTotal / Global.CONSTANTS.FACTOR;

        if (stakedTotal) {
          const percentagePool1 =
            state.stakingBalances[2] / stakedTotalAdjusted;
          const percentageFixed = (percentagePool1 * 100).toFixed(3);

          setPercentagePool1(percentageFixed);
        } else {
          setPercentagePool1(0);
        }
      })();
    }
  }, [props.instances, state.stakingBalances]);

  useEffect(() => {
    if (props.instances) {
      (async () => {
        const stakedTotal2 = await props.stakingContractTwo.methods
          .totalSupply()
          .call();
        const stakedTotalAdjusted2 = stakedTotal2 / Global.CONSTANTS.FACTOR;

        if (stakedTotal2) {
          const percentagePool2 =
            state.stakingBalances[6] / stakedTotalAdjusted2;
          const percentageFixed2 = (percentagePool2 * 100).toFixed(3);

          setPercentagePool2(percentageFixed2);
        } else {
          setPercentagePool2(0);
        }
      })();
    }
  }, [props.instances, state.stakingBalances]);

  useEffect(() => {
    if (props.instances) {
      (async () => {
        const stakedTotal3 = await props.stakingContractGov.methods
          .totalSupply()
          .call();
        const stakedTotalAdjusted3 = stakedTotal3 / Global.CONSTANTS.FACTOR;

        if (stakedTotal3) {
          const percentagePool3 =
            state.stakingBalances[9] / stakedTotalAdjusted3;
          const percentageFixed3 = (percentagePool2 * 100).toFixed(3);

          setPercentageGov(percentageFixed3);
        } else {
          setPercentageGov(0);
        }
      })();
    }
  }, [props.instances, state.stakingBalances]);

  var onPool;
  if (poolSelect === 1) {
    onPool = () => setPoolSelect(2);
  } else {
    onPool = () => setPoolSelect(1);
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentToken() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG | Decentral Games Governance Token</h3>
              <p>
                {' '}
                $DG is rewarded to players, liquidity providers, and governors
                of the decentral.games ecosystem. Learn more by reading our
                <a
                  href="https://decentral.games/blog/presenting-dg-be-the-house-in-the-first-metaverse-casino"
                  target="_blank"
                  style={{ color: '#2085f4' }}
                >
                  {' '}
                  announcement{' '}
                </a>
                or by visiting our
                <a
                  href="https://decentral-games-1.gitbook.io/dg/allocation"
                  target="_blank"
                  style={{ color: '#2085f4' }}
                >
                  {' '}
                  docs
                </a>
                .
              </p>
            </span>
          </div>
        </div>

        <div className="DG-liquidity-container">
          <div className="DG-column unclaimed">
            <span style={{ display: 'flex' }}>
              <img
                src={Images.DG_COIN_LOGO}
                className="farming-logo"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text">Unclaimed $DG</p>
                <p className="account-name">{state.DGBalances[3]}</p>
              </span>
            </span>

            <Divider />

            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: '11px',
                paddingBottom: '11px',
              }}
            >
              <p className="earned-text">Value USD</p>
              {Number(USDToken) || USDToken === 0 ? (
                <p className="earned-amount">
                  ${USDToken.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </p>
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

            {Number(state.DGBalances[3]) ? (
              <span className="DG-button-span">
                <Button
                  className="DG-claim-button"
                  id="balances-padding-correct"
                  onClick={() => props.scrapeMyTokens()}
                >
                  CLAIM $DG
                </Button>
              </span>
            ) : (
              <span className="DG-button-span">
                <Button disabled className="DG-claim-button">
                  CLAIM $DG
                </Button>
              </span>
            )}
          </div>

          <span className="DG-tablet-container">
            <div className="DG-column" style={{ width: '100%' }}>
              <span style={{ display: 'flex' }}>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 className="DG-h3">Existing NFT Holders</h3>
                  <p
                    className="welcome-text"
                    style={{ marginTop: '-12px', paddingLeft: '0px' }}
                  >
                    {' '}
                    december 1, 2020{' '}
                  </p>
                  <p style={{ paddingTop: '15px' }}>
                    {' '}
                    Each Tominoya and Flamingos NFT Holder gets 120 DG with 20
                    week linear vesting.{' '}
                  </p>
                </span>
              </span>

              <span style={{ display: 'flex', paddingTop: '30px' }}>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 className="DG-h3">All Community Players</h3>
                  <p
                    className="welcome-text"
                    style={{ marginTop: '-12px', paddingLeft: '0px' }}
                  >
                    {' '}
                    december 1, 2020{' '}
                  </p>
                  <p style={{ paddingTop: '15px' }}>
                    {' '}
                    Each Ethereum address that has played our free play games
                    within the last 4 months gets 10 DG (Cutoff: Nov 1, 2020).{' '}
                  </p>
                </span>
              </span>
            </div>
          </span>
        </div>
      </Aux>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentMining() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG Gameplay Mining</h3>
              <p>
                Mine $DG by playing games with MANA or DAI. Earn bonuses by
                playing with friends, wearing DG wearable NFTs, and referring
                friends. Read more about $DG gameplay mining in our{' '}
                <a
                  href="https://decentral-games-1.gitbook.io/dg/allocation"
                  target="_blank"
                  style={{ color: '#2085f4' }}
                >
                  docs
                </a>
                .
              </p>
            </span>
          </div>
        </div>

        <div className="DG-liquidity-container">
          <div className="DG-column unclaimed">
            <span style={{ display: 'flex' }}>
              <img
                src={Images.DG_COIN_LOGO}
                className="farming-logo"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text">Unclaimed $DG</p>
                <p className="account-name">{state.DGBalances[0]}</p>
              </span>
            </span>

            <Divider />

            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: '11px',
                paddingBottom: '11px',
              }}
            >
              <p className="earned-text">Value USD</p>
              {Number(USDGameplay) || USDGameplay === 0 ? (
                <p className="earned-amount">
                  $
                  {USDGameplay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </p>
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
              {Number(state.DGBalances[0]) ? (
                <Button
                  className="DG-claim-button"
                  id="balances-padding-correct"
                  onClick={() => props.metaTransaction()}
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
                  src={Images.MANA_CIRCLE}
                  className="farming-logo"
                  alt="Decentraland Logo"
                />
                <span className="farming-pool-span">
                  <p className="welcome-text"> Coin </p>
                  <p className="account-name">MANA</p>
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
                    }}
                  >
                    <p className="earned-text"> Roulette Rate / 1 DG </p>
                    <p className="earned-amount"> 48K MANA </p>
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
                    <p className="earned-text"> Blackjack Rate / 1 DG </p>
                    <p className="earned-amount"> 100K MANA </p>
                  </span>
                </span>
              </div>

              <Divider />

              <span className="DG-button-span">
                <Button
                  href="https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber"
                  className="DG-play-now-button"
                >
                  PLAY NOW
                </Button>
              </span>
            </div>

            <div className="DG-column two">
              <span style={{ display: 'flex' }}>
                <img
                  src={Images.DAI_CIRCLE}
                  className="farming-logo"
                  alt="Dai Logo"
                />
                <span className="farming-pool-span">
                  <p className="welcome-text"> Coin </p>
                  <p className="account-name">DAI</p>
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
                    }}
                  >
                    <p className="earned-text"> Roulette Rate / 1 DG </p>
                    <p className="earned-amount"> 4K DAI </p>
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
                    <p className="earned-text"> Blackjack Rate / 1 DG </p>
                    <p className="earned-amount"> 8.4K DAI </p>
                  </span>
                </span>
              </div>

              <Divider />

              <span className="DG-button-span">
                <Button
                  href="https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber"
                  className="DG-play-now-button"
                >
                  PLAY NOW
                </Button>
              </span>
            </div>
          </span>
        </div>
      </Aux>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentLiquidity() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG Liquidity Farming</h3>
              <p>
                Farm $DG by providing liquidity in 98/2 MANA-DG and DAI-DG
                Balancer pools and staking the LP tokens on this dashboard. Read
                more about $DG liquidity farming in our
                <a
                  href="https://decentral-games-1.gitbook.io/dg/governance-1"
                  style={{ color: '#2085f4' }}
                >
                  {' '}
                  docs
                </a>
                .
              </p>
            </span>
          </div>
        </div>

        <div className="DG-liquidity-container">
          <div className="DG-column unclaimed">
            <span style={{ display: 'flex' }}>
              <img
                src={Images.DG_COIN_LOGO}
                className="farming-logo"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                {poolSelect === 1 ? (
                  <span>
                    <span style={{ display: 'flex' }}>
                      <p className="welcome-text"> unclaimed 1</p>
                      <Icon
                        name="sort"
                        id="pool-select-icon"
                        onClick={onPool}
                      />
                    </span>
                    <p className="account-name">{state.DGBalances[1]}</p>
                  </span>
                ) : (
                  <span>
                    <span style={{ display: 'flex' }}>
                      <p className="welcome-text"> unclaimed 2</p>
                      <Icon
                        name="sort"
                        id="pool-select-icon"
                        onClick={onPool}
                      />
                    </span>
                    <p className="account-name">{state.DGBalances[2]}</p>
                  </span>
                )}
              </span>
            </span>

            <Divider />

            {poolSelect === 1 ? (
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: '11px',
                  paddingBottom: '11px',
                }}
              >
                <p className="earned-text">Value USD</p>
                {Number(PoolOneUSD) || PoolOneUSD === 0 ? (
                  <p className="earned-amount">
                    $
                    {PoolOneUSD.toFixed(2).replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ','
                    )}
                  </p>
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
            ) : (
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: '11px',
                  paddingBottom: '11px',
                }}
              >
                <p className="earned-text">Value USD</p>
                {Number(PoolTwoUSD) || PoolTwoUSD === 0 ? (
                  <p className="earned-amount">
                    $
                    {PoolTwoUSD.toFixed(2).replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ','
                    )}
                  </p>
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
            )}

            <Divider />

            {poolSelect === 1 ? (
              <span className="DG-button-span">
                {Number(state.DGBalances[1]) ? (
                  <Button
                    className="DG-claim-button"
                    id="balances-padding-correct"
                    onClick={() => props.getReward()}
                  >
                    CLAIM POOL 1 $DG
                  </Button>
                ) : (
                  <Button disabled className="DG-claim-button">
                    CLAIM POOL 1 $DG
                  </Button>
                )}
              </span>
            ) : (
              <span className="DG-button-span">
                {Number(state.DGBalances[2]) ? (
                  <Button
                    className="DG-claim-button"
                    id="balances-padding-correct"
                    onClick={() => props.getReward_2()}
                  >
                    CLAIM POOL 2 $DG
                  </Button>
                ) : (
                  <Button disabled className="DG-claim-button">
                    CLAIM POOL 2 $DG
                  </Button>
                )}
              </span>
            )}
          </div>

          <span className="DG-tablet-container">
            <div
              className="DG-column one"
              id="DG-column-hover"
              style={{ position: 'relative', height: '100%' }}
            >
              <span style={{ display: 'flex' }}>
                <img
                  src={Images.MANA_CIRCLE}
                  className="farming-logo"
                  alt="Decentraland Logo"
                />
                <img
                  src={Images.DG_COIN_LOGO}
                  className="farming-logo"
                  alt="Decentral Games Coin Logo"
                />
                <span className="farming-pool-span">
                  <p className="welcome-text">pool 1</p>
                  <p className="account-name">MANA-DG</p>
                </span>
              </span>

              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a
                  href="https://pools.balancer.exchange/#/pool/0xca54c398195fce98856888b0fd97a9470a140f71/"
                  target="_blank"
                  style={{ marginTop: '-75px', marginRight: '0px' }}
                >
                  <Icon
                    className="more-text"
                    name="external square alternate"
                  />
                </a>
              </span>

              <Divider />

              <div style={{ display: 'flex' }}>
                <span className="gameplay-left-column">
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <p className="earned-text">APY</p>
                    {Number(manaAPY) && isFinite(manaAPY) ? (
                      <p className="earned-amount">{manaAPY.toFixed(2)}%</p>
                    ) : (
                      <Loader
                        active
                        inline
                        size="small"
                        style={{
                          fontSize: '12px',
                          marginTop: '5px',
                          marginLeft: '-1px',
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
                    <p className="earned-text">% of pool 1</p>
                    <p className="earned-amount">
                      {Number(PoolOnePercentage) || PoolOnePercentage === 0 ? (
                        <p className="earned-amount">
                          {PoolOnePercentage.toFixed(2)}%
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
                          }}
                        />
                      )}
                    </p>
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
                  onClick={() => setAmountInput(state.stakingBalances[3])}
                >
                  {state.stakingBalances[3]} BPT
                </p>
                <p
                  className="bpt-text"
                  onClick={() => setAmountInput(state.stakingBalances[2])}
                >
                  {state.stakingBalances[2]} BPT staked
                </p>
              </span>

              <span className="DG-button-span">
                {amountInput ? (
                  <Button
                    className="DG-stake-button"
                    id="balances-padding-correct"
                    onClick={() => {
                      stake('stake', amountInput);
                      setAmountInput('');
                    }}
                  >
                    STAKE BPT
                  </Button>
                ) : (
                  <Button disabled className="DG-stake-button">
                    STAKE BPT
                  </Button>
                )}

                {percentagePool1 && amountInput ? (
                  <Button
                    className="DG-stake-button"
                    id="balances-padding-correct"
                    onClick={() => {
                      stake('withdraw', amountInput);
                      setAmountInput('');
                    }}
                  >
                    UNSTAKE BPT
                  </Button>
                ) : (
                  <Button disabled className="DG-stake-button">
                    UNSTAKE BPT
                  </Button>
                )}
              </span>
            </div>

            <div
              className="DG-column two"
              style={{ position: 'relative', height: '100%' }}
            >
              <span style={{ display: 'flex' }}>
                <img
                  src={Images.DAI_CIRCLE}
                  className="farming-logo"
                  alt="Dai Logo"
                />
                <img
                  src={Images.DG_COIN_LOGO}
                  className="farming-logo"
                  alt="Decentral Games Coin Logo"
                />
                <span className="farming-pool-span">
                  <p className="welcome-text"> pool 2 </p>
                  <p className="account-name"> DAI-DG </p>
                </span>
              </span>

              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a
                  href="https://pools.balancer.exchange/#/pool/0x3cf393b95a4fbf9b2bdfc2011fd6675cf51d3e5d/"
                  target="_blank"
                  style={{ marginTop: '-75px', marginRight: '0px' }}
                >
                  <Icon
                    className="more-text"
                    name="external square alternate"
                  />
                </a>
              </span>

              <Divider />

              <div style={{ display: 'flex' }}>
                <span className="gameplay-left-column">
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <p className="earned-text">APY</p>
                    {Number(daiAPY) && isFinite(daiAPY) ? (
                      <p className="earned-amount">{daiAPY.toFixed(2)}%</p>
                    ) : (
                      <Loader
                        active
                        inline
                        size="small"
                        style={{
                          fontSize: '12px',
                          marginTop: '5px',
                          marginLeft: '-1px',
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
                    <p className="earned-text">% of pool 2</p>
                    {Number(PoolTwoPercentage) || PoolTwoPercentage === 0 ? (
                      <p className="earned-amount">
                        {PoolTwoPercentage.toFixed(2)}%
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
                value={amountInput2}
                onChange={handleChange2}
              />

              <span
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <p
                  className="bpt-text"
                  onClick={() => setAmountInput2(state.stakingBalances[7])}
                >
                  {state.stakingBalances[7]} BPT
                </p>
                <p
                  className="bpt-text"
                  onClick={() => setAmountInput2(state.stakingBalances[6])}
                >
                  {state.stakingBalances[6]} BPT staked
                </p>
              </span>

              <span className="DG-button-span">
                {amountInput2 ? (
                  <Button
                    className="DG-stake-button"
                    id="balances-padding-correct"
                    onClick={() => {
                      stake_2('stake', amountInput2);
                      setAmountInput2('');
                    }}
                  >
                    STAKE BPT
                  </Button>
                ) : (
                  <Button disabled className="DG-stake-button">
                    STAKE BPT
                  </Button>
                )}

                {percentagePool2 && amountInput2 ? (
                  <Button
                    className="DG-stake-button"
                    id="balances-padding-correct"
                    onClick={() => {
                      stake_2('withdraw', amountInput2);
                      setAmountInput2('');
                    }}
                  >
                    UNSTAKE BPT
                  </Button>
                ) : (
                  <Button disabled className="DG-stake-button">
                    UNSTAKE BPT
                  </Button>
                )}
              </span>
            </div>
          </span>
        </div>
      </Aux>
    );
  }

  function handleChange(e) {
    console.log('New amount: ' + e.target.value);

    setAmountInput(e.target.value);
  }

  function handleChange2(e) {
    console.log('New amount: ' + e.target.value);

    setAmountInput2(e.target.value);
  }

  function handleChange3(e) {
    console.log('New amount: ' + e.target.value);

    setAmountInput3(e.target.value);
  }

  function handleChange4(e) {
    console.log('New amount: ' + e.target.value);

    setAmountInput4(e.target.value);
  }

  function stake(type, amount) {
    if (type === 'stake') {
      props.staking(amount);
    } else if (type === 'withdraw') {
      props.withdraw(amount);
    }

    setAmountInput('0');
  }

  function stake_2(type, amount) {
    if (type === 'stake') {
      props.staking_2(amount);
    } else if (type === 'withdraw') {
      props.withdraw_2(amount);
    }

    setAmountInput2('0');
  }

  function stake_gov(type, amount) {
    if (type === 'stake') {
      props.staking_gov(amount);
    } else if (type === 'withdraw') {
      props.withdraw_gov(amount);
    }

    setAmountInput2('0');
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentGovernance() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">Decentral Games Governance</h3>
              <p>
                Stake $DG tokens, govern the house profits, and
                earn $DG governance rewards. $DG proposal submission activates once the treasury
                surpasses $500,000 USD. Read more about $DG governance in our{' '}
                <a
                  href="https://decentral-games-1.gitbook.io/dg/governance-1"
                  style={{ color: '#2085f4' }}
                >
                  docs
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
                id="snapshot"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text"> Unclaimed</p>
                <p className="account-name">0.000</p>
              </span>
            </span>

            <Divider />

            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: '11px',
                paddingBottom: '11px',
              }}
            >
              <p className="earned-text"> Value USD </p>
              <p className="earned-amount"> $0.00 </p>
            </span>

            <Divider />

            <span className="DG-button-span">
              {Number(state.DGBalances[14]) ? (
                <Button
                  className="DG-claim-button"
                  id="balances-padding-correct"
                  onClick={() => props.getReward_gov()}
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
                  <p className="welcome-text">Total Staked DG</p>
                  <p className="account-name">{state.stakingBalances[8]}</p>
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
                    }}
                  >
                    <p className="earned-text">% of gov pool</p>
                    {Number(PercentageGov) || PercentageGov == 0 ? (
                      <p className="earned-amount">
                        {PercentageGov}%
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
                    <p className="earned-text">Treasury</p>
                    {Number(treasury) ? (
                      <p className="earned-amount">${treasury.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                    ) : (
                      <Loader
                        active
                        inline
                        size="small"
                        style={{
                          fontSize: '12px',
                          marginTop: '5px',
                          marginLeft: '-1px',
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
                value={amountInput4}
                onChange={handleChange4}
              />

              <span
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <p className="bpt-text"
                  onClick={() => setAmountInput4(state.DGBalances[6])}
                >
                  {state.DGBalances[6]} DG
                </p>
                <p className="bpt-text"
                  onClick={() => setAmountInput4(state.stakingBalances[9])}
                >
                  {state.stakingBalances[9]} DG STAKED
                </p>
              </span>

              <span className="DG-button-span">
                {amountInput4 ? (
                  <Button
                    className="DG-stake-button"
                    id="balances-padding-correct"
                    onClick={() => {
                      stake_gov('stake', amountInput4);
                      setAmountInput4('');
                    }}
                  >
                    STAKE $DG
                  </Button>
                ) : (
                  <Button disabled className="DG-stake-button">
                    STAKE $DG
                  </Button>
                )}

                {percentageGov && amountInput4 ? (
                  <Button
                    className="DG-stake-button"
                    id="balances-padding-correct"
                    onClick={() => {
                      stake_gov('withdraw', amountInput4);
                      setAmountInput4('');
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
                maxHeight: '183px',
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
                  <p className="welcome-text"> Proposals</p>
                  <p className="account-name">0</p>
                </span>
              </span>

              <Divider />

              <span className="DG-button-span">
                <Button disabled className="DG-stake-button">
                  DISCUSSION
                </Button>
                <Button disabled className="DG-stake-button">
                  VOTING
                </Button>
              </span>
            </div>
          </span>
        </div>
      </Aux>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentAdmin() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <p>BPT balance in contract: {state.stakingBalances[0]}</p>
              <p>DG balance in contract: {state.stakingBalances[1]}</p>
              <p>Current reward amount: {currenReward}</p>
              <p>Reward period finish time: {finishTime}</p>

              <Input
                className="liquidity-input"
                fluid
                placeholder="Amount"
                value={amountInput3}
                onChange={handleChange3}
              />

              <Divider />

              <p>
                <ButtonReward1
                  stakingContract={props.stakingContract}
                  rewardAmount={amountInput3}
                  rewardData={(amount) => rewardData(amount)}
                />
              </p>
              <p>
                <ButtonReward2
                  stakingContractTwo={props.stakingContractTwo}
                  rewardAmount={amountInput3}
                  rewardData={(amount) => rewardData(amount)}
                />
              </p>
            </span>
          </div>
        </div>
      </Aux>
    );
  }

  async function rewardData(amountReward) {
    console.log('current reward: ' + amountReward);

    const timestamp = await props.getPeriodFinish();
    console.log('current timestamp: ' + timestamp);

    const date = new Date(timestamp * 1000);
    const hours = date.getHours(); // hours part from the timestamp
    const minutes = '0' + date.getMinutes(); // minutes part from the timestamp
    const seconds = '0' + date.getSeconds(); // seconds part from the timestamp
    const formattedTime =
      hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    setCurrentReward(amountReward);
    setFinishTime(formattedTime);

    // dispatch timestamp to the Context API store
    dispatch({
      type: 'stake_time',
      data: timestamp,
    });
  }

  if (props.content === 'token') {
    return contentToken();
  } else if (props.content === 'mining') {
    return contentMining();
  } else if (props.content === 'liquidity') {
    return contentLiquidity();
  } else if (props.content === 'governance') {
    return contentGovernance();
  } else if (props.content === 'admin') {
    return contentAdmin();
  }
};

export default ContentFarming;
