// import { useState, useEffect, useContext } from 'react';
// import { GlobalContext } from '../../store';
import Link from 'next/link';
import { Divider } from 'semantic-ui-react';
import ContentIntelligence from '../content/ContentIntelligence';

const Intelligence = (props) => {
  // get user's NFT data from the Context API store
  // const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const dashboard = props.dashboard;

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // tab select area
  function submenu() {
    return (
      <div>
        <div className="account-other-tabs" style={{ paddingBottom: '9px' }}>
          {dashboard === 'server' ? (
            <p className="account-other-p" style={{ width: '100%' }}>
              <span className="account-hover active">
                <b>SERVER</b>
              </span>
              <Link href="/intel/website">
                <span className="account-hover">
                  <b>WEBSITE</b>
                </span>
              </Link>
              <Link href="/intel/decentraland">
                <span className="account-hover">
                  <b>DECENTRALAND</b>
                </span>
              </Link>
            </p>
          ) : dashboard === 'website' ? (
            <p className="account-other-p" style={{ width: '100%' }}>
              <Link href="/intel">
                <span className="account-hover">
                  <b>SERVER</b>
                </span>
              </Link>
              <span className="account-hover active">
                <b>WEBSITE</b>
              </span>
              <Link href="/intel/decentraland">
                <span className="account-hover">
                  <b>DECENTRALAND</b>
                </span>
              </Link>
            </p>
          ) : dashboard == 'decentraland' ? (
            <p className="account-other-p" style={{ width: '100%' }}>
              <Link href="/intel">
                <span className="account-hover">
                  <b>SERVER</b>
                </span>
              </Link>
              <Link href="/intel/website">
                <span className="account-hover">
                  <b>WEBSITE</b>
                </span>
              </Link>
              <span className="account-hover active">
                <b>DECENTRALAND</b>
              </span>
            </p>
          ) : null}
        </div>

        <Divider className="tab-divider" style={{ paddingTop: '21px' }} />
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="page-container">
        <div className="account-other-inner-container">
          {submenu()}

          <ContentIntelligence dashboard={dashboard} />
        </div>
      </div>
    </div>
  );
};

export default Intelligence;
