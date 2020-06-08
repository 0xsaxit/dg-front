import React from 'react';
import Link from 'next/link';
import { Grid, Dropdown, Button } from 'semantic-ui-react';
import TokenBalances from './TokenBalances';

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
            <h3 className="modal-h3">Burn MANA on Matic Network</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Please select the amount of Matic tokens you would like to burn
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
                *After sending Burn transaction you will receive a transaction
                hash as proof of burn
              </span>
            </p>
          </Grid.Row>
        </Grid>

        {/* <Button content="Next step" onClick={props.nextStep} /> */}
      </div>
    );
  }

  function contentHash() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Exit MANA to Mainnet pending</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Please check the Transaction History page in 5 to 10 minutes to
              confirm withdrawal of MANA tokens to Mainnet
            </p>
          </Grid.Row>
          <Grid.Row>(TX HASH: {props.transactionHash})</Grid.Row>

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
            <span style={{ fontWeight: 'bold', marginRight: '5px' }}>
              TX HASH:
            </span>
            {props.transactionHash}
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

  if (props.content == 'burn') {
    return contentBurn();
  } else if (props.content == 'hash') {
    return contentHash();
  } else if (props.content == 'exit') {
    return contentExit();
  }
};

export default ContentWithdraw;
