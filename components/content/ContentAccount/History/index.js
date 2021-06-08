import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from 'store/index';
import cn from 'classnames';
import { get } from 'lodash';
import Global from 'components/Constants';
import Images from 'common/Images';
import { Icon, Button, Grid, Table } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import styles from './History.module.scss';
import ModalBreakdown from 'components/modal/ModalBreakdown';

function History({ state }) {
  // get user's transaction history from the Context API store
  const dataHistory = state.transactions[0];
  const dataPlay = state.transactions[1];

  // define local variables
  const [dataPage, setDataPage] = useState([]);
  const [dataPageTwo, setDataPageTwo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [utm, setUtm] = useState('');

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
      let resultTwo = {};
      let i;
      let history = [];

      result = dataHistory.slice(0, maximumCount);
      resultTwo = dataPlay.slice(0, maximumCount);

      for (i = 0; i < result.length; i++) {
        const resultType = get(result, `${i}.type`, '');
        if (resultType.includes('Deposit') || resultType.includes('Withdrawal')) {
          history.push(result[i]);
        }
      }

      setDataPage(history);
      setDataPageTwo(resultTwo);
    }
  }, [isLoading]);

  return (
    <Aux>
      <div className={styles.history_container}>
        <h1 className={styles.title}>
          Recent transactions
        </h1>
        <div>
          <Grid>
            {dataPage === 'false'
              ? 'No data to display'
              : dataPage.map((row, i) => {
                const date = new Date(row.createdAt);
                const timestamp = date.toDateString();
                const amount = (row.amount / 100000000000000000).toFixed(2);

                return (
                  <Grid.Column
                    computer={8}
                    tablet={8}
                    mobile={16}
                    key={i}
                  >
                    <div className={styles.history_column}>
                      {row.type.includes('Deposit') ? (
                        <svg width="25" height="25" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="16.5002" cy="16.5" r="16.5" fill="#1F1F1F"/>
                          <path d="M21.75 22.75H11.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M12.75 14.5L16.5 18.25L20.25 14.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16.5 18.25V9.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="25" height="25" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="16.5002" cy="16.5" r="16.5" fill="#1F1F1F"/>
                          <path d="M21.75 22.75H11.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M20.25 13L16.5 9.25L12.75 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16.5 9.25L16.5 18.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      )}
                        <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span className={styles.left_column}>
                            <h2 className={styles.row_type}>
                              {row.type}
                            </h2>
                            <h3 className={styles.row_date}>
                              {timestamp}
                            </h3>
                          </span>
                          <span className={styles.right_column}>
                            <h2 className={styles.row_type} style={{ textAlign: 'right' }}>
                              {amount}
                            </h2>
                            <h3 className={styles.row_date} style={{ textAlign: 'right' }}>
                              $0.00
                            </h3>
                          </span>
                        </span>
                    </div>
                  </Grid.Column>
                );
              })}
            </Grid>
        </div>
      </div>

     <div className={styles.history_container}>
        <h1 className={styles.title}>
          Gameplay History
        </h1>
        <div className="tx-box-overflow">
          <Table unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Game</Table.HeaderCell>
                <Table.HeaderCell className="account-col-2">
                  Bet
                </Table.HeaderCell>
                <Table.HeaderCell>Payout</Table.HeaderCell>
                <Table.HeaderCell className="account-col-4">
                  Date
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Transactions
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            {dataPageTwo === 'false'
              ? 'No data to display'
              : dataPageTwo.map((row, i) => {
                  const date = new Date(row.createdAt);
                  const timestamp = date.toLocaleString();
                  const amount =
                    Number(row.betAmount) / Global.CONSTANTS.FACTOR;
                  const result =
                    Number(row.amountWin) / Global.CONSTANTS.FACTOR;

                  let action = '';
                  if (row.gameType === 1) {
                    action = 'Slots';
                  } else if (row.gameType === 8 || row.gameType === 2) {
                    action = 'Roulette';
                  } else if (row.gameType === 3) {
                    action = 'Backgammon';
                  } else if (row.gameType === 7 || row.gameType === 4) {
                    action = 'Blackjack';
                  }

                  let style = '';
                  {
                    i % 2 === 0 ? (style = 'rgba(255, 255, 255, 0.08)') : (style = 'black');
                  }

                  return (
                    <Table.Body key={i}>
                      <Table.Row style={{ background: style }}>
                        <Table.Cell>
                          {action}
                        </Table.Cell>
                        <Table.Cell className="account-col-2">
                          {row.coinName === 'DAI' ? (
                            <img
                              src={Images.DAI_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%',
                              }}
                            />
                          ) : row.coinName === 'MANA' ? (
                            <img
                              src={Images.MANA_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%',
                              }}
                            />
                          ) : row.coinName === 'USDT' ? (
                            <img
                              src={Images.USDT_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%',
                              }}
                            />
                          ) : row.coinName === 'ATRI' ? (
                            <img
                              src={Images.ATRI_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%',
                              }}
                            />
                          ) : row.coinName === 'WETH' ? (
                            <img
                              src={Images.ETH_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%',
                              }}
                            />
                          ) : (
                            <img
                              src={Images.PLAY_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%',
                              }}
                            />
                          )}
                          -{amount} {row.coinName}
                        </Table.Cell>
                        <Table.Cell>
                          {row.coinName === 'DAI' ? (
                            <img
                              src={Images.DAI_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%',
                              }}
                            />
                          ) : row.coinName === 'MANA' ? (
                            <img
                              src={Images.MANA_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%',
                              }}
                            />
                          ) : row.coinName === 'USDT' ? (
                            <img
                              src={Images.USDT_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%',
                              }}
                            />
                          ) : row.coinName === 'ATRI' ? (
                            <img
                              src={Images.ATRI_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%',
                              }}
                            />
                          ) : row.coinName === 'WETH' ? (
                            <img
                              src={Images.ETH_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%',
                              }}
                            />
                          ) : (
                            <img
                              src={Images.PLAY_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%',
                              }}
                            />
                          )}
                          +{result} {row.coinName}
                        </Table.Cell>
                        <Table.Cell className="account-col-4">{timestamp}</Table.Cell>
                        <Table.Cell>
                          <span style={{ float: 'right' }}>
                            {row.coinName !== 'PLAY' ? (
                              <Aux>
                                <Button
                                  href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.txid}`}
                                  target="_blank"
                                  className="etherscan-button"
                                  style={{ marginRight: '12px' }}
                                >
                                  tx
                                  <svg style={{ marginLeft: '4px' }} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z" fill="white"/>
                                  </svg>
                                </Button>
                              </Aux>
                            ) : (
                              null
                            )}

                            {row.coinName !== 'PLAY' ? (
                              <Aux>
                                <Button
                                  href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.ptxid}`}
                                  target="_blank"
                                  className="etherscan-button-ptxid"
                                >
                                  payout tx
                                  <svg style={{ marginLeft: '4px' }} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z" fill="white"/>
                                  </svg>
                                </Button>
                                <Button
                                  href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.ptxid}`}
                                  target="_blank"
                                  className="etherscan-button-mobile"
                                >
                                  p tx
                                  <svg style={{ marginLeft: '4px' }} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z" fill="white"/>
                                  </svg>
                                </Button>
                              </Aux>
                            ) : (
                              null
                            )}
                          </span>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  );
                })}
          </Table>
        </div>
      </div>
    </Aux>
  );
}

export default History;
