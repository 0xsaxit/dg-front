import { Button, Icon } from 'semantic-ui-react';
import Global from '../Constants';
import Images from '../../common/Images';

const ContentAccount = (props) => {
  function contentLabels() {
    if (props.type === 'balances') {
      return null;
    } else if (props.type === 'play') {
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
    } else if (props.type === 'history') {
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

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentHistory() {
    return (
      <tbody>
        {props.dataPage.map((row, i) => {
          const date = new Date(row.createdAt);
          const timestamp = date.toLocaleString();
          const amount = row.amount;

          let sign = '';
          if (row.type === 'Deposit') {
            sign = '+';
          } else if (row.type === 'Withdraw') {
            sign = '-';
          }

          return (
            <tr className="table-body" key={i}>
              <td className="table-body-text-1 first">
                {row.coinName === 'MANA' ? (
                  <img
                    src={Images.ICON_DAI}
                    style={{
                      width: '21px',
                      marginRight: '6px',
                      verticalAlign: 'middle',
                      marginTop: '-2px',
                      borderRadius: '100%',
                    }}
                  />
                ) : (
                  <img
                    src={Images.ICON_MANA}
                    style={{
                      width: '21px',
                      marginRight: '6px',
                      verticalAlign: 'middle',
                      marginTop: '-2px',
                      borderRadius: '100%',
                    }}
                  />
                )}
                {row.type}
              </td>

              <td className="table-body-text-1">
                {sign}
                {amount > 1000000000000000000000000
                  ? 'N/A'
                  : amount + ' MANA'}
              </td>

              <td className="table-body-text-1 status">{row.status}</td>
              <td className="table-body-text-1 date">{timestamp}</td>

              <td className="table-body-text-1 hash">
                <span style={{ float: 'right', paddingRight: '12px' }}>
                  <Button
                    href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.txid}`}
                    target="_blank"
                    className="etherscan-button"
                  >
                    blockchain tx
                    <Icon name="external alternate" style={{ marginLeft: '6px', marginRight: '-2px' }}/>
                  </Button>
                  <Button
                    href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.txid}`}
                    target="_blank"
                    className="etherscan-button-mobile"
                  >
                    tx
                    <Icon name="external alternate" style={{ marginLeft: '6px', marginRight: '-2px' }}/>
                  </Button>
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentGameplay() {
    return (
      <tbody>
        {props.dataPage.map((row, i) => {
          const date = new Date(row.createdAt);
          const timestamp = date.toLocaleString();
          const amount = Number(row.betAmount) / Global.CONSTANTS.FACTOR;
          const result = Number(row.amountWin) / Global.CONSTANTS.FACTOR;
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
                {row.coinName === 'MANA' ? (
                  <img
                    src={Images.ICON_MANA}
                    style={{
                      width: '21px',
                      marginRight: '6px',
                      verticalAlign: 'middle',
                      marginTop: '-2px',
                      borderRadius: '100%',
                    }}
                  />
                ) : row.coinName === 'DAI' ? (
                  <img
                    src={Images.ICON_DAI}
                    style={{
                      width: '21px',
                      marginRight: '6px',
                      verticalAlign: 'middle',
                      marginTop: '-2px',
                      borderRadius: '100%',
                    }}
                  />
                ) : (
                  <img
                    src={Images.ICON_PLAY}
                    style={{
                      width: '21px',
                      marginRight: '6px',
                      verticalAlign: 'middle',
                      marginTop: '-2px',
                      borderRadius: '100%',
                    }}
                  />
                )}

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
                  {row.coinName === 'MANA' ? (
                    <span>
                      <Button
                        href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.txid}`}
                        target="_blank"
                        className="etherscan-button"
                      >
                        blockchain tx
                        <Icon name="external alternate" style={{ marginLeft: '6px', marginRight: '-2px' }}/>
                      </Button>
                      <Button
                        href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.txid}`}
                        target="_blank"
                        className="etherscan-button-mobile"
                      >
                        tx
                        <Icon name="external alternate" style={{ marginLeft: '6px', marginRight: '-2px' }}/>
                      </Button>
                    </span>
                  ) : row.coinName === 'DAI' ? (
                    <span>
                      <Button
                        href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.txid}`}
                        target="_blank"
                        className="etherscan-button"
                      >
                        blockchain tx
                        <Icon name="external alternate" style={{ marginLeft: '6px', marginRight: '-2px' }}/>
                      </Button>
                      <Button
                        href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.txid}`}
                        target="_blank"
                        className="etherscan-button-mobile"
                      >
                        tx
                        <Icon name="external alternate" style={{ marginLeft: '6px', marginRight: '-2px' }}/>
                      </Button>
                    </span>
                  ) : (
                    <span>
                      <Button disabled className="etherscan-button" style={{ padding: '2px 0px 0px 0px' }}>
                        blockchain tx
                        <Icon name="external alternate" style={{ marginLeft: '6px', marginRight: '-2px' }}/>
                      </Button>
                      <Button
                        disabled
                        href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.txid}`}
                        target="_blank"
                        className="etherscan-button-mobile"
                      >
                        tx
                        <Icon name="external alternate" style={{ marginLeft: '6px', marginRight: '-2px' }}/>
                      </Button>
                    </span>
                  )}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  }

  if (props.content === 'labels') {
    return contentLabels();
  } else if (props.content === 'balances') {
    return null;
  } else if (props.content === 'history') {
    return contentHistory();
  } else if (props.content === 'play') {
    return contentGameplay();
  }
};

export default ContentAccount;
