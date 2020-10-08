import { useState, useContext } from 'react';
import { Modal, Button, Icon, Divider } from 'semantic-ui-react';
import Global from '../Constants';
import { GlobalContext } from '../../store';
import Images from '../../common/Images';

const ModalInfo = () => {

  const [state, dispatch] = useContext(GlobalContext);
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
          <span className="material-icons">settings</span>
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
        Your DG Breakdown{' '}
      </p>

      <Divider style={{ marginTop: '-9px' }}/> 

      <div>
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={Images.DG_COIN_LOGO} className="farming-logo" />
        </span>

          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <p className="account-name" style={{ marginLeft: '0px', paddingLeft: '0px', textAlign: 'center' }}>{state.DGPoints}</p>
          </span>
      </div>


      <div className="menu-info-container">
        <span className="menu-info-inner-span" style={{ paddingTop: '12px' }}>
          <p className="menu-info-label"> balance </p>
          <p className="menu-info-text"> 0.000</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label"> unclaimed </p>
          <p className="menu-info-text"> 0.000 </p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label"> DG price </p>
          <a href="https://catalyst-monitor.now.sh/" className="menu-info-text">
            {' '}
            ...
          </a>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label"> DG in circulation</p>
          <a
            href="https://wallet.matic.today/staking/"
            className="menu-info-text"
          >
            ...
          </a>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label"> total supply</p>
          <a
            href="https://wallet.matic.today/staking/"
            className="menu-info-text"
          >
            ...
          </a>
        </span>

      </div>
    </Modal>
  );
};

export default ModalInfo;
