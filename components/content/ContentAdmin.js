import { Divider, Grid, Table } from 'semantic-ui-react';
import ButtonPause from '../button/ButtonPause';
import ModalFunds from '../modal/ModalFunds';
import Images from '../../common/Images';
import Aux from '../_Aux';

const ContentAdmin = (props) => {
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  const games = ['slots', 'roulette', 'blackjack', 'poker'];
  const numbers = ['one', 'two', 'three'];
  const logoStyle = {
    width: '21px',
    marginRight: '6px',
    verticalAlign: 'middle',
    marginTop: '-2px',
    borderRadius: '100%',
  };

  function contentBalances() {
    return (
      <Aux>
        <Grid className="account-connected-grid">
          <Grid.Row>
            <Grid.Column
              floated="right"
              width={16}
              className="balances-column zero"
            >
              <span style={{ display: 'flex' }}>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <p className="welcome-text" style={{ paddingLeft: '0px' }}>
                    Matic ETH balance
                  </p>
                  <p className="earn-text" style={{ paddingTop: '9px' }}>
                    {props.ethBalance}
                  </p>
                </span>

                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <p className="welcome-text">Treasury Balances</p>
                  <p
                    className="earn-text"
                    style={{ paddingLeft: '21px', paddingTop: '9px' }}
                  >
                    {props.adminBalances[0][0]} DAI
                  </p>
                  <p
                    className="earn-text"
                    style={{ paddingLeft: '21px', marginTop: '-21px' }}
                  >
                    {props.adminBalances[0][1]} MANA
                  </p>
                </span>
              </span>

              <span
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '-87px',
                  marginBottom: '60px',
                }}
              >
                <ButtonPause
                  isPaused={props.isPaused}
                  dataInterval={props.dataInterval}
                />
              </span>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid className="admin-balances-container">
          <Grid.Row>
            {games.slice(0, 4).map((game, i) => {
              return balanceBox(game, i);
            })}
          </Grid.Row>
        </Grid>
      </Aux>
    );
  }

  function balanceBox(game, i) {
    // let number;

    // if (i === 1) {
    //   number = 'one';
    // } else if (i === 2) {
    //   number = 'two';
    // } else if (i === 3) {
    //   number = 'three';
    // }

    return (
      <span className={`admin-balances-column ${numbers[i + 1]}`} key={i}>
        <span className="name-purchase-span">
          <p
            className="welcome-text"
            style={{
              paddingLeft: '0px',
              marginTop: '-12px',
              marginBottom: '12px',
            }}
          >
            {game}
          </p>
        </span>

        <Divider className="balances-divider" />

        <span style={{ display: 'flex' }}>
          <span className="avatar-picture">
            <img src={Images.DAI_CIRCLE} style={logoStyle} />
          </span>
          <p className="welcome-text">{props.data[1][i][0]} dai</p>
        </span>

        <span style={{ display: 'flex' }}>
          <span className="avatar-picture">
            <img src={Images.MANA_CIRCLE} style={logoStyle} />
          </span>
          <p className="welcome-text">{props.data[1][i][1]} mana</p>
        </span>

        <span className="balances-button-span">
          <ModalFunds modalType={'deposit'} gameType={game} />
          <ModalFunds modalType={'withdraw'} gameType={game} />
        </span>
      </span>
    );
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  function contentUsers() {
    return (
      <Table.Body>
        {props.data.map((row, i) => {
          if (row.verifyStep === 28) {
            return (
              <Table.Row key={i}>
                <Table.Cell>{row.address}</Table.Cell>
                <Table.Cell>{row.avatarName}</Table.Cell>
                <Table.Cell>{row.verifyStep}</Table.Cell>
              </Table.Row>
            );
          }
        })}

        <Divider className="tab-divider" />

        {props.data.map((row, i) => {
          if (row.verifyStep === 20) {
            return (
              <Table.Row key={i}>
                <Table.Cell>{row.address}</Table.Cell>
                <Table.Cell>{row.avatarName}</Table.Cell>
                <Table.Cell>{row.verifyStep}</Table.Cell>
              </Table.Row>
            );
          }
        })}

        <Divider className="tab-divider" />

        <Table.Row>
          <Table.Cell>4: Normal Users</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>6: High Rollers</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>8: Whales</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>10: Guests (Invitees)</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>12: Hosts</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>14: Community Managers</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>16: Streamers/Content Creators</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>18: Floor Supervisors</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>20: General Team Members</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>22:</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>24: Marketing Team/PR</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>26: Developers/DevOps</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>28: Admins</Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }

  if (props.content === 'balances') {
    return contentBalances();
  } else if (props.content === 'users') {
    return contentUsers();
  }
};

export default ContentAdmin;
