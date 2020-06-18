import React from 'react';
import { Grid } from 'semantic-ui-react';


const SwitchRPC = (props) => {
  return (
    <div className="modal-content-container">
      <Grid>
        <Grid.Row>
          <h3 className="modal-h3">Switch MetaMask to Goerli RPC</h3>
        </Grid.Row>

        <Grid.Row>
          <p className="modal-p">
            Open the 'Network' dropdown menu in MetaMask and select 'Goerli Test Network'
          </p>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default SwitchRPC;
