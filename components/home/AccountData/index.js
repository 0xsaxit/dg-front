import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'store';
import Link from 'next/link';
import { Parallax } from 'react-parallax';
import { Divider, Icon, Popup } from 'semantic-ui-react';
import Spinner from 'components/Spinner';
import ContentAccount from 'components/content/ContentAccount';
import Aux from 'components/_Aux';

import './AccountData.module.scss';

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
          </span>

          <span
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              margin: '-78px 0px 90px 0px',
            }}
          >
          </span>
        </div>

        <div className="account-other-tabs" id="account-mobile-tabs">
          <div className="ml-0">
            <span className="account-other-p d-flex justify-content-center">
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

              {dataType === 'referrals' ? (
                <span className="account-hover active">
                  <b>REFERRALS</b>
                </span>
              ) : (
                <Link href="/account/referrals">
                  <span className="account-hover">
                    <b>REFERRALS</b>
                  </span>
                </Link>
              )}
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