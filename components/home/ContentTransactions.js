import { useContext } from 'react';
import { GlobalContext } from '../../store';
import { Table, Button, Icon, Modal } from 'semantic-ui-react';
import ModalDeposit from '../modal/ModalDeposit';
import ModalWithdraw from '../modal/ModalWithdraw';
import mana from '../../static/images/mana_circle.webp';
import eth from '../../static/images/eth.png';
import dai from '../../static/images/dai_circle.webp';
import Global from '../Constants';

const ContentTransactions = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

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
              <Modal
                trigger={<p className="balances-purchase">Purchase</p>}
                closeIcon
              >
                <Modal.Content className="purchase-modal">
                  <p style={{ textAlign: 'center', paddingBottom: '12px' }}>
                    {' '}
                    Coming Soon{' '}
                  </p>
                </Modal.Content>
              </Modal>
              <Modal
                trigger={<p className="balances-exchange">Exchange</p>}
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
              src={mana}
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
              <ModalDeposit isLink={1} />
              <ModalWithdraw isExit={0} />
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
          <Table.Cell>
            <span className="balances-table-span">
              <p className="balances-deposit">Purchase</p>
              <p className="balances-withdraw">Exchange</p>
            </span>
          </Table.Cell>
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
            {state.balances[1][1]} DAI
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
          <Table.Cell>
            <span className="balances-table-span">
              <p className="balances-deposit">Purchase</p>
              <p className="balances-withdraw">Exchange</p>
            </span>
          </Table.Cell>
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

              <Table.Cell>-{amount}</Table.Cell>
              <Table.Cell>+{result}</Table.Cell>
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
