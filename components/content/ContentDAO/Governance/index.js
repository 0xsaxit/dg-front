import cn from 'classnames';
import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from '../../../../store';
import { Loader, Popup, Icon, Button, Table } from 'semantic-ui-react';
import Aux from '../../../_Aux';
import styles from './Governance.module.scss';
import axios from 'axios';


const Governance = (props) => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [snapshotOne, setSnapshotOne] = useState([]);
  const [dateOne, setDateOne] = useState('');
  const [snapshotTwo, setSnapshotTwo] = useState([]);
  const [dateTwo, setDateTwo] = useState('');
  const [snapshotThree, setSnapshotThree] = useState([]);
  const [dateThree, setDateThree] = useState('');
  const [snapshotFour, setSnapshotFour] = useState([]);
  const [dateFour, setDateFour] = useState('');
  const [activeOne, setActiveOne] = useState('');
  const [activeTwo, setActiveTwo] = useState('');
  const [activeThree, setActiveThree] = useState('');
  const [activeFour, setActiveFour] = useState('');
  const [currentDate, setCurrentDate] = useState('');


  useEffect(() => {
    (async () => {
      const snapshotData = await axios.post(
        `https://hub.snapshot.page/graphql`,
        {
          query: `{
            proposals (
              first: 4,
              skip: 0,
              where: {
                space_in: ["decentralgames.eth"],
                state: ""
              },
              orderBy: "created",
              orderDirection: desc
            ) {
              id
              title
              body
              choices
              start
              end
              snapshot
              state
              author
              space {
                id
                name
              }
            }
          }`,
        }
      );

      setSnapshotOne(snapshotData.data.data.proposals[0]);
      setSnapshotTwo(snapshotData.data.data.proposals[1]);
      setSnapshotThree(snapshotData.data.data.proposals[2]);
      setSnapshotFour(snapshotData.data.data.proposals[3]);
    })();
  }, []);

  useEffect(() => {
    const temp = new Date(snapshotOne.end * 1000);
    setDateOne(temp.toDateString());

    const temp_two = new Date(snapshotTwo.end * 1000);
    setDateTwo(temp_two.toDateString());

    const temp_three = new Date(snapshotThree.end * 1000);
    setDateThree(temp_three.toDateString());

    const temp_four = new Date(snapshotFour.end * 1000);
    setDateFour(temp_four.toDateString());

    var today = new Date();
    
    if (temp < today) {
      setActiveOne(true);
    }

    if (temp_two < today) {
      setActiveTwo(true);
    }

    if (temp_three < today) {
      setActiveThree(true);
    }

    if (temp_four < today) {
      setActiveFour(true);
    }

  }, [snapshotOne, snapshotTwo, snapshotThree, snapshotFour, currentDate]);

  return (
    <Aux>

      <div style={{ paddingTop: "90px" }}> HELLO </div>
      <div className={styles.lower}>
        <p className={styles.lower_header_two}>
          Governance Proposals
        </p>

        <div className={styles.governance_container}>
          <div className={styles.state_box}>
            <p className={activeOne ? styles.state_closed : styles.state}>
              {snapshotOne.state}
            </p>
          </div>

          <div className={styles.gov_right}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p className={styles.gov_top}>
                {dateOne}
              </p>
              <p className={styles.gov_title}>
                {snapshotOne.title} 
              </p>
            </div>
            <svg style={{ alignSelf: 'center', marginLeft: '16px' }} width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977" stroke="white" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div className={styles.governance_container}>
          <div className={styles.state_box}>
            <p className={activeTwo ? styles.state_closed : styles.state}>
              {snapshotTwo.state}
            </p>
          </div>

          <div className={styles.gov_right}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p className={styles.gov_top}>
                {dateTwo}
              </p>
              <p className={styles.gov_title}>
                {snapshotTwo.title}
              </p>
            </div>
            <svg style={{ alignSelf: 'center', marginLeft: '16px' }} width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977" stroke="white" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div className={styles.governance_container}>
          <div className={styles.state_box}>
            <p className={activeThree ? styles.state_closed : styles.state}>
              {snapshotThree.state}
            </p>
          </div>

          <div className={styles.gov_right}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p className={styles.gov_top}>
                {dateThree}
              </p>
              <p className={styles.gov_title}>
                {snapshotThree.title}
              </p>
            </div>
            <svg style={{ alignSelf: 'center', marginLeft: '16px' }} width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977" stroke="white" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div className={styles.governance_container}>
          <div className={styles.state_box}>
            <p className={activeFour ? styles.state_closed : styles.state}>
              {snapshotFour.state}
            </p>
          </div>

          <div className={styles.gov_right}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p className={styles.gov_top}>
                {dateFour}
              </p>
              <p className={styles.gov_title}>
                {snapshotFour.title}
              </p>
            </div>
            <svg style={{ alignSelf: 'center', marginLeft: '16px' }} width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977" stroke="white" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div className={styles.button_span}>
          <Button className={styles.button_gov}>
            Discussion
          </Button>
          <Button className={styles.button_gov}>
            Proposals
          </Button>
        </div>
      </div>
    </Aux>
  );
}

export default Governance;