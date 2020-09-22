import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Image, Button, Divider } from 'semantic-ui-react';
import ContentNFTs from './ContentNFTs';
import Aux from '../_Aux';
import Spinner from '../Spinner';
import Global from '../Constants';


const Farming = () => {
  // get user's NFT data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [DGstate, setDGState] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [doneLoading, setDoneLoading] = useState(true);

  useEffect(() => {
    if(document.readyState === 'complete') {
      setDoneLoading(false);
    }
  });

  function Pools() {
    return (
      <div>
        <span style={{ display: 'flex' }} className="outter-DG-container">
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="DG-h3">
              Decentral Games Liquidity Mining
            </h3>
            <p>
              Deposit your Liquidity Provider tokens to receive DG, the Decentral Games protocol governance token. 
              To learn more about DG and the Decentral Games protocol, check out our protocol <a href="https://decentral-games-1.gitbook.io/" style={{ color: '#2085f4' }}>documentation</a>.
            </p>
          </span>
        </span>

        <div className="DG-liquidity-container">
          <div className="DG-column one">
            <span style={{ display: 'flex' }}>
              <img
                src={Global.IMAGES.MANA_CIRCLE}
                className="farming-logo"
              />
              <img
                src={Global.IMAGES.LOGO}
                className="farming-logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text"> Pool Name </p>
                <p className="account-name">MANA-DG</p>
              </span>

            </span>

            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button disabled className="DG-deposit-button">
                DEPOSIT
              </Button>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Deposited </p>
              <p className="earned-amount"> 0 </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Pool Rate </p>
              <p className="earned-amount"> 0 / week </p>
            </span>

            <Divider className="DG-mobile-divider"/>

            <Button disabled className="DG-deposit-button-mobile">
              DEPOSIT
            </Button>

          </div>

          <div className="DG-column two">
            <span style={{ display: 'flex' }}>
              <img
                src={Global.IMAGES.DAI_CIRCLE}
                className="farming-logo"
              />
              <img
                src={Global.IMAGES.LOGO}
                className="farming-logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text"> Pool Name </p>
                <p className="account-name">DAI-DG</p>
              </span>

            </span>

            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button disabled className="DG-deposit-button">
                DEPOSIT
              </Button>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Deposited </p>
              <p className="earned-amount"> 0 </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Pool Rate </p>
              <p className="earned-amount"> 0 / week </p>
            </span>

            <Divider className="DG-mobile-divider"/>

            <Button disabled className="DG-deposit-button-mobile">
              DEPOSIT
            </Button>
          </div>
        </div>

      </div>
    );
  }

  function Liquidity() {
    return (
      <div>
        <span style={{ display: 'flex' }} className="outter-DG-container">
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="DG-h3">
              Liquidity Provider Rewards
            </h3>
            <p>
              Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
              Read more about providing liquidity <a href="https://decentral-games-1.gitbook.io/" style={{ color: '#2085f4' }}>here</a>.
            </p>
          </span>
        </span>

        <span style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p className="account-hover" style={{ marginTop: '30px' }}>
            YOUR LIQUIDITY
          </p>
          <Button
            disabled
            className="DG-liquidity-button"
            target="_blank"
          >
            ADD LIQUIDITY
          </Button>
        </span>

        <span style={{ display: 'flex', justifyContent: 'center' }} className="outter-DG-container">
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="DG-h3" style={{ textAlign: 'center', paddingBottom: '0px' }}>
              No Liquidity Found
            </h3>
          </span>
        </span>
      </div>
    );
  }

  function Vote() {
    return (
      <div>
        <span style={{ display: 'flex' }} className="outter-DG-container">
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="DG-h3">
              Decentral Games Governance
            </h3>
            <p>
              DG tokens represent voting shares in Decentral Games governance. You can vote on each proposal yourself or delegate your votes to a third party.
              Read more about our governance model <a href="https://decentral-games-1.gitbook.io/dg/governance-1" style={{ color: '#2085f4' }}>here</a>.
            </p>
          </span>
        </span>

        <p className="account-hover" style={{ marginTop: '30px' }}>
          PROPOSALS
        </p>

        <span style={{ display: 'flex', justifyContent: 'center' }} className="outter-DG-container">
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="DG-h3" style={{ textAlign: 'center' }}>
              No proposals found
            </h3>
            <p style={{ textAlign: 'center' }}>
              Proposals submitted by community members will appear here.
            </p>
          </span>
        </span>
      </div>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function submenu() {
    return (
      <div className="account-other-tabs">
        {
          (() => {
            if (DGstate == 0) return (
              <p className="account-other-p">
                <b className="account-hover active">POOLS</b>{' '}
                <abbr className="account-hover" onClick={() => setPage(1)}>
                  LIQUIDITY
                </abbr>
                <abbr className="account-hover" onClick={() => setPage(2)}>
                  VOTE
                </abbr>
              </p>
            )
            else if (DGstate == 1) return (
              <p className="account-other-p">
                <abbr className="account-hover" onClick={() => setPage(0)}>
                  POOLS
                </abbr>{' '}
                <b className="account-hover active">LIQUIDITY</b>
                <abbr className="account-hover" onClick={() => setPage(2)}>
                  VOTE
                </abbr>{' '}
              </p> 
            )
            else return (
              <p className="account-other-p">
                <abbr className="account-hover" onClick={() => setPage(0)}>
                  POOLS
                </abbr>{' '}
                <abbr className="account-hover" onClick={() => setPage(1)}>
                  LIQUIDITY
                </abbr>
                <b className="account-hover active">VOTE</b>
              </p>
            )
          })()
        }
      </div>
    );
  }

  function setPage(number) {
    setDGState(number);
  }

  return (
    <div className="main-container">

      {doneLoading ? <Spinner background={3} />
      :
      <div className="page-container">
        <div className="account-other-inner-container ">
          {submenu()}

          <Divider style={{ marginTop: '18px', paddingBottom: '21px' }} />

          {
            (() => {
              if (DGstate == 0)
                return Pools()
              else if (DGstate == 1)
                return Liquidity()
              else
                return Vote()
            })()
          }


        </div>
      </div>}
    </div>
  );
};

export default Farming;