import { useContext, useEffect } from 'react';
import transakSDK from '@transak/transak-sdk';
import { Table, Button, Icon, Modal } from 'semantic-ui-react';
import { GlobalContext } from '../../store';
import ModalDeposit from '../modal/ModalDeposit';
import ModalWithdraw from '../modal/ModalWithdraw';
import Global from '../Constants';

let transak = new transakSDK({
  apiKey: Global.TRANSAK_KEY, // API Key
  environment: 'STAGING', // STAGING/PRODUCTION
  defaultCryptoCurrency: 'MANA',
  walletAddress: '', // customer wallet address
  themeColor: '000000', // theme color
  fiatCurrency: '', // INR/GBP
  email: '', // customer email address
  redirectURL: '',
  hostURL: Global.BASE_URL + '/account',
  widgetHeight: '720px',
  widgetWidth: '450px',
});

const ContentTransactions = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    // get all the events
    transak.on(transak.ALL_EVENTS, (data) => {
      console.log(data);
    });
    // triggers when the user closes the widget
    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
      transak.close();
    });
    // triggers when the payment is complete
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log(orderData);
      transak.close();
    });
  });

  // initialize transak modal
  function show_transak() {
    transak.init();
  }

  function contentLabels() {
    if (props.type === 'Balances') {
      return (
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="table-header-text">
              MAINCHAIN BALANCES
            </Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">
              ACTION
            </Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">
              MATIC BALANCES
            </Table.HeaderCell>
            <Table.HeaderCell className="table-header-text">
              ACTION
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      );
    } else if (props.type === 'Play' || 'History') {
      return (
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="table-header-text">
              ACTION
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
    }
  }

  function contentBalances() {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <img
              src={Global.IMAGES.MANA_CIRCLE}
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
              <a className="balances-purchase" onClick={show_transak}>
                PURCHASE
              </a>
              <Modal
                trigger={<p className="balances-exchange">TRADE</p>}
                closeIcon
              >
                <Modal.Content className="uniswap-modal">
                  <iframe
                    src="https://v2.uniswap.exchange/swap?outputCurrency=0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"
                    height="660px"
                    width="100%"
                    className="uniswap-iframe"
                  />
                </Modal.Content>
              </Modal>
            </span>
          </Table.Cell>
          <Table.Cell>
            <img
              src={Global.IMAGES.MANA_CIRCLE}
              style={{
                width: '18px',
                paddingRight: '3px',
                verticalAlign: 'middle',
                marginTop: '-3px',
              }}
            />
            {state.balances[0][1]} MANA
          </Table.Cell>
          <Table.Cell>
            <span className="balances-table-span">
              <ModalDeposit menuLink={0} />
              <ModalWithdraw isExit={0} />
            </span>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <img
              src={Global.IMAGES.DAI_CIRCLE}
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
              <p className="balances-deposit">PURCHASE</p>
              <p className="balances-withdraw">TRADE</p>
            </span>
          </Table.Cell>
          <Table.Cell>
            <img
              src={Global.IMAGES.DAI_CIRCLE}
              style={{
                width: '18px',
                paddingRight: '3px',
                verticalAlign: 'middle',
                marginTop: '-3px',
              }}
            />
            {state.balances[1][1]} DAI
          </Table.Cell>
          <Table.Cell>
            <span className="balances-table-span">
              <p className="balances-deposit">DEPOSIT</p>
              <p className="balances-withdraw">WITHDRAW</p>
            </span>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell>
            <img
              src={Global.IMAGES.LOGO}
              style={{
                width: '18px',
                paddingRight: '3px',
                verticalAlign: 'middle',
                marginTop: '-3px',
              }}
            />
            5,000 PLAY
          </Table.Cell>
          <Table.Cell>
            <span className="balances-table-span">
              <a
                href="https://play.decentral.games"
                target="_blank"
                className="balances-deposit play"
              >
                PLAY
              </a>
            </span>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
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

  if (props.content == 'Labels') {
    return contentLabels();
  } else if (props.content == 'Balances') {
    return contentBalances();
  } else if (props.content == 'History') {
    return contentHistory();
  } else if (props.content == 'Play') {
    return contentGameplay();
  }
};

export default ContentTransactions;
