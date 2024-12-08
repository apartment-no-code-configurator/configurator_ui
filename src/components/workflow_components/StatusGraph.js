
import React from 'react';
import Diagram, {
  Nodes,
  Edges,
} from 'devextreme-react/diagram';

const StatusGraph = ({ nodes = [], links = [] }) => {

  const onRequestEditOperation = ((e) => {
    if (e.operation === 'changeConnection' || e.operation === "changeConnectorPoints") {
      e.allowed=false;
    }
  })

  return (
      <Diagram
        autoZoomMode='disabled'
        zoomLevel={false}
        defaultItemProperties={{
        connectorLineEnd: "arrow",
        connectorLineStart:"none",
         connectorLineType:"orthogonal",
        }}
        snapToGrid={true}
        pageColor='white'
        pageOrientation='landscape'
        readOnly={false}
        showGrid={false}
        width={"100%"}
        visible={true}
        height={"100%"}
        viewToolbar={false}
        editing={false}
        simpleView={true}
        onRequestEditOperation={onRequestEditOperation}
      >
        <Nodes
          dataSource={nodes}
          typeExpr={"type"}
          textExpr="name"
          autoSizeEnabled={true}
        >
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
