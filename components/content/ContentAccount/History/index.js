import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import Global from 'components/Constants';
import Images from 'common/Images';
import Aux from 'components/_Aux';
import { Button, Grid, Table } from 'semantic-ui-react';
import Deposit from 'assets/svg/deposit.svg';
import Withdrawal from 'assets/svg/withdrawal.svg';
import TopRightArrow from 'assets/svg/toprightarrow.svg';

import styles from './History.module.scss';

const CoinCell = ({ coinName }) => {
  return (
    <>
      { coinName === "DAI" ? (
        <img
          className={styles.token_image}
          src={Images.DAI_CIRCLE}
        />
      ) : coinName === "MANA" ? (
        <img
          className={styles.token_image}
          src={Images.MANA_CIRCLE}
        />
      ) : coinName === "USDT" ? (
        <img
          className={styles.token_image}
          src={Images.USDT_CIRCLE}
        />
      ) : coinName === "ATRI" ? (
        <img
          className={styles.token_image}
          src={Images.ATRI_CIRCLE}
        />
      ) : coinName === "WETH" ? (
        <img
          className={styles.token_image}
          src={Images.ETH_CIRCLE}
        />
      ) : (
        <img
          className={styles.token_image}
          src={Images.PLAY_CIRCLE}
        />
      )}
    </>
  )
};

const History = ({ state }) => {
  // get user's transaction history from the Context API store
  const dataHistory = state.transactions[0];
  const dataPlay = state.transactions[1];
  const dataPoker = state.transactions[2];
  console.log('?????');
  console.log(dataPoker);

  // define local variables
  const [dataPage, setDataPage] = useState([]);
  const [dataPageTwo, setDataPageTwo] = useState([]);
  const [dataPageThree, setDataPageThree] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      let j;
      let history = [];
      let gameplay = [];

      result = dataHistory.slice(0, maximumCount);
      resultTwo = dataPlay.slice(0, maximumCount);

      for (let index = 0; index < result.length; index++) {
        const resultType = get(result, `${index}.type`, '');
        if (
          resultType.includes('Deposit') ||
          resultType.includes('Withdrawal')
        ) {
          history.push(result[index]);
        }
      }

      for (j = 0; j < resultTwo.length; j++) {
        const resultTypeTwo = get(resultTwo, `${j}.gameType`, '');
        console.log(resultTypeTwo);
        if (
          resultTypeTwo < 10
        ) {
          gameplay.push(resultTwo[j]);
        }
      }

      setDataPage(history);
      setDataPageTwo(gameplay);
    }
  }, [isLoading]);

  console.log('!!!!');
  console.log(dataPage);

  return (
    <Aux>
      <div className={styles.history_container}>
        <p className={styles.title}>Recent transactions</p>
        {!dataPage.length ? (
          <div className={styles.error_container}>
            <p className={styles.error_state}>No Recent Transactions</p>
          </div>
        ) : (
          <Grid>
            {dataPage.map((row, i) => {
              const date = new Date(row.createdAt);
              const timestamp = date.toDateString();
              let amount;
              {row.type.includes('USDT') ? (
                amount = (row.amount / 1000000).toFixed(2)
              ) : row.type.includes('DAI') ? (
                amount = (row.amount / 100000000000000000).toFixed(2)
              ) : row.type.includes('MANA') ? (
                amount = (row.amount / 1000000000000000000).toFixed(2)
              ) : (
                amount = (row.amount / 1000000000000000000).toFixed(2)
              )}

              return (
                <Grid.Column computer={8} tablet={8} mobile={16} key={i}>
                  <div className={styles.history_column}>
                    {row.type.includes('Deposit') ? <Deposit /> : <Withdrawal />}
                    <div className={styles.column_container}>
                      <span className={styles.left_column}>
                        <p className={styles.row_type}>{row.type}</p>
                        <p className={styles.row_date}>{timestamp}</p>
                      </span>
                      <span className={styles.right_column}>
                        <p className={styles.row_type}>
                          {amount}
                        </p>
                        <p className={styles.row_date}>
                          $0.00
                        </p>
                      </span>
                    </div>
                  </div>
                </Grid.Column>
              );
            })}
          </Grid>
        )}
      </div>

      <div className={styles.history_container}>
        <p className={styles.title}>Gameplay History</p>
        <div className={styles.tx_box_overflow}>
          {dataPageTwo === 'false' ? null : (
            <Table fixed unstackable className={styles.history_table}> 
              <Table.Header className={styles.header}>
                <Table.Row className={styles.row}>
                  <Table.HeaderCell  className={styles.th}>
                    Game
                  </Table.HeaderCell>
                  <Table.HeaderCell  className={styles.th}>
                    Bet
                  </Table.HeaderCell>
                  <Table.HeaderCell  className={styles.th}>
                    Payout
                  </Table.HeaderCell>
                  <Table.HeaderCell  className={styles.th}>
                    Date
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    className={styles.th}
                  >
                    Transactions
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>
          )}

          {dataPageTwo === 'false' ? (
            <div className={styles.error_container}>
              <p className={styles.error_state}>No Recent Gameplay History</p>
            </div>
          ) : (
            dataPageTwo.map((row, i) => {
              const date = new Date(row.createdAt);
              const timestamp = date.toLocaleString();
              const amount = Number(row.betAmount) / Global.CONSTANTS.FACTOR;
              const result = Number(row.amountWin) / Global.CONSTANTS.FACTOR;

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
                i % 2 === 0
                  ? (style = 'rgba(255, 255, 255, 0.08)')
                  : (style = 'black');
              }

              return (
                <Grid.Column
                computer={8}
                tablet={8}
                mobile={16}
                className={styles.leaderboard_column}
                >
                <Table className={styles.history_table} unstackable>
                  <Table.Body key={i} className={styles.body}>
                    <Table.Row style={{ background: style }} className={styles.body_row}>
                      <Table.Cell className={styles.td}>Name</Table.Cell>
                      <Table.Cell className={styles.td}>
                        <CoinCell coinName={row.coinName} />
                        -{amount} {row.coinName}
                      </Table.Cell>
                      <Table.Cell className={styles.td}>
                        <CoinCell coinName={row.coinName} />
                        +{result} {row.coinName}
                      </Table.Cell>
                      <Table.Cell className={styles.td}>
                        {timestamp}
                      </Table.Cell>
                      <Table.Cell className={styles.td}>
                        <span className="float-right">
                          {row.coinName !== 'PLAY' ? (
                            <Aux>
                              <Button
                                href={
                                  Global.CONSTANTS.MATIC_EXPLORER +
                                  `/tx/${row.txid}`
                                }
                                target="_blank"
                                className={styles.etherscan_button}
                              >
                                tx
                                <TopRightArrow />
                              </Button>
                            </Aux>
                          ) : null}

                          {row.coinName !== 'PLAY' ? (
                            <Aux>
                              <Button
                                href={
                                  Global.CONSTANTS.MATIC_EXPLORER +
                                  `/tx/${row.ptxid}`
                                }
                                target="_blank"
                                className={styles.etherscan_button_ptxid}
                              >
                                payout tx
                                <TopRightArrow />
                              </Button>
                              <Button
                                href={
                                  Global.CONSTANTS.MATIC_EXPLORER +
                                  `/tx/${row.ptxid}`
                                }
                                target="_blank"
                                className={styles.etherscan_button_mobile}
                              >
                                p tx
                                <TopRightArrow />
                              </Button>
                            </Aux>
                          ) : null}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
              );
            })
          )}
        </div>
      </div>
    </Aux>
  );
}

export default History;
