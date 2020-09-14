import Global from './Constants';

const Spinner = (props) => {
  if (props.background == 0) {
    return <img src={Global.IMAGES.LOADING_SPINNER} className="spinner" />;
  } else if (props.background == 1) {
    return (
      <div className="snow">
        <img src={Global.IMAGES.LOADING_SPINNER} className="spinner" />
      </div>
    );
  } else if (props.background == 2) {
    return (
      <div className="black">
        <img src={Global.IMAGES.LOADING_SPINNER} className="spinner" />
      </div>
    );
  } else if (props.background == 3) {
    return (
      <div className="bug-fix">
        <img src={Global.IMAGES.LOADING_SPINNER} className="spinner" />
      </div>
    );
  } else {
    return null;
  }
};

export default Spinner;
