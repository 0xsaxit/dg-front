const ContentIntelligence = (props) => {
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentServer() {
    return (
      <div className="outter-games-container">
        <iframe
          src="https://intel.decentral.games/public/dashboard/50db5987-28dd-4d2e-a47b-e33f78b2d267"
          frameborder="0"
          allowTransparency
          overflow="hidden"
          height="2500px"
          width="1340px"
        />
      </div>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentWebsite() {
    return (
      <div className="outter-games-container">
        <div className="outter-games-container">
          <iframe
            src="https://intel.decentral.games/public/dashboard/c8c993b4-f0ef-45af-b702-e8ddfbff1b3f"
            frameborder="0"
            allowTransparency
            overflow="hidden"
            height="1500px"
            width="1340px"
          />
        </div>
      </div>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentDecentraland() {
    return (
      <div className="outter-games-container">
        Decentraland intel coming soon...
      </div>
    );
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
