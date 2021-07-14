import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from 'store';
import { Loader, Popup, Icon, Table } from 'semantic-ui-react';
import { Line } from 'react-chartjs-2';
import Aux from 'components/_Aux';

import styles from "./ContentTreasury.module.scss";

const GetLoader = () => {
  return (
    <Table.Cell textAlign="right">
      <Loader active inline size="small" classNmae="treasury-loader" />
    </Table.Cell>
  );
}

const GetPopUp = (props) => {
  const { 
    number,
    balance,
    treasury,
    maticTokens,
  } = props;

  return (
    <Popup
      trigger={
        <Icon
          className={`styles.dai-mana-icon_${number}`}
          name="info circle"
        />
      }
    >
      {number === 'one' ? (
        <p className={styles.earned_text}>
          All time gameplay earnings, not counting earnings allocated
          elsewhere by the DG DAO (not used in total treasury calculation)
        </p>
      ) : number === 'two' ? (
        <Aux>
          <p className={styles.earned_text}>DAI: {balance.daiBalance}</p>
          <p className={styles.earned_text}>MANA: {balance.manaBalance}</p>
          <p className={styles.earned_text}>USDT: {balance.usdtBalance}</p>
          <p className={styles.earned_text}>ATRI: {balance.atriBalance}</p>
          <p className={styles.earned_text}>ETH: {balance.ethBalance}</p>
        </Aux>
      ) : number === 'three' ? (
        <p className={styles.earned_text}>
          Treasury holdings of $DG calculated as {balance.dgBalance} $DG at market
          price
        </p>
      ) : number === 'four' ? (
        <p className={styles.earned_text}>
          Treasury holdings of LAND calculated as 1,007 parcels times T30 avg
          LAND price
        </p>
      ) : number === 'five' ? (
        <p className={styles.earned_text}>
          Treasury holdings of wearable NFTs calculated as 210 wearables times
          average bid at current MANA price
        </p>
      ) : number === 'six' ? (
        <Aux>
          <p className={styles.earned_text}> ETH-DG v3: ${treasury.uniTreasury} </p>
          <p className={styles.earned_text}> MVI-ETH v2: ${treasury.mviTreasury} </p>
        </Aux>
      ) : number === 'seven' ? (
        <p className={styles.earned_text}>
          Calculated as {Number(maticTokens).toLocaleString()} delegated
          tokens times current Matic token price
        </p>
      ) : null}
    </Popup>
  );
}

const ContentTableBody = props => {
  const {
    number,
    contentTitle,
    contentBody,
    contentPercent,
    balance,
    treasury,
    maticTokens, 
  } = props;

  return (
    <Table.Row>
      <Table.Cell>
        <span className="d_flex">
          {contentTitle}
          <GetPopUp 
            number={number}
            balance={balance}
            treasury={treasury}
            maticTokens={maticTokens}
          />
        </span>
      </Table.Cell>

      {contentBody ? (
        <Table.Cell textAlign="right">${contentBody}</Table.Cell>
      ) : (
        <GetLoader />
      )}

      {contentPercent > 0 && contentBody ? (
        <Table.Cell textAlign="right">
          <span className="d-flex justify-content-end">
            <p className={styles.earned_percent_pos}>{contentPercent}%</p>
            <Icon className={styles.percent_icon_pos} name="caret up" />
          </span>
        </Table.Cell>
      ) : contentBody ? (
        <Table.Cell textAlign="right">
          <span className="d-flex justify-content-end">
            <p className={styles.earned_percent_neg}>{contentPercent}%</p>
            <Icon className={styles.percent_icon_neg} name="caret down" />
          </span>
        </Table.Cell>
      ) : (
        <GetLoader />
      )}
    </Table.Row>
  )
}

