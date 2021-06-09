import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from '../../store';
import Web3 from 'web3';
import { Button, Divider, Input, Loader } from 'semantic-ui-react';
import Transactions from '../../common/Transactions';
import Aux from '../_Aux';
import Images from '../../common/Images';
import Fetch from '../../common/Fetch';
import Global from '../Constants';

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
  const [instances, setInstances] = useState(false);

  // governance variables
  const [govOne, setGovOne] = useState('');
  const [passedOne, setPassedOne] = useState(false);
  const [endOne, setEndOne] = useState('');
  const [linkOne, setLinkOne] = useState('');

  const [govTwo, setGovTwo] = useState('');
  const [passedTwo, setPassedTwo] = useState(false);
  const [endTwo, setEndTwo] = useState('');
  const [linkTwo, setLinkTwo] = useState('');

  const [govThree, setGovThree] = useState('');
  const [passedThree, setPassedThree] = useState(false);
  const [endThree, setEndThree] = useState('');
  const [linkThree, setLinkThree] = useState('');


  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function length(obj) {
    return Object.keys(obj).length;
  }

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
        (62571 / state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) *
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
    (async function () {
      // get snapshot statistics
      let response = await Fetch.PROPOSALS();
      let json = await response.json();

      setGovOne(
        json.QmVbSn433qDFo7cF1Ci57T8rmNeAJzTd25dRGKUjoPsv4p.msg.payload
      );
      setLinkOne(
        json.QmVbSn433qDFo7cF1Ci57T8rmNeAJzTd25dRGKUjoPsv4p.authorIpfsHash
      );
      let temp_one =
        json.QmVbSn433qDFo7cF1Ci57T8rmNeAJzTd25dRGKUjoPsv4p.msg.payload.end;

      if (temp_one * 1000 < Date.now()) {
        setPassedOne(true);
      } else {
        setPassedOne(false);
      }

      var date = new Date(govOne.end * 1000);
      setEndOne(date.toDateString());

      setGovTwo(
        json.QmZj2oFNnuR7Pd5jbsyCs7fzGd3NCy4GDbK4fj66b1uJnE.msg.payload
      );
      setLinkTwo(
        json.QmZj2oFNnuR7Pd5jbsyCs7fzGd3NCy4GDbK4fj66b1uJnE.authorIpfsHash
      );
      let temp_two =
        json.QmZj2oFNnuR7Pd5jbsyCs7fzGd3NCy4GDbK4fj66b1uJnE.msg.payload.end;

      if (temp_two * 1000 < Date.now()) {
        setPassedTwo(true);
      } else {
        setPassedTwo(false);
      }

      var date = new Date(govTwo.end * 1000);
      setEndTwo(date.toDateString());

      setGovThree(
        json.QmdoJMQ9zscDiLrpuwy7sPYTRtiosM2s15oDLkEqUrSJ4V.msg.payload
      );
      setLinkThree(
        json.QmdoJMQ9zscDiLrpuwy7sPYTRtiosM2s15oDLkEqUrSJ4V.authorIpfsHash
      );
      let temp_three =
        json.QmdoJMQ9zscDiLrpuwy7sPYTRtiosM2s15oDLkEqUrSJ4V.msg.payload.end;

      if (temp_three * 1000 < Date.now()) {
        setPassedThree(true);
      } else {
        setPassedThree(false);
      }

      var date = new Date(temp_three * 1000);
      setEndThree(date.toDateString());
    })();
  }, [endOne, endTwo, endThree]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function handleChange(e) {
    setAmountInput(e.target.value);
  }

  return (
    <Aux>
      <div className="DG-liquidity-container">
        <div className="DG-column unclaimed">
          <p className="earned-amount" style={{ paddingTop: '2px' }}>
            Unclaimed
          </p>

          <Divider className="divider-dg-top" />

          <span style={{ display: 'flex' }}>
            <img
              src={Images.DG_COIN_LOGO}
              className="farming-logo-small"
              alt="Decentral Games Coin Logo"
            />
            <span className="farming-pool-span">
              <p className="welcome-text-top">$DG Balance</p>
              {state.DGBalances.BALANCE_STAKING_GOVERNANCE ? (
                <p className="earned-amount">
                  {props.formatPrice(
                    state.DGBalances.BALANCE_STAKING_GOVERNANCE,
                    3
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
                    marginBottom: '-2px',
                  }}
                />
              )}
            </span>
          </span>

          <Divider className="divider-dg-top" />

          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: '3px',
            }}
          >
            <p className="welcome-text" style={{ paddingLeft: '0px' }}>
              {' '}
              TOTAL USD{' '}
            </p>
            <p className="earned-amount"> ${priceUSD} </p>
          </span>

          <Divider className="divider-dg-top" />

          <p style={{ fontSize: '18px' }}>
            Stake $DG tokens, govern the treasury, and earn governance rewards.
            Read more about $DG governance in our{' '}
            <a
              href={`${Global.CONSTANTS.BASE_URL}/blog/governance-staking-is-now-live-start-earning-dg-gov-rewards`}
              style={{ color: '#2085f4' }}
              target="_blank"
            >
              announcement{' '}
            </a>
            and get $DG{' '}
            <a
              href={`https://info.uniswap.org/pair/${Global.ADDRESSES.UNISWAP_ADDRESS_STAKING}`}
              style={{ color: '#2085f4' }}
              target="_blank"
            >
              here
            </a>
            .
          </p>

          <Divider className="divider-dg-top" />

          <span className="DG-button-span">
            {Number(state.DGBalances.BALANCE_STAKING_GOVERNANCE) ? (
              <Button
                className="DG-claim-button"
                id="balances-padding-correct"
                onClick={() => props.reward(stakeContractGovernance)}
              >
                Claim
              </Button>
            ) : (
              <Button disabled className="DG-claim-button">
                Claim
              </Button>
            )}
          </span>
        </div>

        <div className="DG-tablet-container-gov">
          <div
            className="DG-column-treasury two"
            style={{
              position: 'relative',
              height: '100%',
            }}
          >
            <p className="earned-amount" style={{ paddingTop: '2px' }}>
              Governance Staking
            </p>

            <Divider className="divider-dg-top" />

            <span style={{ display: 'flex' }}>
              <img
                src={Images.DG_COIN_LOGO}
                className="farming-logo-small"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text-top">Total $DG Staked</p>
                {state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE ? (
                  <p className="earned-amount">
                    {props.formatPrice(
                      state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE,
                      0
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
                      marginBottom: '-2px',
                    }}
                  />
                )}
              </span>
            </span>

            <Divider className="divider-dg-top" />

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
                    <p className="earned-amount stat">{APYGovernance}%</p>
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
                    <p className="earned-amount stat">
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

            <Divider className="divider-dg-top" />

            <Input
              className="liquidity-input"
              fluid
              placeholder="Amount"
              value={amountInput}
              onChange={handleChange}
            />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p
                className="bpt-text"
                onClick={() => setAmountInput(state.DGBalances.BALANCE_ROOT_DG)}
              >
                {props.formatPrice(state.DGBalances.BALANCE_ROOT_DG, 3)} DG
              </p>
              <p
                className="bpt-text"
                onClick={() =>
                  setAmountInput(state.stakingBalances.BALANCE_USER_GOVERNANCE)
                }
              >
                {props.formatPrice(
                  state.stakingBalances.BALANCE_USER_GOVERNANCE,
                  3
                )}{' '}
                DG STAKED
              </p>
            </span>

            <span className="DG-button-span" style={{ paddingTop: '8px' }}>
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
                  Stake
                </Button>
              ) : (
                <Button disabled className="DG-stake-button">
                  Stake
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
                  Unstake
                </Button>
              ) : (
                <Button disabled className="DG-stake-button">
                  Unstake
                </Button>
              )}
            </span>
          </div>

          <div
            className="DG-column-treasury three"
            style={{
              position: 'relative',
              height: '100%',
            }}
          >
            <p className="earned-amount" style={{ paddingTop: '2px' }}>
              Governance Proposals
            </p>

            <Divider className="divider-dg-top" />

            <a
              target="_blank"
              href={`https://snapshot.org/#/decentralgames.eth/proposal/${linkOne}`}
            >
              <div
                className={`${
                  passedOne ? 'governance-block' : 'governance-block-blue'
                }`}
              >
                <p className="earned-amount">{govOne.name}</p>
                <span style={{ display: 'flex' }}>
                  {passedOne == true ? (
                    <Button className="etherscan-button-green" disabled>
                      PASSED
                    </Button>
                  ) : (
                    <Button className="etherscan-button-blue" disabled>
                      ACTIVE
                    </Button>
                  )}
                  <p
                    className="earned-text"
                    style={{ marginTop: '6px', paddingLeft: '8px' }}
                  >
                    {' '}
                    EXECUTED ∙ {endOne}
                  </p>
                </span>
              </div>
            </a>

            <Divider className="divider-dg-top" />

            <a
              target="_blank"
              href={`https://snapshot.org/#/decentralgames.eth/proposal/${linkTwo}`}
            >
              <div
                className={`${
                  passedTwo ? 'governance-block' : 'governance-block-blue'
                }`}
              >
                <p className="earned-amount">{govTwo.name}</p>
                <span style={{ display: 'flex' }}>
                  {passedTwo == true ? (
                    <Button className="etherscan-button-green" disabled>
                      PASSED
                    </Button>
                  ) : (
                    <Button className="etherscan-button-blue" disabled>
                      ACTIVE
                    </Button>
                  )}
                  <p
                    className="earned-text"
                    style={{ marginTop: '6px', paddingLeft: '8px' }}
                  >
                    EXECUTED ∙ {endTwo}
                  </p>
                </span>
              </div>
            </a>

            <Divider className="divider-dg-top" />

            <a
              target="_blank"
              href={`https://snapshot.org/#/decentralgames.eth/proposal/${linkThree}`}
            >
              <div
                className={`${
                  passedThree ? 'governance-block' : 'governance-block-blue'
                }`}
              >
                <p className="earned-amount">{govThree.name}</p>
                <span style={{ display: 'flex' }}>
                  {passedThree == true ? (
                    <Button className="etherscan-button-green" disabled>
                      PASSED
                    </Button>
                  ) : (
                    <Button className="etherscan-button-blue" disabled>
                      ACTIVE
                    </Button>
                  )}
                  <p
                    className="earned-text"
                    style={{ marginTop: '6px', paddingLeft: '8px' }}
                  >
                    EXECUTED ∙ {endThree}
                  </p>
                </span>
              </div>
            </a>

            <Divider className="divider-dg-top" />

            <span className="DG-button-span">
              <Button
                href="https://gov.decentral.games"
                target="_blank"
                className="DG-stake-button"
                id="balances-padding-correct-two"
              >
                Discussion
              </Button>
              <Button
                href="https://snapshot.page/#/decentralgames.eth"
                target="_blank"
                className="DG-stake-button"
                id="balances-padding-correct-two"
              >
                All Proposals
              </Button>
            </span>
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default ContentGovernance;
