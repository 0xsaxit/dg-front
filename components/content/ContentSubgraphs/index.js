// import axios from 'axios';
// import { useState, useEffect, useContext } from 'react';
// import { GlobalContext } from 'store/index';
import styles from './ContentSubgraphs.module.scss';
// import Aux from 'components/_Aux';

const ContentAccount = (props) => {
  // ... the Context API store
  // const [state, dispatch] = useContext(GlobalContext);

  // define local variables

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentTreasury() {
    return (
      <div className="account-other-inner-p" style={{ paddingTop: '20px' }}>
        {props.subgraphData.map((data, i) => (
          <p className={styles.referrals_header_subtitle} key={i}>
            {data.displayName}
          </p>
        ))}
      </div>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  if (props.content === 'treasury') {
    return contentTreasury();
  } else if (props.content === 'wearables') {
    return contentPointer();
  }
};

export default ContentAccount;
