import { useEffect, useState, useContext } from 'react';
import { Modal, Button, Divider } from 'semantic-ui-react';
import { GlobalContext } from '../../store';
import Images from '../../common/Images';

const ModalInfo = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [DGTotal, setDGTotal] = useState(0);

  useEffect(() => {
    // console.log('initial value: ' + state.userBalances[2][0]);
    // console.log('parse float: ' + parseFloat(state.userBalances[2][0]));

    const totalDG =
      parseFloat(state.userBalances[2][0]) +
      parseFloat(state.userBalances[2][1]) +
      parseFloat(state.DGBalances[0]) +
      parseFloat(state.DGBalances[1]) +
      parseFloat(state.DGBalances[2]) +
      parseFloat(state.DGBalances[3]);
    const totalDGAdjusted = totalDG
      .toFixed(3)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    setDGTotal(totalDGAdjusted);
  }, [state.DGBalances, state.userBalances]);

  return (
    <Modal
      className="menu-info-modal"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      trigger={
        <Button color="blue" className="modal-info-button">
          <p className="right-menu-text dg">{DGTotal} DG</p>
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
          <img
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1604343512/RotateY_04_250x250_Alpha_jkvo2w.gif"
            className="farming-logo"
            alt="Decentral Games Coin Logo"
          />
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
            {DGTotal}
          </p>
        </span>
      </div>

      <div className="menu-info-container" style={{ marginTop: '24px' }}>
        <span className="menu-info-inner-span" style={{ paddingTop: '12px' }}>
          <p className="menu-info-label">mainchain balance</p>
          <p className="menu-info-text">{state.userBalances[2][0]}</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">matic balance</p>
          <p className="menu-info-text">{state.userBalances[2][1]}</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">airdrop balance </p>
          <p className="menu-info-text">{state.DGBalances[3]}</p>
        </span>
      </div>

      <div
        className="menu-info-container"
        style={{ marginTop: '12px', marginBottom: '12px' }}
      >
        <span className="menu-info-inner-span" style={{ paddingTop: '12px' }}>
          <p className="menu-info-label">unclaimed - gameplay</p>
          <p className="menu-info-text">{state.DGBalances[0]}</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">unclaimed - liquidity</p>
          <p className="menu-info-text">{state.DGBalances[1]}</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">unclaimed - gov</p>
          <p className="menu-info-text">{state.DGBalances[2]}</p>
        </span>
      </div>

      <div className="menu-info-container" style={{ marginBottom: '30px' }}>
        <span className="menu-info-inner-span" style={{ paddingTop: '12px' }}>
          <p className="menu-info-label">dg price</p>
          <p className="menu-info-text">15.00 USD</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">dg in circulation</p>
          <p className="menu-info-text">100,000</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">total supply</p>
          <p className="menu-info-text">1,000,000</p>
        </span>
      </div>
    </Modal>
  );
};

export default ModalInfo;
