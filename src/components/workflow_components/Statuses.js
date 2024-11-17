import React, { Component } from 'react';
// import Diagram, { createSchema, useSchema } from 'beautiful-react-diagrams';
import 'beautiful-react-diagrams/styles.css';
import { Form, Tab, Button, Segment, Modal, ModalHeader, ModalContent, ModalActions, Image, ModalDescription } from 'semantic-ui-react';
import { Status } from '../../lib/StatusLib';
import StatusGraph from './GraphHooksNautanki';
import RightSideFormLayout from '../../util_components/RightSideFormLayout'
import StatusForm from './StatusForm';
import { refreshPage } from '../../utils/Utils';
import { Variable } from '../../lib/VariableLib';
import VariableModal from './VariableModal';
import { dataTypes } from '../../constants';
import { CiEdit } from "react-icons/ci";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

export default class Statuses extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedStatus: null,
      workflowObj: this.props.workflowObj,
      statuses: [],
      newStatusSelected: false,
      selectedStatusVariables: null,
      newVariable: new Variable(),
      selectedVariable: null,
      showAddNewVariablePopup: false
    }
  }

  updateEditVariable = (selectedVariable) => {
    this.setState({
      selectedVariable,
    });
  }

  editStatusEnable = (selectedStatus) => {
    this.setState({
      selectedStatus
    })
  }

  componentDidMount() {
    const { workflowObj } = this.state
    const statuses = [];
    const statusSet = new Set();
    const rootStatus = new Status(workflowObj.statuses[0], { x: 250, y: 60 })
    this.graph = workflowObj.statuses;
    rootStatus.setStartStatusFlag();
    this.rootStatusId = rootStatus.id;
    statuses.push(rootStatus)
    statusSet.add(rootStatus.id)
    const statusObjs = [...this.breadthFirstSearch(statuses, statusSet)]
    this.setState({
      statuses: statusObjs,
      selectedStatusVariables: statusObjs[0]
    })
  }

  breadthFirstSearch = (statuses, statusSet) => {
    const queue = [...statuses];
    while (true) {
      const topStatus = queue[0];
      topStatus.children.forEach((childObj) => {
        const childObjId = childObj.id
        if (!statusSet.has(childObjId)) {
          const childStatus = new Status(this.graph.find((status) => status.id === childObjId), { x: topStatus.children.find((child) => child.id === childObjId).coordinates.x, y: topStatus.coordinates.y + 75 })
          queue.push(childStatus)
          statuses.push(childStatus)
          statusSet.add(childObjId)
        }
      })
      queue.shift()
      if (queue.length === 0) {
        break;
      }
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

    //const { workflowObj } = this.state;

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
      <Button className='add-new-status-button' onClick={this.enableNewStatusAddition}>Add a new Status</Button>
    )
  }

  generateTabAndPanes = (tabPaneContent, status) => {
    const tabs = [];
    tabPaneContent.forEach((tabContent) => {
      tabs.push(
        {
          menuItem: tabContent.menuItem,
          render: () => (
            <Tab.Pane>
              {tabContent.render}
            </Tab.Pane>
          )
        }
      )
    })
    return <Tab panes={tabs} activeIndex={status.activePaneIndex} onTabChange={status.changeDetailsPaneIndex} />
  }

  renderForm = () => {
    const { newStatusSelected, selectedStatus, workflowObj } = this.state;
    // console.log("selectedStatus -")
    // console.log(selectedStatus)
    // console.log("---------")
    return (
      <RightSideFormLayout onClose={this.closeForm}>
        <StatusForm fetchWorkflow={this.props.fetchWorkflow} workflowId={workflowObj.id()} statusObj={newStatusSelected ? new Status({}, {}) : selectedStatus} closeForm={this.closeForm} rootStatusId={this.rootStatusId} />
      </RightSideFormLayout>
    )
  }

  renderStatusSelectionDropdown = () => {
    return this.state.statuses.map((status) => {
      return {
        key: status.id,
        text: status.name(),
        value: status.id
      }
    });
  }

  changeSelectedStatus = (evt, data) => {
    this.setState({
      selectedStatusVariables: this.state.statuses.find((status) => status.id === data.value),
      newVariable: new Variable()
    })
  }

  addNewVariable = () => {
    const { newVariable, selectedStatusVariables } = this.state;
    selectedStatusVariables.createVariable(newVariable)

    this.setState({
      selectedStatusVariables: selectedStatusVariables.clone(),
      newVariable: new Variable()
    })
  }

  render() {
    const { newStatusSelected, selectedStatus, newVariable, selectedStatusVariables, selectedVariable, showAddNewVariablePopup } = this.state;
    // console.log("Statuses - ")
    // console.log(this.state.statuses)
    // console.log("-------------------------")
    const schema = (this.renderStatusGraphSchema())
    // console.log("Bloddy state - ")
    // console.log(this.state)
    // console.log("Schema - ")
    // console.log(schema)
    // console.log("---------------------------------------")
    return (
      <div className='status-container'>
        <h3>Statuses</h3>
        {(newStatusSelected || selectedStatus) && this.renderForm()}
        {this.renderAddNewNodeButton()}
        {schema.nodes.length > 0 && (
          <StatusGraph nodes={schema.nodes} links={schema.links} />
        )}
        
        <Modal
          open={showAddNewVariablePopup}
          closeIcon={<IoCloseOutline className='modal-close-icon'/>}
          onClose={() => {
            this.setState({showAddNewVariablePopup: false})
          }}
        >
          <Modal.Header>Add Status Tags</Modal.Header>
          <Modal.Content>
            <Form className='status-variable-form' onSubmit={this.handleSubmit}> 
              <Form.Group widths='equal'>
                <Form.Select
                  fluid
                  label='Select Status'
                  onChange={this.changeSelectedStatus}
                  placeholder='Select Status'
                  options={this.renderStatusSelectionDropdown()}
                />
                <Form.Input
                  fluid
                  label='Name'
                  placeholder='Name'
                  value={newVariable.name}
                  onChange={(e) => {
                    const { newVariable } = this.state;
                    newVariable.setName(e.target.value)
                    this.setState({ newVariable: newVariable })
                  }}
                />
                <Form.Select
                  fluid
                  label='Data Type'
                  value={newVariable.dataType}
                  onChange={(e) => {
                    // const updatedVariable = { ...newVariable, dataType: e.target.value };
                    const { newVariable } = this.state;
                    newVariable.setDataType(e.target.value)
                    this.setState({ newVariable: newVariable })
                  }}
                  placeholder='Select Type'
                  options={dataTypes}
                />
              </Form.Group>

              <Form.Field>
                <label>Description</label>
                <textarea
                  value={newVariable.description}
                  onChange={(e) => {
                    const { newVariable } = this.state;
                    newVariable.setDescription(e.target.value)
                    this.setState({ newVariable: newVariable })
                  }}
                />
              </Form.Field>

              <Button type="button" onClick={this.addNewVariable}>Add</Button>
            </Form>
          </Modal.Content>
        </Modal>
        
        {selectedStatusVariables && selectedStatusVariables.variables && selectedStatusVariables.variables.length > 0 ? (
          <Segment className='list-existing-tags'>
            <div className='tag-list-header'>
              <h3 className='heading'>Existing tags for the selected status</h3>
              <span className='add-new-tag-link' onClick={() => this.setState({showAddNewVariablePopup: true})} tabIndex={0}>Add Tag</span>
            </div>
            <div className='variable-list'>
              {selectedStatusVariables.variables.map((variable) => {
                return (
                  <div className='variable-list-item' key={`tag_${variable.id}`}>
                    <span className='name'>{variable.name}</span>
                    <span className='actions'>
                      <FaRegEdit className="edit" onClick={() => this.updateEditVariable(variable)} title="Edit Tag" />
                      <FaRegTrashAlt className="delete"  onClick={() => {}} title='Delete Tag' />
                    </span>
                  </div>
                )
              })}
            </div>
          </Segment>
        ) : ""}

        <Button type="button">Save and move to next step</Button>
        
        
        {selectedVariable ? <VariableModal selectedVariable={selectedVariable} selectedStatusVariables={selectedStatusVariables} closeModal={() => this.updateEditVariable(null)} /> : <> </>}
      </div>
    );
  }
}
