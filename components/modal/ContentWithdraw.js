import React from 'react';
import { Grid, Dropdown, Button } from 'semantic-ui-react';
import TokenBalances from './tokenBalances';

const ContentWithdraw = (props) => {
  // drop-down menu MANA values
  const amount = [
    { key: 1, text: '1000 MANA', value: 1000 },
    { key: 2, text: '2000 MANA', value: 2000 },
    { key: 3, text: '3000 MANA', value: 3000 },
    { key: 4, text: '4000 MANA', value: 4000 },
    { key: 5, text: '5000 MANA', value: 5000 },
    {
      key: 6,
      text: 'Maximum ' + '(' + props.tokenBalanceL2 + ' MANA)',
      value: props.tokenBalanceL2,
    },
  ];

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
          <TokenBalances
            tokenBalanceL1={props.tokenBalanceL1}
            tokenBalanceL2={props.tokenBalanceL2}
          />
          <Grid.Row>
            <Dropdown
              selection
              options={amount}
              value={props.amount}
              style={{ width: '300px', marginTop: '0px' }}
              onChange={props.onChangeAmount}
            />
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

          {props.isValidBurn == 1 ? (
            <Grid.Row>
              <p className="modal-p-error">Burn failed</p>
            </Grid.Row>
          ) : null}

          <Grid.Row>
            <p className="modal-p-note">
              <span style={{ fontStyle: 'italic' }}>
                *Once the checkpoint has been submitted for the block containing
                the burn transaction, you may submit proof of burn. Upon
                submitting valid proof your tokens will be transfered to you
              </span>
            </p>
          </Grid.Row>
        </Grid>

        {/* <Button content="Next step" onClick={props.nextStep} /> */}
      </div>
    );
  }

  if (props.content == 'burn') {
    return contentBurn();
  } else if (props.content == 'withdraw') {
    return contentWithdraw();
  }
};

export default ContentWithdraw;
