import React, { Component } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import OptionsSection from './OptionsSection';
import { IoCloseOutline } from "react-icons/io5";
import { DATA_TYPES } from '../../constants';

export default class VariableModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      originalVariable: this.props.originalVariable,
      selectedVariable: this.props.selectedVariable,
      variableSelectedStatus: this.props.variableSelectedStatus
    }
  }

  closeModal = (event) => {
    event.preventDefault();
    const { originalVariable } = this.state;

    this.setState({
      selectedVariable: originalVariable
    })
    this.props.closeModal()
  }

  render() {
    const { selectedVariable } = this.state;

    return (
      <Modal open={selectedVariable !== null} className='app-modal' onClose={this.closeModal} closeIcon={<IoCloseOutline className='modal-close-icon'/>} id="variable-centered-modal" style={{
        height: "70%",
        overflow: "auto"
      }}>
        <Modal.Header>Edit Tag</Modal.Header>
        <Modal.Content>
          <Form className='status-variable-form' onSubmit={this.handleSubmit}> 
            <Form.Group widths='equal'>
              <Form.Input
                fluid
                label='Name'
                placeholder='Name'
                value={selectedVariable.name}
                onChange={(e, data) => {
                  const { selectedVariable } = this.state;
                  selectedVariable.setName(data.value)
                  this.setState({ selectedVariable })
                }}
              />
              <Form.Select
                fluid
                label='Data Type'
                value={selectedVariable.dataType}
                onChange={(e,data) => {
                  selectedVariable.setDataType(data.value)
                  this.setState({ selectedVariable })
                }}
                placeholder='Select Type'
                options={DATA_TYPES}
              />
            </Form.Group>

            <Form.Field>
              <label>Description</label>
              <textarea
                value={selectedVariable.description}
                onChange={(e) => {
                  const { selectedVariable } = this.state;
                  selectedVariable.setDescription(e.target.value)
                  this.setState({ selectedVariable })
                }}
              />
            </Form.Field>
            {
              selectedVariable.dataType === "select" || selectedVariable.dataType === "select_boxes" || selectedVariable.dataType === "radio" ? (
                <Form.Field>
                  <label>Options</label>
                  <OptionsSection selectedVariable={selectedVariable} />
                </Form.Field>
              ) : ""
            }
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="button"
            onClick={(event) => {
              const { selectedVariable, variableSelectedStatus } = this.state;
              if (selectedVariable.createOrUpdateVariable(variableSelectedStatus.id)) {
                this.setState({
                  originalVariable: selectedVariable
                })
              }
            }}
          >Save Changes</Button>
          <Button type="button" onClick={this.closeModal}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
