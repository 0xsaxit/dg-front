import React from 'react';
// import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
// import logo from '../../static/images/authorize_title.png';
// import { FaRegUserCircle } from 'react-icons/fa'; // replace with semantic ui icons **********
// import { FaServer } from 'react-icons/fa';
// import { MdHistory } from 'react-icons/md';
// import { MdPlaylistAddCheck } from 'react-icons/md';
// import { MdBookmarkBorder } from 'react-icons/md';
// import { MdInfoOutline } from 'react-icons/md';
// import Svgeth from '../../static/images/svg6';

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
    Global = require('../Constants').default;
    var index = parseInt(localStorage.getItem('selectedMenu') || 0);
    this.setState({ selectedMenu: index });
    this.props.onMenuSelected(index);
  }

  onMenuClick = (index) => {
    if (index >= 5 && index <= 9) return;
    localStorage.setItem('selectedMenu', index);
    this.setState({ selectedMenu: index });
    this.props.onMenuSelected(index);
  };

  render() {
    return (
      <Menu className="menuContainer" icon="labeled" vertical>
        <a href="/">
          <img
            className="image inline"
            src={Global.IMAGES.LOGO}
            style={{ width: '42px', paddingTop: '30px', paddingBottom: '35px' }}
          />
        </a>
        <Menu.Item
          onClick={() => this.onMenuClick(0)}
          exact="true"
          href="#"
          className="account-p"
          style={{ color: 'grey' }}
        >
          <span>
            {' '}
            {/* <FaRegUserCircle
              style={{ fontSize: '30px', paddingBottom: '6px' }}
            /> */}
          </span>
          <br />
          Admin
        </Menu.Item>
        <Menu.Item
          onClick={() => this.onMenuClick(1)}
          exact="true"
          href="#"
          className="account-p"
          style={{ color: 'grey' }}
        >
          <span>
            {' '}
            {/* <FaServer style={{ fontSize: '30px', paddingBottom: '6px' }} /> */}
          </span>
          <br />
          Games
        </Menu.Item>
        <Menu.Item
          onClick={() => this.onMenuClick(2)}
          exact="true"
          href="#"
          className="account-p"
          style={{ color: 'grey' }}
        >
          <span>
            {' '}
            {/* <MdHistory style={{ fontSize: '30px', paddingBottom: '6px' }} /> */}
          </span>
          <br />
          TX History
        </Menu.Item>
      </Menu>
    );
  }
}

export default SideMenu;
