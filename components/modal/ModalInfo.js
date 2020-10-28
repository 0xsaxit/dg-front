import { useState, useContext } from 'react';
import { Modal, Button, Icon, Divider, Menu } from 'semantic-ui-react';
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
          <p className="right-menu-text dg">{state.DGBalances[0]} DG</p>
        </Button>
      }
    >
      <span className="menu-info-close" onClick={() => setOpen(false)}>
        <span className="material-icons" style={{ fontSize: '29px' }}>
          close
        </span>
      </span>

      <p className="matic-header-text"> Your DG Breakdown </p>

      <Divider style={{ marginTop: '-15px' }} />

      <div>
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={Images.DG_COIN_LOGO} className="farming-logo" alt="Decentral Games Coin Logo" />
        </span>

        <span style={{ display: 'flex', justifyContent: 'center' }}>
          <p
            className="account-name"
            style={{
              marginLeft: '0px',
              paddingLeft: '0px',
              textAlign: 'center',
            }}
          >
            {state.DGBalances[0]}
          </p>
        </span>
      </div>

      <div className="menu-info-container" style={{ marginTop: '24px' }}>
        <span className="menu-info-inner-span" style={{ paddingTop: '12px' }}>
          <p className="menu-info-label"> mainchain balance </p>
          <p className="menu-info-text">
            {' '}
            <a style={{ color: '#2085f4' }}> (Claim)</a> 0.000
          </p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label"> matic balance </p>
          <p className="menu-info-text">
            {' '}
            <a style={{ color: '#2085f4' }}> (Claim)</a> 0.000
          </p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label"> airdrop balance </p>
          <p className="menu-info-text">
            {' '}
            <a style={{ color: '#2085f4' }}> (Claim)</a> 0.000{' '}
          </p>
        </span>
      </div>

      <div
        className="menu-info-container"
        style={{ marginTop: '12px', marginBottom: '12px' }}
      >
        <span className="menu-info-inner-span" style={{ paddingTop: '12px' }}>
          <p className="menu-info-label"> unclaimed - gameplay</p>
          <p className="menu-info-text"> 0.000 </p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label"> unclaimed - liquidity</p>
          <p className="menu-info-text"> 0.000 </p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label"> unclaimed - gov</p>
          <p className="menu-info-text"> 0.000 </p>
        </span>
      </div>

      <div className="menu-info-container" style={{ marginBottom: '30px' }}>
        <span className="menu-info-inner-span" style={{ paddingTop: '12px' }}>
          <p className="menu-info-label"> dg price</p>
          <p className="menu-info-text"> 0.000 </p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label"> dg in circulation</p>
          <p className="menu-info-text"> 0.000 </p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label"> total supply</p>
          <p className="menu-info-text"> 0.000 </p>
        </span>
      </div>
    </Modal>
  );
};

export default ModalInfo;
