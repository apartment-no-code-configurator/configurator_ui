import React, { Component } from 'react';
// import Diagram, { createSchema, useSchema } from 'beautiful-react-diagrams';
import 'beautiful-react-diagrams/styles.css';
import { Form, Tab, Button, Segment, Modal, Dropdown } from 'semantic-ui-react';
import { Status } from '../../lib/StatusLib';
import StatusGraph from './StatusGraph';
import RightSideFormLayout from '../../util_components/RightSideFormLayout'
import StatusForm from './StatusForm';
import { Variable } from '../../lib/VariableLib';
import VariableModal from './VariableModal';
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { flashMessage } from '../../utils/Utils';
import { GEN_ERR_MESSAGE , DATA_TYPES} from '../../utils/Constants';
import FlashMessages from '../FlashMessages';

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
      showAddNewVariablePopup: false,
      variablePopupLoading: false
    }
  }

  updateEditVariable = (selectedVariable) => {
    this.setState({
      selectedVariable,
    });
  }

  editStatusEnable = (selectedStatus) => {
    this.setState({
      selectedStatus: this.state.statuses.find((status) => status.id === selectedStatus.id)
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
    return statuses;
  }

  closeForm = (response) => {
    const _this = this;
    const { newStatusSelected } = this.state;
    if (newStatusSelected) {
      this.setState({
        newStatusSelected: false
      }, () => {
        if (response?.status === 201) {
          _this.props.fetchWorkflow();
        }
      });
    } else {
      this.setState({
        selectedStatus: null
      });
      if (response?.status === 201) {
        _this.props.fetchWorkflow();
      }
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
      nodes.push({
        id: status.id,
        name: status.name(),
        type: "rectangle"
      });
      status.childrenIds.forEach((childId) => {
        links.push({
          id: `${status.id}${childId}`,
          from: status.id,
          to: childId
        });
      })
      status.parentIds.forEach((parentId) => {
        links.push({
          id: `${status.id}${parentId}`,
          from: parentId,
          to: status.id
        });
      });
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

  addNewVariable = async () => {
    const { newVariable, selectedStatusVariables } = this.state;
    this.setState({
      variablePopupLoading: true
    })
    const response = await selectedStatusVariables.createVariable(newVariable);
    if (response) {
      this.setState({
        selectedStatusVariables: selectedStatusVariables.clone(),
        newVariable: new Variable(),
        showAddNewVariablePopup: false,
        variablePopupLoading: false
      }, () => {
        flashMessage("cont-success-message", "Tag added successfully");
      });
    } else {
      this.setState({
        variablePopupLoading: false
      });
      flashMessage("popup-error-message", GEN_ERR_MESSAGE)
    }
    
  }

  render() {
    const { newStatusSelected, selectedStatus, newVariable, selectedStatusVariables, selectedVariable, showAddNewVariablePopup, variablePopupLoading } = this.state;
    const schema = (this.renderStatusGraphSchema())
    return (
      <div className='status-container'>
        <h3>Statuses</h3>
        {(newStatusSelected || selectedStatus) && this.renderForm()}
        {this.renderAddNewNodeButton()}
        {schema.nodes.length > 0 && (
          <StatusGraph nodes={schema.nodes} links={schema.links} editStatusEnable={this.editStatusEnable} />
        )}

        <Modal
          open={showAddNewVariablePopup}
          className='app-modal'
          closeIcon={<IoCloseOutline className='modal-close-icon'/>}
          onClose={() => {
            this.setState({showAddNewVariablePopup: false})
          }}
        >
          <Modal.Header>Add Status Tags</Modal.Header>
          <Modal.Content>
            <FlashMessages errorId="popup-error-message" successId="popup-success-message" />
            <Form className={`status-variable-form ${variablePopupLoading ? "loading" : ""}`}>
              <Form.Group widths='equal'>
                <Form.Select
                  fluid
                  label='Select Status'
                  value={selectedStatusVariables?.id || null}
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
                  options={DATA_TYPES}
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
        <Segment>
          <Form>
            <Form.Select
              fluid
              label='Select Status'
              value={selectedStatusVariables?.id || null}
              onChange={this.changeSelectedStatus}
              placeholder='Select Status'
              options={this.renderStatusSelectionDropdown()}
              upward={false}
            />
          </Form>
        </Segment>
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
        ) : (
          <Segment>
            <div className='tag-list-header'>
              <h3 className='heading'>No existing tags for the selected status</h3>
              <span className='add-new-tag-link' onClick={() => this.setState({showAddNewVariablePopup: true})} tabIndex={0}>Add Tag</span>
            </div>
          </Segment>
        )}

        <Button type="button" onClick={this.handleSubmit}>Save and move to next step</Button>


        {selectedVariable ? <VariableModal selectedVariable={selectedVariable} selectedStatusVariables={selectedStatusVariables} closeModal={() => this.updateEditVariable(null)} /> : <> </>}
      </div>
    );
  }
}
