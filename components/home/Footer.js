import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { useRouter } from 'next/router';
import { Menu, Popup, Icon } from 'semantic-ui-react';

const Footer = () => {

 return (
 		<span className="footer-container">
 			<span>
		 		<Menu className="menu-container" icon="labeled">
			    <div className="menu-items-to-hide">
			      <a href="/">
			        <Menu.Item className="sidebar-menu-text blog">
			          PLAY
			        </Menu.Item>
			      </a>

			      <a href="https://docs.decentral.games/info/risks" target="_blank">
			        <Menu.Item className="sidebar-menu-text blog">
			          RISKS
			        </Menu.Item>
			      </a>

						<a href="https://docs.decentral.games/info/disclaimer" target="_blank">
			        <Menu.Item className="sidebar-menu-text blog">
			          DISCLAIMER
			        </Menu.Item>
			      </a>

			      <a href="/">
			        <Menu.Item className="sidebar-menu-text blog">
			          PRIVACY POLICY
			        </Menu.Item>
			      </a>

			      <a href="/">
			        <Menu.Item className="sidebar-menu-text blog">
			          TERMS OF USE
			        </Menu.Item>
			      </a>

			      <a href="https://drive.google.com/drive/u/1/folders/1YZ2j2zKQoSvwap6M3xecUHZwQmDLWBPC" target="_blank">
			        <Menu.Item className="sidebar-menu-text blog">
			          PRESS KIT
			        </Menu.Item>
			      </a>

						<a href="https://docs.decentral.games" target="_blank">
			        <Menu.Item className="sidebar-menu-text blog">
			          DOCS
			        </Menu.Item>
			      </a>
			    </div>
		    </Menu>
		  </span>

		  <span>
				<Menu className="menu-container" icon="labeled">
			    <div className="menu-items-to-hide" style={{ marginTop: '9px' }}>

						<a href="https://github.com/decentralgames" target="_blank">
		          <span style={{ display: 'flex', marginBottom: '6px' }}>
		            <Menu.Item className="right-menu-text" id="dropdown-more-items">
		              <Icon
		                style={{ marginLeft: '-6px', marginRight: '11px' }}
		                name="github"
		              />
		            </Menu.Item>
		          </span>
		        </a>

		        <a href="https://discord.com/invite/cvbSNzY" target="_blank">
		          <span style={{ display: 'flex', marginBottom: '6px' }}>
		            <Menu.Item className="right-menu-text" id="dropdown-more-items">
		              <Icon
		                style={{ marginLeft: '-5px', marginRight: '10px' }}
		                name="discord"
		              />
		            </Menu.Item>
		          </span>
		        </a>

		        <a href="https://t.me/decentralgames" target="_blank">
		          <span style={{ display: 'flex', marginBottom: '6px' }}>
		            <Menu.Item className="right-menu-text" id="dropdown-more-items">
		              <Icon
		                style={{ marginLeft: '-5px', marginRight: '10px' }}
		                name="telegram"
		              />
		            </Menu.Item>
		          </span>
		        </a>

		        <a href="https://twitter.com/decentralgames" target="_blank">
		          <span style={{ display: 'flex', marginBottom: '6px' }}>
		            <Menu.Item className="right-menu-text" id="dropdown-more-items">
		              <Icon
		                style={{ marginLeft: '-5px', marginRight: '10px' }}
		                name="twitter"
		              />
		            </Menu.Item>
		          </span>
		        </a>

			    </div>
		    </Menu>
	    </span>
    </span>
  );
}

export default Footer;