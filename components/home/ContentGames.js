import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../store';
import { Grid } from 'semantic-ui-react';
import Global from '../Constants';
import Aux from '../_Aux';
import Spinner from '../Spinner';

const ContentGames = (props) => {
  // get game score records from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [dataGames, setDataGames] = useState([[], [], [], []]);
  const [processing, setProcessing] = useState(true);

  const games = ['SLOTS', 'ROULETTE', 'BLACKJACK', 'BACKGAMMON'];

  useEffect(() => {
    if (Object.keys(state.gameRecords).length !== 0) {
      setProcessing(false);

      let gameData = {};
      let game1 = [];
      let game2 = [];
      let game3 = [];
      let selected = [];

      // parse game scores based on time period
      if (props.timePeriod === 'ALL TIME') {
        gameData = state.gameRecords.all;
      } else if (props.timePeriod === 'WEEK') {
        gameData = state.gameRecords.weekly;
      } else if (props.timePeriod == 'DAY') {
        gameData = state.gameRecords.daily;
      }

      // parse game scores based on token type
      if (props.gameSelect === 'play') {
        selected = [
          gameData.slot.play,
          gameData.roulette.play,
          gameData.backgammon.play,
        ];
      } else if (props.gameSelect === 'dai') {
        selected = [
          gameData.slot.dai,
          gameData.roulette.dai,
          gameData.backgammon.dai,
        ];
      } else if (props.gameSelect == 'mana') {
        selected = [
          gameData.slot.mana,
          gameData.roulette.mana,
          gameData.backgammon.mana,
        ];
      }

      selected[0].map((row) => {
        game1.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      selected[1].map((row) => {
        game2.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      selected[2].map((row) => {
        game3.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      setDataGames([game1, game2, [], game3]);
    }
  }, [state.gameRecords, props.timePeriod, props.gameSelect]);

  return (
    <Aux>
      {processing ? <Spinner background={0} /> : null}

      <Grid>
        {games.map((game, index) => {
          return (
            <Grid.Column computer={4} tablet={8} mobile={16} key={index}>
              <table style={{ marginTop: '5px' }}>
                <tbody>
                  <tr className="table-header">
                    <td className="table-header-text-1 games">
                      {game}
                    </td>
                    <td className="table-header-text-2 games">
                      WIN
                    </td>
                  </tr>
                </tbody>

                <tbody>
                  {dataGames[index].map((row, index) => {
                    var num = parseInt(Number(row.winnings) / Global.FACTOR);
                    var amount = Number(num.toFixed(0)).toLocaleString().split(/\s/).join(',');
                    return (
                      <tr className="table-body" key={index}>
                        <td className="table-body-text-1 games">
                          {index + 1}.{' '}
                          {row.name === null || row.name === ''
                            ? row.address.substr(0, 6) +
                              '...' +
                              row.address.substr(-4)
                            : row.name}
                        </td>
                        <td className="table-body-text-2 games">{amount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Grid.Column>
          );
        })}
      </Grid>
    </Aux>
  );
};

export default ContentGames;
