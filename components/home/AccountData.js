import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Link from 'next/link';
import { Menu, Divider, Grid, Icon, Image, Popup, Table } from 'semantic-ui-react';
import Spinner from '../Spinner';
import ContentAccount from '../content/ContentAccount';
import Pagination from './Pagination';
import Aux from '../_Aux';
import { Parallax } from 'react-parallax';
import ModalAffiliates from '../modal/ModalAffiliates';
import Images from '../../common/Images';


const AccountData = (props) => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const dataHistory = state.transactions[0];
  const dataPlay = state.transactions[1];

  // define local variables
  const [maximumCount, setMaximumCount] = useState(0);

  // const [dataType, setDataType] = useState('balances');
  const [dataType, setDataType] = useState(props.dataType);

  const [dataLength, setDataLength] = useState(0);
  const [dataPage, setDataPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [utm, setUtm] = useState('');

  useEffect(() => {
    if (state.userStatus >= 4) {
      const frameHeight = window.innerHeight;
      setMaximumCount(100);
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (state.transactions[0].length) {
      setIsLoading(false);
    }
  }, [state.transactions]);

  useEffect(() => {
    if (!state.userStatus) {
      setIsLoading(false);
    }
  }, [state.userStatus]);

  useEffect(() => {
    // console.log('data type: ' + props.dataType);

    setUserData(props.dataType, 1);
  }, [props.dataType, isLoading]);

  console.log(state.userInfo[5]);

  useEffect(() => {
    setUtm(sessionStorage.getItem('utm'));
  }, [utm]);


  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions

  function topLinks() {
    return (
      <Aux>
        <div style={{ position: 'relative', zIndex: '5', }}>
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="avatar-picture" style={{ alignSelf: 'center', marginTop: '-60px' }}>
              <a
                href={`https://play.decentraland.org/?position=-119%2C133&realm=hades-amber${utm}`}
                target="_blank"
              >
                <img
                  className="avatar-picture main"
                  src={`https://events.decentraland.org/api/profile/${state.userInfo[1]}/face.png`}
                  style={{
                    backgroundColor: 'white',
                    width: '120px',
                    display: 'flex',
                    marginTop: '-18px',

                  }}
                />
              </a>
            </span>
              {state.userInfo[0] === null || state.userInfo[0] === '' ? (
                <p className="account-name-2">
                  {state.userInfo[1].substr(0, 4) +
                    '...' +
                    state.userInfo[1].substr(-4)}
                </p>
              ) : (
                <p className="account-name-2">{state.userInfo[0]}</p>
              )}
              <p className="welcome-text-2"> {state.userInfo[1]} </p>
            </span>

            <span style={{ display: 'flex', justifyContent: 'flex-end', margin: '-123px 0px 90px 0px' }}>
              <Popup
                position='top center'
                className="account-popup"
                trigger={
                  <a href="https://play.decentraland.org/?OPEN_AVATAR_EDITOR&" target="_blank" className="account-icon-hover">
                    <span>
                      <Icon name="settings" className="submenu-icon" />
                    </span>
                  </a>
                }
              >
                <div>
                  <p className="earned-text">
                    EDIT AVATAR
                  </p>
                </div>
              </Popup>
              <Popup
                position='top center'
                className="account-popup"
                onClick={() => introJs().start()}
                trigger={
                  <span className="account-icon-hover">
                    <Icon name="help circle" className="submenu-icon" />
                  </span>
                }
              >
                <div>
                  <p className="earned-text">
                    COMING SOON
                  </p>
                </div>
              </Popup>
            </span>
          </div>

          <div className="account-other-tabs" style={{ paddingTop: '15px' }}>

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

  function setUserData(type, page) {

    if (!isLoading) {
      let result = [];
      const indexStart = (page - 1) * maximumCount;
      const indexEnd = indexStart + maximumCount;
      let dataLength = 0;
      if (type === 'balances') {
        result = true;
        dataLength = 0;
      } else if (type === 'history') {
        result = dataHistory.slice(indexStart, indexEnd);
        dataLength = dataHistory.length;
      } else if (type === 'play') {
        result = dataPlay.slice(indexStart, indexEnd);
        dataLength = dataPlay.length;
      }
      setDataType(type);
      setDataPage(result);
      setDataLength(dataLength);
      setCurrentPage(page);
    }
  }

  function noTxHistory() {
    return (
      <div className="account-other-inner-p" style={{ paddingTop: '20px' }}>
        There is no transaction history for this account
      </div>
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
                {dataType == 'balances' ? (
                  <div>
                    <ContentAccount content={'balances'} />
                  </div>
                ) : dataType == 'wearables' ? (
                  <div>
                    <ContentAccount content={'wearables'} />
                  </div>
                ) : dataType == 'history' ? (
                  <div style={{ paddingTop: '12px'}}>
                    <div className="tx-box-overflow">
                      <ContentAccount content={'labels'} type={dataType} />
                      <ContentAccount content={dataType} dataPage={dataPage} />
                    </div>
                  </div>
                ) : dataType == 'play' ? (
                  <div style={{ paddingTop: '12px'}}>
                    <div className="tx-box-overflow">
                      <ContentAccount content={'labels'} type={dataType} />
                      <ContentAccount content={dataType} dataPage={dataPage} />
                    </div>
                  </div>
                ) : (
                  noTxHistory()
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountData;
