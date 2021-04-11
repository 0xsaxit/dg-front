import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Link from 'next/link';
import { Parallax } from 'react-parallax';
import { Divider, Icon, Popup } from 'semantic-ui-react';
import ModalAffiliates from '../modal/ModalAffiliates';
import Spinner from '../Spinner';
import ContentAccount from '../content/ContentAccount';
import Aux from '../_Aux';

const AccountData = (props) => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const dataHistory = state.transactions[0];
  const dataPlay = state.transactions[1];

  // define local variables
  const [dataPage, setDataPage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [utm, setUtm] = useState('');

  const dataType = props.dataType;
  const maximumCount = 100; // ***** we should limit the data being returned from the server to 100 rows *****

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (state.transactions[0].length && state.transactions[1]) {
      setIsLoading(false);
    }
  }, [state.transactions]);

  useEffect(() => {
    if (!isLoading) {
      let result = {};
      if (dataType === 'history') {
        result = dataHistory.slice(0, maximumCount);
      } else if (dataType === 'play') {
        result = dataPlay.slice(0, maximumCount);
      }

      setDataPage(result);
    }
  }, [isLoading]);

  useEffect(() => {
    setUtm(sessionStorage.getItem('utm'));
  }, [utm]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function topLinks() {
    return (
      <Aux>
        <div style={{ position: 'relative', zIndex: '5' }}>
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              className="avatar-picture"
              style={{ alignSelf: 'center', marginTop: '-60px' }}
            >
              <img
                className="avatar-picture main"
                src={`https://events.decentraland.org/api/profile/${state.userAddress}/face.png`}
                style={{
                  backgroundColor: 'white',
                  width: '120px',
                  display: 'flex',
                  marginTop: '-18px',
                }}
              /> 
              <a 
                href="https://play.decentraland.org/?OPEN_AVATAR_EDITOR&" 
                target="_blank"
                className="avatar-edit-circle"
              >
                <Icon name="pencil" className="edit-icon" />
              </a>
            </span>
            {state.userInfo.name === null || state.userInfo.name === '' ? (
              <p className="account-name-2">
                {state.userAddress.substr(0, 4) +
                  '...' +
                  state.userAddress.substr(-4)}
              </p>
            ) : (
              <p className="account-name-2">{state.userInfo.name}</p>
            )}
            <p className="welcome-text-2"> {state.userAddress} </p>
          </span>

          <span
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              margin: '-123px 0px 90px 0px',
            }}
          >
            <Popup
              position="top center"
              className="account-popup"
              onClick={() => introJs().start()}
              trigger={
                <span className="account-icon-hover">
                  <Icon name="help circle" className="submenu-icon" />
                </span>
              }
            >
              <div>
                <p className="earned-text">COMING SOON</p>
              </div>
            </Popup>
          </span>
        </div>

        <div className="account-other-tabs" id="account-mobile-tabs">
          <div style={{ marginLeft: '0px' }}>
            <span className="account-other-p" style={{ display: 'flex' }}>
              {dataType === 'balances' ? (
                <span className="account-hover active">
                  <b>BALANCES</b>
                </span>
              ) : (
                <Link href="/account">
                  <span className="account-hover">
                    <b>BALANCES</b>
                  </span>
                </Link>
              )}

              {dataType === 'wearables' ? (
                <span className="account-hover active">
                  <b>NFTS</b>
                </span>
              ) : (
                <Link href="/account/nfts">
                  <span className="account-hover">
                    <b>NFTS</b>
                  </span>
                </Link>
              )}

              {dataType === 'poaps' ? (
                <span className="account-hover active">
                  <b>POAPS</b>
                </span>
              ) : (
                <Link href="/account/poaps">
                  <span className="account-hover">
                    <b>POAPS</b>
                  </span>
                </Link>
              )}

              {dataType === 'play' ? (
                <span className="account-hover active">
                  <b style={{ marginRight: '4px' }}>GAME</b>
                  <b>HISTORY</b>
                </span>
              ) : (
                <Link href="/account/play">
                  <span className="account-hover">
                    <b style={{ marginRight: '4px' }}>GAME</b>
                    <b>HISTORY</b>
                  </span>
                </Link>
              )}

              {dataType === 'history' ? (
                <span className="account-hover active">
                  <b>TRANSACTIONS</b>
                </span>
              ) : (
                <Link href="/account/history">
                  <span className="account-hover">
                    <b>TRANSACTIONS</b>
                  </span>
                </Link>
              )}

              <span style={{ marginTop: '27px' }}>
                <ModalAffiliates />
              </span>
            </span>
          </div>
        </div>

        <Divider className="tab-divider" />
      </Aux>
    );
  }

  return (
    <div className="main-container">
      {isLoading ? (
        <Spinner background={1} />
      ) : (
        <div>
          <div style={{ maxWidth: '100vw', marginTop: '60px' }}>
            <Parallax
              blur={0}
              bgImage="https://res.cloudinary.com/dnzambf4m/image/upload/v1614574769/Image_from_iOS_coebmd.png"
              strength={100}
            >
              <div style={{ height: '180px' }} />
            </Parallax>
          </div>

          <div className="page-container">
            <div className="account-other-inner-container">
              {topLinks()}

              <div id="tx-box-history-2">
                <ContentAccount content={dataType} dataPage={dataPage} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountData;
