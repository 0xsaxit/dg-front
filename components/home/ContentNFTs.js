import { useState, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Image, Button, Grid } from 'semantic-ui-react';
import Global from '../Constants';

const ContentNFTs = (props) => {
  // get owner's NFT data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

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

  if (props.loading) return <Spinner background={0} />;

  return (
    <div className="nft-container">
      <div className="nft-image">
        <Image
          src="https://res.cloudinary.com/dnzambf4m/image/upload/v1592519040/Screen_Shot_2020-04-29_at_9.22.15_AM_xjm41j.png"
          className="tominoya-pic"
          style={{ borderRadius: '3px' }}
        />
      </div>
      <div className="nft-description">
        <Grid>
          <Grid.Row>
            <Grid.Column
              className="nft-grid"
              computer={8}
              tablet={8}
              mobile={16}
            >
              <p className="nft-bold-content">PARCEL ID</p>
              <br />
              <p className="nft-number-content">{props.parcelData.parcelID}</p>
            </Grid.Column>

            <Grid.Column
              className="nft-grid"
              computer={8}
              tablet={8}
              mobile={16}
            >
              <p className="nft-bold-content">PARCEL LOCATION</p>
              <br />
              <p className="nft-number-content">
                {props.parcelData.parcelLocation[0]},{' '}
                {props.parcelData.parcelLocation[1]}
              </p>
            </Grid.Column>
          </Grid.Row>

          {months.map((item, i) => {
            return (
              <Grid.Row key={i}>
                <Grid.Column
                  className="nft-grid"
                  computer={8}
                  tablet={8}
                  mobile={16}
                  style={{ marginTop: '10px' }}
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
                  computer={8}
                  tablet={8}
                  mobile={16}
                  style={{ marginTop: '10px' }}
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
          className="nft-button"
          href={`https://play.decentraland.org/?position=${props.parcelData.parcelLocation[0]}%2C${props.parcelData.parcelLocation[1]}&realm=fenrir-gold`}
          target="_blank"
        >
          Teleport in
        </Button>
      </div>
    </div>
  );
};

export default ContentNFTs;
