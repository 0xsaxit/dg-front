import { useContext } from 'react';
import { GlobalContext } from '../../store';
import { Grid, Input, Dropdown, Button } from 'semantic-ui-react';
import TokenBalances from './TokenBalances';
import Global from '../Constants';

const ContentDeposit = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // drop-down menu MANA values
  const amount = [
    { key: 1, text: '1000 MANA', value: 1000 },
    { key: 2, text: '2000 MANA', value: 2000 },
    { key: 3, text: '3000 MANA', value: 3000 },
    { key: 4, text: '4000 MANA', value: 4000 },
    { key: 5, text: '5000 MANA', value: 5000 },
    { key: 6, text: 'CUSTOM', value: -1 },
  ];

  function locationVerify() {
    return (
      <div
        className="modal-content-container"
        style={{ paddingBottom: '70px' }}
      >
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Verify your Location</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Due to international online gaming legislation, we do not allow
              accounts from US IP addresses.
            </p>
          </Grid.Row>

          <Grid.Row>
            <Button
              className="modal-buttons"
              color="blue"
              style={{ marginTop: '0px' }}
              onClick={props.verifyLocation}
            >
              Verify
            </Button>
          </Grid.Row>

          {props.validLocation == 1 ? (
            <Grid.Column floated="right" width={16}>
              <p className="modal-p-error">
                You are in a blacklisted jurisdiction
              </p>
            </Grid.Column>
          ) : null}
        </Grid>

        {/* <Button content="Next step" onClick={props.nextStep} /> */}
      </div>
    );
  }

  function contentApprove() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <div className="deposit-top-row">
              <h3 className="modal-h3 deposit">Deposit to Matic</h3>
              <div className="right-aligned-crypto deposit">
                <span className="crypto-select-span mana">
                  <img
                    src={Global.IMAGES.MANA_CIRCLE}
                    className="deposit-mana-image"
                  />
                  <p className="crypto-select-button"> MANA </p>
                </span>
                <span className="crypto-select-span">
                  <img
                    src={Global.IMAGES.DAI_CIRCLE}
                    className="deposit-dai-image"
                  />
                  <p className="crypto-select-button"> DAI </p>
                </span>
              </div>
            </div>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Approve cryptocurrency transfers and deposit to Matic Network (two
              transactions).
            </p>
            <p className="modal-p-note2">
              If you don't own any cryptocurrency, you can buy some{' '}
              <a style={{ color: '#2085f4' }} href="/exchange">
                here.
              </a>
            </p>
          </Grid.Row>
          <Grid.Row>
            {props.customAmount == 0 ? (
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
                onChange={props.changeCustomAmount}
              />
            )}
          </Grid.Row>
          <Grid.Row>
            {props.processing == false ? (
              <Button
                className="modal-buttons"
                color="blue"
                style={{ marginTop: '-10px', display: 'block' }}
                onClick={props.depositToMatic}
              >
                Deposit
              </Button>
            ) : (
              <Button
                className="modal-buttons"
                color="blue"
                style={{ marginTop: '-10px', display: 'block', width: '180px' }}
              >
                <span className="material-icons" id="deposit-icon-loading">
                  data_usage
                </span>
                Depositing
              </Button>
            )}
          </Grid.Row>

          {props.validDeposit == 1 ? (
            <Grid.Column floated="right" width={16}>
              <p className="modal-p-error">Deposit failed</p>
            </Grid.Column>
          ) : null}
        </Grid>

        {/* <Button content="Next step" onClick={props.nextStep} /> */}
      </div>
    );
  }

  function contentAuthorize() {
    return (
      <div
        className="modal-content-container"
        style={{ paddingBottom: '75px' }}
      >
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Authorize your Wallet on Matic</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Authorize your wallet on Matic Network to play games with MANA.
            </p>
          </Grid.Row>
          <Grid.Row>
            {props.processing == false ? (
              <Button
                className="modal-buttons"
                color="blue"
                style={{ marginTop: '0px', display: 'block' }}
                onClick={props.metaTransaction}
              >
                Authorize
              </Button>
            ) : (
              <Button
                className="modal-buttons"
                color="blue"
                style={{ marginTop: '0px', display: 'block', width: '180px' }}
              >
                <span className="material-icons" id="deposit-icon-loading">
                  data_usage
                </span>
                Authorizing
              </Button>
            )}
          </Grid.Row>

          {props.validAuthorize == 1 ? (
            <Grid.Column floated="right" width={16}>
              <p className="modal-p-error" style={{ paddingTop: '30px' }}>
                Authorization failed
              </p>
            </Grid.Column>
          ) : null}
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
            tokenBalanceL1={state.balances[0][0]}
            tokenBalanceL2={state.balances[0][1]}
          />

          <Grid.Row>
            {props.customAmount == 0 ? (
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
                onChange={props.changeCustomAmount}
              />
            )}
          </Grid.Row>
          <Grid.Row>
            {props.processing == false ? (
              <Button
                className="modal-buttons"
                color="blue"
                style={{ marginTop: '-10px', display: 'block' }}
                onClick={props.depositToMatic}
              >
                Deposit
              </Button>
            ) : (
              <Button
                className="modal-buttons"
                color="blue"
                style={{ marginTop: '-10px', display: 'block', width: '180px' }}
              >
                <span className="material-icons" id="deposit-icon-loading">
                  data_usage
                </span>
                Depositing
              </Button>
            )}
          </Grid.Row>

          {props.validDeposit == 1 ? (
            <Grid.Column floated="right" width={16}>
              <p className="modal-p-error">Deposit failed</p>
            </Grid.Column>
          ) : null}
        </Grid>

        {/* <Button content="Next step" onClick={props.nextStep} /> */}
      </div>
    );
  }

  // function contentPending() {
  //   return (
  //     <div
  //       className="modal-content-container"
  //       style={{ paddingBottom: '70px' }}
  //     >
  //       <Grid>
  //         <Grid.Row>
  //           <h3 className="modal-h3">Deposit Pending</h3>
  //         </Grid.Row>
  //         <Grid.Row>
  //           <p className="modal-p">Current deposit confirmation pending</p>
  //         </Grid.Row>
  //       </Grid>

  //       {/* <Button content="Next step" onClick={props.nextStep} /> */}
  //     </div>
  //   );
  // }

  if (props.content == 'location') {
    return locationVerify();
  } else if (props.content == 'approve') {
    return contentApprove();
  } else if (props.content == 'authorize') {
    return contentAuthorize();
  } else if (props.content == 'deposit') {
    return contentDeposit();
  } else if (props.content == 'pending') {
    return contentPending();
  }
};

export default ContentDeposit;
