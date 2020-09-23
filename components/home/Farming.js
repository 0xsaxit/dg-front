import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Image, Button, Divider, Grid } from 'semantic-ui-react';
import ButtonAuthorize from './ButtonAuthorize';
import ButtonEnable from './ButtonEnable';
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

  function gameplayFarming() {
    return (
      <div>
        <div className="outter-DG-container">
          <span style={{ display: 'flex' }}>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">
                $DG Gameplay Farming
              </h3>
              <p>
                You can farm $DG by playing games in our virtual casinos. Earn multipliers when sporting Decentral 
                Games wearables and playing with friends. Read more about $DG rewards by visiting our <a href="https://decentral-games-1.gitbook.io/dg/governance-1" style={{ color: '#2085f4' }}>documentation</a>.
              </p>
            </span>
          </span>

          <div>
            <Button disabled className="DG-stake-button-two">
              REDEEM $DG
            </Button>
          </div>

        </div>


        <div className="DG-liquidity-container">
          <div className="DG-column one">
            <span style={{ display: 'flex' }}>
              <img
                src={Global.IMAGES.MANA_CIRCLE}
                className="farming-logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text"> Coin </p>
                <p className="account-name">MANA</p>
              </span>

            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Spent </p>
              <p className="earned-amount"> 0 </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Earned </p>
              <p className="earned-amount"> 0 </p>
            </span>

          </div>

          <div className="DG-column two">
            <span style={{ display: 'flex' }}>
              <img
                src={Global.IMAGES.DAI_CIRCLE}
                className="farming-logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text"> Coin </p>
                <p className="account-name">DAI</p>
              </span>

            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Spent </p>
              <p className="earned-amount"> 0 </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Earned </p>
              <p className="earned-amount"> 0 </p>
            </span>

          </div>
        </div>

      </div>
    );
  }

  function liquidityFarming() {
    return (
      <div>
        <span style={{ display: 'flex' }} className="outter-DG-container">
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="DG-h3">
              $DG Liquidity Farming
            </h3>
            <p>
              You can farm $DG by staking $MANA/$DG and $DAI/$DG balancer pool tokens here. 
              Read more about DG rewards by visiting our  
              <a href="https://decentral-games-1.gitbook.io/dg/governance-1" style={{ color: '#2085f4' }}> documentation</a>.
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

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Deposited </p>
              <p className="earned-amount"> 0 </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> % share of pool </p>
              <p className="earned-amount"> 0% </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Pool Rate </p>
              <p className="earned-amount"> 0 / week </p>
            </span>

            <Divider/>

            <span className="DG-button-span">
              <Button disabled className="DG-deposit-button">
                DEPOSIT TO BALANCER POOL
              </Button>
            </span>

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

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Deposited </p>
              <p className="earned-amount"> 0 </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> % share of pool </p>
              <p className="earned-amount"> 0% </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Pool Rate </p>
              <p className="earned-amount"> 0 / week </p>
            </span>

            <Divider/>

            <span className="DG-button-span">
              <Button disabled className="DG-deposit-button">
                DEPOSIT TO BALANCER POOL
              </Button>
            </span>

          </div>
        </div>

      </div>
    );
  }

  function Governance() {
    return (
      <div>
        <div className="outter-DG-container">
          <span style={{ display: 'flex' }}>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">
                Decentral Games Governance
              </h3>
              <p>
                $DG tokens represent voting shares in Decentral Games governance. Users can vote on each proposal or delegate votes to a third party.
                Proposals can be submitted and voted on <a href="" style={{ color: '#2085f4' }}> here</a>. Read more about our governance model in our <a href="https://decentral-games-1.gitbook.io/dg/governance-1" style={{ color: '#2085f4' }}>documentation</a>.
              </p>
            </span>
          </span>

          <div>
            <Button disabled className="DG-stake-button-two">
              STAKE $DG
            </Button>
          </div>

        </div>
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
                <b className="account-hover active">GAMEPLAY FARMING</b>{' '}
                <abbr className="account-hover" onClick={() => setPage(1)}>
                  LIQUIDITY FARMING
                </abbr>
                <abbr className="account-hover" onClick={() => setPage(2)}>
                  GOVERNANCE
                </abbr>
              </p>
            )
            else if (DGstate == 1) return (
              <p className="account-other-p">
                <abbr className="account-hover" onClick={() => setPage(0)}>
                  GAMEPLAY FARMING
                </abbr>
                <b className="account-hover active">LIQUIDITY FARMING</b>{' '}
                <abbr className="account-hover" onClick={() => setPage(2)}>
                  GOVERNANCE
                </abbr>
              </p>
            )
            else return (
              <p className="account-other-p">
                <abbr className="account-hover" onClick={() => setPage(0)}>
                  GAMEPLAY FARMING
                </abbr>
                <abbr className="account-hover" onClick={() => setPage(1)}>
                  LIQUIDITY FARMING
                </abbr>
                <b className="account-hover active">GOVERNANCE</b>{' '}
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
                return gameplayFarming()
              else if (DGstate == 1)
                return liquidityFarming()
              else
                return Governance() 
            })()
          }

        </div>
      </div>}
    </div>
  );
};

export default Farming;
