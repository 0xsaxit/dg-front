import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Divider } from 'semantic-ui-react';
import { MdPlayCircleOutline } from 'react-icons/md';
import { MdHistory } from 'react-icons/md';
import { MdBookmarkBorder } from 'react-icons/md';
import { MdInfoOutline } from 'react-icons/md';
import { MdCode } from 'react-icons/md';
import { MdAutorenew } from 'react-icons/md';
import { MdCreditCard } from 'react-icons/md';
import Svgeth from '../../static/images/svg6';

let Global;

const INITIAL_STATE = {
  selectedMenu: 0,
};

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  async componentDidMount() {
    Global = require('../constants').default;
  }

  render() {
    return (
      <Menu className="menu-container" icon="labeled" vertical>
        <a href="/">
          <img
            className="image inline"
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058640/authorize_title_v3ze35.png"
            style={{ width: '42px', paddingTop: '30px', paddingBottom: '35px' }}
          />
        </a>
        <Menu.Item href="/" exact="true" className="sidebar-menu-text">
          <span>
            {' '}
            <MdPlayCircleOutline
              style={{ fontSize: '30px', paddingBottom: '6px' }}
            />
          </span>
          <br />
          Play Now
        </Menu.Item>
        {this.props.dashboard === true ? (
          <Menu.Item
            href="/txhistory"
            exact="true"
            className="sidebar-menu-text"
          >
            <span>
              {' '}
              <MdHistory style={{ fontSize: '30px', paddingBottom: '6px' }} />
            </span>
            <br />
            TX History
          </Menu.Item>
        ) : (
          <p></p>
        )}
        {this.props.dashboard === true ? (
          <Menu.Item
            href="/nfts"
            exact="true"
            className="sidebar-menu-text"
            style={{ color: 'grey' }}
          >
            <span>
              {' '}
              <Svgeth style={{ paddingBottom: '9px' }} />
            </span>
            <br />
            NFTs
          </Menu.Item>
        ) : (
          <p></p>
        )}
        {this.props.dashboard === true ? (
          <Menu.Item
            href="/exchange"
            exact="true"
            className="sidebar-menu-text"
          >
            <span>
              {' '}
              <MdCreditCard
                style={{ fontSize: '32px', paddingBottom: '6px' }}
              />
            </span>
            <br />
            Buy Crypto
          </Menu.Item>
        ) : (
          <p></p>
        )}

        <Divider style={{ width: '71px' }} />

        <Menu.Item href="/blog" className="sidebar-menu-text">
          <span>
            {' '}
            <MdBookmarkBorder
              style={{ fontSize: '30px', paddingBottom: '6px' }}
            />
          </span>
          <br />
          Blog
        </Menu.Item>
        <Menu.Item href="/about" className="sidebar-menu-text">
          <span>
            {' '}
            <MdInfoOutline style={{ fontSize: '30px', paddingBottom: '6px' }} />
          </span>
          <br />
          About Us
        </Menu.Item>
        <Menu.Item
          href="https://docs.decentral.games"
          target="_blank"
          className="sidebar-menu-text"
        >
          <span>
            {' '}
            <MdCode style={{ fontSize: '30px', paddingBottom: '6px' }} />
          </span>
          <br />
          Docs
        </Menu.Item>
        {/*<Menu.Item className='sidebar-menu-text translate' >
          <span> <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589054986/english_ljacid_f9z8h5.jp2" className="translate-image" /></span><br />
           English 
          <MdUnfoldMore style={{ fontSize: '15px', marginBottom: '-3px' }}/>
        </Menu.Item>*/}
      </Menu>
    );
  }
}

export default SideMenu;
