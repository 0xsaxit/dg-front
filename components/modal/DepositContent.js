import React from 'react';
import { Grid, Table, Input, Dropdown, Button } from 'semantic-ui-react';
import mana from '../../static/images/mana.png';
import verify1 from '../../static/images/switch_ropsten.png';

const DepositContent = (props) => {
  // drop-down menu MANA values
  const amount = [
    { key: 1, text: '1000 MANA', value: 1000 },
    { key: 2, text: '2000 MANA', value: 2000 },
    { key: 3, text: '3000 MANA', value: 3000 },
    { key: 4, text: '4000 MANA', value: 4000 },
    { key: 5, text: '5000 MANA', value: 5000 },
    { key: 6, text: 'Custom', value: -1 },
  ];

  function changeRPC() {
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

  function contentApprove() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Deposit MANA</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Authorize MANA transfers and deposit to Matic Network
            </p>
          </Grid.Row>
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
              id="depositButton2"
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

          <Grid.Row>
            <p className="modal-p-note">
              <span style={{ fontStyle: 'italic' }}>
                *Matic Network is a second layer sidechain that allows our games
                to have much faster in-game transactions
              </span>
            </p>
            <p className="modal-p-note2">
              <span style={{ fontWeight: 'bold' }}>NOTE: </span>
              Matic Network deposits are instantly usable in all our games
            </p>
          </Grid.Row>
        </Grid>
      </div>
    );
  }

  function contentAuthorize() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Authorize MANA</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">Authorize MANA transfers on Matic Network</p>
          </Grid.Row>
          <Grid.Row>
            <Button
              id="depositButton2"
              color="blue"
              style={{ marginLeft: '5px', marginBottom: '3em' }}
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
      </div>
    );
  }

  function contentDeposit() {
    return (
      <div className="modal-content-container">
        <Grid>
          <Grid.Row>
            <h3 className="modal-h3">Deposit MANA</h3>
          </Grid.Row>
          <Grid.Row>
            <p className="modal-p">
              Select amount of MANA to deposit to Matic Network
            </p>
          </Grid.Row>

          <div id="modal-balance">
            <Table
              id="header"
              singleLine
              fixed
              style={{ marginBottom: 0, border: '0px' }}
            >
              <div style={{ paddingTop: '6px', paddingBottom: '17px' }}>
                <Table.Row>
                  <span
                    style={{
                      color: 'black',
                      textAlign: 'left',
                      lineHeight: '25px',
                      verticalAlign: 'middle',
                      fontWeight: 'bold',
                    }}
                  >
                    ROPSTEN BALANCE:
                  </span>
                  <img
                    style={{ verticalAlign: 'middle', marginLeft: '40px' }}
                    width="20px"
                    height="20px"
                    src={mana}
                  />
                  <span
                    style={{
                      color: 'black',
                      textAlign: 'left',
                      marginLeft: '10px',
                      lineHeight: '25px',
                      verticalAlign: 'middle',
                    }}
                  >
                    {props.tokenBalanceL1} MANA
                  </span>
                </Table.Row>
                <Table.Row>
                  <span
                    style={{
                      color: 'black',
                      textAlign: 'left',
                      lineHeight: '25px',
                      verticalAlign: 'middle',
                      fontWeight: 'bold',
                    }}
                  >
                    MATIC BALANCE:
                  </span>
                  <img
                    style={{ verticalAlign: 'middle', marginLeft: '63px' }}
                    width="20px"
                    height="20px"
                    src={mana}
                  />
                  <span
                    style={{
                      color: 'black',
                      textAlign: 'left',
                      marginLeft: '10px',
                      lineHeight: '25px',
                      verticalAlign: 'middle',
                    }}
                  >
                    {props.tokenBalanceL2} MANA
                  </span>
                </Table.Row>
              </div>
            </Table>
          </div>

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
                style={{ width: '300px', marginTop: '0px' }}
                value={props.amount}
                onChange={props.onChangeCustomAmount}
              />
            )}
          </Grid.Row>
          <Grid.Row>
            <Button
              id="depositButton2"
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
      </div>
    );
  }

  if (props.content == 'changeRPC') {
    return changeRPC();
  } else if (props.content == 'approve') {
    return contentApprove();
  } else if (props.content == 'authorize') {
    return contentAuthorize();
  } else if (props.content == 'deposit') {
    return contentDeposit();
  }
};

export default DepositContent;
