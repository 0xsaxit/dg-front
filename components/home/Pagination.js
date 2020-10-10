import { Icon } from 'semantic-ui-react';

const Pagination = (props) => {
  function pagination() {
    const previousPage = props.currentPage - 1;
    const nextPage = props.currentPage + 1;

    return (
      <div className="pagination" style={{ paddingTop: '12px' }}>
        {props.currentPage > 1 ? (
          <Icon
            name="caret left"
            style={{ cursor: 'pointer', color: '#2085F4' }}
            onClick={() => props.setUserData(props.dataType, previousPage)}
          />
        ) : (
          <Icon name="caret left" style={{ color: '#aaaaaa' }} />
        )}

        <span
          className="spanbox"
          style={{ padding: '6px 15px', display: 'inline-block' }}
        >
          Page {props.currentPage}
        </span>

        {props.dataLength > props.maximumCount * props.currentPage ? (
          <Icon
            name="caret right"
            style={{ cursor: 'pointer', color: '#2085F4' }}
            onClick={() => props.setUserData(props.dataType, nextPage)}
          />
        ) : (
          <Icon name="caret right" style={{ color: '#aaaaaa' }} />
        )}
      </div>
    );
  }

  return pagination();
};

export default Pagination;
