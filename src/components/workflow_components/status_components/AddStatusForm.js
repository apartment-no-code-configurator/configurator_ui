import React, { Component } from 'react';
import { Form, Input, Dropdown, Label, Button } from 'semantic-ui-react';
import { API_HOST } from '../../../utils/Constants';

export default class AddStatusForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      statusObj: this.props.statusObj,
      workflowId: this.props.workflowId,
      eligibleParentStatuses: []
    }
  }

  async getEligibleParentStatuses() {
    const { workflowId } = this.state;

    try {
      if (!localStorage.getItem('apartix_session_id')) {
        return;
      }
      const response = await fetch(`https://${API_HOST}/workflow_service/workflows/${workflowId}/status_list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}` // Replace with your actual token or header value
        }
      });
      const result = await response.json();
      if (response.ok) {
        const eligibleParentStatuses = result["data"].map((status) => {
          return {
            key: status["id"],
            text: status["label"],
            value: status["id"]
          }
        })
        this.setState({
          eligibleParentStatuses
        })
      } else {
        throw response
      }
    } catch(error) {
      console.log(error)
    }
  }

  componentDidMount() {
    this.getEligibleParentStatuses()
  }

  handleLabelValueChange = (event) => {
    const { value } = event.target;
    this.newValueLabelValue = value;
  }

  handleParentStatusChange = (e, { name, value }) => {
    this.parentStatusId = value;
  }

  createStatus = (event) => {
    event.preventDefault();
    const { statusObj } = this.state;
    statusObj.createStatus(this.parentStatusId, this.newValueLabelValue)
  }

  render() {

    const { eligibleParentStatuses } = this.state;

    return (
      <Form className="add-status-form">
        <Form.Field>
          <label htmlFor='status-label'>Status Label</label>
          <Input requied style={{width: "200px"}} onChange={(event) => this.handleLabelValueChange(event)} />
        </Form.Field>
        {eligibleParentStatuses.length > 0 ? (
          <Form.Field>
            <label htmlFor='parent-status'>Parent Status</label>
            <Dropdown
              name="parent-status"
              placeholder='Select Parent Status'
              fluid
              selection
              options={eligibleParentStatuses}
              onChange={(e, { name, value }) => this.handleParentStatusChange(e, { name, value })}
            />
          </Form.Field>
        ) : ""}
        <Button type="submit" onClick={this.createStatus}>Create Status</Button>
      </Form>
    )
  }
}
