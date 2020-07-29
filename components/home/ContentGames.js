import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../store';
import { Grid, Table } from 'semantic-ui-react';
import Global from '../Constants';
// import Spinner from '../Spinner';

const ContentGames = (props) => {
  // get game score records from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [loading, setLoading] = useState(true);
  const games = ['SLOTS', 'ROULETTE', 'BLACKJACK', 'BACKGAMMON'];
  const [dataSlots, setDataSlots] = useState([]);
  const [dataRoulette, setDataRoulette] = useState([]);
  const [dataBackgammon, setDataBackgammon] = useState([]);

  useEffect(() => {
    if (
      Object.keys(state.gameRecords).length === 0 &&
      state.gameRecords.constructor === Object
    ) {
      console.log('waiting...');
    } else {
      let gameData;
      let game1 = [];
      let game2 = [];
      let game3 = [];

      if (props.timePeriod === 'ALL TIME') {
        gameData = state.gameRecords.all;
      } else if (props.timePeriod === 'WEEK') {
        gameData = state.gameRecords.weekly;
      } else if (props.timePeriod == 'DAY') {
        gameData = state.gameRecords.daily;
      }

      console.log('use effect...'); // why do we keep re-rendering??? ***************************************

      gameData.slot.play.map((row) => {
        dataSlots.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      gameData.roulette.play.map((row) => {
        dataRoulette.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      gameData.backgammon.play.map((row) => {
        dataBackgammon.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      console.log(game1);

      setDataSlots(game1); // we can not set date from useEffect??? ****************************************
      setDataRoulette(game2);
      setDataBackgammon(game3);
    }
  });

  return (
    <Grid>
      {games.map((game, index) => {
        return (
          <Grid.Column computer={4} key={index}>
            <Table id="header" singleLine fixed>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="table-header-text">
                    {game}
                  </Table.HeaderCell>
                  <Table.HeaderCell className="table-header-text">
                    WIN
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {dataSlots.map((row, index) => {
                  var amount = parseInt(Number(row.winnings) / Global.FACTOR);
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>
                        {row.name === null || row.name === ''
                          ? row.address.substr(0, 6) +
                            '...' +
                            row.address.substr(-4)
                          : row.name}
                      </Table.Cell>
                      <Table.Cell>{amount}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Grid.Column>
        );
      })}
    </Grid>
  );
};

export default ContentGames;
