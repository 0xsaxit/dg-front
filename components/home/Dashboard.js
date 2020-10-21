import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import ReactPageScroller from "react-page-scroller";
import Chateau from "./Chateau";
import Tominoya from "./Tominoya";
import Serenity from "./Serenity";


const Dashboard = () => {

  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <React.Fragment>

      {state.userStatus ? (
        <ReactPageScroller>
          <Chateau />
          <Tominoya />
          <Serenity />
        </ReactPageScroller>
      ) : (
        <Chateau />
      )}

    </React.Fragment>
  );
}

export default Dashboard;