import { useContext, useEffect } from 'react';
import { GlobalContext } from '../../store';
import transakSDK from '@transak/transak-sdk';
import { Table, Button, Icon, Divider, Grid } from 'semantic-ui-react';
import ModalWithdraw from '../modal/ModalWithdraw';
import Global from '../Constants';

let transak = new transakSDK({
  apiKey: Global.KEYS.TRANSAK_API, // API Key
  environment: 'STAGING', // STAGING/PRODUCTION
  defaultCryptoCurrency: 'MANA',
  walletAddress: '', // customer wallet address
  themeColor: '000000', // theme color
  fiatCurrency: '', // INR/GBP
  email: '', // customer email address
  redirectURL: '',
  hostURL: 'https://decentral.games/account',
  widgetHeight: '633px',
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
  }, []);

  // initialize transak modal
  function show_transak() {
    transak.init();
  }

  function contentLabels() {
    if (props.type === 'Balances') {
      return null;
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

  function contentBalancesMain() {
    return (
      <Grid className="balances-container">
        <Grid.Row>
          <Grid.Column
            computer={5}
            tablet={16}
            mobile={16}
            className="balances-column one"
          >
            <p className="balances-token-name"> Play </p>
            <Divider className="balances-divider" />
            <img
              src={Global.IMAGES.LOGO}
              style={{
                width: '60px',
                display: 'flex',
                marginLeft: 'calc(50% - 30px)',
                paddingTop: '12px',
              }}
            />
            <p className="balances-text"> 5,000 </p>
            <span className="balances-button-span">
              <Button
                color="blue"
                className="balances-play-button"
                href="https://play.decentral.games"
                target="_blank"
              >
                PLAY NOW
              </Button>
              <Button
                disabled
                color="blue"
                className="balances-play-button-2"
                href="https://play.decentral.games"
                target="_blank"
              >
                TOP UP
              </Button>
            </span>
          </Grid.Column>

          <Grid.Column
            computer={5}
            tablet={16}
            mobile={16}
            className="balances-column two"
          >
            <span className="name-purchase-span">
              <p className="balances-token-name"> Dai </p>
              <Button
                disabled
                className="balances-purchase-button"
                onClick={show_transak}
              >
                Purchase
              </Button>
            </span>
            <Divider className="balances-divider" />
            <img
              src={Global.IMAGES.DAI_CIRCLE}
              style={{
                width: '60px',
                display: 'flex',
                marginLeft: 'calc(50% - 30px)',
                paddingTop: '12px',
              }}
            />
            <p className="balances-text"> 0 </p>
            <span className="balances-button-span">
              <Button disabled color="blue" className="balances-play-button">
                DEPOSIT
              </Button>
              <Button disabled color="blue" className="balances-play-button-2">
                WITHDRAW
              </Button>
            </span>
          </Grid.Column>

          <Grid.Column
            computer={5}
            tablet={16}
            mobile={16}
            className="balances-column three"
          >
            <span className="name-purchase-span">
              <p className="balances-token-name"> Mana </p>
              <Button
                className="balances-purchase-button"
                onClick={show_transak}
              >
                PURCHASE
              </Button>
            </span>
            <Divider className="balances-divider" />
            <img
              src={Global.IMAGES.MANA_CIRCLE}
              style={{
                width: '60px',
                display: 'flex',
                marginLeft: 'calc(50% - 30px)',
                paddingTop: '12px',
              }}
            />
            <p className="balances-text"> {state.balances[0][1]} </p>
            <span className="balances-button-span">
              <Button
                color="blue"
                className="balances-play-button"
                data-default-page="deposit"
              >
                DEPOSIT
              </Button>
              <Button
                color="blue"
                className="balances-play-button-2"
                data-default-page="withdraw"
                data-wapp-id="xeYvesZxGiEKOMt4gq3s"
              >
                WITHDRAW
              </Button>

              <script
                src="https://wallet.matic.today/embeds/widget-button.js"
                data-script-name="matic-embeds"
              ></script>
            </span>
          </Grid.Column>
        </Grid.Row>
      </Grid>
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

  if (props.content == 'Labels') {
    return contentLabels();
  } else if (props.content == 'Balances') {
    return null;
  } else if (props.content == 'History') {
    return contentHistory();
  } else if (props.content == 'Play') {
    return contentGameplay();
  }
};

export default ContentTransactions;
