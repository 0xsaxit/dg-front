import { Image, Button, Grid } from 'semantic-ui-react';
import Global from '../Constants';

const ContentNFTs = (props) => {
  // define local variables
  const monthNames = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];

  const d = new Date();
  const months = [
    monthNames[d.getMonth()],
    monthNames[d.getMonth() - 1],
    'TOTAL',
  ];

  return (
    <div className="nft-container">
      <div>
        <Image
          src={`https://vegascity.land/vcs/vegas-city-card-tominoya${props.parcelData.parcelLocation[0]},${props.parcelData.parcelLocation[2]},1.png`}
          className="tominoya-pic"
        />
      </div>
      <div className="nft-description">
        <Grid style={{ paddingLeft: '15px' }}>
          <Grid.Row className="my-nft-row">

            <Grid.Column
              className="nft-grid"
              computer={8}
              tablet={8}
              mobile={8}
            >
              <p className="nft-bold-content">PARCEL LOCATION</p>
              <br />
              <p className="nft-number-content">
                {props.parcelData.parcelLocation[0]},{' '}
                {props.parcelData.parcelLocation[2]}
              </p>
            </Grid.Column>
          </Grid.Row>

          {months.map((item, i) => {
            return (
              <Grid.Row className="my-nft-row" key={i}>
                <Grid.Column
                  className="nft-grid"
                  computer={6}
                  tablet={4}
                  mobile={8}
                >
                  <p className="nft-bold-content">VOLUME ({item})</p>
                  <br />
                  <a href="">
                    <Image
                      src={Global.IMAGES.ICON_MANA}
                      style={{
                        width: '18px',
                        marginTop: '5px',
                        float: 'left',
                        verticalAlign: 'middle',
                      }}
                    ></Image>
                    <abbr
                      style={{
                        float: 'left',
                        marginTop: '5px',
                        marginLeft: '5px',
                      }}
                      className="nft-number-content"
                    >
                      {props.parcelData.parcelVolume[i]} MANA
                    </abbr>
                  </a>
                </Grid.Column>

                <Grid.Column
                  className="nft-grid"
                  computer={6}
                  tablet={4}
                  mobile={8}
                >
                  <p className="nft-bold-content">PROFIT ({item})</p>
                  <br />
                  <a href="">
                    <Image
                      src={Global.IMAGES.ICON_MANA}
                      style={{
                        width: '18px',
                        marginTop: '5px',
                        float: 'left',
                        verticalAlign: 'middle',
                      }}
                    ></Image>
                    <abbr
                      style={{
                        float: 'left',
                        marginTop: '5px',
                        marginLeft: '5px',
                      }}
                      className="nft-number-content"
                    >
                      {props.parcelData.parcelRevenue[i]} MANA
                    </abbr>
                  </a>
                </Grid.Column>
              </Grid.Row>
            );
          })}
        </Grid>

        <br />

        <Button
          color="blue"
          className="my-nft-button"
          href={`https://play.decentraland.org/?position=${props.parcelData.parcelLocation[0]}%2C${props.parcelData.parcelLocation[2]}&realm=fenrir-gold`}
          target="_blank"
          style={{ marginLeft: '12px', marginTop: '30px' }}
        >
          Teleport in
        </Button>
      </div>
    </div>
  );
};

export default ContentNFTs;
