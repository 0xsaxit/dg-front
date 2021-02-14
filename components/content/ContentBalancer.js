import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store';
import Web3 from 'web3';
import { Button, Divider, Loader, Icon, Input } from 'semantic-ui-react';
import Aux from '../_Aux';
import Images from '../../common/Images';
import Transactions from '../../common/Transactions';
import Global from '../Constants';

const ContentBalancer = (props) => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [pool1, setPool1] = useState(true);
  const [amountInputMANA, setAmountInputMANA] = useState('');
  const [amountInputDAI, setAmountInputDAI] = useState('');
  const [percentagePool1, setPercentagePool1] = useState(0);
  const [percentagePool2, setPercentagePool2] = useState(0);
  // const [APYMANA, setAPYMANA] = useState(0);
  // const [APYDAI, setAPYDAI] = useState(0);
  // const [poolPercentage1, setPoolPercentage1] = useState(0);
  // const [poolPercentage2, setPoolPercentage2] = useState(0);
  const [pool1USD, setPool1USD] = useState(0);
  const [pool2USD, setPool2USD] = useState(0);
  const [BPTContract1, setBPTContract1] = useState({});
  const [BPTContract2, setBPTContract2] = useState({});

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const BPTContract1 = await Transactions.BPTContract1(web3);
        setBPTContract1(BPTContract1);

        const BPTContract2 = await Transactions.BPTContract2(web3);
        setBPTContract2(BPTContract2);
      }

      fetchData();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (
      props.price &&
      state.DGBalances.BALANCE_STAKING_BALANCER_1 &&
      state.DGBalances.BALANCE_STAKING_BALANCER_2
    ) {
      const pool1USD =
        props.price * state.DGBalances.BALANCE_STAKING_BALANCER_1;
      const pool1Formatted = props.formatPrice(pool1USD, 2);

      setPool1USD(pool1Formatted);

      const pool2USD =
        props.price * state.DGBalances.BALANCE_STAKING_BALANCER_2;
      const pool2Formatted = props.formatPrice(pool2USD, 2);

      setPool2USD(pool2Formatted);
    }
  }, [
    props.price,
    state.DGBalances.BALANCE_STAKING_BALANCER_1,
    state.DGBalances.BALANCE_STAKING_BALANCER_2,
  ]);

  // useEffect(() => {
  //   if (props.price && state.stakingBalances.BALANCE_CONTRACT_BPT_1) {
  //     const numeratorMANA =
  //       51 * 1200 * props.price * state.DGBalances.SUPPLY_BPT_1;
  //     const totalLockedMANA =
  //       state.DGBalances.BALANCE_BP_DG_1 * props.price +
  //       Number(state.DGBalances.TOTAL_MANA);
  //     const denominatorMANA =
  //       totalLockedMANA * state.stakingBalances.BALANCE_CONTRACT_BPT_1;

  //     setAPYMANA(((numeratorMANA / denominatorMANA) * 100).toFixed(2));

  //     setPoolPercentage1(
  //       (
  //         (state.stakingBalances.BALANCE_STAKED_BPT_1 /
  //           state.stakingBalances.BALANCE_CONTRACT_BPT_1) *
  //         100
  //       ).toFixed(2)
  //     );
  //   }
  // }, [props.price, state.stakingBalances.BALANCE_CONTRACT_BPT_1]);

  // useEffect(() => {
  //   if (props.price && state.stakingBalances.BALANCE_CONTRACT_BPT_2) {
  //     const numeratorDAI =
  //       51 * 1200 * props.price * state.DGBalances.SUPPLY_BPT_2;
  //     const totalLockedDAI =
  //       state.DGBalances.BALANCE_BP_DG_2 * props.price +
  //       Number(state.DGBalances.BALANCE_BP_DAI);
  //     const denominatorDAI =
  //       totalLockedDAI * state.stakingBalances.BALANCE_CONTRACT_BPT_2;

  //     setAPYDAI(((numeratorDAI / denominatorDAI) * 100).toFixed(2));

  //     setPoolPercentage2(
  //       (
  //         (state.stakingBalances.BALANCE_STAKED_BPT_2 /
  //           state.stakingBalances.BALANCE_CONTRACT_BPT_2) *
  //         100
  //       ).toFixed(2)
  //     );
  //   }
  // }, [props.price, state.stakingBalances.BALANCE_CONTRACT_BPT_2]);

  // useEffect(() => {
  //   if (props.instances) {
  //     (async () => {
  //       const stakedTotal = await Transactions.getTotalSupply(
  //         props.stakingContractPool1
  //       );

  //       if (stakedTotal) {
  //         const percentagePool =
  //           state.stakingBalances.BALANCE_STAKED_BPT_1 / stakedTotal;
  //         const percentageFixed = percentagePool * 100;

  //         setPercentagePool1(percentageFixed);
  //       } else {
  //         setPercentagePool1(0);
  //       }
  //     })();
  //   }
  // }, [props.instances, state.stakingBalances.BALANCE_STAKED_BPT_1]);

  // useEffect(() => {
  //   if (props.instances) {
  //     (async () => {
  //       const stakedTotal = await Transactions.getTotalSupply(
  //         props.stakingContractPool2
  //       );

  //       if (stakedTotal) {
  //         const percentagePool =
  //           state.stakingBalances.BALANCE_STAKED_BPT_2 / stakedTotal;
  //         const percentageFixed = percentagePool * 100;

  //         setPercentagePool2(percentageFixed);
  //       } else {
  //         setPercentagePool2(0);
  //       }
  //     })();
  //   }
  // }, [props.instances, state.stakingBalances.BALANCE_STAKED_BPT_2]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function handleChangeMANA(e) {
    console.log('New amount (MANA): ' + e.target.value);

    setAmountInputMANA(e.target.value);
  }

  function handleChangeDAI(e) {
    console.log('New amount (DAI): ' + e.target.value);

    setAmountInputDAI(e.target.value);
  }

  function contentBalancer() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG Balancer Liquidity Incentives</h3>
              <p>
                Balancer LP rewards have now ended following this{' '}
                <a
                  href="https://snapshot.page/#/decentralgames.eth/proposal/QmRnnRAA3uHJjSvgMhLvigtapKRLNF1D5Wes5gVkRyJ1HX"
                  style={{ color: '#2085f4' }}
                  target="_blank"
                >
                  gov proposal
                </a>
                . The Uniswap LP rewards are still active and have been increased.{' '}
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
                {pool1 ? (
                  <span>
                    <span style={{ display: 'flex' }}>
                      <p className="welcome-text">unclaimed 1</p>
                      <Icon
                        name="sort"
                        id="pool-select-icon"
                        onClick={() => setPool1(!pool1)}
                      />
                    </span>
                    <p className="account-name">
                      {state.DGBalances.BALANCE_STAKING_BALANCER_1 ? (
                        props.formatPrice(
                          state.DGBalances.BALANCE_STAKING_BALANCER_1,
                          3
                        )
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
                    </p>
                  </span>
                ) : (
                  <span>
                    <span style={{ display: 'flex' }}>
                      <p className="welcome-text">unclaimed 2</p>
                      <Icon
                        name="sort"
                        id="pool-select-icon"
                        onClick={() => setPool1(!pool1)}
                      />
                    </span>
                    <p className="account-name">
                      {state.DGBalances.BALANCE_STAKING_BALANCER_2 ? (
                        props.formatPrice(
                          state.DGBalances.BALANCE_STAKING_BALANCER_2,
                          3
                        )
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
                    </p>
                  </span>
                )}
              </span>
            </span>

            <Divider />

            {pool1 ? (
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
                {pool1USD ? (
                  <p className="earned-amount">${pool1USD}</p>
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
                  paddingTop: '12px',
                  paddingBottom: '12px',
                }}
              >
                <p className="earned-text">Value USD</p>
                {pool2USD ? (
                  <p className="earned-amount">${pool2USD}</p>
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

            {pool1 ? (
              <span className="DG-button-span">
                {Number(state.DGBalances.BALANCE_STAKING_BALANCER_1) ? (
                  <Button
                    className="DG-claim-button"
                    id="balances-padding-correct"
                    onClick={() => props.reward(props.stakingContractPool1)}
                  >
                    CLAIM BALANCER 1 $DG
                  </Button>
                ) : (
                  <Button disabled className="DG-claim-button">
                    CLAIM BALANCER 1 $DG
                  </Button>
                )}
              </span>
            ) : (
              <span className="DG-button-span">
                {Number(state.DGBalances.BALANCE_STAKING_BALANCER_2) ? (
                  <Button
                    className="DG-claim-button"
                    id="balances-padding-correct"
                    onClick={() => props.reward(props.stakingContractPool2)}
                  >
                    CLAIM BALANCER 2 $DG
                  </Button>
                ) : (
                  <Button disabled className="DG-claim-button">
                    CLAIM BALANCER 2 $DG
                  </Button>
                )}
              </span>
            )}
          </div>

        </div>
      </Aux>
    );
  }

  return contentBalancer();
};

export default ContentBalancer;
