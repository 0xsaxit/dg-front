import { useContext } from 'react';
import { GlobalContext } from '../../store';
import { Table, Button, Divider, Grid } from 'semantic-ui-react';
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

  function contentBalances() {
    return (
      <Grid className="balances-container">
        <Grid.Row>
          <Grid.Column
            computer={5}
            tablet={16}
            mobile={16}
            className="balances-column two"
          >
            <span className="name-purchase-span">
              <p className="balances-token-name"> Slots </p>
              <Button
                disabled
                className="balances-purchase-button"
                onClick={() => show_transak()}
              >
                PAUSE
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
            className="balances-column two"
          >
            <span className="name-purchase-span">
              <p className="balances-token-name"> Roulette </p>
              <Button
                disabled
                className="balances-purchase-button"
                onClick={() => show_transak()}
              >
                PAUSE
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
              <p className="balances-token-name"> Backgammon </p>
              <Button
                className="balances-purchase-button"
                onClick={() => show_transak()}
              >
                PAUSE
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
