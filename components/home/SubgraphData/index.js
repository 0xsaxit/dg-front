import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'store';
import axios from 'axios';
import Spinner from 'components/Spinner';
import ContentSubgraphs from 'components/content/ContentSubgraphs';
import Aux from 'components/_Aux';

const SubgraphData = (props) => {
  // get subgraph data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [isLoading, setIsLoading] = useState(true);
  const [subgraphData, setSubgraphData] = useState([]);

  const dataType = props.dataType;

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (subgraphData.length) {
      setIsLoading(false);
    }
  }, [subgraphData]);

  useEffect(() => {
    (async function() {
      // let subgraphArray = [];

      const subgraphData = await axios.post(
        `https://api.thegraph.com/subgraphs/name/decentralgames/treasury`,
        {
          query: `{
            gravatars(first: 5) {
              id
              owner
              displayName
              imageUrl
            }
          }`,
        }
      );

      console.log('the graph data...');
      console.log(subgraphData.data.data.gravatars);

      // subgraphArray.push(subgraphData.data.data.pairs);

      // console.log('the graph array...');
      // console.log(subgraphArray);

      setSubgraphData(subgraphData.data.data.gravatars);
    })();
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div className="main-container">
      {isLoading ? (
        <Spinner background={1} />
      ) : (
        <Aux>
          <div className="page-container">
            <div className="account-other-inner-container">
              <ContentSubgraphs
                content={dataType}
                subgraphData={subgraphData}
              />
            </div>
          </div>
        </Aux>
      )}
    </div>
  );
};

export default SubgraphData;
