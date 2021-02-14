import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store';
import Web3 from 'web3';
import { Button, Divider, Loader, Icon, Input, Modal } from 'semantic-ui-react';
import Aux from '../_Aux';
import Images from '../../common/Images';
import Fetch from '../../common/Fetch';
import Transactions from '../../common/Transactions';
import Global from '../Constants';


const ModalBalancer = (props) => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [pool1, setPool1] = useState(true);
  const [pool1USD, setPool1USD] = useState(0);
  const [pool2USD, setPool2USD] = useState(0);
  const [BPTContract1, setBPTContract1] = useState({});
  const [BPTContract2, setBPTContract2] = useState({});
  const [open, setOpen] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function formatPrice(balanceDG, units) {
    const priceFormatted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return priceFormatted;
  }

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
      const pool1Formatted = formatPrice(pool1USD, 2);

      setPool1USD(pool1Formatted);

      const pool2USD =
        props.price * state.DGBalances.BALANCE_STAKING_BALANCER_2;
      const pool2Formatted = formatPrice(pool2USD, 2);

      setPool2USD(pool2Formatted);
    }
  }, [
    props.price,
    state.DGBalances.BALANCE_STAKING_BALANCER_1,
    state.DGBalances.BALANCE_STAKING_BALANCER_2,
  ]);


  return (
    <Modal
      className="menu-info-modal"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      trigger={
        <span className='balancer-pool-modal-trigger'>
          <p> Balancer Pools </p>
          <Icon name="external alternate" style={{ margin: '6px 0px 0px 6px' }} />
        </span>
      }
    >
    <div style={{ margin: '21px 30px 0px 30px' }}>
      <span className="mailchimp-close" onClick={() => setOpen(false)}>
        <Icon name="close" />
      </span>
    </div>

    <p className="mailchimp-header-text"> Balancer Pools </p>

    <Divider style={{ marginTop: '-15px' }} />

    <p style={{ margin: '21px 30px 30px 30px' }}> To unstake from the MANA-DG pool, go{' '} 
      <a 
        href="https://pools.balancer.exchange/#/pool/0xca54c398195fce98856888b0fd97a9470a140f71/"
        target="_blank"
      >
        here
      </a>
      . To unstake from DAI-DG, go{' '}
      <a 
        href="https://pools.balancer.exchange/#/pool/0x3cf393b95a4fbf9b2bdfc2011fd6675cf51d3e5d/"
        target="_blank"
      >
        here
      </a>
      .
    </p>

    <Divider />

    <div style={{ margin: '15px 30px 30px 30px'}}>
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
                  formatPrice(
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
                  formatPrice(
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

      {/*<Divider />

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
      )}*/}

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
    </Modal>
  );
};

export default ModalBalancer;