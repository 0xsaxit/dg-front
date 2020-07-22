import { useState, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Image, Button, Grid, Icon, Table } from 'semantic-ui-react';
import Global from '../Constants';


const ContentGames = () => {
  // get owner's NFT data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <div>
      <Grid>
        <Grid.Column computer={4}>
          <Table id="header" singleLine fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="table-header-text">
                  SLOTS
                </Table.HeaderCell>
                <Table.HeaderCell className="table-header-text">
                  WIN
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>

                </Table.Cell>
                <Table.Cell>

                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>

        <Grid.Column computer={4}>
          <Table id="header" singleLine fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="table-header-text">
                  ROULETTE
                </Table.HeaderCell>
                <Table.HeaderCell className="table-header-text">
                  WIN
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>

                </Table.Cell>
                <Table.Cell>

                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>

        <Grid.Column computer={4}>
          <Table id="header" singleLine fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="table-header-text">
                  BLACKJACK
                </Table.HeaderCell>
                <Table.HeaderCell className="table-header-text">
                  WIN
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>

                </Table.Cell>
                <Table.Cell>

                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>

        <Grid.Column computer={4}>
          <Table id="header" singleLine fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="table-header-text">
                  BACKGAMMON
                </Table.HeaderCell>
                <Table.HeaderCell className="table-header-text">
                  WIN
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>

                </Table.Cell>
                <Table.Cell>

                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default ContentGames;