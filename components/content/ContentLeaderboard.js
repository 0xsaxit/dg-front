import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Grid } from 'semantic-ui-react';
import Global from '../Constants';
import Spinner from '../Spinner';
import Fetch from '../../common/Fetch';


const ContentLeaderboard = (props) => {
  // get game score records from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [dataGames, setDataGames] = useState([[], [], [], [], []]);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarImage, setAvatarImage] = useState('');

  const games = ['ALL GAMES', 'BLACKJACK', 'ROULETTE', 'SLOTS', 'BACKGAMMON'];

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    (async function func() {
      if (Object.keys(props.gameRecords).length !== 0) {

        let gameData = {};
        let game1 = [];
        let game2 = [];
        let game3 = [];
        let game4 = [];
        let game5 = [];
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
        } else if (props.gameSelect === 'mana') {
          selected = [
            gameData.all.mana,
            gameData.blackjack.mana,
            gameData.roulette.mana,
            gameData.slot.mana,
            gameData.backgammon.mana,
          ];
        }

        await selected[0].map(async(row) => {

          let avatarImg;
          await (async function () {
            const responseAvatar = await Fetch.AVATAR_IMAGE(row.address);
            const jsonAvatar = await responseAvatar.json();
            avatarImg = jsonAvatar.avatars[0].avatar.snapshots.face;
          })();

          game1.push({
            image: avatarImg,
            name: row.name,
            address: row.address,
            winnings: row.winnings,
          });

          await game1.sort(function(a, b) {
            return parseInt(b.winnings) - parseInt(a.winnings);
          });
        });

        await selected[1].map(async(row) => {

          let avatarImg;
          await (async function () {
            const responseAvatar = await Fetch.AVATAR_IMAGE(row.address);
            const jsonAvatar = await responseAvatar.json();
            avatarImg = jsonAvatar.avatars[0].avatar.snapshots.face;
          })();

          game2.push({
            image: avatarImg,
            name: row.name,
            address: row.address,
            winnings: row.winnings,
          });

          await game2.sort(function(a, b) {
            return parseInt(b.winnings) - parseInt(a.winnings);
          });
        });

        await selected[2].map(async(row) => {

          let avatarImg;
          await (async function () {
            const responseAvatar = await Fetch.AVATAR_IMAGE(row.address);
            const jsonAvatar = await responseAvatar.json();
            avatarImg = jsonAvatar.avatars[0].avatar.snapshots.face;
          })();

          game3.push({
            image: avatarImg,
            name: row.name,
            address: row.address,
            winnings: row.winnings,
          });

          await game3.sort(function(a, b) {
            return parseInt(b.winnings) - parseInt(a.winnings);
          });
        });

        await selected[3].map(async(row) => {

          let avatarImg;
          await (async function () {
            const responseAvatar = await Fetch.AVATAR_IMAGE(row.address);
            const jsonAvatar = await responseAvatar.json();
            avatarImg = jsonAvatar.avatars[0].avatar.snapshots.face;
          })();

          game4.push({
            image: avatarImg,
            name: row.name,
            address: row.address,
            winnings: row.winnings,
          });

          await game4.sort(function(a, b) {
            return parseInt(b.winnings) - parseInt(a.winnings);
          });
        });

        await selected[4].map(async(row) => {

          let avatarImg;
          await (async function () {
            const responseAvatar = await Fetch.AVATAR_IMAGE(row.address);
            const jsonAvatar = await responseAvatar.json();
            avatarImg = jsonAvatar.avatars[0].avatar.snapshots.face;
          })();

          console.log(avatarImg);

          game5.push({
            image: avatarImg,
            name: row.name,
            address: row.address,
            winnings: row.winnings,
          });


          await game5.sort(function(a, b) {
            return parseInt(b.winnings) - parseInt(a.winnings);
          });
          console.log('$$$$$$$$$$$$$$$$');
          console.log(game5);
        });
        setDataGames([game1, game2, game3, game4, game5]);

        console.log(dataGames);
      }
    }) ();
    setIsLoading(false);
  }, [props.gameRecords, props.timePeriod, props.gameSelect]);


  if (isLoading) return <Spinner background={1} />;
  console.log(dataGames);
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
                  var num = parseInt(
                    Number(row.winnings) / Global.CONSTANTS.FACTOR
                  );
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
                          src={row.image}
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

export default ContentLeaderboard;
