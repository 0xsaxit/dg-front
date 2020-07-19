import { useState, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Image, Button, Grid, Icon } from 'semantic-ui-react';
import Global from '../Constants';

const parcelData = {
  parcelID: '33',
  parcelLocation: ['-120', '0', '135'],
  parcelVolume: ['29,109', '73,204', '264,348'],
  parcelRevenue: ['2,120', '4,592', '23,934'],
};

const months = ['JULY', 'JUNE', 'TOTAL'];

const ContentNFTs = () => {
  // get owner's NFT data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <div>
      <Grid>
        <Grid.Row>
          <Grid.Column className="nft-grid" computer={8} tablet={8} mobile={16}>
            <p className="nft-bold-content">PARCEL ID</p>
            <br />
            <p className="nft-number-content">{parcelData.parcelID}</p>
          </Grid.Column>

          <Grid.Column className="nft-grid" computer={8} tablet={8} mobile={16}>
            <p className="nft-bold-content">PARCEL LOCATION</p>
            <br />
            <p className="nft-number-content">
              {parcelData.parcelLocation[0]}, {parcelData.parcelLocation[1]},{' '}
              {parcelData.parcelLocation[2]}
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
                    {parcelData.parcelVolume[i]} MANA
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
                    {parcelData.parcelRevenue[i]} MANA
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
        href={`https://play.decentraland.org/?position=${parcelData.parcelLocation[0]}%2C${parcelData.parcelLocation[2]}&realm=fenrir-gold`}
        target="_blank"
      >
        Teleport in
      </Button>
    </div>
  );
};

export default ContentNFTs;
