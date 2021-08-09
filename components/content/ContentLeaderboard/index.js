import { useState, useEffect } from 'react';
import { Grid, Table } from 'semantic-ui-react';
import Global from 'components/Constants';
import Spinner from 'components/Spinner';

import styles from './ContentLeaderboard.module.scss';

const ContentLeaderboard = props => {
  // get game score records from the Context API store
  // const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [dataGames, setDataGames] = useState([[], [], [], []]);
  const [isLoading, setIsLoading] = useState(true);

  const games = ['ALL GAMES', 'BLACKJACK', 'ROULETTE', 'SLOTS'];

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    // console.log(props.gameRecords);

    if (Object.keys(props.gameRecords).length !== 0) {
      setIsLoading(false);

      let gameData = {};
      let game1 = [];
      let game2 = [];
      let game3 = [];
      let game4 = [];
      // let game5 = [];
      let selected = [];

      // parse game scores based on time period
      if (props.timePeriod === 'ALL TIME') {
        gameData = props.gameRecords.all;
      } else if (props.timePeriod === 'WEEKLY') {
        gameData = props.gameRecords.weekly;
      } else if (props.timePeriod === 'DAILY') {
        gameData = props.gameRecords.daily;
      } else if (props.timePeriod === 'COMPETITION') {
        gameData = props.gameRecords.competition;
      }

      // parse game scores based on token type
      if (props.gameSelect === 'play') {
        selected = [
          gameData.all.play,
          gameData.blackjack.play,
          gameData.roulette.play,
          gameData.slot.play,
        ];
      } else if (props.gameSelect === 'dai') {
        selected = [
          gameData.all.dai,
          gameData.blackjack.dai,
          gameData.roulette.dai,
          gameData.slot.dai,
        ];
      } else if (props.gameSelect === 'mana') {
        selected = [
          gameData.all.mana,
          gameData.blackjack.mana,
          gameData.roulette.mana,
          gameData.slot.mana,
        ];
      } else if (props.gameSelect === 'eth') {
        selected = [
          gameData.all.eth,
          gameData.blackjack.eth,
          gameData.roulette.eth,
          gameData.slot.eth,
        ];
      } else if (props.gameSelect === 'usdt') {
        selected = [
          gameData.all.usdt,
          gameData.blackjack.usdt,
          gameData.roulette.usdt,
          gameData.slot.usdt,
        ];
      } else if (props.gameSelect === 'atri') {
        selected = [
          gameData.all.atri,
          gameData.blackjack.atri,
          gameData.roulette.atri,
          gameData.slot.atri,
        ];
      }

      selected[0].map(row => {
        game1.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      selected[1].map(row => {
        game2.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      selected[2].map(row => {
        game3.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      selected[3].map(row => {
        game4.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      setDataGames([game1, game2, game3, game4]);
    }
  }, [props.gameRecords, props.timePeriod, props.gameSelect]);

  if (isLoading) return <Spinner background={0} />;

  console.log(dataGames);

  return (
    <Grid className={styles.content_leaderboard_container}>
      {games.map((game, index) => {
        return (
          <Grid.Column
            computer={8}
            tablet={8}
            mobile={16}
            key={index}
            className={styles.leaderboard_column}
          >
            <Table unstackable className={styles.leaders_table}>
              <Table.Header className={styles.header}>
                <Table.Row className={styles.row}> 
                  <Table.HeaderCell className={styles.th}>{game}</Table.HeaderCell>
                  <Table.HeaderCell className={styles.th}>WIN</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body className={styles.body}>
                {dataGames[index].map((row, index) => {
                  var num = parseInt(
                    Number(row.winnings) / Global.CONSTANTS.FACTOR
                  );
                  var amount = Number(num.toFixed(0))
                    .toLocaleString()
                    .split(/\s/)
                    .join(',');
                  return (
                    <Table.Row key={index} className={styles.body_row}>
                      <Table.Cell className={styles.td}>
                        {index + 1}.{' '}
                        <img
                          className={styles.avatar_picture}
                          src={`https://events.decentraland.org/api/profile/${row.address}/face.png`}
                        />
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

export default ContentLeaderboard;
