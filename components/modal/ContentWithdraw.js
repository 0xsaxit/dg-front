import Link from 'next/link';
import { Grid, Dropdown, Button } from 'semantic-ui-react';
import TokenBalances from './TokenBalances';
import Global from '../Constants';

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
      text: 'MAXIMUM ' + '(' + props.tokenBalanceL2 + ' MANA)',
      value: props.tokenBalanceL2,
    },
  ];

  function contentBurn() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Withdraw MANA from Matic</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Select the amount of Matic tokens to initiate a withdrawal from
              Matic
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
              onClick={props.burnOnMatic}
            >
              Withdraw
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
                *Following this transaction, you will receive a transaction hash
                as a proof of burn
              </span>
            </p>
          </Grid.Row>
        </Grid>

        {/* <Button content="Next step" onClick={props.nextStep} /> */}
      </div>
    );
  }

  function contentHistory() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Exit MANA to Mainnet pending</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Please check the Transaction History page in 10 minutes to confirm
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
            <Link href="/txhistory">
              <Button
                className="modal-buttons"
                color="blue"
                style={{ marginTop: '-10px' }}
                onClick={props.goToTxHistory}
              >
                Tx History
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
            tokenBalanceL1={props.tokenBalanceL1}
            tokenBalanceL2={props.tokenBalanceL2}
          />
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
            <Button
              className="modal-buttons"
              color="blue"
              style={{ marginTop: '-10px' }}
              onClick={props.exitToMainnet}
            >
              Exit
            </Button>
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
  } else if (props.content == 'history') {
    return contentHistory();
  } else if (props.content == 'exit') {
    return contentExit();
  } else if (props.content == 'confirmation') {
    return contentConfirm();
  }
};

export default ContentWithdraw;
