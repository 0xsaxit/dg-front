import React from 'react';
import Link from 'next/link';
import { Menu } from 'semantic-ui-react';
import ModalVerify from '../modal/ModalVerify';
import ModalDeposit from '../modal/ModalDeposit';
import mana from '../../static/images/mana_circle.webp';
import dai from '../../static/images/dai_circle.webp';
import Global from '../Constants';

class MenuTop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      manaTokenBalance: 0,
    };

    this.maticWeb3 = {};
  }

  async componentDidMount() {
    if (window.web3) {
      this.maticWeb3 = new window.Web3(
        new window.Web3.providers.HttpProvider(Global.MATIC_URL)
      );

      const object = this;
      window.ethereum.on('accountsChanged', async () => {
        await object.getTokenBalance();
      });

      await Global.delay(2000); // give a little time to fetch the addresses from server
      await this.getTokenBalance();
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get balances on Matic Network
  getTokenBalance = async () => {
    console.log('web3 provider...');
    console.log(this.maticWeb3);

    try {
      const amount = await Global.balanceOfToken('matic', this.maticWeb3);

      this.setState({ manaTokenBalance: amount });

      // console.log('balance...');
      // console.log(amount);
    } catch (err) {
      console.log('token balance error foo: ' + err);
    }
  };

  render() {
    return (
      <Menu className="menu-container-dark" icon="labeled">
        <Link href="/">
          <img
            className="image inline"
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058640/authorize_title_v3ze35.png"
            style={{
              width: '42px',
              paddingTop: '15px',
              paddingBottom: '15px',
              marginRight: '12px',
            }}
          />
        </Link>

        {this.props.dashboard ? (
          <Link href="/account">
            <Menu.Item className="sidebar-menu-text" exact="true">
              ACCOUNT
            </Menu.Item>
          </Link>
        ) : null}

        {this.props.dashboard ? (
          <Link href="/nfts">
            <Menu.Item className="sidebar-menu-text">NFTS</Menu.Item>
          </Link>
        ) : null}

        <Link href="/games">
          <Menu.Item className="sidebar-menu-text">GAMES</Menu.Item>
        </Link>

        <Link href="/blog">
          <Menu.Item className="sidebar-menu-text">BLOG</Menu.Item>
        </Link>

        <Link href="/docs">
          <Menu.Item className="sidebar-menu-text">DOCS</Menu.Item>
        </Link>

        {this.props.dashboard ? (
          <div>
            <span className="sidebar-menu-text-2">
              <img
                style={{
                  verticalAlign: 'middle',
                  marginRight: '6px',
                }}
                className="image inline"
                width="20px"
                height="20px"
                src={dai}
              />
              0 DAI
            </span>

            <span className="sidebar-menu-text-3">
              <img
                style={{
                  verticalAlign: 'middle',
                  marginRight: '6px',
                }}
                className="image inline"
                width="20px"
                height="20px"
                src={mana}
              />
              {this.state.manaTokenBalance} MANA
            </span>

            <ModalDeposit />
          </div>
        ) : (
          <ModalVerify />
        )}
      </Menu>
    );
  }
}

export default MenuTop;
