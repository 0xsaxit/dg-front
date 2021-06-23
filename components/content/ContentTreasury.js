import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from '../../store';
import { Loader, Popup, Icon, Table } from 'semantic-ui-react';
import { Line } from 'react-chartjs-2';
import Aux from '../_Aux';

const ContentTreasury = (props) => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [dgBalance, setDgBalance] = useState(0);
  const [treasuryTotal, setTreasuryTotal] = useState(0);
  const [statsUSDX, setStatsUSDX] = useState([]);
  const [statsUSDY, setStatsUSDY] = useState([]);
  const [gameplayTreasury, setGameplayTreasury] = useState(0);
  const [gameplayTreasuryPercent, setGameplayTreasuryPercent] = useState(0);
  const [weeklyChange, setWeeklyChange] = useState(0);
  const [gameplayAll, setGameplayAll] = useState(0);
  const [gameplayAllPercent, setGameplayAllPercent] = useState(0);
  const [manaBalance, setManaBalance] = useState(0);
  const [daiBalance, setDaiBalance] = useState(0);
  const [usdtBalance, setUSDTBalance] = useState(0);
  const [atriBalance, setAtriBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [dgTreasury, setDgTreasury] = useState(0);
  const [dgTreasuryPercent, setDgTreasuryPercent] = useState(0);
  const [landTreasury, setLandTreasury] = useState(0);
  const [landTreasuryPercent, setLandTreasuryPercent] = useState(0);
  const [nftTreasury, setNftTreasury] = useState(0);
  const [nftTreasuryPercent, setNftTreasuryPercent] = useState(0);
  const [liquidityTreasury, setLiquidityTreasury] = useState(0);
  const [liquidityTreasuryPercent, setLiquidityTreasuryPercent] = useState(0);
  const [uniTreasury, setUniTreasury] = useState(0);
  const [mviTreasury, setMviTreasury] = useState(0);
  const [maticTreasury, setMaticTreasury] = useState(0);
  const [maticTreasuryPercent, setMaticTreasuryPercent] = useState(0);
  const [maticTokens, setMaticTokens] = useState(0);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // use for both the graph and the stats
  // that'll just be week? to match discord bot 'in the past week'
  // that data will include the percent changes for both daily/weekly in the changes object
  // call .weekly to match labels
  useEffect(() => {
    if (Object.keys(state.treasuryNumbers).length !== 0) {
      const usd = state.treasuryNumbers.totalBalanceUSD.graph;
      let xAxis = [];
      let i;
      for (i = 0; i < usd.length; i += 2) {
        let temp_x = new Date(usd[i].primary);
        let temp_x2 = temp_x.toDateString();
        xAxis.push(temp_x2);
      }

      let yAxis = [];
      let j;
      for (j = 0; j < usd.length; j += 2) {
        let temp_y = usd[j].secondary;
        yAxis.push(temp_y.toFixed(2));
      }
      setStatsUSDX(xAxis);
      setStatsUSDY(yAxis);

      const totalUSD = state.treasuryNumbers.totalBalanceUSD.graph;
      setTreasuryTotal(props.formatPrice(totalUSD.slice(-1)[0].secondary, 0));

      const temp_start = totalUSD[0].secondary;
      const temp_end = totalUSD.slice(-1)[0].secondary;
      const change = temp_end - temp_start;
      setWeeklyChange(change);

      const gameplayTotal = state.treasuryNumbers.allTimeGameplayUSD;
      setGameplayAll(
        props.formatPrice(gameplayTotal.graph.slice(-1)[0].secondary, 0)
      );

      const gameplayTotal_temp =
        gameplayTotal.changes.weekly.percent.toFixed(2);
      setGameplayAllPercent(Number(gameplayTotal_temp));

      const gameplay = state.treasuryNumbers.totalGameplayUSD;
      setGameplayTreasury(
        props.formatPrice(gameplay.graph.slice(-1)[0].secondary, 0)
      );

      const gameplay_temp = gameplay.changes.weekly.percent.toFixed(2);
      setGameplayTreasuryPercent(Number(gameplay_temp));

      const mana = state.treasuryNumbers.manaBalance.graph;
      setManaBalance(props.formatPrice(mana.slice(-1)[0].secondary, 0));

      const dai = state.treasuryNumbers.daiBalance.graph;
      setDaiBalance(props.formatPrice(dai.slice(-1)[0].secondary, 0));

      const usdt = 149746;
      setUSDTBalance(props.formatPrice(usdt, 0));

      const atri = state.treasuryNumbers.atriBalance.graph;
      setAtriBalance(props.formatPrice(atri.slice(-1)[0].secondary, 0));

      const eth = state.treasuryNumbers.ethBalance.graph;
      setEthBalance(props.formatPrice(eth.slice(-1)[0].secondary, 3));

      const land = state.treasuryNumbers.totalLandUSD;
      setLandTreasury(props.formatPrice(land.graph.slice(-1)[0].secondary, 0));

      const land_temp = land.changes.weekly.percent.toFixed(2);
      setLandTreasuryPercent(Number(land_temp));

      const wearables = state.treasuryNumbers.totalWearablesUSD;
      setNftTreasury(
        props.formatPrice(wearables.graph.slice(-1)[0].secondary, 0)
      );

      const wearables_temp = wearables.changes.weekly.percent.toFixed(2);
      setNftTreasuryPercent(Number(wearables_temp));

      const dg = state.treasuryNumbers.totalDgUSD;
      setDgTreasury(props.formatPrice(dg.graph.slice(-1)[0].secondary, 0));

      const dg_temp = dg.changes.weekly.percent.toFixed(2);
      setDgTreasuryPercent(Number(dg_temp));

      const liq = state.treasuryNumbers.totalLiquidityProvided;
      setLiquidityTreasury(
        props.formatPrice(liq.graph.slice(-1)[0].secondary, 0)
      );

      const liq_temp = liq.changes.weekly.percent.toFixed(2);
      setLiquidityTreasuryPercent(Number(liq_temp));

      const uni = state.treasuryNumbers.totalDgEthUniswapBalance;
      setUniTreasury(props.formatPrice(uni.graph.slice(-1)[0].secondary, 0));

      const mvi = state.treasuryNumbers.totalMviEthLPBalance;
      setMviTreasury(props.formatPrice(mvi.graph.slice(-1)[0].secondary, 0));

      const maticBal = state.treasuryNumbers.totalMaticUSD;
      setMaticTreasury(
        props.formatPrice(maticBal.graph.slice(-1)[0].secondary, 0)
      );

      const maticTemp = state.treasuryNumbers.maticBalance.graph
        .slice(-1)[0]
        .secondary.toFixed(0);
      setMaticTokens(maticTemp);

      const matic_temp = maticBal.changes.weekly.percent.toFixed(2);
      setMaticTreasuryPercent(Number(matic_temp));

      const dgbal = state.treasuryNumbers.dgBalance.graph;
      setDgBalance(props.formatPrice(dgbal.slice(-1)[0].secondary, 0));
    }
  }, [state.treasuryNumbers]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function getWeeklyChange() {
    return (
      <span style={{ display: 'flex', justifyContent: 'center' }}>
        {weeklyChange > 0 && treasuryTotal ? (
          <Table.Cell textAlign="right">
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '-6px',
                paddingBottom: '9px',
              }}
            >
              <p className="earned-percent pos">
                +$
                {weeklyChange.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </p>
              <p className="earned-week-text">This Week</p>
            </span>
          </Table.Cell>
        ) : treasuryTotal ? (
          <Table.Cell textAlign="right">
            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <p className="earned-percent neg">
                -$
                {(weeklyChange * -1)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </p>
              <p className="earned-week-text">This Week</p>
            </span>
          </Table.Cell>
        ) : null}
      </span>
    );
  }


  function allTimeEarnings() {
    return (
      <Table.Row>
        <Table.Cell>
          <span style={{ display: 'flex' }}>
            All Time Gameplay Profits
            {getPopUp('one')}
          </span>
        </Table.Cell>

        {gameplayAll ? (
          <Table.Cell textAlign="right">${gameplayAll}</Table.Cell>
        ) : (
          getLoader()
        )}

        {gameplayAllPercent > 0 && gameplayAll ? (
          <Table.Cell textAlign="right">
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <p className="earned-percent pos">{gameplayAllPercent}%</p>
              <Icon name="caret up" className="percent-icon pos" />
            </span>
          </Table.Cell>
        ) : gameplayAll ? (
          <Table.Cell textAlign="right">
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <p className="earned-percent neg">{gameplayAllPercent}%</p>
              <Icon name="caret down" className="percent-icon neg" />
            </span>
          </Table.Cell>
        ) : (
          getLoader()
        )}
      </Table.Row>
    );
  }

  function gameplayHotWallet() {
    return (
      <Table.Row>
        <Table.Cell>
          <span style={{ display: 'flex' }}>
            Gameplay Hot Wallet
            {getPopUp('two')}
          </span>
        </Table.Cell>

        {gameplayTreasury ? (
          <Table.Cell textAlign="right">${gameplayTreasury}</Table.Cell>
        ) : (
          getLoader()
        )}

        {gameplayTreasuryPercent > 0 && gameplayTreasury ? (
          <Table.Cell textAlign="right">
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <p className="earned-percent pos">{gameplayTreasuryPercent}%</p>
              <Icon name="caret up" className="percent-icon pos" />
            </span>
          </Table.Cell>
        ) : gameplayTreasury ? (
          <Table.Cell textAlign="right">
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <p className="earned-percent neg">{gameplayTreasuryPercent}%</p>
              <Icon name="caret down" className="percent-icon neg" />
            </span>
          </Table.Cell>
        ) : (
          getLoader()
        )}
      </Table.Row>
    );
  }

  function dgToken() {
    return (
      <Table.Row>
        <Table.Cell>
          <span style={{ display: 'flex' }}>
            $DG Token
            {getPopUp('three')}
          </span>
        </Table.Cell>

        {dgTreasury ? (
          <Table.Cell textAlign="right">${dgTreasury}</Table.Cell>
        ) : (
          getLoader()
        )}

        {dgTreasuryPercent > 0 && dgTreasury ? (
          <Table.Cell textAlign="right">
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <p className="earned-percent pos">{dgTreasuryPercent}%</p>
              <Icon name="caret up" className="percent-icon pos" />
            </span>
          </Table.Cell>
        ) : dgTreasury ? (
          <Table.Cell textAlign="right">
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <p className="earned-percent neg">{dgTreasuryPercent}%</p>
              <Icon name="caret down" className="percent-icon neg" />
            </span>
          </Table.Cell>
        ) : (
          getLoader()
        )}
      </Table.Row>
    );
  }

  function decentralandLand() {
    return (
      <Table.Row>
        <Table.Cell>
          <span style={{ display: 'flex' }}>
            Decentraland LAND
            {getPopUp('four')}
          </span>
        </Table.Cell>

        {landTreasury ? (
          <Table.Cell textAlign="right">${landTreasury}</Table.Cell>
        ) : (
          getLoader()
        )}

        {landTreasuryPercent > 0 && landTreasury ? (
          <Table.Cell textAlign="right">
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <p className="earned-percent pos">{landTreasuryPercent}%</p>
              <Icon name="caret up" className="percent-icon pos" />
            </span>
          </Table.Cell>
        ) : landTreasury ? (
          <Table.Cell textAlign="right">
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <p className="earned-percent neg">{landTreasuryPercent}%</p>
              <Icon name="caret down" className="percent-icon neg" />
            </span>
          </Table.Cell>
        ) : (
          getLoader()
        )}
      </Table.Row>
    );
  }

  function dgWearables() {
    return (
      <Table.Row>
        <Table.Cell>
          <span style={{ display: 'flex' }}>
            $DG Wearables
            {getPopUp('five')}
          </span>
        </Table.Cell>

        {nftTreasury ? (
          <Table.Cell textAlign="right">${nftTreasury}</Table.Cell>
        ) : (
          getLoader()
        )}

        {nftTreasuryPercent > 0 && nftTreasury ? (
          <Table.Cell textAlign="right">
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <p className="earned-percent pos">{nftTreasuryPercent}%</p>
              <Icon name="caret up" className="percent-icon pos" />
            </span>
          </Table.Cell>
        ) : nftTreasury ? (
          <Table.Cell textAlign="right">
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <p className="earned-percent neg">{nftTreasuryPercent}%</p>
              <Icon name="caret down" className="percent-icon neg" />
            </span>
          </Table.Cell>
        ) : (
          getLoader()
        )}
      </Table.Row>
    );
  }

  function liquidityProvided() {
    return (
      <Table.Row>
        <Table.Cell>
          <span style={{ display: 'flex' }}>
            Liquidity Provided
            {getPopUp('six')}
          </span>
        </Table.Cell>

        {liquidityTreasury ? (
          <Table.Cell textAlign="right">${liquidityTreasury}</Table.Cell>
        ) : (
          getLoader()
        )}

        {liquidityTreasuryPercent > 0 && liquidityTreasury ? (
          <Table.Cell textAlign="right">
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <p className="earned-percent pos">{liquidityTreasuryPercent}%</p>
              <Icon name="caret up" className="percent-icon pos" />
            </span>
          </Table.Cell>
        ) : liquidityTreasury ? (
          <Table.Cell textAlign="right">
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <p className="earned-percent neg">{liquidityTreasuryPercent}%</p>
              <Icon name="caret down" className="percent-icon neg" />
            </span>
          </Table.Cell>
        ) : (
          getLoader()
        )}
      </Table.Row>
    );
  }

  function maticStaked() {
    return (
      <Table.Row>
        <Table.Cell>
          <span style={{ display: 'flex' }}>
            Matic Staked in Matic Node
            {getPopUp('seven')}
          </span>
        </Table.Cell>

        {maticTreasury ? (
          <Table.Cell textAlign="right">${maticTreasury}</Table.Cell>
        ) : (
          getLoader()
        )}

        {maticTreasuryPercent > 0 && maticTreasury ? (
          <Table.Cell textAlign="right">
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <p className="earned-percent pos">{maticTreasuryPercent}%</p>
              <Icon name="caret up" className="percent-icon pos" />
            </span>
          </Table.Cell>
        ) : maticTreasury ? (
          <Table.Cell textAlign="right">
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <p className="earned-percent neg">{maticTreasuryPercent}%</p>
              <Icon name="caret down" className="percent-icon neg" />
            </span>
          </Table.Cell>
        ) : (
          getLoader()
        )}
      </Table.Row>
    );
  }

  function getLoader() {
    return (
      <Table.Cell textAlign="right">
        <Loader active inline size="small" className="treasury-loader" />
      </Table.Cell>
    );
  }

  function getPopUp(number) {
    return (
      <Popup
        className="dai-mana-popup"
        style={{ background: 'rgb(21, 24, 28)', color: 'rgba(255, 255, 255, 0.6)' }}
        trigger={
          <Icon
            className={`dai-mana-icon ${number}`}
            name="info circle"
            style={{ fontSize: '10px', marginLeft: '6px' }}
          />
        }
      >
        {number === 'one' ? (
          <p className="earned-text">
            All time gameplay earnings, not counting earnings allocated
            elsewhere by the DG DAO (not used in total treasury calculation)
          </p>
        ) : number === 'two' ? (
          <Aux>
            <p className="earned-text">DAI: {daiBalance}</p>
            <p className="earned-text">MANA: {manaBalance}</p>
            <p className="earned-text">USDT: {usdtBalance}</p>
            <p className="earned-text">ATRI: {atriBalance}</p>
            <p className="earned-text">ETH: {ethBalance}</p>
          </Aux>
        ) : number === 'three' ? (
          <p className="earned-text">
            Treasury holdings of $DG calculated as {dgBalance} $DG at market
            price
          </p>
        ) : number === 'four' ? (
          <p className="earned-text">
            Treasury holdings of LAND calculated as 1,007 parcels times T30 avg
            LAND price
          </p>
        ) : number === 'five' ? (
          <p className="earned-text">
            Treasury holdings of wearable NFTs calculated as 210 wearables times
            average bid at current MANA price
          </p>
        ) : number === 'six' ? (
          <Aux>
            <p className="earned-text"> ETH-DG v3: ${uniTreasury} </p>
            <p className="earned-text"> MVI-ETH v2: ${mviTreasury} </p>
          </Aux>
        ) : number === 'seven' ? (
          <p className="earned-text">
            Calculated as {Number(maticTokens).toLocaleString()} delegated
            tokens times current Matic token price
          </p>
        ) : null}
      </Popup>
    );
  }

  const weekly = {
    labels: statsUSDX,
    datasets: [
      {
        fill: true,
        lineTension: 0.5,
        backgroundColor: '#000000',
        borderColor: '#16c784',
        borderWidth: 4,
        data: statsUSDY,
      },
    ],
  };

  return (
    <Aux>
      <span style={{ display: 'flex', justifyContent: 'center' }}>
        {treasuryTotal ? (
          <p className="treasury-amount">${treasuryTotal}</p>
        ) : (
          <Loader
            active
            inline
            size="large"
            style={{
              fontSize: '12px',
              marginTop: '48px',
              marginBottom: '48px',
              marginLeft: '0px',
            }}
          />
        )}
      </span>

      {getWeeklyChange()}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span className="treasury-graph">
          <Line
            height={150}
            data={weekly}
            options={{
              maintainAspectRatio: false,
              title: { display: false },
              legend: { display: false },
              scales: {
                xAxes: [{ display: false }],
                yAxes: [{ display: false }],
              },
              elements: {
                point: { radius: 0 },
              },
            }}
          />
        </span>
      </div>

      <span
        style={{ display: 'flex', justifyContent: 'center' }}
        className="treasury-table"
      >
        <div
          className="treasury-stats"
          style={{
            position: 'relative',
            height: '100%',
          }}
        >
          <Table unstackable className="treasury-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{ paddingRight: '22.5vw' }}>
                  Name
                </Table.HeaderCell>
                <Table.HeaderCell
                  textAlign="right"
                  className="treasury-left-padding"
                  style={{ textAlign: 'right' }}
                >
                  Amount
                </Table.HeaderCell>
                <Table.HeaderCell style={{ textAlign: "right" }}>Weekly</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {allTimeEarnings()}
              {gameplayHotWallet()}
              {dgToken()}
              {decentralandLand()}
              {dgWearables()}
              {liquidityProvided()}
              {maticStaked()}
            </Table.Body>
          </Table>
        </div>
      </span>
    </Aux>
  );
};

export default ContentTreasury;
