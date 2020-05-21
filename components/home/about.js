import React from 'react'
import { Grid, Card, Reveal, Image } from 'semantic-ui-react'
import mana from '../../static/images/mana.png';
import LogoSpinner from '../LogoSpinner'
import Spinner from '../Spinner'
import Fade from 'react-reveal/Fade'
import Menu from './menu';


let Global;
var USER_ADDRESS;

const INITIAL_STATE = {
  isRunningTransaction: false,
  isDashboard: false,
  isLoading: true,
};

class About extends React.Component {
  showSpinner = () => this.setState({isRunningTransaction: true})
  hideSpinner = () => this.setState({isRunningTransaction: false})

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  async componentDidMount() {
    Global = require('../constant').default;
    if (window.web3) {
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
    }
    await this.getUserData();
    this.setState({isLoading: false});
  }

  getUserVerify = () => {
    return fetch(`${Global.BASE_URL}/order/verifyAddress`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: USER_ADDRESS,
      })
    })
  }
  getUserData = async () => {
    try {
      let response = await this.getUserVerify();
      let json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          return;
        }
        let stepValue = parseInt(json.result);
        if (stepValue > 3) {
          this.setState({isDashboard: true});
        }
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    if ( this.state.isLoading === true) {
      return (
        <div>
          <Spinner show={this.state.isLoading}/>
        </div>
      )
    }
    return (
      <div className="games-dashboard">
        <Menu dashboard={this.state.isDashboard}/>
        <LogoSpinner show={this.state.isRunningTransaction}/>
        <div className="games-dashboard-content">
          <Fade bottom distance="20px" duration="600">
            <h3 className="account-other-h3 games"> About Us </h3>
            <p className="account-other-p games" style={{ paddingTop: '7px' }}> Decentral Games develops realtime 3D multiplayer games, built on Matic Network's Plasma-based sidechain and deployed to the Decentraland metaverse. </p>
          </Fade>

          <Fade bottom distance="20px" duration="600" delay="300">
            <div className="games-container">
              <div>
                <h3 className="account-other-h4 games"> Our Games </h3>
                <p className="account-other-p games" style={{ paddingTop: '6px', paddingBottom: '30px' }}>Playable for free and with MANA. ETH and DAI coming soon. </p>
              </div>
              <Grid>
                <Grid.Row>
                  <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Card className='games-card'>
                      <Reveal animated='fade'>
                        <Reveal.Content visible>
                          <Image className='card-image' src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058163/slots-1_qa9ced_a8rqpc_lcvhua.jpg" />
                        </Reveal.Content>
                        <Reveal.Content hidden>
                          <Image className='card-image' src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058163/slots-2_tvfv6r_lowidv_vabcjn.jpg" />
                        </Reveal.Content>
                      </Reveal>
                      <Card.Content>
                        <Card.Header className='games-card-header'>SLOTS</Card.Header>
                      </Card.Content>
                    </Card>
                  </Grid.Column>

                  <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Card className='games-card'>
                      <Reveal animated='fade'>
                        <Reveal.Content visible>
                          <Image className='card-image' src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058162/roulette-1_rmgcgr_evcxkj_rwjlcw.jpg" />
                        </Reveal.Content>
                        <Reveal.Content hidden>
                          <Image className='card-image' src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058161/roulette-2_hamycv_mchxtp_cbscn1.jpg"/>
                        </Reveal.Content>
                      </Reveal>
                      <Card.Content>
                        <Card.Header className='games-card-header'>ROULETTE</Card.Header>
                      </Card.Content>
                    </Card>
                  </Grid.Column>

                  <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Card className='games-card'>
                      <Reveal animated='fade'>
                        <Reveal.Content visible>
                          <Image className='card-image' src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058160/dice_fheuwk_t8hjf6_ydjuva.jpg" />
                        </Reveal.Content>
                        <Reveal.Content hidden>
                          <Image className='card-image' src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058160/backgammon_mgb1hk_xojcpl_gede81.jpg" />
                        </Reveal.Content>
                      </Reveal>
                      <Card.Content>
                        <Card.Header className='games-card-header'>BACKGAMMON</Card.Header>
                      </Card.Content>
                    </Card>
                  </Grid.Column>

                  <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Card className='games-card'>
                      <Reveal animated='fade'>
                        <Reveal.Content visible>
                          <Image className='card-image' src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058160/blackjack_haiuyl_pnpdet_nolik4.jpg" />
                        </Reveal.Content>
                        <Reveal.Content hidden>
                          <Image className='card-image' src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058164/soon_hover_dvzscx_xqpgw7_gqdvi3.jpg" />
                        </Reveal.Content>
                      </Reveal>
                      <Card.Content>
                        <Card.Header className='games-card-header'>BLACKJACK</Card.Header>
                      </Card.Content>
                    </Card>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>

          </Fade>
          <Fade bottom distance="20px" duration="600" delay="300">
            <div className="games-container">
              <Grid>
                <Grid.Row>
                  <div>
                    <h3 className="account-other-h4 games" style={{ paddingLeft: '13px' }}> Partners </h3>
                  </div>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column computer={4} tablet={4} mobile={4}>
                    <a href="https://decentraland.org" target="_blank">
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1590087264/Dcl_thjhob.png" style={{ height: '70px' }} />
                    </a>
                  </Grid.Column>

                  <Grid.Column computer={4} tablet={4} mobile={4}>
                    <a href="https://matic.network" target="_blank">
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1590087266/Matic_z2ski2.png" style={{ height: '70px' }} />
                    </a>
                  </Grid.Column>

                  <Grid.Column computer={4} tablet={4} mobile={4}>
                    <a href="https://makerdao.com" target="_blank">
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1590087269/Maker_pohttw.png" style={{ height: '60px', marginLeft: '30px', marginTop: '5px' }} />
                    </a>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </Fade>
        </div>
      </div>
    )
  }
}

export default About;
