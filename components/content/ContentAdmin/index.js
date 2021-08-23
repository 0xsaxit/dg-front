import { Divider, Grid, Table } from 'semantic-ui-react';
import Images from 'common/Images';
import Aux from 'components/_Aux';

import styles from './ContentAdmin.module.scss';

const CoinImage = ({ data, image, title }) => {
  return (
    <div className="d-flex">
      <span className={styles.avatar_picture}>
        <img src={image} className={styles.coin_image} />
      </span>
      <p className={styles.welcome_text}>{data} {title}</p>
    </div>
  )
}

const ContentAdmin = ({ ethBalance, data, content }) => {
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  const games = Object.keys(data);
  const numbers = ['one', 'two', 'three'];

  const contentBalances = () => {
    return (
      <Aux>
        <Grid className={styles.account_connected_grid}>
          <Grid.Row>
            <Grid.Column
              floated="right"
              width={16}
              className={styles.balances_column}
            >
              <span className="d-flex">
                <p className="pl-0">
                  Worker wallet balance: {ethBalance} ETH
                </p>
              </span>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid className={styles.admin_balances_container}>
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
      <div className={`admin-balances-column ${numbers[i]}`} key={i}>
        <span className="d-flex">
          <p className="pl-0">
            {game.toUpperCase()}
          </p>
        </span>

        <Divider className={styles.balances_divider} />
        
        <CoinImage image={Images.MANA_CIRCLE} data={data[game][0]} title="mana" /> 
        <CoinImage image={Images.DAI_CIRCLE} data={data[game][1]} title="dai" />
        <CoinImage image={Images.USDT_CIRCLE} data={data[game][2]} title="usdt" />
        <CoinImage image={Images.ATRI_CIRCLE} data={data[game][3]} title="atri" />
        <CoinImage image={Images.ETH_CIRCLE} data={data[game][4]} title="weth" />

        <Divider className={styles.balances_divider} />

        <a
          href={`https://explorer-mainnet.maticvigil.com/address/${data[game][6]}/write-contract`}
          id="docs-top-menu"
          target="_blank"
        >
          <span className={styles.welcome_text}>{data[game][6]}</span>
        </a>
      </div>
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

        <Divider className={styles.tab_divider} />

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

        <Divider className={styles.tab_divider} />

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
