import React, { useState, useEffect, useContext } from 'react'
import { GlobalContext } from '../../../../store';
import { Table, Button } from 'semantic-ui-react';
import ModalIceDelegationBreakDown from 'components/modal/ModalIceDelegationBreakDown';
import FoxAnimation from 'components/lottieAnimation/animations/fox'
import HourglassAnimation from 'components/lottieAnimation/animations/hourglass'
import EmptyResultAnimation from 'components/lottieAnimation/animations/emptyResult';
import Fetch from 'common/Fetch';
import styles from './Delegation.module.scss'

const Delegation = () => {
    // get delegation data from the Context API store
    const [state, dispatch] = useContext(GlobalContext);

    // define local variables
    const [loading, setLoading] = useState(true);
    const [time, setTime] = useState('Weekly');
    const [showBreakDown, setShowingBreakDown] = useState(-1);
    const [delegations, setDelegations] = useState([]);
    const [sortingName, setSortingName] = useState('dailyICE');
    const [sortingOrder, setSortingOrder] = useState('dec');

    useEffect(async () => {
        if (state.userStatus) {
            setLoading(true);

            // Get Delegation Breakdown from the API
            let response = await Fetch.DELEGATION_BREAKDOWN(time === 'Weekly' ? 'week' : time === 'Monthly' ? 'month' : 'all');
            console.log(response);

            if (response && response.length > 0) {
                response.sort(function (a, b) {
                    return b.stats.avgIceEarned - a.stats.avgIceEarned;
                })
                for (var i = 0; i < response.length; i++) {
                    response[i].breakdown.sort(function (a, b) {
                        return new Date(b.gameplayDay) - new Date(a.gameplayDay);
                    })
                }
            }
            setDelegations(response && response.length > 0 ? response : []);

            setLoading(false);
        }
    }, [state.userStatus, time])

    useEffect(() => {
        const orderingData = [].concat(delegations);

        if (orderingData && orderingData.length > 0) [
            orderingData.sort(function (a, b) {
                if (sortingName === 'dailyICE') {
                    return (sortingOrder === 'dec') ? (b.stats.avgIceEarned - a.stats.avgIceEarned) : (a.stats.avgIceEarned - b.stats.avgIceEarned);
                } else if (sortingName === 'iceEarned') {
                    return (sortingOrder === 'dec') ? (b.stats.totalIceEarned - a.stats.totalIceEarned) : (a.stats.totalIceEarned - b.stats.totalIceEarned);
                } else if (sortingName === 'daysCheckedIn') {
                    return (sortingOrder === 'dec') ? (b.stats.daysCheckedIn - a.stats.daysCheckedIn) : (a.stats.daysCheckedIn - b.stats.daysCheckedIn);
                } else if (sortingName === 'totalChallengesCompleted') {
                    return (sortingOrder === 'dec') ? (b.stats.totalChallengesCompleted - a.stats.totalChallengesCompleted) : (a.stats.totalChallengesCompleted - b.stats.totalChallengesCompleted);
                } else if (sortingName === 'avgLeaderboardTier') {
                    return (sortingOrder === 'inc') ? (b.stats.avgLeaderboardTier - a.stats.avgLeaderboardTier) : (a.stats.avgLeaderboardTier - b.stats.avgLeaderboardTier);
                }
            })
        ]

        setDelegations(orderingData);
    }, [sortingName, sortingOrder])

    const defaultImgs = [
        "https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png",
        "https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png",
        "https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png",
        "https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png",
        "https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png"
    ];

    function tableHeaderClicked(name) {
        if (sortingName !== name) {
            setSortingName(name);
            setSortingOrder('dec');
        } else {
            setSortingOrder(sortingOrder === 'dec' ? 'inc' : 'dec');
        }
    }

    return (
        <section>
            <div className={styles.main_wrapper}>
                {!state.userStatus ?
                    <FoxAnimation />
                    :
                    <>
                        <div className={styles.title}>
                            <h1>
                                Delegation Statistics
                            </h1>
                        </div>

                        <div className={styles.time_div}>
                            <div
                                className={time === 'Weekly' ? styles.active : null}
                                onClick={() => {
                                    setTime('Weekly');
                                }}
                            >
                                Weekly
                            </div>
                            <div
                                className={time === 'Monthly' ? styles.active : null}
                                onClick={() => {
                                    setTime('Monthly');
                                }}
                            >
                                Monthly
                            </div>
                            <div
                                className={time === 'All Time' ? styles.active : null}
                                onClick={() => {
                                    setTime('All Time');
                                }}
                            >
                                All Time
                            </div>
                        </div>
                    </>
                }
            </div>

            {state.userStatus ?
                loading ?
                    <div style={{ marginTop: '120px' }}>
                        <HourglassAnimation />
                    </div>
                    :
                    delegations && delegations.length > 0 ?
                        <>
                        <div className={styles.delegation_table}>
                            <div className={styles.fixed}>
                                <Table fixed unstackable>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell style={{ width: '50px' }} />
                                            <Table.HeaderCell style={{ width: '200px' }} >
                                                Player Address
                                            </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {delegations.map((row, i) => {
                                            let style = '';
                                            {
                                                i % 2 === 0
                                                    ? (style = 'rgba(255, 255, 255, 0.08)')
                                                    : (style = 'black');
                                            }

                                            return (
                                                <Table.Row key={i} style={{ background: style, width: '250px' }}>
                                                    <Table.Cell style={{ width: '50px' }} >
                                                        {i + 1}
                                                    </Table.Cell>
                                                    <Table.Cell className={styles.user_info} >
                                                        <section onClick={() => setShowingBreakDown(i)}>
                                                            <img src={row.imageURL} alt="avatar" />
                                                            {row.address.substr(0, 5)}...{row.address.substr(row.address.length - 4, row.address.length)}
                                                        </section>
                                                    </Table.Cell>
                                                </Table.Row>
                                            );
                                        })}
                                    </Table.Body>
                                </Table>
                            </div>

                            <div className={styles.scroll}>
                                <Table fixed unstackable>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell style={{ width: '250px' }} >
                                                NFTs Delegated
                                            </Table.HeaderCell>
                                            <Table.HeaderCell style={{ width: '200px' }} onClick={() => tableHeaderClicked('dailyICE')}>
                                                Avg.Daily ICE
                                                <svg style={{ opacity: `${sortingName === 'dailyICE' ? 1 : 0}` }} className={sortingOrder === 'inc' ? styles.inc : styles.dec} width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.49219 0.875C5.78906 0.875 5.32031 1.36719 5.32031 2.09375V10.6016L5.39062 12.2969L3.92188 10.5938L2.14062 8.8125C1.92969 8.60156 1.65625 8.44531 1.30469 8.44531C0.671875 8.44531 0.1875 8.90625 0.1875 9.57812C0.1875 9.88281 0.3125 10.1719 0.554688 10.4219L5.625 15.5C5.84375 15.7188 6.17188 15.8516 6.49219 15.8516C6.8125 15.8516 7.14062 15.7188 7.35938 15.5L12.4375 10.4219C12.6797 10.1719 12.8047 9.88281 12.8047 9.57812C12.8047 8.90625 12.3203 8.44531 11.6875 8.44531C11.3359 8.44531 11.0625 8.60156 10.8438 8.8125L9.0625 10.5938L7.59375 12.2969L7.67188 10.6016V2.09375C7.67188 1.36719 7.19531 0.875 6.49219 0.875Z" fill="white" />
                                                </svg>
                                            </Table.HeaderCell>
                                            <Table.HeaderCell style={{ width: '200px' }} onClick={() => tableHeaderClicked('iceEarned')}>
                                                Total ICE Earned
                                                <svg style={{ opacity: `${sortingName === 'iceEarned' ? 1 : 0}` }} className={sortingOrder === 'inc' ? styles.inc : styles.dec} width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.49219 0.875C5.78906 0.875 5.32031 1.36719 5.32031 2.09375V10.6016L5.39062 12.2969L3.92188 10.5938L2.14062 8.8125C1.92969 8.60156 1.65625 8.44531 1.30469 8.44531C0.671875 8.44531 0.1875 8.90625 0.1875 9.57812C0.1875 9.88281 0.3125 10.1719 0.554688 10.4219L5.625 15.5C5.84375 15.7188 6.17188 15.8516 6.49219 15.8516C6.8125 15.8516 7.14062 15.7188 7.35938 15.5L12.4375 10.4219C12.6797 10.1719 12.8047 9.88281 12.8047 9.57812C12.8047 8.90625 12.3203 8.44531 11.6875 8.44531C11.3359 8.44531 11.0625 8.60156 10.8438 8.8125L9.0625 10.5938L7.59375 12.2969L7.67188 10.6016V2.09375C7.67188 1.36719 7.19531 0.875 6.49219 0.875Z" fill="white" />
                                                </svg>
                                            </Table.HeaderCell>
                                            <Table.HeaderCell style={{ width: '150px' }} onClick={() => tableHeaderClicked('daysCheckedIn')}>
                                                Check-Ins
                                                <svg style={{ opacity: `${sortingName === 'daysCheckedIn' ? 1 : 0}` }} className={sortingOrder === 'inc' ? styles.inc : styles.dec} width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.49219 0.875C5.78906 0.875 5.32031 1.36719 5.32031 2.09375V10.6016L5.39062 12.2969L3.92188 10.5938L2.14062 8.8125C1.92969 8.60156 1.65625 8.44531 1.30469 8.44531C0.671875 8.44531 0.1875 8.90625 0.1875 9.57812C0.1875 9.88281 0.3125 10.1719 0.554688 10.4219L5.625 15.5C5.84375 15.7188 6.17188 15.8516 6.49219 15.8516C6.8125 15.8516 7.14062 15.7188 7.35938 15.5L12.4375 10.4219C12.6797 10.1719 12.8047 9.88281 12.8047 9.57812C12.8047 8.90625 12.3203 8.44531 11.6875 8.44531C11.3359 8.44531 11.0625 8.60156 10.8438 8.8125L9.0625 10.5938L7.59375 12.2969L7.67188 10.6016V2.09375C7.67188 1.36719 7.19531 0.875 6.49219 0.875Z" fill="white" />
                                                </svg>
                                            </Table.HeaderCell>
                                            <Table.HeaderCell style={{ width: '220px' }} onClick={() => tableHeaderClicked('totalChallengesCompleted')}>
                                                Finished Challenges
                                                <svg style={{ opacity: `${sortingName === 'totalChallengesCompleted' ? 1 : 0}` }} className={sortingOrder === 'inc' ? styles.inc : styles.dec} width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.49219 0.875C5.78906 0.875 5.32031 1.36719 5.32031 2.09375V10.6016L5.39062 12.2969L3.92188 10.5938L2.14062 8.8125C1.92969 8.60156 1.65625 8.44531 1.30469 8.44531C0.671875 8.44531 0.1875 8.90625 0.1875 9.57812C0.1875 9.88281 0.3125 10.1719 0.554688 10.4219L5.625 15.5C5.84375 15.7188 6.17188 15.8516 6.49219 15.8516C6.8125 15.8516 7.14062 15.7188 7.35938 15.5L12.4375 10.4219C12.6797 10.1719 12.8047 9.88281 12.8047 9.57812C12.8047 8.90625 12.3203 8.44531 11.6875 8.44531C11.3359 8.44531 11.0625 8.60156 10.8438 8.8125L9.0625 10.5938L7.59375 12.2969L7.67188 10.6016V2.09375C7.67188 1.36719 7.19531 0.875 6.49219 0.875Z" fill="white" />
                                                </svg>
                                            </Table.HeaderCell>
                                            <Table.HeaderCell style={{ width: '230px' }} onClick={() => tableHeaderClicked('avgLeaderboardTier')}>
                                                Avg.Leaderboard Tier
                                                <svg style={{ opacity: `${sortingName === 'avgLeaderboardTier' ? 1 : 0}` }} className={sortingOrder === 'inc' ? styles.inc : styles.dec} width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.49219 0.875C5.78906 0.875 5.32031 1.36719 5.32031 2.09375V10.6016L5.39062 12.2969L3.92188 10.5938L2.14062 8.8125C1.92969 8.60156 1.65625 8.44531 1.30469 8.44531C0.671875 8.44531 0.1875 8.90625 0.1875 9.57812C0.1875 9.88281 0.3125 10.1719 0.554688 10.4219L5.625 15.5C5.84375 15.7188 6.17188 15.8516 6.49219 15.8516C6.8125 15.8516 7.14062 15.7188 7.35938 15.5L12.4375 10.4219C12.6797 10.1719 12.8047 9.88281 12.8047 9.57812C12.8047 8.90625 12.3203 8.44531 11.6875 8.44531C11.3359 8.44531 11.0625 8.60156 10.8438 8.8125L9.0625 10.5938L7.59375 12.2969L7.67188 10.6016V2.09375C7.67188 1.36719 7.19531 0.875 6.49219 0.875Z" fill="white" />
                                                </svg>
                                            </Table.HeaderCell>
                                            <Table.HeaderCell style={{ width: '170px' }} >
                                                History
                                            </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {delegations.map((row, i) => {
                                            let style = '';
                                            {
                                                i % 2 === 0
                                                    ? (style = 'rgba(255, 255, 255, 0.08)')
                                                    : (style = 'black');
                                            }

                                            return (
                                                <Table.Row key={i} style={{ background: style }}>
                                                    <Table.Cell style={{ width: '250px' }} >
                                                        <div className={styles.nfts} style={{ marginTop: '10px' }}>
                                                            {defaultImgs.map((def, i) => {
                                                                if (row.currentDelegations && row.currentDelegations.length > i) {
                                                                    return (
                                                                        <div key={i} className={styles.nft}>
                                                                            <img src={`${row.currentDelegations[i].image}`} />
                                                                            <div className={styles.rank}> {row.currentDelegations[i].rank} </div>
                                                                            <div className={styles.bottomInfo}>
                                                                                +{row.currentDelegations[i].bonus}%
                                                                                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                } else {
                                                                    return (
                                                                        <div key={i} className={styles.nft}>
                                                                            <img src={`${def}`} />
                                                                            <div className={styles.bottomInfo} style={{ opacity: 0.6 }}>
                                                                                +0%
                                                                                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            })}
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell style={{ width: '200px' }} >
                                                        <div className={styles.dailyICE} style={{ textAlign: 'center' }}>
                                                            {Math.round(row.stats.avgIceEarned)}
                                                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell style={{ width: '200px' }} >
                                                        <div className={styles.iceEarned} style={{ textAlign: 'center' }}>
                                                            {Math.round(row.stats.totalIceEarned)}
                                                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell style={{ width: '150px' }} >
                                                        {row.stats.daysCheckedIn} of {row.stats.totalPossibleCheckIns}
                                                    </Table.Cell>
                                                    <Table.Cell style={{ width: '220px' }} >
                                                        {row.stats.totalChallengesCompleted} of {row.stats.totalChallengesAssigned}
                                                    </Table.Cell>
                                                    <Table.Cell style={{ width: '230px' }} >
                                                        <div className={styles.tier} style={{ textAlign: 'center' }}>
                                                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175017/cup_w68eni.png" alt="xp" />
                                                            {row.stats.avgLeaderboardTier + 5 <= 50 ?
                                                                `Top ${Math.round(row.stats.avgLeaderboardTier) + 5}%`
                                                                :
                                                                `Bottom ${100 - Math.round(row.stats.avgLeaderboardTier)}%`}
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell style={{ width: '170px' }} >
                                                        <Button className={styles.breakdown} onClick={() => setShowingBreakDown(i)}>See History</Button>
                                                    </Table.Cell>
                                                </Table.Row>
                                            );
                                        })}
                                    </Table.Body>
                                </Table>
                            </div>

                            
                        </div>
                        <div className={styles.more_wearable}>
                            <div className={styles.title}>
                                More Wearables. More Players.
                            </div>
                            <div className={styles.desc}>
                                Acquire more ICE Wearables to expand your roster of poker players.
                            </div>

                            <Button
                                className={styles.grey_button}
                                href="https://decentral.games/ice/marketplace"
                                target="_blank"
                            >
                                Browser Wearables
                            </Button>
                        </div>
                        </>
                        :
                        <div style={{ marginTop: '30px' }}>
                            <EmptyResultAnimation />
                        </div>
                : null}

            {
                showBreakDown !== -1 ? (
                    <ModalIceDelegationBreakDown
                        delegationBreakdown={delegations && delegations.length > 0 ? delegations[showBreakDown].breakdown : []}
                        setShowingBreakDown={setShowingBreakDown}
                    />
                ) : null
            }
        </section >
    )
}

export default Delegation
