import React from 'react';
import { Grid, Table, Input, Dropdown, Button } from 'semantic-ui-react';
import mana from '../../static/images/mana.png';
import verify1 from '../../static/images/switch_ropsten.png';

const ContentDeposit = (props) => {
  function prerenderCheck() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Switch to Ropsten RPC</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">{props.text}</p>
          </Grid.Row>
          {props.image == 1 ? (
            <Grid.Row>
              <img style={{ width: '240px' }} src={verify1} />
            </Grid.Row>
          ) : null}
        </Grid>
      </div>
    );
  }

  if (props.content == 'prerenderCheck') {
    return prerenderCheck();
    //   } else if (props.content == 'approve') {
    //     return contentApprove();
    //   } else if (props.content == 'authorize') {
    //     return contentAuthorize();
    //   } else if (props.content == 'confirmations') {
    //     return contentConfirm();
    //   } else if (props.content == 'deposit') {
    //     return contentDeposit();
  }
};

export default ContentDeposit;
