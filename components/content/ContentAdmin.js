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
      <Grid className="balances-container">
        <Grid.Row>
          {games.slice(0, 3).map((game, i) => {
            return balanceBox(game, i);
          })}
        </Grid.Row>

        <Grid.Row>
          {games.slice(3, 6).map((game, i) => {
            return balanceBox(game, i + 3);
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
      <Grid.Column
        computer={5}
        tablet={16}
        mobile={16}
        className={`balances-column ${number}`}
      >
        <span className="name-purchase-span">
          <p className="welcome-text">{game}</p>
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
      </Grid.Column>
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
            <Table.Row>
              <Table.Cell style={{ paddingLeft: '20px' }}>
                <img
                  style={{ verticalAlign: 'middle' }}
                  className="image inline"
                  width="20px"
                  height="20px"
                  src={coinImage}
                />
                <span style={{ textAlign: 'left', marginLeft: '10px' }}>
                  {game}
                </span>
              </Table.Cell>

              <Table.Cell>{row.globalID}</Table.Cell>

              <Table.Cell>{bets} MANA</Table.Cell>

              <Table.Cell>{payouts} MANA</Table.Cell>

              <Table.Cell>{timestamp}</Table.Cell>
            </Table.Row>
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
              <Table.Row>
                <Table.Cell style={{ paddingLeft: '20px' }}>
                  <img
                    style={{ verticalAlign: 'middle' }}
                    className="image inline"
                    width="20px"
                    height="20px"
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
                </Table.Cell>

                <Table.Cell>{row.globalID}</Table.Cell>

                <Table.Cell>
                  <a
                    style={{ color: 'gray' }}
                    target="_blank"
                    href={
                      Global.CONSTANTS.MATIC_EXPLORER +
                      `/address/${row.address}`
                    }
                  >
                    {row.address.substr(0, 6) + '...' + row.address.substr(-4)}
                  </a>
                </Table.Cell>

                <Table.Cell className="admin-tx-table-padding">
                  {amount} {coinName}
                </Table.Cell>

                <Table.Cell className="admin-tx-table-padding2">
                  {payout} {coinName}
                </Table.Cell>

                <Table.Cell>{timestamp}</Table.Cell>
              </Table.Row>
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
