import React, { FC, ReactElement, useState, useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import { Table } from 'semantic-ui-react';
import FoxAnimation from 'components/lottieAnimation/animations/fox';
import StarAnimation from 'components/lottieAnimation/animations/star';
import NoResult from 'components/lottieAnimation/animations/noResult';
import styles from './Leaderboard.module.scss';

interface PersonalRecord {
  myScore: number;
  myRank: string;
}

export interface LeaderboardType {
  className?: string;
}

const Leaderboard: FC<LeaderboardType> = ({ className = '' }: LeaderboardType): ReactElement => {
  // get leaderboard data from the Context API store
  const [state] = useContext(GlobalContext);
  const [gameRecords, setGameRecords] = useState([]);
  const initialPersonalRecordState: PersonalRecord = {
    myScore: 0,
    myRank:  'N/A'
  };
  const [personalRecord, setPersonalRecord] = useState(initialPersonalRecordState);

  // define local variables
  const [time, setTime] = useState('Weekly');

  useEffect(() => {
    if (state.gameRecords && Object.keys(state.gameRecords).length !== 0) {
      if (time === 'Weekly') {
        setGameRecords(state.gameRecords.weekly.poker.chips);
        setPersonalRecord(state.gameRecords.weekly.poker.personalChipsData);
      } else if (time === 'Monthly') {
        setGameRecords(state.gameRecords.monthly.poker.chips);
        setPersonalRecord(state.gameRecords.monthly.poker.personalChipsData);
      } else {
        setGameRecords(state.gameRecords.all.poker.chips);
        setPersonalRecord(state.gameRecords.all.poker.personalChipsData);
      }
    }
  }, [state.gameRecords, time]);

  return (
    <div className={`ice-leaderboard component ${className} ${styles.main_wrapper}`}>
      {!state.userStatus ? (
        <FoxAnimation />
      ) : (
        <>
          <div className={styles.title}>
            <h1>ICE Poker Leaderboard</h1>
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

          <div className={styles.user_div}>
            <div className={styles.rank}>
              <abbr>{personalRecord.myRank}</abbr>
            </div>
            <div className={styles.user_info}>
              <img src={`https://events.decentraland.org/api/profile/${state.userAddress}/face.png`} alt="avatar" />
              <abbr>{state.userInfo.name === null || state.userInfo.name === '' ? 'Unnamed' : state.userInfo.name}</abbr>
            </div>
            <div className={styles.winnings}>
              <abbr>{(Number(personalRecord.myScore) / 1000000000000000000).toFixed(0).toLocaleString()}</abbr>
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1635212177/FREE_Coin_c08hyk.png" alt="ice" />
            </div>
          </div>

          <div className={styles.table}>
            <Table fixed unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Player</Table.HeaderCell>
                  <Table.HeaderCell>Total CHIP Winnings</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>

            {gameRecords && gameRecords.length > 0 ? (
              <Table fixed unstackable>
                <Table.Body>
                  {gameRecords.map((row, i) => {
                    let style = '';

                    {
                      i % 2 === 0 ? (style = 'rgba(255, 255, 255, 0.08)') : (style = 'black');
                    }

                    return (
                      <Table.Row key={i} style={{ background: style }}>
                        <Table.Cell className={styles.user_info}>
                          {row.address === state.userAddress ? <StarAnimation /> : null}
                          <abbr>{i + 1}</abbr>
                          <img src={row.imageURL} alt="avatar" />
                          <abbr className={row.address === state.userAddress ? styles.active : null}>{row.name}</abbr>
                        </Table.Cell>
                        <Table.Cell className={styles.winnings}>
                          <abbr>{(Number(row.winnings) / 1000000000000000000).toFixed(0).toLocaleString()}</abbr>
                          <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1635212177/FREE_Coin_c08hyk.png" alt="ice" />
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            ) : (
              <NoResult />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
