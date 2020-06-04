import React from 'react';
import { Table } from 'semantic-ui-react';
import mana from '../../static/images/mana.png';

const tokenBalances = (props) => {
  return (
    <div id="modal-balance">
      <Table
        id="header"
        singleLine
        fixed
        style={{ marginBottom: 0, border: 0 }}
      >
        <Table.Body>
          {/* <div style={{ paddingTop: '6px', paddingBottom: '17px' }}> */}
          <Table.Row>
            <Table.Cell>
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
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
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
            </Table.Cell>
          </Table.Row>
          {/* </div> */}
        </Table.Body>
      </Table>
    </div>
  );
};

export default tokenBalances;
