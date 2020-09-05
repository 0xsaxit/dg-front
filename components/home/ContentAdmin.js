import { useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button, Divider, Grid } from 'semantic-ui-react';
import Global from '../Constants';

const ContentAdmin = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  function contentLabels() {
    if (props.type === 'balances') {
      return null;
    } else if (props.type === 'machines') {
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

  function contentBalances() {
    return (
      <Grid className="balances-container">
        <Grid.Row>
          <Grid.Column
            computer={5}
            tablet={16}
            mobile={16}
            className="balances-column one"
          >
            <p className="balances-token-name">Play</p>
            <Divider className="balances-divider" />
            <img
              src={Global.IMAGES.PLAY_CIRCLE}
              style={{
                width: '60px',
                display: 'flex',
                marginLeft: 'calc(50% - 30px)',
                paddingTop: '12px',
              }}
            />
            <p className="balances-text"> {state.userInfo[2]} </p>
            <span className="balances-button-span">
              <Button
                color="blue"
                className="balances-play-button"
                href="https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber"
                target="_blank"
              >
                PLAY NOW
              </Button>
              {state.userInfo[3] === 2 ? (
                <Button
                  disabled
                  color="blue"
                  className="balances-play-button-2"
                >
                  TOP UP
                </Button>
              ) : (
                <Button
                  onClick={() => topUp()}
                  color="blue"
                  className="balances-play-button-2"
                >
                  TOP UP
                </Button>
              )}
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
                onClick={() => show_transak()}
              >
                PURCHASE
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
                onClick={() => show_transak()}
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
                className="matic-widget-button balances-play-button"
                data-default-page="deposit"
                data-wapp-id="xeYvesZxGiEKOMt4gq3s"
                onClick={() => initializePings()}
              >
                DEPOSIT
              </Button>
              <Button
                color="blue"
                className="matic-widget-button balances-play-button-2"
                data-default-page="withdraw"
                data-wapp-id="xeYvesZxGiEKOMt4gq3s"
                onClick={() => initializePings()}
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
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  }

  function contentMachines() {
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
                {row.coinName === 'play' ? (
                  <img
                    src={Global.IMAGES.ICON_MANA}
                    style={{
                      width: '24px',
                      paddingRight: '6px',
                      verticalAlign: 'middle',
                      marginTop: '-2px',
                    }}
                  />
                ) : (
                  <img
                    src={Global.IMAGES.ICON_PLAY}
                    style={{
                      width: '24px',
                      paddingRight: '6px',
                      verticalAlign: 'middle',
                      marginTop: '-2px',
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
                  {row.coinName === 'play' ? (
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
                  ) : (
                    <Button disabled className="etherscan-button">
                      etherscan
                      <span class="material-icons" id="etherscan-button-icon">
                        launch
                      </span>
                    </Button>
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
    return contentBalances();
  } else if (props.content === 'history') {
    return contentHistory();
  } else if (props.content === 'machines') {
    return contentMachines();
  } else {
    console.log('data type: ' + props.content);
    console.log('data page: ' + props.dataPage);
  }
};

export default ContentAdmin;
