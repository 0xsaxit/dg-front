import { useContext } from 'react';
import { GlobalContext } from '../../store';
import { Table, Divider, Grid } from 'semantic-ui-react';
import ModalFunds from '../modal/ModalFunds';
import Global from '../Constants';

const ContentAdmin = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const games = ['slots', 'roulette', 'backgammon', 'blackjack'];

  function contentLabels() {
    if (props.type === 'balances') {
      return null;
    } else if (props.type === 'machines') {
      return (
        <tbody>
          <tr className="table-header">
            <td className="table-header-text account">GAME</td>
            <td className="table-header-text-1 bet">MACHINE ID</td>
            <td className="table-header-text-1 date">BET</td>
            <td className="table-header-text-1">PAYOUT</td>
            <td className="table-header-text-1 date">TIMESTAMP</td>
          </tr>
        </tbody>
      );
    } else if (props.type === 'history') {
      return (
        <tbody>
          <tr className="table-header">
            <td className="table-header-text account">GAME</td>
            <td className="table-header-text-1 bet">MACHINE ID</td>
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
              src={Global.IMAGES.MANA_CIRCLE}
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
            <p className="welcome-text">Mana</p>
            <p className="account-name">{state.adminBalances[1][i][1]}</p>
          </span>
        </span>

        <span className="balances-button-span">
          <ModalFunds modalType={'deposit'} gameType={game} />
          <ModalFunds modalType={'withdraw'} gameType={game} />

          {/* <Button color="blue" className="balances-play-button-2">
            WITHDRAW
          </Button> */}
        </span>
      </Grid.Column>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentHistory() {
    return (
      <tbody>
        {props.dataPage.map((row, i) => {
          var date = new Date(row.createdAt);
          var timestamp = date.toLocaleString();
          timestamp = timestamp.replace(timestamp.substr(-2), '').trim();
          var game;

          if (row.betAmount) {
            var amount = Number(row.betAmount) / Global.FACTOR;
            var payout = Number(row.amountWin) / Global.FACTOR;
            var machine_id = row.globalID.substr(row.globalID.length - 3, 3);
            var row_type = row.globalID.substr(row.globalID.length - 6, 3);
            if (row_type === '002') game = 'MANA Roulette';
            else game = 'MANA Slots';

            return (
              <Table.Row>
                <Table.Cell style={{ paddingLeft: '20px' }}>
                  <img
                    style={{ verticalAlign: 'middle' }}
                    className="image inline"
                    width="20px"
                    height="20px"
                    src={Global.IMAGES.ICON_MANA}
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
                <Table.Cell>{machine_id}</Table.Cell>
                <Table.Cell>
                  <a
                    style={{ color: 'gray' }}
                    target="_blank"
                    href={Global.MATIC_EXPLORER + `/address/${row.address}`}
                  >
                    {row.address.substr(0, 6) + '...' + row.address.substr(-4)}
                  </a>
                </Table.Cell>
                <Table.Cell className="admin-tx-table-padding">
                  {amount} MANA
                </Table.Cell>
                <Table.Cell className="admin-tx-table-padding2">
                  {payout} MANA
                </Table.Cell>
                <Table.Cell>
                  {timestamp} <i style={{ marginLeft: '5px' }}>&#x25B8;</i>
                </Table.Cell>
              </Table.Row>
            );
          }
        })}
      </tbody>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentMachines() {
    return (
      <tbody>
        {props.dataPage.map((row, i) => {
          var bets = (Number(row.totalBetAmount) / Global.FACTOR).toFixed(0);
          var payouts = (Number(row.totalAmountWin) / Global.FACTOR).toFixed(0);
          var date = new Date(row.latestSessionDate);
          var timestamp = date.toLocaleString();
          timestamp = timestamp.replace(timestamp.substr(-2), '').trim();
          var game;
          var machine_id = row.globalID.substr(row.globalID.length - 3, 3);
          var row_type = row.globalID.substr(row.globalID.length - 6, 3);
          if (row_type === '002') game = 'MANA Roulette';
          else game = 'MANA Slots';
          return (
            <Table.Row>
              <Table.Cell style={{ paddingLeft: '20px' }}>
                <img
                  style={{ verticalAlign: 'middle' }}
                  className="image inline"
                  width="20px"
                  height="20px"
                  src={Global.ICON_MANA}
                />
                <span style={{ textAlign: 'left', marginLeft: '10px' }}>
                  {game}
                </span>
              </Table.Cell>
              <Table.Cell>{machine_id}</Table.Cell>
              <Table.Cell>{bets} MANA</Table.Cell>
              <Table.Cell>{payouts} MANA</Table.Cell>
              <Table.Cell>
                {timestamp}
                <i style={{ marginLeft: '5px' }}>&#x25B8;</i>
              </Table.Cell>
            </Table.Row>
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
  }
};

export default ContentAdmin;
