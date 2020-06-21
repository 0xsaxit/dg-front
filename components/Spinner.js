import spin from '../static/images/spin.gif';

const Spinner = (props) => {
  if (props.background == 0) {
    return <img src={spin} className="spinner" />;
  } else if (props.background == 1) {
    return (
      <div className="snow">
        <img src={spin} className="spinner" />
      </div>
    );
  } else if (props.background == 2) {
    return (
      <div className="black">
        <img src={spin} className="spinner" />
      </div>
    );
  } else {
    return null;
  }
};

export default Spinner;
