import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'store';
import Spinner from 'components/Spinner';
import ContentSubgraphs from 'components/content/ContentSubgraphs';
import Aux from 'components/_Aux';

const SubgraphData = props => {
  // get subgraph data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [isLoading, setIsLoading] = useState(true);

  const dataType = props.dataType;

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (state.subgraphData.length) {
      setIsLoading(false);
    }
  }, [state.subgraphData]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div className={styles.main_container}>
      {isLoading ? (
        <Spinner background={1} />
      ) : (
        <Aux>
          <div className={styles.page_container}>
            <div className={styles.account_other_inner_container}>
              <ContentSubgraphs
                content={dataType}
                subgraphData={state.subgraphData}
              />
            </div>
          </div>
        </Aux>
      )}
    </div>
  );
};

export default SubgraphData;
