import { useState, useEffect } from 'react';
import { Table } from 'semantic-ui-react';
import Global from '../Constants';
import FoxAnimation from '../lottieAnimation/animations/fox'

const ContentLeaderboard = (props) => {
  // get game score records from the Context API store
  // const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [dataGames, setDataGames] = useState([[], [], [], []]);
  const [isLoading, setIsLoading] = useState(true);

  const games = ['ALL GAMES', 'BLACKJACK', 'ROULETTE', 'SLOTS'];

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  var a = ['', ' First ', 'Second ', 'Third ', 'Fourth ', 'Fifth ', 'Sixth ', 'Seventh ', 'Eighth ', 'Ninth ', 'Tenth'];

  function inWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str;
  }

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

      setDataGames([game1, game2, game3, game4]);
    }
  }, [props.gameRecords, props.timePeriod, props.gameSelect]);

  if (isLoading) return (
    <section style={{ marginTop: '100px' }}>
      <FoxAnimation />
    </section>
  );

  console.log(dataGames);

  return (
    <>
      {(props && props.coinSelector) ? props.coinSelector() : null}
      <div className="outter-leaders-container" style={{ marginTop: '24px' }}>
        {games.map((game, index) => {
          return (
            <Table unstackable className="leaders-table">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="leaderboard-header">{game.toLowerCase()}</Table.HeaderCell>
                  {/*<Table.HeaderCell>WIN</Table.HeaderCell>*/}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {dataGames[index].map((row, index) => {
                  var num = parseInt(
                    Number(row.winnings) / Global.CONSTANTS.FACTOR
                  );
                  var amount = Number(num.toFixed(0))
                    .toLocaleString()
                    .split(/\s/)
                    .join(',');
                  return (
                    <Table.Row key={index}>
                      <Table.Cell style={{ display: 'flex' }}>
                        <img
                          className="avatar-picture"
                          src={`https://events.decentraland.org/api/profile/${row.address}/face.png`}
                          style={{
                            width: '36px',
                            marginRight: '6px',
                            verticalAlign: 'middle',
                            border: '1px solid rgba(42, 42, 42, 1)',
                            borderRadius: '100%',
                            display: 'flex',
                            alignSelf: 'center',
                          }}
                        />
                        <span style={{ display: 'flex', flexDirection: 'column', paddingLeft: '12px', alignSelf: 'center' }}>
                          <p className="leaderboard-top">
                            {inWords(index + 1)}
                          </p>
                          <p className="leaderboard-bottom">
                            {row.name === null || row.name === ''
                              ? row.address.substr(0, 6) +
                              '...' +
                              row.address.substr(-4)
                              : row.name}
                          </p>
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span style={{ display: 'flex', flexDirection: 'column', paddingLeft: '12px', marginTop: '-3px' }}>
                          <p className="leaderboard-top" style={{ textAlign: 'right' }}>
                            Winnings
                          </p>
                          <p className="leaderboard-bottom" style={{ textAlign: 'right' }}>
                            {amount}
                          </p>
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          );
        })}
      </div>
    </>
  );
};

export default ContentLeaderboard;