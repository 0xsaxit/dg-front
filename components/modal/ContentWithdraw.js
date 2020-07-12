import { useContext } from 'react';
import { GlobalContext } from '../../store';
import Link from 'next/link';
import { Grid, Dropdown, Button } from 'semantic-ui-react';
import TokenBalances from './TokenBalances';
import Global from '../Constants';

const ContentWithdraw = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // drop-down menu MANA values
  const amount = [
    { key: 1, text: '1000 MANA', value: 1000 },
    { key: 2, text: '2000 MANA', value: 2000 },
    { key: 3, text: '3000 MANA', value: 3000 },
    { key: 4, text: '4000 MANA', value: 4000 },
    { key: 5, text: '5000 MANA', value: 5000 },
    {
      key: 6,
      text: 'MAXIMUM ' + '(' + state.balances[0][1] + ' MANA)',
      value: state.balances[0][1],
    },
  ];

  function contentBurn() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <div className="deposit-top-row">
              <h3 className="modal-h3 deposit">Withdraw from Matic</h3>
              <div className="right-aligned-crypto withdraw">
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
            <p className="modal-p" style={{ marginBottom: '6px' }}>
              Select the amount of Matic tokens to initiate a withdrawal from
              Matic. Following this transaction, you will receive a transaction
              hash as a proof of withdrawal.
            </p>
          </Grid.Row>
          <TokenBalances
            tokenBalanceL1={state.balances[0][0]}
            tokenBalanceL2={state.balances[0][1]}
          />
          <Grid.Row style={{ marginTop: '6px' }}>
            <Dropdown
              selection
              options={amount}
              value={props.amount}
              style={{ width: '300px', marginTop: '0px' }}
              onChange={props.onChangeAmount}
            />
          </Grid.Row>
          <Grid.Row>
            {props.processing == false ? (
              <Button
                className="modal-buttons"
                color="blue"
                style={{ marginTop: '-10px' }}
                onClick={props.burnOnMatic}
              >
                Withdraw
              </Button>
            ) : (
              <Button
                className="modal-buttons"
                color="blue"
                style={{ marginTop: '-10px' }}
              >
                <span className="material-icons" id="deposit-icon-loading">
                  data_usage
                </span>
                Withdraw
              </Button>
            )}
          </Grid.Row>

          {props.isValidBurn == 1 ? (
            <Grid.Row>
              <p className="modal-p-error">Withdraw failed</p>
            </Grid.Row>
          ) : null}
        </Grid>

        {/* <Button content="Next step" onClick={props.nextStep} /> */}
      </div>
    );
  }

  function contentPending() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Exit MANA to Mainnet pending</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Please check the Account History page in 10 minutes to confirm
              withdrawal of MANA tokens to Mainnet
            </p>
          </Grid.Row>

          <Grid.Row>
            <a
              target="_blank"
              href={Global.MATIC_EXPLORER + '/tx/' + props.transactionHash}
              className="nft-number-content"
            >
              {props.transactionHash}
            </a>
          </Grid.Row>

          <Grid.Row>
            <Link href="/account">
              <Button
                className="modal-buttons"
                color="blue"
                style={{ marginTop: '-10px' }}
                onClick={props.goToTxHistory}
              >
                Account
              </Button>
            </Link>
          </Grid.Row>
        </Grid>

        {/* <Button content="Next step" onClick={props.nextStep} /> */}
      </div>
    );
  }

  function contentExit() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Withdraw MANA to Mainnet</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Click Exit to submit your transaction hash as proof of burn
            </p>
          </Grid.Row>
          <TokenBalances
            tokenBalanceL1={state.balances[0][0]}
            tokenBalanceL2={state.balances[0][1]}
          />

          {/* <Grid.Row>
            <a
              target="_blank"
              href={Global.MATIC_EXPLORER + '/tx/' + props.transactionHash}
              className="nft-number-content"
            >
              {props.transactionHash}
            </a>
          </Grid.Row> */}

          <Grid.Row>
            {props.processing == false ? (
              <Button
                className="modal-buttons"
                color="blue"
                style={{ marginTop: '-10px' }}
                onClick={props.exitToMainnet}
              >
                Exit
              </Button>
            ) : (
              <Button
                className="modal-buttons"
                color="blue"
                style={{ marginTop: '-10px' }}
              >
                <span className="material-icons" id="deposit-icon-loading">
                  data_usage
                </span>
                Withdraw
              </Button>
            )}
          </Grid.Row>

          {props.isValidExit == 1 ? (
            <Grid.Row>
              <p className="modal-p-error">Exit failed</p>
            </Grid.Row>
          ) : null}

          <Grid.Row>
            <p className="modal-p-note">
              <span style={{ fontStyle: 'italic' }}>
                *Upon submitting valid proof your tokens will be transfered to
                your Mainnet account
              </span>
            </p>
          </Grid.Row>
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
            <h3 className="modal-h3">Exit confirmation</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Below is your Exit confirmation transaction hash
            </p>
          </Grid.Row>
          <Grid.Row>
            <a
              target="_blank"
              href={Global.MATIC_EXPLORER + '/tx/' + props.transactionHash}
              className="nft-number-content"
            >
              {props.transactionHash}
            </a>
          </Grid.Row>
        </Grid>

        {/* <Button content="Next step" onClick={props.nextStep} /> */}
      </div>
    );
  }

  if (props.content == 'burn') {
    return contentBurn();
  } else if (props.content == 'pending') {
    return contentPending();
  } else if (props.content == 'exit') {
    return contentExit();
  } else if (props.content == 'confirmation') {
    return contentConfirm();
  }
};

export default ContentWithdraw;
