import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import axios from 'axios';

function SubgraphQuery() {
  // dispatch subgraph query data to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // query data from pointer contract subgraph API
  useEffect(() => {
    (async () => {
      const subgraphData = await axios.post(
        `https://api.thegraph.com/subgraphs/name/mobiman1/dg-pointer-lax`,
        {
          query: `{
            exampleEntities(first: 500) {
              id
              affiliate
              player
              points
              total
            }
          }`,
        }
      );

      const data = subgraphData.data.data.exampleEntities;

      // console.log('subgraph data');
      // console.log(data);

      dispatch({
        type: 'subgraph_data',
        data: data,
      });
    })();
  }, []);

  return null;
}

export default SubgraphQuery;
