import { useEffect, useContext, useState, useCallback, React } from 'react';
import { GlobalContext } from '../../store';
import { Button, Divider, Input, Icon, Loader } from 'semantic-ui-react';
import Aux from '../_Aux';
import Images from '../../common/Images';
import ButtonReward1 from '../button/ButtonReward1';
import ButtonReward2 from '../button/ButtonReward2';
import Global from '../Constants';
import Transactions from '../../common/Transactions';
import Fetch from '../../common/Fetch';
import { Chart } from "react-charts";

const ContentTreasury = (props) => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [statsUSD, setStatsUSD] = useState('');

  useEffect(
    () => {
      (async function () {
        // get treasury statistics
        if (state.userStatus) {
          let userAddress = window.web3.currentProvider.selectedAddress;
          let response_3 = await Fetch.TREASURY_STATS(userAddress);
          let json_3 = await response_3.json();
          let usd = json_3.totalBalanceUSD;
          setStatsUSD(usd);
        } 
      })();
    },
    [statsUSD]
  );

  let data;
  let axes;

  if (statsUSD.length > 0) {

    statsUSD.map((stat) => stat.primary = new Date(stat.primary));

    data =
    [
      {
        label: 'USD',
        
        data: [...new Array(statsUSD.map((stat, i) => {
           return {
              primary: stat.primary,
              secondary: stat.secondary
           }
        }))[0]],
      },
    ]

    axes = [
      { primary: true, type: "time", position: "bottom" },
      {
        type: "linear",
        id: "Second Metric",
        min: 0,
        position: "left",
        format: (d) => `$${d}`,
      },
    ]

  } else {
    data =
    [
      {
        label: 'Loading USD',
        data: [],
      },
    ]

    axes = [
      { primary: true, type: 'utc', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ]
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentTreasury() {

    const series = {
      showPoints: false,
      type: 'area'
    }

    const getSeriesStyle = useCallback(
      series => ({
        color: `url(#${series.index % 4})`,
        opacity: 1,
      }),
    );
    
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG Treasury Statistics</h3>
              <p>Decentral Games treasury data is in USD. After reaching $500,000 USD, $DG holders may create proposals to allocate funds. All Data is calculated using MANA and DAI exchange prices.</p>
            </span>
          </div>
        </div>

        <div className="treasury-outter" style={{ paddingTop: '30px' }}>
          <div className="treasury-inner">

            <span style={{ minWidth: '100%' }}>
              <div
                className="DG-graph-column"
                style={{ position: 'relative', minWidth: '100%' }}
              >
              
                <div
                  style={{
                    width: '100%',
                    height: '500px',
                  }}
                >
                  <Chart
                    data={data}
                    axes={axes}
                    series={series}
                    getSeriesStyle={getSeriesStyle}
                    tooltip
                    renderSVG={() => (
                      <defs>
                        <linearGradient id="0" x1="0" x2="0" y1="1" y2="0">
                          <stop offset="1%" stopColor="#ffffff" />
                          <stop offset="100" stopColor="#2085f4" />
                        </linearGradient>
                      </defs>
                    )}
                  />
                </div>

              </div>
            </span>
          </div>
        </div>

      </Aux>
    );
  }

  return contentTreasury();
};

export default ContentTreasury;