import { Table, Button, Icon } from 'semantic-ui-react';
import mana from '../../static/images/mana.png';
import Global from '../constants';

const ContentTransactions = (props) => {
  function contentLabels() {
    return (
      <Table id="header" singleLine fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ACTION</Table.HeaderCell>
            <Table.HeaderCell>AMOUNT</Table.HeaderCell>
            <Table.HeaderCell>RESULT</Table.HeaderCell>
            <Table.HeaderCell>DATE</Table.HeaderCell>
            <Table.HeaderCell>TX HASH</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      </Table>
    );
  }

  function contentHistory() {
    return (
      <Table singleLine fixed>
        <Table.Body>
          {props.dataPage.map((row, i) => {
            const date = new Date(row.createdAt);
            const timestamp = date.toLocaleString();
            const amount = row.amount;
            let sign = '+';
            if (row.type !== 'Deposit') sign = '-';

            return (
              <Table.Row>
                <Table.Cell>
                  <img
                    src={mana}
                    style={{
                      width: '18px',
                      paddingRight: '3px',
                      verticalAlign: 'middle',
                      marginTop: '-3px',
                    }}
                  />
                  {row.type}
                </Table.Cell>

                <Table.Cell>
                  {sign}
                  {amount} MANA
                </Table.Cell>

                <Table.Cell>{row.status}</Table.Cell>
                <Table.Cell>{timestamp}</Table.Cell>

                <Table.Cell>
                  <a
                    style={{
                      color: '#2085F4',
                      maxWidth: '90px',
                      display: 'inline-block',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      verticalAlign: 'middle',
                    }}
                    target="_blank"
                    href={Global.MATIC_EXPLORER + `/tx/${row.txid}`}
                  >
                    {row.txid}
                  </a>
                  <Icon name="caret right" style={{ color: '#2085F4' }} />

                  {row.type === 'Burn' ? (
                    1 === 0 ? (
                      <Button size="mini" color="red">
                        PENDING
                      </Button>
                    ) : (
                      <Button size="mini" color="blue">
                        EXIT
                      </Button>
                    )
                  ) : null}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }

  function contentGameplay() {
    return (
      <Table singleLine fixed>
        <Table.Body>
          {props.dataPage.map((row, i) => {
            const date = new Date(row.createdAt);
            const timestamp = date.toLocaleString();
            const amount = Number(row.betAmount) / Global.FACTOR;
            const result = Number(row.amountWin) / Global.FACTOR;
            let action;
            if (row.gameType === 1) {
              action = 'Slots';
            } else if (row.gameType === 2) {
              action = 'Roulette';
            } else if (row.gameType === 3) {
              action = 'Backgammon';
            } else if (row.gameType === 4) {
              action = 'Blackjack';
            }

            return (
              <Table.Row>
                <Table.Cell>
                  <img
                    src={mana}
                    style={{
                      width: '18px',
                      paddingRight: '3px',
                      verticalAlign: 'middle',
                      marginTop: '-3px',
                    }}
                  />
                  {action}
                </Table.Cell>

                <Table.Cell>-{amount} MANA</Table.Cell>
                <Table.Cell>+{result} MANA</Table.Cell>
                <Table.Cell>{timestamp}</Table.Cell>

                <Table.Cell>
                  <a
                    style={{
                      color: '#2085F4',
                      maxWidth: '90px',
                      display: 'inline-block',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      verticalAlign: 'middle',
                    }}
                    target="_blank"
                    href={Global.MATIC_EXPLORER + `/tx/${row.txid}`}
                  >
                    {row.txid}
                  </a>
                  <Icon name="caret right" style={{ color: '#2085F4' }} />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }

  if (props.content == 'labels') {
    return contentLabels();
  } else if (props.content == 'history') {
    return contentHistory();
  } else if (props.content == 'gameplay') {
    return contentGameplay();
  }
};

export default ContentTransactions;
