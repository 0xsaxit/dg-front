import { Grid, Input, Dropdown, Button } from 'semantic-ui-react';
import TokenBalances from './TokenBalances';

const ContentDeposit = (props) => {
  // drop-down menu MANA values
  const amount = [
    { key: 1, text: '1000 MANA', value: 1000 },
    { key: 2, text: '2000 MANA', value: 2000 },
    { key: 3, text: '3000 MANA', value: 3000 },
    { key: 4, text: '4000 MANA', value: 4000 },
    { key: 5, text: '5000 MANA', value: 5000 },
    { key: 6, text: 'CUSTOM', value: -1 },
  ];

  function contentApprove() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Deposit MANA to Matic</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Authorize MANA transfers and deposit to Matic Network (two
              transactions).
            </p>
            <p className="modal-p-note2">
              <span style={{ fontWeight: 'bold' }}>NOTE: </span>
              If you don't have MANA, you can buy some{' '}
              <a style={{ color: '#2085f4' }} href="/exchange">
                here.
              </a>
            </p>
          </Grid.Row>
          <Grid.Row>
            {props.isCustomAmount == 0 ? (
              <Dropdown
                selection
                options={amount}
                value={props.amount}
                style={{ width: '300px', marginTop: '0px' }}
                onChange={props.onChangeAmount}
              />
            ) : (
              <Input
                value={props.amount}
                style={{ width: '300px', marginTop: '0px' }}
                onChange={props.onChangeCustomAmount}
              />
            )}
          </Grid.Row>
          <Grid.Row>
            <Button
              className="modal-buttons"
              color="blue"
              style={{ marginTop: '-10px', display: 'block' }}
              onClick={props.depositToMatic}
            >
              Deposit
            </Button>
          </Grid.Row>

          {props.isValidDeposit == 1 ? (
            <Grid.Row>
              <p className="modal-p-error">Deposit failed</p>
            </Grid.Row>
          ) : null}
        </Grid>

        {/* <Button content="Next step" onClick={props.nextStep} /> */}
      </div>
    );
  }

  function contentAuthorize() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Authorize MANA on Matic</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Authorize MANA transfers on Matic Network to play games.{' '}
            </p>
          </Grid.Row>
          <Grid.Row>
            <Button
              className="modal-buttons"
              color="blue"
              style={{ marginTop: '-10px' }}
              onClick={props.authorizeMana}
            >
              Authorize
            </Button>
          </Grid.Row>

          {props.isValidAuthorize == 1 ? (
            <Grid.Row>
              <p className="modal-p-error">Authorization failed</p>
            </Grid.Row>
          ) : null}
        </Grid>

        {/* <Button content="Next step" onClick={props.nextStep} /> */}
      </div>
    );
  }

  function contentConfirm() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Matic Network Confirmations</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Matic Network requires a total of 12 confirmations for transaction
              to complete.
            </p>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">Number of confirmations: ...</p>
          </Grid.Row>
        </Grid>

        {/* <Button content="Next step" onClick={props.nextStep} /> */}
      </div>
    );
  }

  function contentDeposit() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Deposit MANA to Matic</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Select the amount of MANA to deposit to Matic Network.
            </p>
          </Grid.Row>

          <TokenBalances
            tokenBalanceL1={props.tokenBalanceL1}
            tokenBalanceL2={props.tokenBalanceL2}
          />

          <Grid.Row>
            {props.isCustomAmount == 0 ? (
              <Dropdown
                selection
                options={amount}
                value={props.amount}
                style={{ width: '300px', marginTop: '0px' }}
                onChange={props.onChangeAmount}
              />
            ) : (
              <Input
                value={props.amount}
                style={{ width: '300px', marginTop: '0px' }}
                onChange={props.onChangeCustomAmount}
              />
            )}
          </Grid.Row>
          <Grid.Row>
            <Button
              className="modal-buttons"
              color="blue"
              style={{ marginTop: '-10px', display: 'block' }}
              onClick={props.depositToMatic}
            >
              Deposit
            </Button>
          </Grid.Row>

          {props.isValidDeposit == 1 ? (
            <Grid.Row>
              <p className="modal-p-error">Deposit failed</p>
            </Grid.Row>
          ) : null}
        </Grid>

        {/* <Button content="Next step" onClick={props.nextStep} /> */}
      </div>
    );
  }

  if (props.content == 'approve') {
    return contentApprove();
  } else if (props.content == 'authorize') {
    return contentAuthorize();
  } else if (props.content == 'confirmations') {
    return contentConfirm();
  } else if (props.content == 'deposit') {
    return contentDeposit();
  }
};

export default ContentDeposit;
