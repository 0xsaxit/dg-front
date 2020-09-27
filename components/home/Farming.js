import { useState, useEffect, useContext } from 'react'
import { GlobalContext } from '../../store'
import { Button, Divider, Radio  } from 'semantic-ui-react'
// import ButtonAuthorize from './ButtonAuthorize'
// import ButtonEnable from './ButtonEnable'
// import ContentNFTs from './ContentNFTs'
import Aux from '../_Aux'
import Spinner from '../Spinner'
import Global from '../Constants'

const Farming = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext)

  // define local variables
  const [DGstate, setDGState] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useState('light')
  const [themeStyle, setThemeStyle] = useState([])

  useEffect(() => {
    if (document.readyState === 'complete') {
      setIsLoading(false)
    }
  })

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      setThemeStyle([
        'dark',
        'divider-dark'
      ])
    } else {
      setTheme('light');
      setThemeStyle([
        '',
        ''
      ])
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function gameplayFarming() {
    return (
      <Aux>

        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3" id={themeStyle[0]}>$DG Gameplay Farming</h3>
              <p id={themeStyle[0]}>
                You can farm $DG by playing games with $MANA or $DAI. 
                Playing with two, three, or four players at the same table earns you 1.2x, 1.3x,
                and 1.4x multipliers respectively, and repping a
                Decentral Games wearable earns you an extra 10% $DG when playing. Refer any friends and get 
                an additional 20% bonus on all $DG they farm. For more details see our
                <a
                  href="https://decentral-games-1.gitbook.io/dg/governance-1"
                  style={{ color: '#2085f4' }}
                >
                  {' '}
                  documentation
                </a>
              </p>
            </span>
          </div>
        </div>

        <div className="DG-liquidity-container">
          <div className="DG-column unclaimed">
            <span style={{ display: 'flex' }}>
              <img src={Global.IMAGES.LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Unclaimed DG</p>
                <p className="account-name">0</p>
              </span>
            </span>

            <Divider />

            <span className="DG-button-span">
              <Button disabled className="DG-claim-button">
                CLAIM
              </Button>
            </span>
          </div>

          <div className="DG-column one" id={themeStyle[0]}>
            <span style={{ display: 'flex' }}>
              <img src={Global.IMAGES.MANA_CIRCLE} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text" id={themeStyle[0]}> Coin </p>
                <p className="account-name" id={themeStyle[0]}>MANA</p>
              </span>
            </span>

            <Divider className={themeStyle[1]}/>

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text" id={themeStyle[0]}> Total Bet </p>
              <p className="earned-amount" id={themeStyle[0]}> 0 </p>
            </span>

            <Divider className={themeStyle[1]}/>

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text" id={themeStyle[0]}> $DG Farmed </p>
              <p className="earned-amount" id={themeStyle[0]}> 0 </p>
            </span>

            <Divider className={themeStyle[1]}/>

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text" id={themeStyle[0]}> Play-to-farm Rate </p>
              <p className="earned-amount" id={themeStyle[0]}> 0 </p>
            </span>
          </div>

          <div className="DG-column two" id={themeStyle[0]}>
            <span style={{ display: 'flex' }}>
              <img src={Global.IMAGES.DAI_CIRCLE} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text" id={themeStyle[0]}> Coin </p>
                <p className="account-name" id={themeStyle[0]}>DAI</p>
              </span>
            </span>

            <Divider className={themeStyle[1]}/>

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text" id={themeStyle[0]}> Total Bet </p>
              <p className="earned-amount" id={themeStyle[0]}> 0 </p>
            </span>

            <Divider className={themeStyle[1]}/>

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text" id={themeStyle[0]}> $DG Farmed </p>
              <p className="earned-amount" id={themeStyle[0]}> 0 </p>
            </span>

            <Divider className={themeStyle[1]}/>

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text" id={themeStyle[0]}> Play-to-farm Rate </p>
              <p className="earned-amount" id={themeStyle[0]}> 0 </p>
            </span>
          </div>
        </div>
      </Aux>
    )
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function liquidityFarming() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG Liquidity Farming</h3>
              <p>
                You can farm $DG by providing liquidity in $MANA-$DG and $DAI-$DG balancer pools
                (weighted 98-2) and staking your balancer pool tokens on this dashboard.
                 Read more about $DG liquidity farming rewards in our
                <a
                  href="https://decentral-games-1.gitbook.io/dg/governance-1"
                  style={{ color: '#2085f4' }}
                >
                  {' '}
                  docs
                </a>
                .
              </p>
            </span>
          </div>
        </div>

        <div className="DG-liquidity-container">
          <div className="DG-column unclaimed">
            <span style={{ display: 'flex' }}>
              <img src={Global.IMAGES.LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Unclaimed DG</p>
                <p className="account-name">0</p>
              </span>
            </span>

            <Divider />

            <span className="DG-button-span">
              <Button disabled className="DG-claim-button">
                CLAIM
              </Button>
            </span>
          </div>

          <div className="DG-column one">
            <span style={{ display: 'flex' }}>
              <img src={Global.IMAGES.MANA_CIRCLE} className="farming-logo" />
              <img src={Global.IMAGES.LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Balancer Pool </p>
                <p className="account-name">MANA-DG</p>
              </span>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Deposited </p>
              <p className="earned-amount"> 0 </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> % share of pool </p>
              <p className="earned-amount"> 0% </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Pool Rate </p>
              <p className="earned-amount"> 0 / week </p>
            </span>

            <Divider />

            <span className="DG-button-span">
              <Button disabled className="DG-deposit-button">
                DEPOSIT
              </Button>
              <Button disabled className="DG-stake-button">
                STAKE LP
              </Button>
            </span>
          </div>

          <div className="DG-column two">
            <span style={{ display: 'flex' }}>
              <img src={Global.IMAGES.DAI_CIRCLE} className="farming-logo" />
              <img src={Global.IMAGES.LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Balancer Pool </p>
                <p className="account-name">DAI-DG</p>
              </span>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Deposited </p>
              <p className="earned-amount"> 0 </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> % share of pool </p>
              <p className="earned-amount"> 0% </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Pool Rate </p>
              <p className="earned-amount"> 0 / week </p>
            </span>

            <Divider />

            <span className="DG-button-span">
              <Button disabled className="DG-deposit-button">
                DEPOSIT
              </Button>
              <Button disabled className="DG-stake-button">
                STAKE LP
              </Button>
            </span>
          </div>
        </div>
      </Aux>
    )
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function Governance() {
    return (
      <Aux>
        <div className="outter-DG-container">
          <span style={{ display: 'flex' }}>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">Decentral Games Governance</h3>
              <p>
                Staked $DG tokens are used to vote in decentral.games
                governance. To incentivize participation, for the first year
                there will be farming rewards distributed to stakers in the $DG 
                governance contract. Proposals can be submitted and voted on{' '}
                <a href="" style={{ color: '#2085f4' }}>
                  {' '}
                  here
                </a>
                . Read more about decentral.games governance in our{' '}
                <a
                  href="https://decentral-games-1.gitbook.io/dg/governance-1"
                  style={{ color: '#2085f4' }}
                >
                  docs
                </a>
                .
              </p>
            </span>
          </span>
        </div>

        <div className="DG-liquidity-container gov">
          <div className="DG-column gov">
            <span style={{ display: 'flex' }}>
              <img src={Global.IMAGES.LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Unclaimed DG</p>
                <p className="account-name">0</p>
              </span>
            </span>

            <Divider />

            <span className="DG-button-span">
              <Button disabled className="DG-claim-button">
                CLAIM
              </Button>
            </span>
          </div>

          <div className="DG-column stake">
            <span style={{ display: 'flex' }}>
              <img src={Global.IMAGES.LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Staked DG</p>
                <p className="account-name">0</p>
              </span>
            </span>

            <Divider />

            <span className="DG-button-span">
              <Button disabled className="DG-claim-button">
                Stake
              </Button>
            </span>
          </div>

        </div>

      </Aux>
    )
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function submenu() {
    return (
      <div className="account-other-tabs">
        {(() => {
          if (DGstate == 0)
            return (
              <p className="account-other-p">
                <b className="account-hover active" id={themeStyle[0]}>GAMEPLAY</b>{' '}
                <abbr className="account-hover" id={themeStyle[0]} onClick={() => setPage(1)}>
                  LIQUIDITY
                </abbr>
                <abbr className="account-hover" id={themeStyle[0]} onClick={() => setPage(2)}>
                  GOVERNANCE
                </abbr>
              </p>
            )
          else if (DGstate == 1)
            return (
              <p className="account-other-p">
                <abbr className="account-hover" id={themeStyle[0]} onClick={() => setPage(0)}>
                  GAMEPLAY
                </abbr>{' '}
                <b className="account-hover active" id={themeStyle[0]}>LIQUIDITY</b>
                <abbr className="account-hover" id={themeStyle[0]} onClick={() => setPage(2)}>
                  GOVERNANCE
                </abbr>{' '}
              </p>
            )
          else
            return (
              <p className="account-other-p">
                <abbr className="account-hover" id={themeStyle[0]} onClick={() => setPage(0)}>
                  GAMEPLAY
                </abbr>{' '}
                <abbr className="account-hover" id={themeStyle[0]} onClick={() => setPage(1)}>
                  LIQUIDITY
                </abbr>
                <b className="account-hover active" id={themeStyle[0]}>GOVERNANCE</b>
              </p>
            )
        })()}
      </div>
    )
  }

  function setPage(number) {
    setDGState(number)
  }

  return (
    <div className="main-container" id={themeStyle[0]}>
      {isLoading ? (
        <Spinner background={3} />
      ) : (
        <div className="page-container">
          <div className="account-other-inner-container ">

            {submenu()}
            {/*<span style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '-60px', marginBottom: '60px' }}>
              <Radio toggle onClick={toggleTheme} />
            </span>*/}

            <Divider style={{ marginTop: '18px', paddingBottom: '21px' }} className={themeStyle[1]}/>

            {(() => {
              if (DGstate == 0) return gameplayFarming()
              else if (DGstate == 1) return liquidityFarming()
              else return Governance()
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default Farming
