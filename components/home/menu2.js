import React from 'react';
import Link from 'next/link';
import { Menu, Divider } from 'semantic-ui-react';
import ModalVerify from '../modal/ModalVerify';
import ModalDeposit from '../modal/ModalDeposit';
import mana from '../../static/images/mana_circle.webp';
import dai from '../../static/images/dai_circle.webp';
import Global from '../constants';


var USER_ADDRESS;

const INITIAL_STATE = {
  manaTokenBalanceL1: 0,
  manaTokenBalanceL2: 0,
  daiTokenBalanceL1: 0,
  daiTokenBalanceL2: 0,
  ethTokenBalanceL1: 0,
  ethTokenBalanceL2: 0,
  username: '',
};

class Menu_2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  async componentDidMount() {
    if (window.web3) {
      console.log(window);
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
    }

    // Global = require('../constants').default;

    this.maticWeb3 = new window.Web3(
      new window.Web3.providers.HttpProvider(Global.MATIC_URL)
    );

    let object = this;
    window.ethereum.on('accountsChanged', async function (accounts) {
      await object.getUserData();
    });

    await this.getUserData();
  }

  async getUserData() {
    await this.getTokenBalance();
    await this.getUserName();
  }

  update = () => {
    this.getTokenBalance();
  };

  getUserInfo = () => {
    return fetch(`${Global.API_BASE_URL}/order/getUser`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: window.web3.currentProvider.selectedAddress,
      }),
    });
  };

  getUserName = async () => {
    try {
      let response = await this.getUserInfo();
      let json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          return;
        }

        this.setState({ username: json.name });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  getTokenBalance = async () => {
    try {
      const amount1 = await Global.balanceOfToken('ropsten');
      const amount2 = await Global.balanceOfToken('matic', this.maticWeb3);

      this.setState({ manaTokenBalanceL1: amount1 });
      this.setState({ manaTokenBalanceL2: amount2 });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <Menu className="menu-container-dark" icon="labeled">
        <Link href="/">
          <img
            className="image inline"
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058640/authorize_title_v3ze35.png"
            style={{ width: '42px', paddingTop: '15px', paddingBottom: '15px', marginRight: '12px' }}
          />
        </Link>
        <Link href="/">
          <Menu.Item className="sidebar-menu-text" exact="true">
            HOME
          </Menu.Item>
        </Link>
        <Link href="/txhistory">
          <Menu.Item className="sidebar-menu-text" exact="true">
            ACCOUNT
          </Menu.Item>
        </Link>
        <Link href="/nfts">
          <Menu.Item className="sidebar-menu-text">
            NFTS
          </Menu.Item>
        </Link>
        <Link href="/blog">
          <Menu.Item className="sidebar-menu-text">
            BLOG
          </Menu.Item>
        </Link>

        <Link href="/about">
          <Menu.Item className="sidebar-menu-text">
            ABOUT
          </Menu.Item>
        </Link>
        <Menu.Item
          href="https://docs.decentral.games"
          target="_blank"
          className="sidebar-menu-text"
        >
          <div>
            DOCS
          </div>
        </Menu.Item>

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
            {this.state.manaTokenBalanceL2} MANA
          </span>
          <ModalDeposit />
        </div>

      </Menu>
    );
  }
}

export default Menu_2;