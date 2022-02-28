import React, { FC, ReactElement, useContext, useEffect, useRef, useState } from 'react';
import AutosizeInput from 'react-input-autosize';
import { get, isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { GlobalContext } from '@/store';
import { Button, Table } from 'semantic-ui-react';
import ModalIceDelegationBreakDown from 'components/modal/ModalIceDelegationBreakDown';
import FoxAnimation from 'components/lottieAnimation/animations/fox';
import HourglassAnimation from 'components/lottieAnimation/animations/hourglass';
import EmptyResultAnimation from 'components/lottieAnimation/animations/emptyResult';
import WearableButton from 'components/common/cards/ICEWearableCard/WearableButton';
import Fetch from 'common/Fetch';
import styles from './Delegation.module.scss';
import cn from 'classnames';

enum DelegationStates {
  All = 'All Delegates',
  Active = 'Active Delegates',
  Past = 'Past Delegates'
}

enum TimePeriods {
  Weekly = 'week',
  Monthly = 'month',
  All = 'all'
}

export interface DelegationDashboardType {
  className?: string;
}

const DelegationDashboard: FC<DelegationDashboardType> = ({ className = '' }: DelegationDashboardType): ReactElement => {
  // get delegation data from the Context API store
  const [state, dispatch] = useContext<any>(GlobalContext);
  const router = useRouter();


  // define local variables
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState(TimePeriods.Weekly);
  const [showBreakDown, setShowingBreakDown] = useState(-1);
  const [rawDelegations, setRawDelegations] = useState([]);
  const [filteredDelegations, setFilteredDelegations] = useState([]);
  const [sortingName, setSortingName] = useState('dailyICE');
  const [sortingOrder, setSortingOrder] = useState('dec');
  const [multiplierMap, setMultiplierMap] = useState([]);
  const [title, setTitle] = useState('Your Guild');
  const [isEditingTitle, saveIsEditingTitle] = useState(false);
  const [pastTitle, savePastTitle] = useState(null);
  const [editingNickNameIndex, saveEditingNickNameIndex] = useState(-1);
  const [pastNickName, savePastNickName] = useState({ index: -1, value: null });
  const [delegationStatusFilter, setDelegationStatusFilter] = useState(null);

  useEffect(() => {
    const fetchGuildName = async (): Promise<void> => {
      const { guildName } = await Fetch.PLAYER_INFO(state.userAddress);

      setTitle(guildName ? guildName : 'Your Guild');
      savePastTitle(guildName ? guildName : 'Your Guild');
    };
    const fetchLeaderboardMultiplerMap = async (): Promise<void> => {
      const { leaderboardMultiplierMap } = await Fetch.GET_REWARDS_CONFIG();

      setMultiplierMap(leaderboardMultiplierMap);
    };

    fetchGuildName();
    fetchLeaderboardMultiplerMap();
  }, []);

  useEffect(() => {
    (async (): Promise<void> => {
      if (state.userLoggedIn) {
        setIsLoading(true);

        let period: string;

        if (time === TimePeriods.Weekly) {
          period = TimePeriods.Weekly;
        } else if (time === TimePeriods.Monthly) {
          period = TimePeriods.Monthly;
        } else {
          period = TimePeriods.All;
        }
        
        try {
        // Get Delegation Breakdown from the API
          const response = await Fetch.DELEGATION_BREAKDOWN(period);
          const iceWearableItems = await Fetch.GET_WEARABLE_INVENTORY(state.userAddress);
          const undelegatedItems = iceWearableItems.filter(item => !get(item, 'delegationStatus.delegatedTo', null)).map(item => {
            return {
              currentDelegations: [item],
              stats: {},
              noSeeHistory: true
            }
          });

          if (response && response.length > 0) {
            response.sort(function (a, b) {
              return b.stats.avgIceEarned - a.stats.avgIceEarned;
            });

              for (let i = 0; i < response.length; i++) {
                response[i].breakdown.sort(function (a, b) {
                  return Number(new Date(b.gameplayDay)) - Number(new Date(a.gameplayDay));
                });

                for (let i = 0; i < response.length; i++) {
                  response[i].breakdown.sort(function (a, b) {
                    return Number(new Date(b.gameplayDay)) - Number(new Date(a.gameplayDay));
                  });
                }
              }

              const delegationData = response && response.length > 0 ? response : [];

            // Used for display
            setFilteredDelegations([...delegationData, ...undelegatedItems]);

            // Used as the raw source for filtering
            setRawDelegations([...delegationData, ...undelegatedItems]);

            // Default filter status
            setDelegationStatusFilter(DelegationStates.Active);
            
          }
        } catch(error) {
            console.log("Error fetching delegation info: " +error)
            
            dispatch({
                type: 'show_toastMessage',
                data: 'Error fetching delegation info, please try again.',
            });
        }
        // Get Delegation Breakdown from the API

        setIsLoading(false);
      }
    })();
  }, [state.userLoggedIn, time]);

  useEffect(() => {
    /* Delegate Filtering needs to happen before the Sorting hook */
    let filteredDelegations;

    if (delegationStatusFilter === DelegationStates.All) {
      filteredDelegations = rawDelegations;
    } else if (delegationStatusFilter === DelegationStates.Active) {
      filteredDelegations = rawDelegations.filter(data => data.currentDelegations.length > 0);
    } else if (delegationStatusFilter === DelegationStates.Past) {
      filteredDelegations = rawDelegations.filter(data => data.currentDelegations.length === 0);
    }

    setFilteredDelegations(filteredDelegations);

    /* Sorting needs to happen after Delegate Filtering hook */
    
    const orderingData = [].concat(filteredDelegations);

    if (orderingData && orderingData.length > 0) {
      orderingData.sort(function (a, b) {
        if (sortingName === 'dailyICE') {
          if (!isEmpty(a.stats)) {
            return sortingOrder === 'dec' ? b.stats.avgIceEarned - a.stats.avgIceEarned : a.stats.avgIceEarned - b.stats.avgIceEarned;
          } else {
            return sortingOrder === 'dec' ? 100000 : -100000;
          }
        } else if (sortingName === 'iceEarned') {
          if (!isEmpty(a.stats)) {
            return sortingOrder === 'dec' ? b.stats.totalIceEarned - a.stats.totalIceEarned : a.stats.totalIceEarned - b.stats.totalIceEarned;
          } else {
            return sortingOrder === 'dec' ? 100000 : -100000; 
          }
        } else if (sortingName === 'daysCheckedIn') {
          if (!isEmpty(a.stats)) {
            return sortingOrder === 'dec' ? b.stats.daysCheckedIn - a.stats.daysCheckedIn : a.stats.daysCheckedIn - b.stats.daysCheckedIn;
          } else {
            return sortingOrder === 'dec' ? 100000 : -100000;
          }
        } else if (sortingName === 'totalChallengesCompleted') {
          if (!isEmpty(a.stats)) {
            return sortingOrder === 'dec' ? b.stats.totalChallengesCompleted - a.stats.totalChallengesCompleted : a.stats.totalChallengesCompleted - b.stats.totalChallengesCompleted;
          } else {
            return sortingOrder === 'dec' ? 100000 : -100000;
          }
        } else if (sortingName === 'avgLeaderboardTier' || sortingName === 'avgLeaderboardMultiplier') {
          if (!isEmpty(a.stats)) {
            return sortingOrder === 'inc' ? b.stats.avgLeaderboardTier - a.stats.avgLeaderboardTier : a.stats.avgLeaderboardTier - b.stats.avgLeaderboardTier;
          } else {
            return sortingOrder === 'inc' ? -100000 : 100000;
          }
        }
      });
    }
  }, [sortingName, sortingOrder, delegationStatusFilter]);

  const defaultImgs = [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png'
  ];
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<AutosizeInput>(null);
  const nickNameRef = useRef<HTMLDivElement>(null);
  const nickNameInputRef = useRef<AutosizeInput>(null);

  function tableHeaderClicked(name): void {
    if (sortingName !== name) {
      setSortingName(name);
      setSortingOrder('dec');
    } else {
      setSortingOrder(sortingOrder === 'dec' ? 'inc' : 'dec');
    }
  }

  function handleEditTitleClick(): void {
    if (!isEditingTitle) {
      saveIsEditingTitle(true);
      savePastTitle(title);
      setTitle(title);

      setTimeout(() => {
        titleInputRef.current.input.focus();
      }, 200);
    }
  }

  function updateDelegationName(index, nickname): void {
    const tempDelegations = [].concat(filteredDelegations);

    tempDelegations[index].nickname = nickname;
    setFilteredDelegations(tempDelegations);
  }

  async function handleEditNickNameClick(index: number, nickName): Promise<void> {
    if (editingNickNameIndex !== index) {
      saveEditingNickNameIndex(index);

      if (pastNickName.index !== index) {
        savePastNickName({
          index: index,
          value: nickName ?? ''
        });
      }

      updateDelegationName(index, nickName);

      setTimeout(() => {
        nickNameInputRef.current.input.focus();
      }, 200);
    }
  }

  async function saveUpdatedTitle(): Promise<void> {
    saveIsEditingTitle(false);

    if (!title) {
      setTitle(pastTitle);
    } else if (title !== pastTitle) {
      await Fetch.EDIT_DELEGATION_GUILDNAME(title);
      savePastTitle(title);
    }
  }

  async function saveUpdatedNickName(): Promise<void> {
    if (!filteredDelegations[editingNickNameIndex].nickname) {
      updateDelegationName(editingNickNameIndex, pastNickName.value);
    } else {
      await Fetch.EDIT_DELEGATION_NICKNAME(filteredDelegations[editingNickNameIndex].nickname, filteredDelegations[editingNickNameIndex].address);
    }

    saveEditingNickNameIndex(-1);
    savePastNickName({
      index: -1,
      value: null
    });
  }

  function nickNameInfo(delegation, index): ReactElement {
    const nickName =
      delegation.nickname !== delegation.address || editingNickNameIndex === index
        ? delegation.nickname !== delegation.address
          ? delegation.nickname
          : ''
        : delegation.address.substr(0, 5) + '...' + delegation.address.substr(delegation.address.length - 4, delegation.address.length);

    return (
      <div className={styles.nickNameDiv} ref={index === editingNickNameIndex ? nickNameRef : null}>
        {index === editingNickNameIndex ? (
          <AutosizeInput
            ref={nickNameInputRef}
            name="nick-name"
            value={nickName}
            onChange={e => {
              updateDelegationName(index, e.target.value);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                saveUpdatedNickName();
              }
            }}
            onBlur={() => {
              saveUpdatedNickName();
            }}
            disabled={index !== editingNickNameIndex}
          />
        ) : (
          <h1 onClick={() => setShowingBreakDown(index)}>{nickName.length > 12 ? nickName.substr(0, 10) + '...' : nickName}</h1>
        )}
        {state.userStatus >= 28 && (
          <img
            className={styles.edit}
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1643126922/edit_p53oml.png"
            alt="edit"
            onClick={() => {
              handleEditNickNameClick(index, nickName);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <section className={`delegation-dashboard component ${className}`}>
      {(() => {
        // Filtering Options
        if (!state.userLoggedIn) {
          return <div className={styles.main_wrapper}>{<FoxAnimation />}</div>;
        } else {
          return (
            <div className={styles.main_wrapper}>
              <>
                <div className={styles.title} ref={titleRef}>
                  {isEditingTitle ? (
                    <AutosizeInput
                      ref={titleInputRef}
                      name="title"
                      value={title}
                      onChange={e => {
                        setTitle(e.target.value);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          saveUpdatedTitle();
                        }
                      }}
                      onBlur={() => {
                        saveUpdatedTitle();
                      }}
                      disabled={!isEditingTitle}
                    />
                  ) : (
                    <h1>{title.length > 24 ? title.substr(0, 24) + '...' : title}</h1>
                  )}
                  {state.userStatus >= 28 && (
                    <img
                      className={styles.edit}
                      src="https://res.cloudinary.com/dnzambf4m/image/upload/v1643126922/edit_p53oml.png"
                      alt="edit"
                      onClick={() => {
                        handleEditTitleClick();
                      }}
                    />
                  )}
                </div>

                {/* Filter by Timeline */}
                <div className={cn(styles.filter_pills, styles.timeline)}>
                  <div
                    className={time === TimePeriods.Weekly ? styles.active : null}
                    onClick={() => {
                      setTime(TimePeriods.Weekly);
                    }}
                  >
                    Weekly
                  </div>
                  <div
                    className={time === TimePeriods.Monthly ? styles.active : null}
                    onClick={() => {
                      setTime(TimePeriods.Monthly);
                    }}
                  >
                    Monthly
                  </div>
                  <div
                    className={time === TimePeriods.All ? styles.active : null}
                    onClick={() => {
                      setTime(TimePeriods.All);
                    }}
                  >
                    All Time
                  </div>
                </div>

                {/* Filter by Active Delegation Status */}
                {(() => {
                  if (state.userStatus >= 28) {
                    return (
                      <div className={cn(styles.filter_pills, styles.delegation_status)}>
                        <div
                          className={delegationStatusFilter === DelegationStates.Active ? styles.active : null}
                          onClick={() => {
                            setDelegationStatusFilter(DelegationStates.Active);
                          }}
                        >
                          {DelegationStates.Active}
                        </div>
                        <div
                          className={delegationStatusFilter === DelegationStates.Past ? styles.active : null}
                          onClick={() => {
                            setDelegationStatusFilter(DelegationStates.Past);
                          }}
                        >
                          {DelegationStates.Past}
                        </div>
                        <div
                          className={delegationStatusFilter === DelegationStates.All ? styles.active : null}
                          onClick={() => {
                            setDelegationStatusFilter(DelegationStates.All);
                          }}
                        >
                          {DelegationStates.All}
                        </div>
                      </div>
                    );
                  }
                })()}
              </>
            </div>
          );
        }
      })()}

      {(() => {
        // Table Data
        if (state.userLoggedIn) {
          if (isLoading) {
            return (
              <div style={{ marginTop: '120px' }}>
                <HourglassAnimation />
              </div>
            );
          } else {
            if (filteredDelegations && filteredDelegations.length > 0) {
              return (
                <>
                  <div className={styles.delegation_table}>
                    <div className={styles.fixed}>
                      <Table fixed unstackable>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell style={{ width: '50px' }} />
                            <Table.HeaderCell style={{ width: '300px' }}>Player Address</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>

                        <Table.Body>
                          {filteredDelegations.map((row, i) => {
                            let style;

                            {
                              if (i % 2 === 0) {
                                style = 'rgba(255, 255, 255, 0.08)';
                              } else {
                                style = 'black';
                              }
                            }

                            return (
                              <Table.Row key={i} style={{ background: style }}>
                                <Table.Cell style={{ width: '50px' }}>{i + 1}</Table.Cell>
                                <Table.Cell className={styles.user_info}>
                                  {row.address ? (
                                    <section>
                                      <img src={row.imageURL} onClick={() => setShowingBreakDown(i)} alt="avatar" />
                                      {row.currentDelegations.some(delegation => delegation.checkInStatus) && (
                                        <img
                                          className={styles.check_in}
                                          src="https://res.cloudinary.com/dnzambf4m/image/upload/v1627301200/Green_Check_iahexg.png"
                                          alt="check in"
                                        />
                                      )}
                                      {nickNameInfo(row, i)}
                                    </section>
                                  ) : (
                                    <WearableButton item={row.currentDelegations[0]} />
                                  )}
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
                            <Table.HeaderCell style={{ width: '250px' }}>NFTs Delegated</Table.HeaderCell>
                            <Table.HeaderCell style={{ width: '200px' }} onClick={() => tableHeaderClicked('dailyICE')}>
                              Avg.Daily ICE
                              <svg
                                style={{ opacity: `${sortingName === 'dailyICE' ? 1 : 0}` }}
                                className={sortingOrder === 'inc' ? styles.inc : styles.dec}
                                width="13"
                                height="16"
                                viewBox="0 0 13 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6.49219 0.875C5.78906 0.875 5.32031 1.36719 5.32031 2.09375V10.6016L5.39062 12.2969L3.92188 10.5938L2.14062 8.8125C1.92969 8.60156 1.65625 8.44531 1.30469 8.44531C0.671875 8.44531 0.1875 8.90625 0.1875 9.57812C0.1875 9.88281 0.3125 10.1719 0.554688 10.4219L5.625 15.5C5.84375 15.7188 6.17188 15.8516 6.49219 15.8516C6.8125 15.8516 7.14062 15.7188 7.35938 15.5L12.4375 10.4219C12.6797 10.1719 12.8047 9.88281 12.8047 9.57812C12.8047 8.90625 12.3203 8.44531 11.6875 8.44531C11.3359 8.44531 11.0625 8.60156 10.8438 8.8125L9.0625 10.5938L7.59375 12.2969L7.67188 10.6016V2.09375C7.67188 1.36719 7.19531 0.875 6.49219 0.875Z"
                                  fill="white"
                                />
                              </svg>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{ width: '200px' }} onClick={() => tableHeaderClicked('iceEarned')}>
                              Total ICE Earned
                              <svg
                                style={{ opacity: `${sortingName === 'iceEarned' ? 1 : 0}` }}
                                className={sortingOrder === 'inc' ? styles.inc : styles.dec}
                                width="13"
                                height="16"
                                viewBox="0 0 13 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6.49219 0.875C5.78906 0.875 5.32031 1.36719 5.32031 2.09375V10.6016L5.39062 12.2969L3.92188 10.5938L2.14062 8.8125C1.92969 8.60156 1.65625 8.44531 1.30469 8.44531C0.671875 8.44531 0.1875 8.90625 0.1875 9.57812C0.1875 9.88281 0.3125 10.1719 0.554688 10.4219L5.625 15.5C5.84375 15.7188 6.17188 15.8516 6.49219 15.8516C6.8125 15.8516 7.14062 15.7188 7.35938 15.5L12.4375 10.4219C12.6797 10.1719 12.8047 9.88281 12.8047 9.57812C12.8047 8.90625 12.3203 8.44531 11.6875 8.44531C11.3359 8.44531 11.0625 8.60156 10.8438 8.8125L9.0625 10.5938L7.59375 12.2969L7.67188 10.6016V2.09375C7.67188 1.36719 7.19531 0.875 6.49219 0.875Z"
                                  fill="white"
                                />
                              </svg>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{ width: '150px' }} onClick={() => tableHeaderClicked('daysCheckedIn')}>
                              Check-Ins
                              <svg
                                style={{ opacity: `${sortingName === 'daysCheckedIn' ? 1 : 0}` }}
                                className={sortingOrder === 'inc' ? styles.inc : styles.dec}
                                width="13"
                                height="16"
                                viewBox="0 0 13 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6.49219 0.875C5.78906 0.875 5.32031 1.36719 5.32031 2.09375V10.6016L5.39062 12.2969L3.92188 10.5938L2.14062 8.8125C1.92969 8.60156 1.65625 8.44531 1.30469 8.44531C0.671875 8.44531 0.1875 8.90625 0.1875 9.57812C0.1875 9.88281 0.3125 10.1719 0.554688 10.4219L5.625 15.5C5.84375 15.7188 6.17188 15.8516 6.49219 15.8516C6.8125 15.8516 7.14062 15.7188 7.35938 15.5L12.4375 10.4219C12.6797 10.1719 12.8047 9.88281 12.8047 9.57812C12.8047 8.90625 12.3203 8.44531 11.6875 8.44531C11.3359 8.44531 11.0625 8.60156 10.8438 8.8125L9.0625 10.5938L7.59375 12.2969L7.67188 10.6016V2.09375C7.67188 1.36719 7.19531 0.875 6.49219 0.875Z"
                                  fill="white"
                                />
                              </svg>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{ width: '220px' }} onClick={() => tableHeaderClicked('totalChallengesCompleted')}>
                              Finished Challenges
                              <svg
                                style={{ opacity: `${sortingName === 'totalChallengesCompleted' ? 1 : 0}` }}
                                className={sortingOrder === 'inc' ? styles.inc : styles.dec}
                                width="13"
                                height="16"
                                viewBox="0 0 13 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6.49219 0.875C5.78906 0.875 5.32031 1.36719 5.32031 2.09375V10.6016L5.39062 12.2969L3.92188 10.5938L2.14062 8.8125C1.92969 8.60156 1.65625 8.44531 1.30469 8.44531C0.671875 8.44531 0.1875 8.90625 0.1875 9.57812C0.1875 9.88281 0.3125 10.1719 0.554688 10.4219L5.625 15.5C5.84375 15.7188 6.17188 15.8516 6.49219 15.8516C6.8125 15.8516 7.14062 15.7188 7.35938 15.5L12.4375 10.4219C12.6797 10.1719 12.8047 9.88281 12.8047 9.57812C12.8047 8.90625 12.3203 8.44531 11.6875 8.44531C11.3359 8.44531 11.0625 8.60156 10.8438 8.8125L9.0625 10.5938L7.59375 12.2969L7.67188 10.6016V2.09375C7.67188 1.36719 7.19531 0.875 6.49219 0.875Z"
                                  fill="white"
                                />
                              </svg>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{ width: '200px' }} onClick={() => tableHeaderClicked('totalNetChipsScore')}>
                              Net Chips Score
                              <svg
                                style={{ opacity: `${sortingName === 'totalNetChipsScore' ? 1 : 0}` }}
                                className={sortingOrder === 'inc' ? styles.inc : styles.dec}
                                width="13"
                                height="16"
                                viewBox="0 0 13 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6.49219 0.875C5.78906 0.875 5.32031 1.36719 5.32031 2.09375V10.6016L5.39062 12.2969L3.92188 10.5938L2.14062 8.8125C1.92969 8.60156 1.65625 8.44531 1.30469 8.44531C0.671875 8.44531 0.1875 8.90625 0.1875 9.57812C0.1875 9.88281 0.3125 10.1719 0.554688 10.4219L5.625 15.5C5.84375 15.7188 6.17188 15.8516 6.49219 15.8516C6.8125 15.8516 7.14062 15.7188 7.35938 15.5L12.4375 10.4219C12.6797 10.1719 12.8047 9.88281 12.8047 9.57812C12.8047 8.90625 12.3203 8.44531 11.6875 8.44531C11.3359 8.44531 11.0625 8.60156 10.8438 8.8125L9.0625 10.5938L7.59375 12.2969L7.67188 10.6016V2.09375C7.67188 1.36719 7.19531 0.875 6.49219 0.875Z"
                                  fill="white"
                                />
                              </svg>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{ width: '230px' }} onClick={() => tableHeaderClicked('avgLeaderboardTier')}>
                              Avg.Leaderboard Tier
                              <svg
                                style={{ opacity: `${sortingName === 'avgLeaderboardTier' ? 1 : 0}` }}
                                className={sortingOrder === 'inc' ? styles.inc : styles.dec}
                                width="13"
                                height="16"
                                viewBox="0 0 13 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6.49219 0.875C5.78906 0.875 5.32031 1.36719 5.32031 2.09375V10.6016L5.39062 12.2969L3.92188 10.5938L2.14062 8.8125C1.92969 8.60156 1.65625 8.44531 1.30469 8.44531C0.671875 8.44531 0.1875 8.90625 0.1875 9.57812C0.1875 9.88281 0.3125 10.1719 0.554688 10.4219L5.625 15.5C5.84375 15.7188 6.17188 15.8516 6.49219 15.8516C6.8125 15.8516 7.14062 15.7188 7.35938 15.5L12.4375 10.4219C12.6797 10.1719 12.8047 9.88281 12.8047 9.57812C12.8047 8.90625 12.3203 8.44531 11.6875 8.44531C11.3359 8.44531 11.0625 8.60156 10.8438 8.8125L9.0625 10.5938L7.59375 12.2969L7.67188 10.6016V2.09375C7.67188 1.36719 7.19531 0.875 6.49219 0.875Z"
                                  fill="white"
                                />
                              </svg>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{ width: '260px' }} onClick={() => tableHeaderClicked('avgLeaderboardMultiplier')}>
                              Avg.Leaderboard Multiplier
                              <svg
                                style={{ opacity: `${sortingName === 'avgLeaderboardMultiplier' ? 1 : 0}` }}
                                className={sortingOrder === 'inc' ? styles.inc : styles.dec}
                                width="13"
                                height="16"
                                viewBox="0 0 13 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6.49219 0.875C5.78906 0.875 5.32031 1.36719 5.32031 2.09375V10.6016L5.39062 12.2969L3.92188 10.5938L2.14062 8.8125C1.92969 8.60156 1.65625 8.44531 1.30469 8.44531C0.671875 8.44531 0.1875 8.90625 0.1875 9.57812C0.1875 9.88281 0.3125 10.1719 0.554688 10.4219L5.625 15.5C5.84375 15.7188 6.17188 15.8516 6.49219 15.8516C6.8125 15.8516 7.14062 15.7188 7.35938 15.5L12.4375 10.4219C12.6797 10.1719 12.8047 9.88281 12.8047 9.57812C12.8047 8.90625 12.3203 8.44531 11.6875 8.44531C11.3359 8.44531 11.0625 8.60156 10.8438 8.8125L9.0625 10.5938L7.59375 12.2969L7.67188 10.6016V2.09375C7.67188 1.36719 7.19531 0.875 6.49219 0.875Z"
                                  fill="white"
                                />
                              </svg>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{ width: '170px' }}>History</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>

                        <Table.Body>
                          {filteredDelegations.map((row, i) => {
                            let style;

                            {
                              if (i % 2 === 0) {
                                style = 'rgba(255, 255, 255, 0.08)';
                              } else {
                                style = 'black';
                              }
                            }

                            return (
                              <Table.Row key={i} style={{ background: style }}>
                                {/* NFTs Delegated */}
                                <Table.Cell style={{ width: '250px' }}>
                                  <div className={styles.nfts} style={{ marginTop: '10px' }}>
                                    {defaultImgs.map((def, i) => {
                                      if (row.currentDelegations && row.currentDelegations.length > i) {
                                        return (
                                          <div key={i} className={styles.nft}>
                                            <img src={`${row.currentDelegations[i].image}`} />
                                            <div className={styles.rank}> {row.currentDelegations[i].rank} </div>
                                            <div className={styles.bottomInfo}>
                                              +{row.currentDelegations[i].bonus}%
                                              <img
                                                src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg"
                                                alt="ice"
                                              />
                                            </div>
                                          </div>
                                        );
                                      } else {
                                        return (
                                          <div key={i} className={styles.nft}>
                                            <img src={`${def}`} />
                                            <div className={styles.bottomInfo} style={{ opacity: 0.6 }}>
                                              +0%
                                              <img
                                                src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg"
                                                alt="ice"
                                              />
                                            </div>
                                          </div>
                                        );
                                      }
                                    })}
                                  </div>
                                </Table.Cell>

                                {/* Avg.Daily ICE */}
                                <Table.Cell style={{ width: '200px' }}>
                                  {row.stats.avgIceEarned !== undefined ? (
                                    <div className={styles.dailyICE} style={{ textAlign: 'center' }}>
                                      {Math.round(row.stats.avgIceEarned)}
                                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                                    </div>
                                  ) : (
                                    <div className={styles.dailyICE} style={{ textAlign: 'center' }}>
                                      - -
                                    </div>
                                  )}
                                </Table.Cell>

                                {/* Total ICE Earned */}
                                <Table.Cell style={{ width: '200px' }}>
                                  {row.stats.totalIceEarned !== undefined ? (
                                    <div className={styles.iceEarned} style={{ textAlign: 'center' }}>
                                      {Math.round(row.stats.totalIceEarned)}
                                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                                    </div>
                                  ) : (
                                    <div className={styles.iceEarned} style={{ textAlign: 'center' }}>
                                      - -
                                    </div>
                                  )}
                                </Table.Cell>

                                {/* Check-Ins */}
                                <Table.Cell style={{ width: '150px' }}>
                                  {row.stats.daysCheckedIn !== undefined && row.stats.totalPossibleCheckIns !== undefined ? (
                                    <>
                                      {row.stats.daysCheckedIn} of {row.stats.totalPossibleCheckIns}
                                    </>
                                  ) : (
                                    <>- -</>
                                  )}
                                </Table.Cell>

                                {/* Finished Challenges */}
                                <Table.Cell style={{ width: '220px' }}>
                                  {row.stats.totalChallengesCompleted !== undefined && row.stats.totalChallengesAssigned !== undefined ? (
                                    <>
                                      {row.stats.totalChallengesCompleted} of {row.stats.totalChallengesAssigned}
                                    </>
                                  ) : (
                                    <>- -</>
                                  )}
                                </Table.Cell>

                                {/* Net Chips Score */}
                                <Table.Cell style={{ width: '200px' }}>
                                  {row.stats.totalChipsEarned !== undefined ? (
                                    <div className={styles.netChipsScore} style={{ textAlign: 'center' }}>
                                      {row.stats.totalChipsEarned ? row.stats.totalChipsEarned : '- -'}
                                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1635212177/FREE_Coin_c08hyk.png" alt="ice" />
                                    </div>
                                  ) : (
                                    <div className={styles.netChipsScore} style={{ textAlign: 'center' }}>
                                      - -
                                    </div>
                                  )}
                                </Table.Cell>

                                {/* Avg.Leaderboard Tier */}
                                <Table.Cell style={{ width: '230px' }}>
                                  {row.stats.avgLeaderboardTier !== undefined ? (
                                    <div className={styles.tier} style={{ textAlign: 'center' }}>
                                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175017/cup_w68eni.png" alt="xp" />
                                      {row.stats.avgLeaderboardTier + 5 <= 50
                                        ? `Top ${Math.round(row.stats.avgLeaderboardTier) + 5}%`
                                        : `Bottom ${100 - Math.round(row.stats.avgLeaderboardTier)}%`}
                                    </div>
                                  ) : (
                                    <div className={styles.tier} style={{ textAlign: 'center' }}>
                                      - -
                                    </div>
                                  )}
                                </Table.Cell>

                                {/* Avg.Leaderboard Multiplier */}
                                <Table.Cell style={{ width: '260px' }}>
                                  {row.stats.avgLeaderboardTier !== undefined && !!multiplierMap.length ? (
                                    <div className={styles.tier} style={{ textAlign: 'center' }}>
                                      {!!multiplierMap.length && multiplierMap[Math.floor(row.stats.avgLeaderboardTier / 5)]}x
                                    </div>
                                  ) : (
                                    <div className={styles.tier} style={{ textAlign: 'center' }}>
                                      - -
                                    </div>
                                  )}
                                </Table.Cell>

                                {/* History */}
                                <Table.Cell style={{ width: '170px' }}>
                                  {!row.noSeeHistory ? (
                                    <Button className={styles.breakdown} onClick={() => setShowingBreakDown(i)}>
                                      See History
                                    </Button>
                                  ) : (
                                    <></>
                                  )}
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                        </Table.Body>
                      </Table>
                    </div>
                  </div>
                  <div className={styles.more_wearable}>
                    <div className={styles.title}>More Wearables. More Players.</div>
                    <div className={styles.desc}>Acquire more ICE Wearables to expand your roster of poker players.</div>

                    <Button className={styles.grey_button} href="/ice/marketplace">
                      Browse Wearables
                    </Button>
                  </div>
                </>
              );
            } else {
              return (
                <div style={{ marginTop: '30px' }}>
                  <EmptyResultAnimation />
                </div>
              );
            }
          }
        }
      })()}

      {(() => {
        if (showBreakDown !== -1) {
          return (
            <ModalIceDelegationBreakDown
              playerAddress={filteredDelegations && filteredDelegations.length > 0 ? filteredDelegations[showBreakDown].address : ''}
              delegationBreakdown={filteredDelegations && filteredDelegations.length > 0 ? filteredDelegations[showBreakDown].breakdown : []}
              setShowingBreakDown={setShowingBreakDown}
            />
          );
        } else {
          return null;
        }
      })()}
    </section>
  );
};

export default DelegationDashboard;