const ContentTreasury = props => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [treasuryTotal, setTreasuryTotal] = useState(0);
  const [statsUSDX, setStatsUSDX] = useState([]);
  const [statsUSDY, setStatsUSDY] = useState([]);
  const [gameplayTreasury, setGameplayTreasury] = useState(0);
  const [gameplayTreasuryPercent, setGameplayTreasuryPercent] = useState(0);
  const [weeklyChange, setWeeklyChange] = useState(0);
  const [gameplayAll, setGameplayAll] = useState(0);
  const [gameplayAllPercent, setGameplayAllPercent] = useState(0);
  const [balance, setBalance] = useState({});
  const [treasury, setTreasury] = useState({});
  const [dgTreasury, setDgTreasury] = useState(0);
  const [nftTreasury, setNftTreasury] = useState(0);
  const [nftTreasuryPercent, setNftTreasuryPercent] = useState(0);
  const [dgTreasuryPercent, setDgTreasuryPercent] = useState(0);
  const [landTreasury, setLandTreasury] = useState(0);
  const [landTreasuryPercent, setLandTreasuryPercent] = useState(0);
  const [liquidityTreasury, setLiquidityTreasury] = useState(0);
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
      setBalance({
        ...balance,
        manaBalance: props.formatPrice(mana.slice(-1)[0].secondary, 0)
      });

      const dai = state.treasuryNumbers.daiBalance.graph;
      setBalance({
        ...balance,
        daiBalance: props.formatPrice(dai.slice(-1)[0].secondary, 0)
      });

      const usdt = 149746;
      setBalance({
        ...balance,
        usdtBalance: props.formatPrice(usdt, 0)
      });

      const atri = state.treasuryNumbers.atriBalance.graph;
      setBalance({
        ...balance,
        atriBalance: props.formatPrice(atri.slice(-1)[0].secondary, 0)
      })

      const eth = state.treasuryNumbers.ethBalance.graph;
      setBalance({
        ...balance,
        ethBalance: props.formatPrice(eth.slice(-1)[0].secondary, 3)
      });

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

      const uni = state.treasuryNumbers.totalDgEthUniswapBalance;
      setTreasury({
        ...treasury,
        uniTreasury: props.formatPrice(uni.graph.slice(-1)[0].secondary, 0)
      });

      const mvi = state.treasuryNumbers.totalMviEthLPBalance;
      setTreasury({
        ...treasury,
        mviTreasury: props.formatPrice(mvi.graph.slice(-1)[0].secondary, 0)
      });

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
      setBalance({
        ...balance,
        dgBalance: props.formatPrice(dgbal.slice(-1)[0].secondary, 0)
      });
    }
  }, [state.treasuryNumbers]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  const getWeeklyChange = () => {
    return (
      <div className="d-flex justify-content-center">
        {weeklyChange > 0 && treasuryTotal ? (
          <Table.Cell textAlign="right">
            <span className={styles.table_weekly_field}>
              <p className={styles.earned_percent_pos}>
                +$
                {weeklyChange.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </p>
              <p className={styles.earned_week_text}>This Week</p>
            </span>
          </Table.Cell>
        ) : treasuryTotal ? (
          <Table.Cell textAlign="right">
            <span className="d-flex justify-content-end">
              <p className={styles.earned_percent_neg}>
                -$
                {(weeklyChange * -1)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </p>
              <p className={styles.earned_week_text}>This Week</p>
            </span>
          </Table.Cell>
        ) : null}
      </div>
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
        borderWidth: 2,
        data: statsUSDY,
      },
    ],
  };

  return (
    <Aux>
      <div className={styles.content_treasury_container}>
        <span className="d-flex justify-content-center">
          {treasuryTotal ? (
            <p className={styles.treasury_amount}>${treasuryTotal}</p>
          ) : (
            <Loader
              className={styles.content_treasury_loader}
              active
              inline
              size="large"
            />
          )}
        </span>

        {getWeeklyChange()}

        <div className="d-flex justify-content-center">
          <span className={styles.treasury_graph}>
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

        <span className={styles.treasury_table}>
          <div className={styles.treasury_stats}>
            <Table unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    Name
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-end">
                    Amount
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-end">
                    Weekly
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <ContentTableBody
                  number="one"
                  contentTitle="All Time Gameplay Profits"
                  contentBody={gameplayAll}
                  contentPercent={gameplayAllPercent}
                  balance={balance}
                  treasury={treasury}
                  maticTokens={maticTokens}
                />
                <ContentTableBody
                  number="two"
                  contentTitle="Gameplay Hot Wallet"
                  contentBody={gameplayTreasury}
                  contentPercent={gameplayTreasuryPercent}
                  treasury={treasury}
                  balance={balance}
                  maticTokens={maticTokens}
                />
                <ContentTableBody
                  number="three"
                  contentTitle="$DG Token"
                  contentBody={dgTreasury}
                  contentPercent={dgTreasuryPercent}
                  treasury={treasury}
                  balance={balance}
                  maticTokens={maticTokens}
                />
                <ContentTableBody
                  number="four"
                  contentTitle="Decentraland LAND"
                  contentBody={landTreasury}
                  contentPercent={landTreasuryPercent}
                  treasury={treasury}
                  balance={balance}
                  maticTokens={maticTokens}
                />
                <ContentTableBody
                  number="five"
                  contentTitle="Liquidity Provided"
                  contentBody={liquidityTreasury}
                  contentPercent="0.00"
                  treasury={treasury}
                  balance={balance}
                  maticTokens={maticTokens}
                />
                <ContentTableBody
                  number="six"
                  contentTitle="Matic Staked in Matic Node"
                  contentBody={maticTreasury}
                  contentPercent={maticTreasuryPercent}
                  treasury={treasury}
                  balance={balance}
                  maticTokens={maticTokens}
                />
              </Table.Body>
            </Table>
          </div>
        </span>
      </div>
    </Aux>
  );
};

export default ContentTreasury;
