import React from 'react';
import { Grid, Divider } from 'semantic-ui-react';
import logo from '../../static/images/logo.png';
import box from '../../static/images/box.png';
import check from '../../static/images/check.png';

const ModalSidebar = (props) => {
  return (
    <div className="progressbar2">
      <img className="modal-logo" src={logo} />

      <Grid.Row style={{ marginTop: '15px' }}>
        <Divider className="modal-divider" />
        <img className="progressbar-image-box" src={box} />

        {props.checked > 0 ? (
          <img className="progressbar-image-check" src={check} />
        ) : (
          <img className="progressbar-image-check" />
        )}

        <p className="progressbar p-text">Switch to Ropsten RPC</p>
      </Grid.Row>

      <Grid.Row style={{ marginTop: '15px' }}>
        <img className="progressbar-image-box" src={box} />

        {props.checked > 1 ? (
          <img className="progressbar-image-check" src={check} />
        ) : (
          <img className="progressbar-image-check" />
        )}

        <p className="progressbar p-text">Deposit to Matic Network</p>
      </Grid.Row>

      <Grid.Row style={{ marginTop: '15px' }}>
        <img className="progressbar-image-box" src={box} />

        {props.checked > 2 ? (
          <img className="progressbar-image-check" src={check} />
        ) : (
          <img className="progressbar-image-check" />
        )}

        <p className="progressbar p-text">MANA Authorization</p>
      </Grid.Row>
    </div>
  );
};

export default ModalSidebar;
