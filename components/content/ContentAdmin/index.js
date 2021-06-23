import { Divider, Grid, Table } from 'semantic-ui-react';
import Images from 'common/Images';
import Aux from 'components/_Aux';

const CoinImage = props => {
  const { data, image, title } = props;
  const logoStyle = {
    width: '21px',
    marginRight: '6px',
    verticalAlign: 'middle',
    marginTop: '-2px',
    borderRadius: '100%',
  };

  return (
    <span style={{ display: 'flex' }}>
      <span className="avatar-picture">
        <img src={image} style={logoStyle} />
      </span>
      <p className="welcome-text">{data} {title}</p>
    </span>
  )
}

const ContentAdmin = props => {
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  const { ethBalance, data, content } = props;
  const games = Object.keys(data);
  const numbers = ['one', 'two', 'three'];

  const contentBalances = () => {
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
                <p className="earn-text" style={{ paddingLeft: '0px' }}>
                  Worker wallet balance: {ethBalance} ETH
                </p>
              </span>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid className="admin-balances-container">
          <Grid.Row>
            {games.map((game, i) => {
              return balanceBox(game, i);
            })}
          </Grid.Row>
        </Grid>
      </Aux>
    );
  }

  const balanceBox = (game, i) => {
    return (
      <span className={`admin-balances-column ${numbers[i]}`} key={i}>
        <span style={{ display: 'flex' }}>
          <p className="earn-text" style={{ paddingLeft: '0px' }}>
            {game.toUpperCase()}
          </p>
        </span>

        <Divider className="balances-divider" />
        
        <CoinImage image={Images.MANA_CIRCLE} data={data[game][0]} title="mana" /> 
        <CoinImage image={Images.DAI_CIRCLE} data={data[game][1]} title="dai" />
        <CoinImage image={Images.USDT_CIRCLE} data={data[game][2]} title="usdt" />
        <CoinImage image={Images.ATRI_CIRCLE} data={data[game][3]} title="atri" />
        <CoinImage image={Images.ETH_CIRCLE} data={data[game][4]} title="weth" />

        <Divider className="balances-divider" />

        <a
          href={`https://explorer-mainnet.maticvigil.com/address/${data[game][6]}/write-contract`}
          id="docs-top-menu"
          target="_blank"
        >
          <span className="welcome-text">{data[game][6]}</span>
        </a>
      </span>
    );
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  const contentUsers = () => {
    return (
      <Table.Body>
        {data.map((row, i) => {
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

        {data.map((row, i) => {
          if (row.verifyStep === 22) {
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
          <Table.Cell>20: DG Investors/NFT Holders</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>22: General Team Members</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>24: Marketing Team/Intel</Table.Cell>
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

  if (content === 'balances') {
    return contentBalances();
  } else if (content === 'users') {
    return contentUsers();
  }
};

export default ContentAdmin;
