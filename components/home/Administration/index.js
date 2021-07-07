import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'store';
import { Divider } from 'semantic-ui-react';
import Web3 from 'web3';
import Link from 'next/link';
import ContentAdmin from 'components/content/ContentAdmin';
import Global from 'components/Constants';

import styles from './Administration.module.scss';

const Administration = props => {
  // get smart contract balances and user status' from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [ethBalance, setEthBalance] = useState(0);
  const [dataPage, setDataPage] = useState('');

  const dataType = props.dataType;

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (props.dataType === 'balances') {
      setEthBalance(state.ethBalance);
      setDataPage(state.adminBalances);
    } else if (props.dataType === 'users') {
      setDataPage(state.usersList);
    }
  }, [state.ethBalance, state.adminBalances, state.usersList]);

  useEffect(() => {
    if (state.userStatus >= 4) {
      // initialize maticWeb3 provider and create treasury contract instance
      const maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      // (async function () {
      //   const parentContract = await Transactions.treasuryContract(maticWeb3);
      //   setParentContract(parentContract);

      //   setInstances(true);
      // })();
    }
  }, [state.userStatus]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  const topLinks = () => {
    return (
      <div className={styles.account_other_tabs}>
        <div>
          <p>
            {dataType === 'balances' ? (
              <span className={styles.account_hover_active}>
                <b className={styles.account_hover_active_title}>
                  GAME BALANCES
                </b>
              </span>
            ) : (
              <Link href="/admin">
                <span className={styles.account_hover}>
                  <b className={styles.account_hover_active_title}>
                    GAME BALANCES
                  </b>
                </span>
              </Link>
            )}

            {dataType === 'users' ? (
              <span className={styles.account_hover_active}>
                <b className={styles.account_hover_active_title}>
                  USERS LIST
                </b>
              </span>
            ) : (
              <Link href="/admin/users">
                <span className={styles.account_hover}>
                  <b className={styles.account_hover_active_title}>
                    USERS LIST
                  </b>
                </span>
              </Link>
            )}
          </p>
        </div>

        <Divider className={styles.tab_divider} />
      </div>
    );
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.page_container}>
        <div className={styles.account_other_inner_container}>
          {topLinks()}

          <div className={styles.tx_box_history_2} id="tx-box-history-2">
            <table className={styles.account_table}>
              {dataPage ? (
                <ContentAdmin
                  content={dataType}
                  ethBalance={ethBalance}
                  data={dataPage}
                />
              ) : null}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administration;
