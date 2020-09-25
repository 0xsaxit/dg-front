import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../store';
import { Grid } from 'semantic-ui-react';
import Global from '../Constants';
import Spinner from '../Spinner';

const ContentGames = (props) => {
  // get game score records from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [dataGames, setDataGames] = useState([[], [], [], [], []]);
  const [isLoading, setIsLoading] = useState(true);

  const games = ['ALL GAMES', 'BLACKJACK', 'ROULETTE', 'SLOTS', 'BACKGAMMON'];

  useEffect(() => {
    if (Object.keys(state.gameRecords).length !== 0) {
      setIsLoading(false);

      let gameData = {};
      let game1 = [];
      let game2 = [];
      let game3 = [];
      let game4 = [];
      let game5 = [];
      let selected = [];

      // parse game scores based on time period
      if (props.timePeriod === 'ALL TIME') {
        gameData = state.gameRecords.all;
      } else if (props.timePeriod === 'WEEK') {
        gameData = state.gameRecords.weekly;
      } else if (props.timePeriod == 'DAY') {
        gameData = state.gameRecords.daily;
      } else if (props.timePeriod == 'COMPETITION') {
        gameData = state.gameRecords.competition;
      }

      // parse game scores based on token type
      if (props.gameSelect === 'play') {
        selected = [
          gameData.all.play,
          gameData.blackjack.play,
          gameData.roulette.play,
          gameData.slot.play,
          gameData.backgammon.play,
        ];
      } else if (props.gameSelect === 'dai') {
        selected = [
          gameData.all.dai,
          gameData.blackjack.dai,
          gameData.roulette.dai,
          gameData.slot.dai,
          gameData.backgammon.dai,
        ];
      } else if (props.gameSelect == 'mana') {
        selected = [
          gameData.all.mana,
          gameData.blackjack.mana,
          gameData.roulette.mana,
          gameData.slot.mana,
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

      selected[3].map((row) => {
        game4.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      selected[4].map((row) => {
        game5.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      setDataGames([game1, game2, game3, game4, game5]);
    }
  }, [state.gameRecords, props.timePeriod, props.gameSelect]);

  if (isLoading) return <Spinner background={0} />;

  return (
    <Grid>
      {games.map((game, index) => {
        return (
          <Grid.Column
            computer={5}
            tablet={8}
            mobile={16}
            key={index}
            className="leaderboard-column"
          >
            <table style={{ marginTop: '5px' }}>
              <tbody>
                <tr className="table-header">
                  <td className="table-header-text-1 games">{game}</td>
                  <td className="table-header-text-2 games">WIN</td>
                </tr>
              </tbody>

              <tbody>
                {dataGames[index].map((row, index) => {
                  var num = parseInt(Number(row.winnings) / Global.FACTOR);
                  var amount = Number(num.toFixed(0))
                    .toLocaleString()
                    .split(/\s/)
                    .join(',');
                  return (
                    <tr className="table-body" key={index}>
                      <td className="table-body-text-1 games">
                        {index + 1}.{' '}
                        <img
                          className="avatar-picture"
                          src={`https://events.decentraland.org/api/profile/${row.address}/face.png`}
                          style={{
                            width: '24px',
                            marginRight: '6px',
                            verticalAlign: 'middle',
                            marginTop: '-2px',
                            border: '1px solid rgb(227, 232, 238)',
                            borderRadius: '100%',
                            boxShadow:
                              '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
                          }}
                        />
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
  );
};

export default ContentGames;
