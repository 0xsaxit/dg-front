import styles from './TreasuryTooltipGameplay.module.scss';
import { Popup } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import React, { useEffect, useContext, useState } from 'react';

const TreasuryTooltipGameplay = props => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  const [manaBalance, setManaBalance] = useState(0);
  const [daiBalance, setDaiBalance] = useState(0);
  const [usdtBalance, setUSDTBalance] = useState(0);
  const [atriBalance, setAtriBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [iceBalance, setIceBalance] = useState(0);

  function formatPrice(balanceDG, units) {
    const priceFormatted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return priceFormatted;
  }

  useEffect(() => {
    if (Object.keys(state.treasuryNumbers).length !== 0) {
      const usd = state.treasuryNumbers.totalBalanceUSD.graph;

      const mana = state.treasuryNumbers.manaBalance.graph;
      setManaBalance(formatPrice(mana.slice(-1)[0].secondary, 0));

      const dai = state.treasuryNumbers.daiBalance.graph;
      setDaiBalance(formatPrice(dai.slice(-1)[0].secondary, 0));

      const usdt = state.treasuryNumbers.usdtBalance.graph;
      setUSDTBalance(formatPrice(usdt.slice(-1)[0].secondary, 0));

      const atri = state.treasuryNumbers.atriBalance.graph;
      setAtriBalance(formatPrice(atri.slice(-1)[0].secondary, 0));

      const eth = state.treasuryNumbers.ethBalance.graph;
      setEthBalance(formatPrice(eth.slice(-1)[0].secondary, 3));

      const ice = Number(state.DGBalances.BALANCE_ICE * state.DGPrices.ice);
      setIceBalance(formatPrice(ice, 0));
    }
  }, [state.treasuryNumbers, state.DGBalances.BALANCE_ICE]);

  return (
    <>
       <Popup
        trigger={
          <div className={styles.info_mark}>
            <svg
              width="8"
              height="9"
              viewBox="0 0 11 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5026 11.5C8.51864 11.5 11 9.01864 11 6.0026C11 2.98136 8.51864 0.5 5.4974 0.5C2.47617 0.5 0 2.98136 0 6.0026C0 9.01864 2.48136 11.5 5.5026 11.5ZM5.4974 4.33624C5.05097 4.33624 4.67721 3.96248 4.67721 3.51605C4.67721 3.05403 5.05097 2.69066 5.4974 2.69066C5.94384 2.69066 6.31241 3.05403 6.31241 3.51605C6.31241 3.96248 5.94384 4.33624 5.4974 4.33624ZM4.51109 8.9252C4.22039 8.9252 3.99198 8.72275 3.99198 8.41647C3.99198 8.14134 4.22039 7.91812 4.51109 7.91812H5.10807V6.07008H4.61491C4.31902 6.07008 4.0958 5.86244 4.0958 5.56654C4.0958 5.28622 4.31902 5.06819 4.61491 5.06819H5.67909C6.05286 5.06819 6.24493 5.32256 6.24493 5.71708V7.91812H6.71732C7.00802 7.91812 7.23643 8.14134 7.23643 8.41647C7.23643 8.72275 7.00802 8.9252 6.71732 8.9252H4.51109Z"
                fill="white"
              />
            </svg>
          </div>
        }
        position="right center"        
        hideOnScroll={true}
        className={styles.popup}
      >
        <Popup.Content className="accountTooltip">
          <div className="tooltip_body" style={{ width: '144px' }}>
            <img
              className="info"
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640045/ICE_Info_bbiag6.svg"
            />
            <div>
              <p style={{ marginBottom: '4px' }}>
                MANA: ${manaBalance}         
              </p>
              <p style={{ marginBottom: '4px' }}>
                DAI: ${daiBalance}         
              </p>
              <p style={{ marginBottom: '4px' }}>
                USDT: ${usdtBalance}         
              </p>
              <p style={{ marginBottom: '4px' }}>
                ATARI: ${atriBalance}         
              </p>
              <p style={{ marginBottom: '4px' }}>
                ETH: ${ethBalance}
              </p>
              <p style={{ marginTop: '0px' }}>
                ICE: ${iceBalance}            
              </p>
            </div>
          </div>          
        </Popup.Content>
      </Popup>
    </>
  );
};

export default TreasuryTooltipGameplay;