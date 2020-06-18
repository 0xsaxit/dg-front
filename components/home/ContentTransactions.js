import { Table, Button, Icon } from 'semantic-ui-react';
import ModalWithdraw from '../modal/ModalWithdraw';
import mana from '../../static/images/mana.png';
import eth from '../../static/images/eth.png';
import dai from '../../static/images/dai.png';
import Global from '../constants';
import ModalAccountDeposit from '../modal/ModalAccountDeposit';


const ContentTransactions = (props) => {
  function contentLabels() {
    return (
      <div> </div>
    );
  }

  function contentHistory() {
    return (
      <Table singleLine fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="table-header-text">ACTION</Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">AMOUNT</Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">RESULT</Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">DATE</Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">TX HASH</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.dataPage.map((row, i) => {
            const date = new Date(row.createdAt);
            const timestamp = date.toLocaleString();
            const amount = row.amount;
            let sign = '+';
            if (row.type !== 'Deposit') sign = '-';

            const dateFirst = new Date(timestamp);
            const dateSecond = new Date();
            const timeDiff = Math.abs(
              dateSecond.getTime() - dateFirst.getTime()
            );

            return (
              <Table.Row key={i}>
                <Table.Cell>
                  <img
                    src={mana}
                    style={{
                      width: '18px',
                      paddingRight: '3px',
                      verticalAlign: 'middle',
                      marginTop: '-3px',
                    }}
                  />
                  {row.type}
                </Table.Cell>

                <Table.Cell>
                  {sign}
                  {amount} MANA
                </Table.Cell>

                <Table.Cell>{row.status}</Table.Cell>
                <Table.Cell>{timestamp}</Table.Cell>

                <Table.Cell>
                  <a
                    style={{
                      color: '#2085F4',
                      maxWidth: '90px',
                      display: 'inline-block',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      verticalAlign: 'middle',
                    }}
                    target="_blank"
                    href={Global.MATIC_EXPLORER + `/tx/${row.txid}`}
                  >
                    {row.txid}
                  </a>
                  <Icon name="caret right" style={{ color: '#2085F4' }} />

                  {row.type === 'Exit' && row.status === 'In Progress' ? (
                    // set PENDING time to 600 seconds (10 minutes)
                    timeDiff * 0.001 < 600 ? (
                      <Button size="mini" color="red">
                        PENDING
                      </Button>
                    ) : (
                      <ModalWithdraw isLink={1} transactionHash={row.txid} />
                    )
                  ) : null}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }

  function contentBalances() {
    return (
      <Table id="header" singleLine fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="table-header-text">MAINCHAIN BALANCES</Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">ACTION</Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">MATIC BALANCES</Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">ACTION</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <img
                src={mana}
                style={{
                  width: '18px',
                  paddingRight: '3px',
                  verticalAlign: 'middle',
                  marginTop: '-3px',
                }}
              />
              0 MANA            
            </Table.Cell>
            <Table.Cell className="account-purchase">Purchase</Table.Cell>
            <Table.Cell>
              <img
                src={mana}
                style={{
                  width: '18px',
                  paddingRight: '3px',
                  verticalAlign: 'middle',
                  marginTop: '-3px',
                }}
              />
              0 MANA            
            </Table.Cell>
            <Table.Cell>
              <span className="balances-table-span">
                <ModalAccountDeposit />
                <ModalWithdraw />
              </span>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <img
                src={dai}
                style={{
                  width: '18px',
                  paddingRight: '3px',
                  verticalAlign: 'middle',
                  marginTop: '-3px',
                }}
              />
              0 DAI            
            </Table.Cell>
            <Table.Cell className="account-purchase">Purchase</Table.Cell>
            <Table.Cell>
              <img
                src={dai}
                style={{
                  width: '18px',
                  paddingRight: '3px',
                  verticalAlign: 'middle',
                  marginTop: '-3px',
                }}
              />
              0 DAI            
            </Table.Cell>
            <Table.Cell>
              <span className="balances-table-span">
                <p className="balances-deposit">Deposit</p>
                <p className="balances-withdraw">Withdraw</p>
              </span>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <img
                src={eth}
                style={{
                  width: '18px',
                  paddingRight: '3px',
                  verticalAlign: 'middle',
                  marginTop: '-3px',
                }}
              />
              0 ETH            
            </Table.Cell>
            <Table.Cell className="account-purchase">Purchase</Table.Cell>
            <Table.Cell>
              <img
                src={eth}
                style={{
                  width: '18px',
                  paddingRight: '3px',
                  verticalAlign: 'middle',
                  marginTop: '-3px',
                }}
              />
              0 ETH           
            </Table.Cell>
            <Table.Cell>
              <span className="balances-table-span">
                <p className="balances-deposit">Deposit</p>
                <p className="balances-withdraw">Withdraw</p>
              </span>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }

  function contentGameplay() {
    return (
      <Table singleLine fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="table-header-text">ACTION</Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">AMOUNT</Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">RESULT</Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">DATE</Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">TX HASH</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.dataPage.map((row, i) => {
            const date = new Date(row.createdAt);
            const timestamp = date.toLocaleString();
            const amount = Number(row.betAmount) / Global.FACTOR;
            const result = Number(row.amountWin) / Global.FACTOR;
            let action;
            if (row.gameType === 1) {
              action = 'Slots';
            } else if (row.gameType === 2) {
              action = 'Roulette';
            } else if (row.gameType === 3) {
              action = 'Backgammon';
            } else if (row.gameType === 4) {
              action = 'Blackjack';
            }

            return (
              <Table.Row key={i}>
                <Table.Cell>
                  <img
                    src={mana}
                    style={{
                      width: '18px',
                      paddingRight: '3px',
                      verticalAlign: 'middle',
                      marginTop: '-3px',
                    }}
                  />
                  {action}
                </Table.Cell>

                <Table.Cell>-{amount} MANA</Table.Cell>
                <Table.Cell>+{result} MANA</Table.Cell>
                <Table.Cell>{timestamp}</Table.Cell>

                <Table.Cell>
                  <a
                    style={{
                      color: '#2085F4',
                      maxWidth: '90px',
                      display: 'inline-block',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      verticalAlign: 'middle',
                    }}
                    target="_blank"
                    href={Global.MATIC_EXPLORER + `/tx/${row.txid}`}
                  >
                    {row.txid}
                  </a>
                  <Icon name="caret right" style={{ color: '#2085F4' }} />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }

  if (props.content == 'labels') {
    return contentLabels();
  } else if (props.content == 'balances') {
    return contentBalances();
  } else if (props.content == 'history') {    
    return contentHistory();
  } else if (props.content == 'gameplay') {
    return contentGameplay();
  }
};

export default ContentTransactions;
