
import React from 'react';
import Diagram, { useSchema, createSchema } from 'beautiful-react-diagrams';

const StatusGraph = ({ nodes, links }) => {
  // console.log("nodes - ")
  // console.log(nodes)
  // console.log("links - ")
  // console.log(links)
  const initialSchema = createSchema({
    nodes,
    links,
    linkExtras: {
      arrowHead: 'arrow',
    },
  });
  // const initialSchema = createSchema({nodes, links});
  // console.log(initialSchema)
  // console.log("-----------------")
  const [schema, { onChange }] = useSchema(initialSchema);

  const styles = {
    height: "350px", position: "relative", margin: "10px 0", overflow: "auto"
  }

  return (
    <div style={styles} className='status-graph'>
      <Diagram schema={schema} onChange={onChange} />
    </div>
  );
};

export default StatusGraph;
