import { Table, Button, Icon, Divider } from 'semantic-ui-react';
import ModalWithdraw from '../modal/ModalWithdraw';
import Global from '../Constants';

const ContentTransactions = (props) => {
  function contentLabels() {
    if (props.type === 'Balances') {
      return null;
    } else if (props.type === 'Play') {
      return (
        <tbody>
          <tr className="table-header">
            <td className="table-header-text account">GAME</td>
            <td className="table-header-text-1 bet">BET</td>
            <td className="table-header-text-1">PAYOUT</td>
            <td className="table-header-text-1 date">DATE</td>
            <td />
          </tr>
        </tbody>
      );
    } else if (props.type === 'History') {
      return (
        <tbody>
          <tr className="table-header">
            <td className="table-header-text account">ACTION</td>
            <td className="table-header-text-1">AMOUNT</td>
            <td className="table-header-text-1 status">STATUS</td>
            <td className="table-header-text-1 date">DATE</td>
            <td />
          </tr>
        </tbody>
      );
    }
  }

  function contentHistory() {
    return (
      <tbody>
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
            <tr className="table-body" key={i}>
              <td className="table-body-text-1 first">
                <img
                  src={Global.IMAGES.ICON_MANA}
                  style={{
                    width: '25px',
                    paddingRight: '6px',
                    verticalAlign: 'middle',
                    marginTop: '-3px',
                  }}
                />
                {row.type}
              </td>

              <td className="table-body-text-1">
                {sign}
                {amount > 1000000000000000000000000
                  ? 'MAX AMOUNT'
                  : amount + ' MANA'}
              </td>

              <td className="table-body-text-1 status">{row.status}</td>
              <td className="table-body-text-1 date">{timestamp}</td>

              <td className="table-body-text-1 hash">
                {/*<a
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
                <Icon name="caret right" style={{ color: '#2085F4' }} />*/}

                <span style={{ float: 'right', paddingRight: '12px' }}>
                  <Button
                    href={Global.MATIC_EXPLORER + `/tx/${row.txid}`}
                    target="_blank"
                    className="etherscan-button"
                  >
                    etherscan
                    <span class="material-icons" id="etherscan-button-icon">
                      launch
                    </span>
                  </Button>
                </span>

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
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  }

  function contentGameplay() {
    return (
      <tbody>
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
            <tr className="table-body" key={i}>
              <td className="table-body-text-1 first">
              {row.coinName === 'play' ?
                <img
                  src={Global.IMAGES.ICON_MANA}
                  style={{
                    width: '24px',
                    paddingRight: '6px',
                    verticalAlign: 'middle',
                    marginTop: '-2px',
                  }}
                />
              :
                <img
                  src={Global.IMAGES.ICON_PLAY}
                  style={{
                    width: '24px',
                    paddingRight: '6px',
                    verticalAlign: 'middle',
                    marginTop: '-2px',
                  }}
                />
              }
                {action}
              </td>

              <td className="table-body-text-1 bet">
                -{amount} {row.coinName}
              </td>
              <td className="table-body-text-1">
                +{result} {row.coinName}
              </td>
              <td className="table-body-text-1 date">{timestamp}</td>

              <td className="table-body-text-1 hash">
                <span style={{ float: 'right', paddingRight: '12px' }}>
                  {row.coinName === 'play' ?
                    <Button
                      href={Global.MATIC_EXPLORER + `/tx/${row.txid}`}
                      target="_blank"
                      className="etherscan-button"
                    >
                      etherscan
                      <span class="material-icons" id="etherscan-button-icon">
                        launch
                      </span>
                    </Button>
                  :
                    <Button
                      disabled
                      className="etherscan-button"
                    >
                      etherscan
                      <span class="material-icons" id="etherscan-button-icon">
                        launch
                      </span>
                    </Button>
                  }
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
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
