import React, { Component } from 'react';
import { Form, Input, Dropdown, Button, Label } from 'semantic-ui-react';
import { Table } from 'semantic-ui-react';
import { API_HOST, GEN_ERR_MESSAGE } from '../../../utils/Constants';
import MultiSelectDropdown from "../../../utils/MultiSelectDropdown";
import axios from 'axios';
import { flashMessage } from '../../../utils/Utils';

export default class EditStatusForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rootStatusId: this.props.rootStatusId,
      originalStatusObj: this.props.statusObj,
      statusObj: this.props.statusObj,
      workflowId: this.props.workflowId,
      eligibleParentStatuses: [],
      eligibleChildrenStatuses: [],
      newParent: null,
      newChild: null,
      loading: true
    }
  }

  async getEligibleParentAndChildrenStatuses() {
    const { workflowId, rootStatusId, statusObj } = this.state;

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
        const {childrenIds, parentIds} = {...this.state.statusObj};
        const eligibleParentStatuses = [];
        result["data"].forEach((status) => {
          if (status["key"] !== statusObj.id) {
            eligibleParentStatuses.push({
              key: status["id"],
              text: status["label"],
              value: status["id"],
              selected: parentIds?.includes(status["id"]) ? true : false
            })
          }
        });

        const eligibleChildrenStatuses = [];
        result["data"].forEach((status) => {
          if (status.id !== rootStatusId && status["key"] !== statusObj.id)  {
            eligibleChildrenStatuses.push({
              key: status["id"],
              text: status["label"],
              value: status["id"],
              selected: childrenIds?.includes(status["id"]) ? true : false
            });
          }
        });

        this.setState({
          eligibleParentStatuses,
          eligibleChildrenStatuses,
          loading: false
        })
      } else {
        throw response
      }
    } catch(error) {
      console.log(error)
    }
  }

  componentDidMount() {
    this.getEligibleParentAndChildrenStatuses()
  }

  handleLabelValueChange = (event, data) => {
    const { statusObj } = this.state;
    statusObj.setLabel(data.value);
    this.setState({
      statusObj
    })
  }

  generateHeaders(){
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}`
    }
  }

  updateStatus = (event) => {
    event.preventDefault();
    const { statusObj, eligibleChildrenStatuses, eligibleParentStatuses } = this.state;

    this.setState({
      loading: true
    });
    const payload = {
      label: statusObj.name(),
      parent_statuses: [],
      child_statuses: []
    };
    payload["label"] = statusObj.name();
    eligibleParentStatuses.forEach((item) => {
      if (item.selected) {
        payload.parent_statuses.push({
          id: item.value,
          rule: "[]"
        });
      }
    });
    eligibleChildrenStatuses.forEach((item) => {
      if (item.selected) {
        payload.child_statuses.push({
          id: item.key,
          rule: "[]"
        });
      }
    });

    axios.put(`https://${API_HOST}/workflow_service/status/${statusObj.id}/edit`, payload, {
      headers: this.generateHeaders()
    })
    .then((response) => {
      if (response.status === 201) {
        this.props.closeForm(response);
      } else {
        throw response;
      }
      flashMessage("cont-success-message", "Status Updated Successfully");
    })
    .catch((err) => {
      this.setState({
        loading: false
      });
      flashMessage("slider-error-message", GEN_ERR_MESSAGE);
    });
  }

  //generate code to add one section for name update, another for status variables create/edit and another section for editing parent status and another section for editing/adding children statuses

  handleParentStatusChange = (e, { name, value }) => {
    //it should update parent status id in the status object
    // const { statusObj } = this.state;
    this.setState({
      newParent: value
    })
  }

  editParentStatus = (event) => {
    event.preventDefault();
    const { statusObj, originalStatusObj, newParent } = this.state;
    const ifSuccess = statusObj.editParentStatus(newParent);
    if (ifSuccess === true) {
      this.props.fetchWorkflow()
      this.setState({
        statusObj: statusObj.clone(),
        originalStatusObj: statusObj.clone(),
        newParent: null
      })
    } else {
      alert("Parent status update failed")
      this.setState({
        statusObj: originalStatusObj,
        newParent: null
      })
    }
  }

  editChildStatus = (event) => {
    event.preventDefault();
    const { statusObj, originalStatusObj, newChild } = this.state;
    const ifSuccess = statusObj.editChildStatus(newChild);

    if (ifSuccess === true) {
      this.props.fetchWorkflow()
      this.setState({
        statusObj: statusObj.clone(),
        originalStatusObj: statusObj.clone(),
        newChild: null
      })
    } else {
      alert("Child status update failed")
      this.setState({
        statusObj: originalStatusObj,
        newChild: null
      })
    }
  }

  handleChildStatusChange = (e, { name, value }) => {
    //it should update child status id in the status object
    this.setState({
      newChild: value
    })
  }

  render() {
    const { eligibleParentStatuses, eligibleChildrenStatuses, statusObj, loading } = this.state;

    return (
      <Form className={`edit-status-form ${loading ? "loading" : ""}`} onSubmit={this.updateStatus}>
        <Form.Input
          label="Label"
          name="label"
          value={this.state.statusObj.content}
          onChange={this.handleLabelValueChange}
        />
        <h5>Status Linking</h5>
        <Form.Group widths="equal">
          <Form.Field>
            <MultiSelectDropdown
              label="Parent Statuses"
              options={eligibleParentStatuses}
              onChange={(eligibleNewParentStatuses) => {
                this.setState({
                  eligibleNewParentStatuses
                })
              }}
            />
          </Form.Field>
          <Form.Field>
            <MultiSelectDropdown
              label="Child Statuses"
              options={eligibleChildrenStatuses}
              onChange={(eligibleNewChildrenStatuses) => {
                this.setState({
                  eligibleNewChildrenStatuses
                })
              }}
            />
          </Form.Field>
        </Form.Group>
        <Button type="submit">Update</Button>
      </Form>
    )
  }
}
