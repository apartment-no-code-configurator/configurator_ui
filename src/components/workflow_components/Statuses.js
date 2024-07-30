import React, { Component } from 'react';
// import Diagram, { createSchema, useSchema } from 'beautiful-react-diagrams';
import 'beautiful-react-diagrams/styles.css';
import { Form, Tab, Button } from 'semantic-ui-react';
import { Status } from '../../lib/StatusLib';
import StatusGraph from './GraphHooksNautanki';
// import RightSideFormLayout from '../../util_components/RightSideFormLayout';
import StatusForm from './StatusForm';

export default class Statuses extends Component {

  constructor(props){
    super(props)
    this.state = {
      selectedStatus: null,
      workflowObj: this.props.workflowObj,
      statuses: [],
      newStatusSelected: false
    }
  }

  editStatusEnable = (selectedStatus) => {
    this.setState( {
      selectedStatus
    })
  }

  componentDidMount() {
    const { workflowObj } = this.state
    const statuses = [];
    const statusSet = new Set();
    const rootStatus = new Status(workflowObj.statuses, {x: 250, y: 60})
    statuses.push(rootStatus)
    statusSet.add(rootStatus.id)
    this.setState({
      statuses: [...this.breadthFirstSearch(statuses, statusSet)]
    })
  }

  breadthFirstSearch = (statuses, statusSet) => {
    const queue = [...statuses];
    while(queue.length > 0) {
      const topStatus = statuses[0];
      topStatus.children.forEach((childObj) => {
        const childObjId = childObj.id
        if (!statusSet.has(childObjId)){
          queue.push(childObj)
          statuses.push(childObj)
          statusSet.add(childObjId)
        }
      })
      queue.pop()
    }
    return statuses
  }

  closeForm = () => {
    const { newStatusSelected } = this.state;
    if (newStatusSelected) {
      this.setState({
        newStatusSelected: false
      })
    } else {
      this.setState({
        selectedStatus: null
      })
    }
  }

  handleSubmit = () => {

    const { workflowObj } = this.state;

    try {
      // if (workflowObj.id()) {
      //   workflowObj.updateObj();
      // } else {
      //   workflowObj.createObj();
      // }
      this.props.updateActivePaneIndex(2)

    } catch (error) {
      console.log(error)
    }
  }

  renderStatusGraphSchema = () => {
    const { statuses } = this.state
    const nodes = [];
    const links = [];
    statuses.forEach((status) => {
      nodes.push(status.generateDiagramJson({ updateFunctionCallback: this.editStatusEnable }));
      const statusLinks = status.generateLinks();
      statusLinks.forEach((status) => {
        links.push(status)
      })
    })

    const schema = {
      nodes,
      links
    }
    return (
      schema
    )
  }

  enableNewStatusAddition = () => {
    this.setState({
      newStatusSelected: true
    })
  }

  renderAddNewNodeButton = () => {
    return (
      <div>
        <Button className='add-new-status-button' onClick={this.enableNewStatusAddition}>Add a new Status</Button>
      </div>
    )
  }

  generateTabAndPanes = (tabPaneContent, status) => {
    const tabs = [];
    tabPaneContent.forEach((tabContent) => {
      tabs.push(
        {
          menuItem: tabContent.menuItem,
          render: () => {
            return (
              <Tab.Pane>
                {tabContent.render}
              </Tab.Pane>
            )
          }
        }
      )
    })
    return (
      <div>
        <Tab panes={tabs} activeIndex={status.activePaneIndex} onTabChange={status.changeDetailsPaneIndex}/>
      </div>
    )
  }

  renderForm = () => {
    const { newStatusSelected, selectedStatus, workflowObj } = this.state;
    console.log("selectedStatus -")
    console.log(selectedStatus)
    console.log("---------")
    return (
      <>
        <StatusForm workflowId={workflowObj.id()} statusObj={newStatusSelected ? new Status({}, {}) : selectedStatus} closeForm={this.closeForm}/>
      </>
    )
  }

  render() {
    const { newStatusSelected, selectedStatus } = this.state;
    const schema = (this.renderStatusGraphSchema())
    // console.log("Bloddy state - ")
    // console.log(this.state)
    // console.log("Schema - ")
    // console.log(schema)
    // console.log("---------------------------------------")
    return (
      <h3>
        Statuses

        {(newStatusSelected || selectedStatus) && this.renderForm()}
        {this.renderAddNewNodeButton()}
        { schema.nodes.length > 0 && <StatusGraph
          nodes={schema.nodes}
          links={schema.links}
        />}
        <Form onSubmit={this.handleSubmit}>
          <Button type='submit'>Save and move to next step</Button>
        </Form>
      </h3>
    )
  }
}
