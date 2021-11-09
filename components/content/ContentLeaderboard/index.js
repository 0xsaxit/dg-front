import { useState, useEffect, useContext } from 'react';
import { Table, Dropdown } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import Images from 'common/Images';
import FoxAnimation from '../../lottieAnimation/animations/fox'
import StarAnimation from '../../lottieAnimation/animations/star';
import NoResult from '../../lottieAnimation/animations/noResult';
import styles from './ContentLeaderboard.module.scss'

const ContentLeaderboard = (props) => {
    // get game score records from the Context API store
    const [state, dispatch] = useContext(GlobalContext);

    // define local variables
    const games = ['All', 'Blackjack', 'Roulette', 'Poker', 'Slots'];
    const timePeriods = ['All', 'Daily', 'Weekly', 'Monthly', 'Competition'];
    const coinOptions = [
        {
            key: 'Play',
            text: null,
            value: 'Play',
            image: { avatar: true, src: Images["PLAY_CIRCLE"] }
        },
        {
            key: 'Mana',
            text: null,
            value: 'Mana',
            image: { avatar: true, src: Images["MANA_CIRCLE"] }
        },
        {
            key: 'Dai',
            text: null,
            value: 'Dai',
            image: { avatar: true, src: Images["DAI_CIRCLE"] }
        },
        {
            key: 'Eth',
            text: null,
            value: 'Eth',
            image: { avatar: true, src: Images["ETH_CIRCLE"] }
        },
    ]

    const [gameRecords, setGameRecords] = useState([]);
    const [time, setTime] = useState('All');
    const [game, setGame] = useState('All');
    const [coin, setCoin] = useState('PLAY');

    useEffect(() => {
        if (Object.keys(props.gameRecords).length !== 0) {
            console.log(props.gameRecords);
            if (props.gameRecords[time.toLowerCase()] && props.gameRecords[time.toLowerCase()][game.toLowerCase()] && props.gameRecords[time.toLowerCase()][game.toLowerCase()][coin.toLowerCase()]) {
                setGameRecords(props.gameRecords[time.toLowerCase()][game.toLowerCase()][coin.toLowerCase()]);
            } else {
                setGameRecords([]);
            }
        }
    }, [props.gameRecords, time, game, coin]);

    function handleCoinChange(e, { value }) {
        setCoin(value);
    }

    if (!state.userStatus) return (
        <section style={{ marginTop: '100px' }}>
            <FoxAnimation />
        </section>
    );

    return (
        <div className={styles.main_wrapper}>
            <div className={styles.title}>
                <h1>Games Leaderboard</h1>
            </div>

            <div className={styles.game_div}>
                {games.map((gameName, i) => {
                    return (
                        <div
                            key={i}
                            className={gameName === game ? styles.active : null}
                            onClick={() => {
                                setGame(gameName);
                            }}
                        >
                            {gameName === 'All' ? 'All Games' : gameName}
                        </div>
                    )
                })}
            </div>

            <div className={styles.time_div}>
                {timePeriods.map((timePeriod, i) => {
                    return (
                        <div
                            key={i}
                            className={timePeriod === time ? styles.active : null}
                            onClick={() => {
                                setTime(timePeriod);
                            }}
                        >
                            {timePeriod === 'All' ? 'All Time' : timePeriod}
                        </div>
                    )
                })}
            </div>

            <div className={styles.table}>
                <div className="gamesLeaderboardCoinSelect">
                    <Dropdown
                        defaultValue={coinOptions[0].value}
                        selection
                        options={coinOptions}
                        onChange={handleCoinChange}
                    />
                </div>

                <Table fixed unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                                Player
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{ paddingRight: '70px' }}>
                                Total {coin} Winnings
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                </Table>

                {gameRecords && gameRecords.length > 0 ?
                    <Table fixed unstackable>
                        <Table.Body>
                            {gameRecords.map((row, i) => {
                                let style = '';
                                {
                                    i % 2 === 0
                                        ? (style = 'rgba(255, 255, 255, 0.08)')
                                        : (style = 'black');
                                }

                                return (
                                    <Table.Row key={i} style={{ background: style }}>
                                        <Table.Cell className={styles.user_info}>
                                            {row.address === state.userAddress ?
                                                <StarAnimation />
                                                : null}
                                            <abbr>{i + 1}</abbr>
                                            <img src={row.imageURL} alt="avatar" />
                                            <abbr className={row.address === state.userAddress ? styles.active : null}>
                                                {row.name}
                                            </abbr>
                                        </Table.Cell>
                                        <Table.Cell className={styles.winnings}>
                                            <abbr>{Number((Number(row.winnings) / 1000000000000000000).toFixed(0)).toLocaleString()}</abbr>
                                            <img src={Images[coin.toUpperCase() + "_CIRCLE"]} alt="coin" />
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table>
                    :
                    <NoResult />
                }
            </div>
        </div>
    );
};

export default ContentLeaderboard;