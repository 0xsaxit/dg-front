import { useState } from 'react';
import { Modal, Button, Icon } from 'semantic-ui-react';
import Global from '../Constants';

const ModalInfo = () => {
  // define local variables
  const [open, setOpen] = useState(false);

  return (
    <Modal
      className="menu-info-modal"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      trigger={
        <Button color="blue" className="modal-info-button">
          <span class="material-icons">settings</span>
        </Button>
      }
    >
      <span className="menu-info-close" onClick={() => setOpen(false)}>
        <span className="material-icons" style={{ fontSize: '29px' }}>
          close
        </span>
      </span>

      <p className="matic-header-text" style={{ paddingTop: '72px' }}>
        {' '}
        About{' '}
      </p>

      <span
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '-9px',
        }}
      >
        <a href={`https://twitter.com/${Global.SOCIAL_HANDLE}`}>
          <Icon style={{ fontSize: '34px' }} name="twitter" />
        </a>
        <a href={Global.DISCORD_URL}>
          <Icon
            style={{
              fontSize: '34px',
              marginRight: '12px',
              marginLeft: '12px',
            }}
            name="discord"
          />
        </a>
        <a href={`https://github.com/${Global.SOCIAL_HANDLE}`}>
          <Icon style={{ fontSize: '34px' }} name="github" />
        </a>
      </span>
      <div className="menu-info-container">
        <span className="menu-info-inner-span" style={{ paddingTop: '12px' }}>
          <p className="menu-info-label"> Version </p>
          <p className="menu-info-text"> 0.0.9 </p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label"> Network </p>
          <p className="menu-info-text"> Goerli </p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label"> DCL Node </p>
          <a href="https://catalyst-monitor.now.sh/" className="menu-info-text">
            {' '}
            https://catalyst-monitor.now.sh
          </a>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label"> Matic Node </p>
          <a
            href="https://wallet.matic.today/staking/"
            className="menu-info-text"
          >
            https://wallet.matic.today
          </a>
        </span>
      </div>
    </Modal>
  );
};

export default ModalInfo;
