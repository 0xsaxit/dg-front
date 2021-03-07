// import { Image, Button, Divider } from 'semantic-ui-react';
// import { useState, useEffect } from 'react';

const ContentIntelligence = (props) => {
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentServer() {
    return (
      <div className="outter-games-container">
        {/* <iframe
          src="https://intel.decentral.games/embed/dashboard/11"
          frameBorder={0}
          width={800}
          height={600}
          allowTransparency
        /> */}

        {/* <iframe
          src="https://intel.decentral.games/public/dashboard/50db5987-28dd-4d2e-a47b-e33f78b2d267"
          frameborder="0"
          width="100%"
          height="100%"
          overflow="scroll"
          scrolling="no"
          allowtransparency
        ></iframe> */}

        <iframe
          src="https://intel.decentral.games/public/dashboard/50db5987-28dd-4d2e-a47b-e33f78b2d267"
          frameborder="0"
          allowTransparency
          overflow="hidden"
          height="2500px"
          // scrolling="no"
          // position="absolute"
          width="1340px"
        />
      </div>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentWebsite() {
    return <div className="outter-games-container">website intel...</div>;
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentDecentraland() {
    return <div className="outter-games-container">decentraland intel...</div>;
  }

  if (props.dashboard === 'server') {
    return contentServer();
  } else if (props.dashboard === 'website') {
    return contentWebsite();
  } else if (props.dashboard === 'decentraland') {
    return contentDecentraland();
  }
};

export default ContentIntelligence;
