import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'store';
import Link from 'next/link';
import { Parallax } from 'react-parallax';
import { Divider, Icon, Popup } from 'semantic-ui-react';
import Spinner from 'components/Spinner';
import ContentAccount from 'components/content/ContentAccount';
import Aux from 'components/_Aux';
import styles from './AccountData.module.scss';


const AccountData = (props) => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const dataHistory = state.transactions[0];
  const dataPlay = state.transactions[1];

  // define local variables
  const [dataPage, setDataPage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [utm, setUtm] = useState('');
  const [DGMined, setDGMined] = useState('');

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
    const one = Number(state.DGGameplayCollected);
    const two = Number(state.DGBalances.BALANCE_MINING_DG_V2);
    const temp = Number(one + two);
    setDGMined(temp);
  }, [state.DGGameplayCollected, state.DGBalances.BALANCE_MINING_DG_V2]);

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

  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(state.userAddress);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);

    // track 'Affiliate Link' button click event
    analytics.track('Clicked AFFILIATE LINK button');
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function topLinks() {
    return (
      <Aux>
        <div className={styles.player_card}>
          <div>
            <span
              className="avatar-picture"
              style={{ alignSelf: 'center' }}
            >
              <img
                className="avatar-picture main"
                src={`https://events.decentraland.org/api/profile/${state.userAddress}/face.png`}
                style={{
                  backgroundColor: '#3B3B3B',
                  width: '180px',
                  display: 'flex',
                }}
              />
              <a
                href="https://play.decentraland.org/?OPEN_AVATAR_EDITOR&"
                target="_blank"
                className="avatar-edit-circle"
              >
                <svg style={{ margin: '12px' }} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.2656 3.85938L13.7422 5.38281L10.6172 2.25781L12.1406 0.734375C12.2969 0.578125 12.4922 0.5 12.7266 0.5C12.9609 0.5 13.1562 0.578125 13.3125 0.734375L15.2656 2.6875C15.4219 2.84375 15.5 3.03906 15.5 3.27344C15.5 3.50781 15.4219 3.70312 15.2656 3.85938ZM0.5 12.375L9.71875 3.15625L12.8438 6.28125L3.625 15.5H0.5V12.375Z" fill="white" />
                </svg>
              </a>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: 30 }}>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/account">
                {state.userInfo.name === null || state.userInfo.name === '' ? (
                  <h4 style={{ paddingLeft: '8px', marginTop: '-4px' }}>
                    Unnamed
                  </h4>
                ) : (
                  <h4 style={{ paddingLeft: '8px', marginTop: '-4px' }}>
                    {state.userInfo.name}
                  </h4>
                )}
              </Link>
              <span
                className="account-copy"
                style={{ display: 'flex', marginTop: 5 }}
                onClick={() => onCopy()}
              >
                <p className="account-address">
                  {state.userAddress.substr(0, 8) +
                    '...' +
                    state.userAddress.substr(-8)}
                  <svg
                    style={{ marginLeft: '8px' }}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.54907 15.7588L10.9241 15.7588C11.7151 15.7588 12.3303 15.1143 12.3303 14.3525L12.3303 12.9463L13.7366 12.9463C14.5276 12.9463 15.1428 12.3018 15.1428 11.54L15.1428 2.16504C15.1428 1.37402 14.5276 0.758789 13.7366 0.758789L4.36157 0.758788C3.59985 0.758788 2.95532 1.37402 2.95532 2.16504L2.95532 3.57129L1.54907 3.57129C0.787355 3.57129 0.142823 4.18652 0.142823 4.97754L0.142822 14.3525C0.142822 15.1143 0.787354 15.7588 1.54907 15.7588ZM4.53735 2.16504L13.5608 2.16504C13.678 2.16504 13.7366 2.22363 13.7366 2.34082L13.7366 11.3643C13.7366 11.4521 13.678 11.54 13.5608 11.54L12.3303 11.54L12.3303 4.97754C12.3303 4.18652 11.7151 3.57129 10.9241 3.57129L4.36157 3.57129L4.36157 2.34082C4.36157 2.22363 4.44946 2.16504 4.53735 2.16504ZM1.72485 4.97754L10.7483 4.97754C10.8655 4.97754 10.9241 5.03613 10.9241 5.15332L10.9241 14.1768C10.9241 14.2646 10.8655 14.3525 10.7483 14.3525L1.72485 14.3525C1.63696 14.3525 1.54907 14.2646 1.54907 14.1768L1.54907 5.15332C1.54907 5.03613 1.63696 4.97754 1.72485 4.97754Z"
                      fill="white"
                      fillOpacity="0.5"
                    />
                  </svg>
                </p>
              </span>
            </span>

            <div style={{ display: 'flex' }}>
              <div className={styles.token_container}>
                <img className={styles.token_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629713504/image_23_nm4wev.png" />
                <div className={styles.tokenBalance} >
                  <p className={styles.title}> ICE Mined </p>
                  <p className={styles.amount} > 0 </p>
                </div>
              </div>
              <div className={styles.token_container}>
                <img className={styles.token_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629713504/Group_175_hajl2h.png" />
                <div className={styles.tokenBalance} >
                  <p className={styles.title}> Unused XP </p>
                  <p className={styles.amount}> 0 </p>
                </div>
              </div>
              <div className={styles.token_container}>
                <img className={styles.token_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629713504/image_22_w5ecsu.png" />
                <div className={styles.tokenBalance} >
                  <p className={styles.title}> DG Mined</p>
                  <p className={styles.amount}> 0 </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*<div className={styles.card_container}>
          <img className={styles.avatar_img} src={`https://events.decentraland.org/api/profile/${state.userAddress}/face.png`} />
          <a 
            href="https://play.decentraland.org/?OPEN_AVATAR_EDITOR&" 
            target="_blank"
            className={styles.avatar_edit}
          >
            <svg style={{ margin: '12px' }} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.2656 3.85938L13.7422 5.38281L10.6172 2.25781L12.1406 0.734375C12.2969 0.578125 12.4922 0.5 12.7266 0.5C12.9609 0.5 13.1562 0.578125 13.3125 0.734375L15.2656 2.6875C15.4219 2.84375 15.5 3.03906 15.5 3.27344C15.5 3.50781 15.4219 3.70312 15.2656 3.85938ZM0.5 12.375L9.71875 3.15625L12.8438 6.28125L3.625 15.5H0.5V12.375Z" fill="white"/>
            </svg>
          </a>
          <div className={styles.card_info}>
            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                {state.userInfo.name === null || state.userInfo.name === '' ? (
                  <p className={styles.avatar_name}>
                    Unnamed
                  </p>
                ) : (
                  <p className={styles.avatar_name}>
                    {state.userInfo.name}
                  </p>
                )}
                <p className={styles.avatar_address}> 
                  {state.userAddress.substr(0, 4) +
                    '...' +
                    state.userAddress.substr(-4)}
                </p>
              </span>

              <img className={styles.laurel} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1627310333/Laurel_tl9ms6.png" />
            </span>

            <p className={styles.mined_amount}> 
              {DGMined.toFixed(3)} DG Mined
            </p>

            <div className={styles.mined_progress_bar}>
              <div />
            </div>

            <div className={styles.card_stats_container}>
              <div className={styles.card_stat}>
                <p className={styles.stat_header}>
                  Your Status
                  {getPopUp('two')}
                </p>
                <div>
                  {DGMined < 5 ? (
                    <span style={{ display: 'flex', justifyContent: 'center' }}>
                      <p className={styles.stat_value}> Bronze </p>
                      <img className={styles.stat_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1627313187/Medal_gu7cub.png" />
                    </span>
                  ) : (
                    null
                  )}
                </div>
              </div>

              <div className={styles.card_stat}>
                <p className={styles.stat_header}>
                  Mining Bonus
                </p>
                <p className={styles.stat_value}>
                  40%
                </p>
              </div>

              <div className={styles.card_stat}>
                <p className={styles.stat_header}>
                  Total Mined
                </p>
                <p className={styles.stat_value}>
                  {DGMined.toFixed(3)}
                </p>
              </div>
            </div>

          </div>
        </div>*/}

        <div className="account-other-tabs" id="account-mobile-tabs" style={{ marginTop: '0px' }}>
          <div className="ml-0">
            <span className="account-other-p d-flex justify-content-center">
              {dataType === 'balances' ? (
                <span className="account-hover active">
                  Balances
                </span>
              ) : (
                <Link href="/account">
                  <span className="account-hover">
                    Balances
                  </span>
                </Link>
              )}

              {dataType === 'ice' ? (
                <span className="account-hover active">
                  ICE
                </span>
              ) : (
                state.dgLoading ? (
                  <span
                    className="account-hover"
                    onClick={() => {
                      dispatch({
                        type: 'set_dgWarningMsg',
                        data: true,
                      });
                    }}
                  >
                    ICE
                  </span>
                ) : (<Link href="/account/ice">
                  <span className="account-hover">
                   ICE
                  </span>
                </Link>)
              )}

              {dataType === 'items' ? (
                <span className="account-hover active">
                  NFTs
                </span>
              ) : (
                state.dgLoading ? (
                  <span
                    className="account-hover"
                    onClick={() => {
                      dispatch({
                        type: 'set_dgWarningMsg',
                        data: true,
                      });
                    }}
                  >
                    NFTs
                  </span>
                ) : (<Link href="/account/items">
                  <span className="account-hover">
                    NFTs
                  </span>
                </Link>)
              )}

              {dataType === 'history' ? (
                <span className="account-hover active">
                  History
                </span>
              ) : (state.dgLoading ? (
                <span className="account-hover" onClick={() => {
                  dispatch({
                    type: 'set_dgWarningMsg',
                    data: true,
                  });
                }}>
                  History
                </span>) : (
                <Link href="/account/history">
                  <span className="account-hover">
                    History
                  </span>
                </Link>)
              )}

              {dataType === 'referrals' ? (
                <span className="account-hover active">
                  Referrals
                </span>
              ) : (state.dgLoading ? (
                <span className="account-hover" onClick={() => {
                  dispatch({
                    type: 'set_dgWarningMsg',
                    data: true,
                  });
                }}>
                  Referrals
                </span>) :
                (<Link href="/account/referrals">
                  <span className="account-hover">
                    Referrals
                  </span>
                </Link>)
              )}

            </span>
          </div>
        </div>
      </Aux>
    );
  }

  function getPopUp(number) {
    return (
      <Popup
        className={styles.popup_container}
        position='right center'
        trigger={
          <svg style={{ margin: '0px 0px 0px 2px' }} width="8" height="7" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.40346 5.80886C4.92058 5.80886 6.16874 4.5607 6.16874 3.04358C6.16874 1.52385 4.92058 0.275683 3.40084 0.275683C1.88111 0.275683 0.635561 1.52385 0.635561 3.04358C0.635561 4.5607 1.88372 5.80886 3.40346 5.80886ZM3.40084 2.20538C3.17628 2.20538 2.98827 2.01737 2.98827 1.7928C2.98827 1.5604 3.17628 1.37762 3.40084 1.37762C3.62541 1.37762 3.81081 1.5604 3.81081 1.7928C3.81081 2.01737 3.62541 2.20538 3.40084 2.20538ZM2.90471 4.5137C2.75848 4.5137 2.64359 4.41186 2.64359 4.2578C2.64359 4.1194 2.75848 4.00712 2.90471 4.00712H3.205V3.07752H2.95694C2.8081 3.07752 2.69581 2.97308 2.69581 2.82424C2.69581 2.68323 2.8081 2.57356 2.95694 2.57356H3.49224C3.68025 2.57356 3.77686 2.70151 3.77686 2.89996V4.00712H4.01448C4.16071 4.00712 4.2756 4.1194 4.2756 4.2578C4.2756 4.41186 4.16071 4.5137 4.01448 4.5137H2.90471Z" fill="white" fill-opacity="0.5" />
          </svg>
        }
      >
        {number === 'one' ? (
          <p className="earned-text">
            All time gameplay earnings, not counting earnings allocated
            elsewhere by the DG DAO (not used in total treasury calculation)
          </p>
        ) : number === 'two' ? (
          <Aux>
            <span style={{ display: 'flex' }}>
              <svg style={{ marginLeft: '-10px' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.85581 17.3405C13.6103 17.3405 17.522 13.4289 17.522 8.67435C17.522 3.91164 13.6103 0 8.84762 0C4.08491 0 0.181458 3.91164 0.181458 8.67435C0.181458 13.4289 4.0931 17.3405 8.85581 17.3405ZM8.84762 6.04749C8.14386 6.04749 7.55465 5.45829 7.55465 4.75453C7.55465 4.02621 8.14386 3.45337 8.84762 3.45337C9.55139 3.45337 10.1324 4.02621 10.1324 4.75453C10.1324 5.45829 9.55139 6.04749 8.84762 6.04749ZM7.29279 13.2816C6.83452 13.2816 6.47445 12.9624 6.47445 12.4796C6.47445 12.0459 6.83452 11.694 7.29279 11.694H8.23387V8.78073H7.45645C6.99 8.78073 6.63812 8.4534 6.63812 7.98695C6.63812 7.54505 6.99 7.20135 7.45645 7.20135H9.13404C9.72324 7.20135 10.026 7.60233 10.026 8.22427V11.694H10.7707C11.229 11.694 11.589 12.0459 11.589 12.4796C11.589 12.9624 11.229 13.2816 10.7707 13.2816H7.29279Z" fill="white" />
              </svg>
              <p className={styles.popup_header}>
                This is your status. Mine DG to continue leveling up.
              </p>
            </span>

            <div className={styles.popup_row}>
              <div className={styles.popup_column}>
                <img className={styles.popup_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1627313187/Medal_gu7cub.png" />
                <p className={styles.row_header}>
                  Bronze (1 - 5)
                </p>
                <p className={styles.row_subtitle}>
                  0.0 - 0.19 DG Mined
                </p>
              </div>

              <div className={styles.popup_column}>
                <img className={styles.popup_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1627313187/Ribbon_akemn5.png" />
                <p className={styles.row_header}>
                  Silver (6 - 10)
                </p>
                <p className={styles.row_subtitle}>
                  0.2 - 0.99 DG Mined
                </p>
              </div>
            </div>

            <div className={styles.popup_row}>
              <div className={styles.popup_column}>
                <img className={styles.popup_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1627313187/Cup_v2ouux.png" />
                <p className={styles.row_header}>
                  Gold (11 - 15)
                </p>
                <p className={styles.row_subtitle}>
                  1.0 - 3.99 DG Mined
                </p>
              </div>

              <div className={styles.popup_column}>
                <img className={styles.popup_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1627313185/diamond_light_vwookl.png" />
                <p className={styles.row_header}>
                  Diamond (16 - 19)
                </p>
                <p className={styles.row_subtitle}>
                  4.0 - 9.99 DG Mined
                </p>
              </div>
            </div>

            <div className={styles.popup_row}>
              <div className={styles.popup_column}>
                <img className={styles.popup_img_high} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1627313185/Money_Bags_dyuttz.png" />
                <p className={styles.row_header}>
                  High Roller (20+)
                </p>
                <p className={styles.row_subtitle}>
                  10+ DG Mined
                </p>
              </div>
            </div>

            <p className={styles.card_subtitle}>
              High Roller’s receive custom wearables, exclusive rewards, and private access to high roller lounges, events, and tables.
            </p>
          </Aux>
        ) : number === 'three' ? (
          <p className="earned-text">
            Treasury holdings of $DG calculated as {dgBalance} $DG at market
            price
          </p>
        ) : number === 'four' ? (
          <p className="earned-text">
            Treasury holdings of LAND calculated as 1,007 parcels times T30 avg
            LAND price
          </p>
        ) : number === 'five' ? (
          <p className="earned-text">
            Treasury holdings of wearable NFTs calculated as 210 wearables times
            average bid at current MANA price
          </p>
        ) : number === 'six' ? (
          <Aux>
            <p className="earned-text"> ETH-DG v3: ${uniTreasury} </p>
            <p className="earned-text"> MVI-ETH v2: ${mviTreasury} </p>
          </Aux>
        ) : number === 'seven' ? (
          <p className="earned-text">
            Calculated as {Number(maticTokens).toLocaleString()} delegated
            tokens times current Matic token price
          </p>
        ) : null}
      </Popup>
    );
  }

  return (
    <div className="main-container">
      {isLoading ? (
        <Spinner background={1} />
      ) : (
        <div>
          <div className="page-container">
            <div className="account-other-inner-container">
              {topLinks()}

              <div id="tx-box-history-2">
                <ContentAccount content={dataType} dataPage={dataPage} />
              </div>
            </div>
          </div>
          {copied ? (
            <div className={copied ? 'copied-toast' : 'copied-toast hidden'}>
              <h3 className="copied-text" style={{textAlign: 'center'}}>Wallet address copied!</h3>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AccountData;