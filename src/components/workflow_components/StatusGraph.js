
import React from 'react';
import Diagram, {
  Nodes,
  Edges,
  AutoLayout
} from 'devextreme-react/diagram';
import { hideLicenseTags, observeLicenseTags } from '../../utils/Utils';
import "./StatusGraph.css";


const StatusGraph = ({ nodes = [], links = [], editStatusEnable }) => {

  const onRequestEditOperation = ((e) => {
    if (e.operation === 'changeConnection') {
      e.allowed=false;
    }
  })

  hideLicenseTags();

  return (
      <Diagram
        defaultItemProperties={{
        connectorLineEnd: "arrow",
        connectorLineStart:"none",
        }}
        className="status-graph"
        pageOrientation='landscape'
        readOnly={false}
        showGrid={false}
        width={"100%"}
        visible={true}
        height={"500px"}
        viewToolbar={true}
        editing={true}
        simpleView={true}
        onItemClick={(itemData) => {
          editStatusEnable(itemData.item.dataItem);
        }}
        onRequestEditOperation={onRequestEditOperation}
      >
        <Nodes
          dataSource={nodes}
          typeExpr={"type"}
          textExpr="name"
          autoSizeEnabled={true}
        >
          <AutoLayout type="layered" />
        </Nodes>
        <Edges
          dataSource={links}
          fromExpr={"from"}
          toExpr={"to"}
          keyExpr={"id"}
        />
      </Diagram>
  );
};

export default StatusGraph;
