import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'store';
import Link from 'next/link';
import { Icon } from 'semantic-ui-react';
import Spinner from 'components/Spinner';
import cx from 'classnames';
import ContentAccount from 'components/content/ContentAccount';
import Aux from 'components/_Aux';

import styles from './AccountData.module.scss';

const AccountData = props => {
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
  const topLinks = () => {
    return (
      <Aux>
        <div className={styles.account_data_container}>
          <span className={cx("d-flex flex-column")}>
            <span className={styles.avatar_picture}>
              <img
                className={styles.avatar_picture_main}
                src={`https://events.decentraland.org/api/profile/${state.userAddress}/face.png`}
              />
              <a
                className={styles.avatar_edit_circle}
                href="https://play.decentraland.org/?OPEN_AVATAR_EDITOR&"
                target="_blank"
              >
                <Icon className={styles.edit_icon} name="pencil" />
              </a>
            </span>
          </span>
        </div>

        <div
          className={styles.account_other_tabs}
          id="account-mobile-tabs"
        >
          <div>
            <span className={cx("d-flex justify-content-center")}>
              {dataType === 'balances' ? (
                <span className={styles.account_hover_active}>Balances</span>
              ) : (
                <Link href="/account">
                  <span className={styles.account_hover}>Balances</span>
                </Link>
              )}

              {dataType === 'items' ? (
                <span className={styles.account_hover_active}>My Items</span>
              ) : (
                <Link href="/account/items">
                  <span className={styles.account_hover}>My Items</span>
                </Link>
              )}

              {dataType === 'history' ? (
                <span className={styles.account_hover_active}>History</span>
              ) : (
                <Link href="/account/history">
                  <span className={styles.account_hover}>History</span>
                </Link>
              )}

              {dataType === 'referrals' ? (
                <span className={styles.account_hover_active}>Referrals</span>
              ) : (
                <Link href="/account/referrals">
                  <span className={styles.account_hover}>Referrals</span>
                </Link>
              )}
            </span>
          </div>
        </div>
      </Aux>
    );
  }

  return (
    <div className={styles.main_container}>
      {isLoading ? (
        <Spinner background={1} />
      ) : (
        <div>
          <div className={styles.page_container}>
            <div className={styles.account_other_inner_container}>
              {topLinks()}

              <div className={styles.tx_box_history_2} id="tx-box-history-2">
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
