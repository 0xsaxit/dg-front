import { useContext } from 'react';
import { GlobalContext } from '../../store';
import { Table, Divider, Grid } from 'semantic-ui-react';
import ModalFunds from '../modal/ModalFunds';
import Global from '../Constants';
import Images from '../../common/Images';

const ContentAdmin = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const games = ['slots', 'roulette', 'backgammon', 'blackjack'];
  let game = '';

  function contentLabels() {
    if (props.type === 'balances') {
      return null;
    } else if (props.type === 'machines') {
      return (
        <tbody>
          <tr className="table-header">
            <td className="table-header-text account">GAME</td>
            <td className="table-header-text-1 bet">GLOBAL ID</td>
            <td className="table-header-text-1 date">TOTAL BETS</td>
            <td className="table-header-text-1">TOTAL PAYOUTS</td>
            <td className="table-header-text-1 date">LAST SESSION</td>
          </tr>
        </tbody>
      );
    } else if (props.type === 'history') {
      return (
        <tbody>
          <tr className="table-header">
            <td className="table-header-text account">GAME</td>
            <td className="table-header-text-1 bet">GLOBAL ID</td>
            <td className="table-header-text-1">PLAYER</td>
            <td className="table-header-text-1 date">BET</td>
            <td className="table-header-text-1">PAYOUT</td>
            <td className="table-header-text-1 date">TIMESTAMP</td>
          </tr>
        </tbody>
      );
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentBalances() {
    return (
      <Grid className="admin-balances-container">
        <Grid.Row>
          {games.slice(0, 4).map((game, i) => {
            return balanceBox(game, i);
          })}
        </Grid.Row>
      </Grid>
    );
  }

  function balanceBox(game, i) {
    let number;
    if (i === 1) {
      number = 'one';
    } else if (i === 2) {
      number = 'two';
    } else if (i === 3) {
      number = 'three';
    }

    return (
      <span className={`admin-balances-column ${number}`}>
        <span className="name-purchase-span">
          <p className="welcome-text" style={{ paddingLeft: '0px', marginTop: '-12px', marginBottom: '12px' }}>{game}</p>
        </span>

        <Divider className="balances-divider" />

        <span style={{ display: 'flex' }}>
          <span className="avatar-picture">
            <img
              src={Images.DAI_CIRCLE}
              style={{
                width: '60px',
                display: 'flex',
                paddingTop: '12px',
                paddingBottom: '9px',
              }}
            />
          </span>
          <span
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '7px',
            }}
          >
            <p className="welcome-text">dai</p>
            <p className="account-name">{state.adminBalances[1][i][0]}</p>
          </span>
        </span>

        <span style={{ display: 'flex' }}>
          <span className="avatar-picture">
            <img
              src={Images.MANA_CIRCLE}
              style={{
                width: '60px',
                display: 'flex',
                paddingTop: '12px',
                paddingBottom: '9px',
              }}
            />
          </span>
          <span
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '7px',
            }}
          >
            <p className="welcome-text">mana</p>
            <p className="account-name">{state.adminBalances[1][i][1]}</p>
          </span>
        </span>

        <span className="balances-button-span">
          <ModalFunds modalType={'deposit'} gameType={game} />
          <ModalFunds modalType={'withdraw'} gameType={game} />
        </span>
      </span>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentMachines() {
    return (
      <tbody>
        {props.dataPage.map((row, i) => {
          let row_type = row.globalID.substr(row.globalID.length - 6, 3);
          switch (row_type) {
            case '001':
              game = 'Slots';
              break;
            case '002':
              game = 'Roulette';
              break;
            case '003':
              game = 'Backgammon';
              break;
            case '004':
              game = 'Blackjack';
              break;
            case '005':
              game = 'Poker';
              break;
            default:
              game = 'Slots';
          }
          let bets = (
            Number(row.totalBetAmount) / Global.CONSTANTS.FACTOR
          ).toFixed(0);
          let payouts = (
            Number(row.totalAmountWin) / Global.CONSTANTS.FACTOR
          ).toFixed(0);

          // later we should provide the coinName property in the data
          let coinName = 'MANA';
          let coinImage = '';
          if (coinName === 'PLAY') {
            coinImage = Images.PLAY_CIRCLE;
          } else if (coinName === 'MANA') {
            coinImage = Images.ICON_MANA;
          } else if (coinName === 'DAI') {
            coinImage = Images.ICON_DAI;
          }

          let date = new Date(row.latestSessionDate);
          let timestamp = date.toLocaleString();
          timestamp = timestamp.replace(timestamp.substr(-2), '').trim();

          return (
            <tr className="table-body">
              <td className="table-body-text-1 first">
                <img
                  style={{
                    width: '21px',
                    marginRight: '6px',
                    verticalAlign: 'middle',
                    marginTop: '-3px',
                    borderRadius: '100%',
                  }}
                  src={coinImage}
                />
                <span style={{ textAlign: 'left', marginLeft: '10px' }}>
                  {game}
                </span>
              </td>

              <td className="table-body-text-1">{row.globalID}</td>

              <td className="table-body-text-1">{bets} MANA</td>

              <td className="table-body-text-1">{payouts} MANA</td>

              <td className="table-body-text-1">{timestamp}</td>
            </tr>
          );
        })}
      </tbody>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentHistory() {
    return (
      <tbody>
        {props.dataPage.map((row, i) => {
          let row_type = row.globalID.substr(row.globalID.length - 6, 3);
          if (row.betAmount) {
            switch (row_type) {
              case '001':
                game = 'Slots';
                break;
              case '002':
                game = 'Roulette';
                break;
              case '003':
                game = 'Backgammon';
                break;
              case '004':
                game = 'Blackjack';
                break;
              case '005':
                game = 'Poker';
                break;
              default:
                game = 'Slots';
            }
            let amount = Number(row.betAmount) / Global.CONSTANTS.FACTOR;
            let payout = Number(row.amountWin) / Global.CONSTANTS.FACTOR;
            let coinName = row.coinName;

            let coinImage = '';
            if (coinName === 'PLAY') {
              coinImage = Images.PLAY_CIRCLE;
            } else if (coinName === 'MANA') {
              coinImage = Images.ICON_MANA;
            } else if (coinName === 'DAI') {
              coinImage = Images.ICON_DAI;
            }

            let date = new Date(row.createdAt);
            let timestamp = date.toLocaleString();
            timestamp = timestamp.replace(timestamp.substr(-2), '').trim();

            return (
              <tr className="table-body">
                <td className="table-body-text-1 first">
                  <img
                    style={{
                      width: '21px',
                      marginRight: '6px',
                      verticalAlign: 'middle',
                      marginTop: '-3px',
                      borderRadius: '100%',
                    }}
                    src={coinImage}
                  />
                  <span
                    style={{
                      textAlign: 'left',
                      marginLeft: '10px',
                    }}
                  >
                    {game}
                  </span>
                </td>

                <td className="table-body-text-1">{row.globalID}</td>

                <td className="table-body-text-1">
                  <a
                    style={{ color: '#2085f4' }}
                    target="_blank"
                    href={
                      Global.CONSTANTS.MATIC_EXPLORER +
                      `/address/${row.address}`
                    }
                  >
                    {row.address.substr(0, 6) + '...' + row.address.substr(-4)}
                  </a>
                </td>

                <td className="table-body-text-1">
                  {amount} {coinName}
                </td>

                <td className="table-body-text-1">
                  {payout} {coinName}
                </td>

                <td className="table-body-text-1">{timestamp}</td>
              </tr>
            );
          }
        })}
      </tbody>
    );
  }

  if (props.content === 'labels') {
    return contentLabels();
  } else if (props.content === 'balances') {
    return contentBalances();
  } else if (props.content === 'machines') {
    return contentMachines();
  } else if (props.content === 'history') {
    return contentHistory();
  }
};

export default ContentAdmin;
