import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import axios from 'axios';

function SubgraphQuery() {
  // dispatch subgraph query data to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // query data from pointer contract subgraph API
  useEffect(() => {
    // (async () => {
    //   const subgraphData = await axios.post(
    //     `https://api.thegraph.com/subgraphs/name/mobiman1/dg-pointer-lax`,
    //     {
    //       query: `{
    //         exampleEntities(first: 500) {
    //           id
    //           affiliate
    //           player
    //           points
    //           total
    //         }
    //       }`,
    //     }
    //   );

    //   const data = subgraphData.data.data.exampleEntities;

    //   const snapshotData = await axios.post(
    //     `https://hub.snapshot.page/graphql`,
    //     {
    //       query: `{
    //         proposals (
    //           first: 3,
    //           skip: 0,
    //           where: {
    //             space_in: ["decentralgames.eth"],
    //             state: ""
    //           },
    //           orderBy: "created",
    //           orderDirection: desc
    //         ) {
    //           id
    //           title
    //           body
    //           choices
    //           start
    //           end
    //           snapshot
    //           state
    //           author
    //           space {
    //             id
    //             name
    //           }
    //         }
    //       }`,
    //     }
    //   );

    //   const data_snapshot = snapshotData.data.data.proposals;

    //   dispatch({
    //     type: 'subgraph_data',
    //     data: data,
    //   });

    //   dispatch({
    //     type: 'snapshot_data',
    //     data: data_snapshot,
    //   });

    // })();
  }, []);

  return null;
}

export default SubgraphQuery;
