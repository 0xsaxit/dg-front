// import { useContext, useEffect } from 'react';
// import { GlobalContext } from '../../store';
// import transakSDK from '@transak/transak-sdk';
import { Table, Button, Icon } from 'semantic-ui-react';
import ModalWithdraw from '../modal/ModalWithdraw';
import Global from '../Constants';

// let transak = new transakSDK({
//   apiKey: Global.KEYS.TRANSAK_API, // API Key
//   environment: 'STAGING', // STAGING/PRODUCTION
//   defaultCryptoCurrency: 'MANA',
//   walletAddress: '', // customer wallet address
//   themeColor: '000000', // theme color
//   fiatCurrency: '', // INR/GBP
//   email: '', // customer email address
//   redirectURL: '',
//   hostURL: 'https://decentral.games/account',
//   widgetHeight: '633px',
//   widgetWidth: '450px',
// });

const ContentTransactions = (props) => {


  function contentLabels() {
    if (props.type === 'Balances') {
      return null;
    } else if (props.type === 'Play') {
      return (
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="table-header-text">
              GAME
            </Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">
              AMOUNT
            </Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">
              RESULT
            </Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">
              DATE
            </Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">
              TX HASH
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      );
    } else if (props.type === 'History') {
      return (
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="table-header-text">
              poos
            </Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">
              AMOUNT
            </Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">
              RESULT
            </Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">
              DATE
            </Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">
              TX HASH
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      );
    } else {
      return null;
    }
  }

  function contentHistory() {
    return (
      <Table.Body>
        {props.dataPage.map((row, i) => {
          const date = new Date(row.createdAt);
          const timestamp = date.toLocaleString();
          const amount = row.amount;
          let sign = '+';
          if (row.type !== 'Deposit') sign = '-';

          const dateFirst = new Date(timestamp);
          const dateSecond = new Date();
          const timeDiff = Math.abs(dateSecond.getTime() - dateFirst.getTime());

          return (
            <Table.Row key={i}>
              <Table.Cell>
                <img
                  src={Global.IMAGES.ICON_MANA}
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
                {amount > 1000000000000000000000000
                  ? 'MAX AMOUNT'
                  : amount + ' MANA'}
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
                    <ModalWithdraw isExit={1} transactionHash={row.txid} />
                  )
                ) : null}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    );
  }

  function contentGameplay() {
    return (
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
                  src={Global.IMAGES.ICON_MANA}
                  style={{
                    width: '18px',
                    paddingRight: '3px',
                    verticalAlign: 'middle',
                    marginTop: '-3px',
                  }}
                />
                {action}
              </Table.Cell>

              <Table.Cell>
                -{amount} {row.coinName}
              </Table.Cell>
              <Table.Cell>
                +{result} {row.coinName}
              </Table.Cell>
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
    );
  }

  if (props.content === 'Labels') {
    return contentLabels();
  } else if (props.content === 'Balances') {
    return null;
  } else if (props.content === 'History') {
    return contentHistory();
  } else if (props.content === 'Play') {
    return contentGameplay();
  }
};

export default ContentTransactions;
