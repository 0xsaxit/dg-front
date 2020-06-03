import React from 'react';
import { Grid, Table, Input, Dropdown, Button } from 'semantic-ui-react';
import mana from '../../static/images/mana.png';
import verify1 from '../../static/images/switch_ropsten.png';

const ContentWithdraw = (props) => {
  // function contentOnboard() {
  //   return (
  //     <div className="modal-content-container">
  //       <Grid>
  //         <Grid.Row>
  //           <h3 className="modal-h3">Authorize MANA</h3>
  //         </Grid.Row>
  //         <Grid.Row>
  //           <p className="modal-p">
  //             Please click the 'Deposit' link to deposit and authorize MANA on
  //             Matic Network
  //           </p>
  //         </Grid.Row>
  //         <Grid.Row>
  //           <Button
  //             className="modal-buttons"
  //             color="blue"
  //             style={{ marginTop: '-10px' }}
  //             onClick={props.authorizeMana}
  //           >
  //             Authorize
  //           </Button>
  //         </Grid.Row>

  //         {props.isValidAuthorize == 1 ? (
  //           <Grid.Row>
  //             <p className="modal-p-error">Authorization failed</p>
  //           </Grid.Row>
  //         ) : null}
  //       </Grid>

  //       {/* <Button content="Next step" onClick={props.nextStep} /> */}
  //     </div>
  //   );
  // }

  function contentBurn() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Burn tokens on Matic Network</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Please select the amount of Matic tokens you wold like to burn
            </p>
          </Grid.Row>
          <Grid.Row>
            <Button
              className="modal-buttons"
              color="blue"
              style={{ marginTop: '-10px' }}
              onClick={props.authorizeMana}
            >
              Burn
            </Button>
          </Grid.Row>

          {props.isValidAuthorize == 1 ? (
            <Grid.Row>
              <p className="modal-p-error">Burn failed</p>
            </Grid.Row>
          ) : null}
        </Grid>

        {/* <Button content="Next step" onClick={props.nextStep} /> */}
      </div>
    );
  }

  if (props.content == 'burn') {
    // return contentOnboard();
    // } else if (props.content == 'burn') {
    return contentBurn();
  } else if (props.content == 'withdraw') {
    return contentWithdraw();
  }
};

export default ContentWithdraw;
