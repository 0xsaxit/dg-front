import React from 'react';
import { Grid } from 'semantic-ui-react';
import verify1 from '../../static/images/switch_ropsten.png';

const SwitchRPC = (props) => {
  return (
    <div className="modal-content-container">
      <Grid>
        <Grid.Row>
          <h3 className="modal-h3">Switch MetaMask to Ropsten RPC</h3>
        </Grid.Row>

        <Grid.Row>
          <p className="modal-p">
            Open Network dropdown menu and select 'Ropsten'
          </p>
        </Grid.Row>

        <Grid.Row>
          <img style={{ width: '240px' }} src={verify1} />
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default SwitchRPC;
 
