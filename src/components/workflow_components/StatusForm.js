import React, { Component } from 'react'
import AddStatusForm from './status_components/AddStatusForm'
import EditStatusForm from './status_components/EditStatusForm'

export default class StatusForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      statusObj: this.props.statusObj,
      workflowId: this.props.workflowId,
      newStatus: this.props.statusObj.id ? false : true
    };
    this.closeForm = this.props.closeForm;
  }

  formComponent = () => {

    const { newStatus, statusObj, workflowId } = this.state;
    const { rootStatusId } = this.props;

    return newStatus ? <AddStatusForm {...this.props}  /> : <EditStatusForm {...this.props} rootStatusId={rootStatusId} />;
  }

  render() {

    const { newStatus, statusObj } = this.state

    return (
      <>
        <h3>{newStatus ? "Add new status" : `Edit "${statusObj.content}" status`}</h3>
        {this.formComponent()}
      </>
    );
  }
}
