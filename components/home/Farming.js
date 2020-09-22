import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Image, Button, Divider, Grid } from 'semantic-ui-react';
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

  function Farming() {
    return (
      <div>
        <span style={{ display: 'flex' }} className="outter-DG-container">
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="DG-h3">
              Decentral Games Farming
            </h3>
            <p>
              Users are able to farm DG in two ways, through gameplay and by providing liquidity. 
              After depositing to a liquidity pool, users will recieve LP tokens they can then stake
              in order to farm DG. Read more about DG rewards by visiting our <a href="https://decentral-games-1.gitbook.io/dg/governance-1" style={{ color: '#2085f4' }}>documentation</a>.
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
              <p className="earned-text"> Pool Rate </p>
              <p className="earned-amount"> 0 / week </p>
            </span>

            <Divider/>

            <span className="DG-button-span">
              <Button disabled className="DG-deposit-button">
                DEPOSIT
              </Button>
              <Button disabled className="DG-stake-button">
                STAKE LP
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
              <p className="earned-text"> Pool Rate </p>
              <p className="earned-amount"> 0 / week </p>
            </span>

            <Divider/>

            <span className="DG-button-span">
              <Button disabled className="DG-deposit-button">
                DEPOSIT
              </Button>
              <Button disabled className="DG-stake-button">
                STAKE LP
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
                DG tokens represent voting shares in Decentral Games governance. Users can vote on each proposal yourself or delegate your votes to a third party.
                Proposals can be found <a href="" style={{ color: '#2085f4' }}> here</a>. Read more about our governance model in our <a href="https://decentral-games-1.gitbook.io/dg/governance-1" style={{ color: '#2085f4' }}>documentation</a>.
              </p>
            </span>
          </span>

          <div>
            <Button disabled className="DG-stake-button-two">
              STAKE DG
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

        <div className="DG-top-container">
          <div className="DG-column one top">
            <span style={{ display: 'flex' }}>
              <span className="avatar-picture">
                <a
                  href="https://play.decentraland.org/?OPEN_AVATAR_EDITOR&"
                  target="_blank"
                >
                  <img
                    className="avatar-picture"
                    src={`https://events.decentraland.org/api/profile/${state.userInfo[1]}/face.png`}
                    style={{
                      width: '72px',
                      display: 'flex',
                      border: '1px solid rgb(227, 232, 238)',
                      borderRadius: '100%',
                      boxShadow: '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
                    }}
                  />
                  <span className="avatar-edit"> edit </span>
                </a>
              </span>
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <p className="welcome-text"> Account Connected </p>
                {state.userInfo[0] === null || state.userInfo[0] === '' ? (
                  <p className="account-name">
                    {state.userInfo[1].substr(0, 4) +
                      '...' +
                      state.userInfo[1].substr(-4)}
                  </p>
                ) : (
                  <p className="account-name">{state.userInfo[0]}</p>
                )}
              </span>
            </span>

            <span style={{ display: 'flex', justifyContent: 'flex-end' }} className="account-authorize-span">
              {state.userStatus === 6 ? (
                <ButtonAuthorize />
              ) : state.userStatus === 7 ? (
                <ButtonEnable />
              ) : (
                <Button disabled className="account-connected-play-button">
                  AUTHORIZE
                </Button>
              )}
            </span>

            <Divider className="DG-mobile-divider"/>

            <span className="account-authorize-span-mobile">
              {state.userStatus === 6 ? (
                <ButtonAuthorize />
              ) : state.userStatus === 7 ? (
                <ButtonEnable />
              ) : (
                <Button disabled className="account-connected-play-button-mobile">
                  AUTHORIZE
                </Button>
              )}
            </span>
          </div>

          <div className="DG-column two">
            <span style={{ display: 'flex' }}>
              <span className="avatar-picture">
                <img
                  className="avatar-picture"
                  src={Global.IMAGES.LOGO}
                  style={{
                    width: '72px',
                    display: 'flex',
                    border: '1px solid rgb(227, 232, 238)',
                    borderRadius: '100%',
                    boxShadow: '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
                  }}
                />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <p className="welcome-text"> DG </p>
                <p className="account-name"> 0 </p>
              </span>
            </span>

            <span style={{ display: 'flex', justifyContent: 'flex-end' }} className="account-authorize-span">
              <Button disabled className="account-connected-play-button">
                REDEEM
              </Button>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> DG rewards </p>
              <p className="earned-amount"> 0 </p>
            </span>

            <Divider className="DG-mobile-divider"/>

            <span>
              <Button disabled className="account-connected-play-button-mobile">
                REDEEM
              </Button>
            </span>
          </div>
        </div>
        {
          (() => {
            if (DGstate == 0) return (
              <p className="account-other-p">
                <b className="account-hover active">FARMING</b>{' '}
                <abbr className="account-hover" onClick={() => setPage(1)}>
                  GOVERNANCE
                </abbr>
              </p>
            )
            else return (
              <p className="account-other-p">
                <abbr className="account-hover" onClick={() => setPage(0)}>
                  FARMING
                </abbr>{' '}
                <b className="account-hover active">GOVERNANCE</b>
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
                return Farming()
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