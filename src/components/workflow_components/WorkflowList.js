import React, { Component } from 'react'
import { DataGrid, Column, Toolbar, Item } from 'devextreme-react/data-grid';
import { Link } from 'react-router-dom';
import { Workflow } from '../../lib/WorkflowLib';
import Button from 'devextreme-react/button';
import { API_HOST } from '../../utils/Constants';
import { CLoader } from '../../utils/CLoader'; 

export default class WorkflowList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workflows: [],
      error: null,
      loading: true
    };
  }

  componentDidMount() {
    if (!localStorage.getItem('apartix_session_id')) {
      window.location.href = `${window.location.origin}/login`
    } else {
      this.fetchWorkflows();
    }
  }

  handleAddWorkflow = () => {
    window.location.href = `${window.location.origin}/workflows/new`
  }

  fetchWorkflows = async () => {
    try {
      const response = await fetch(`https://${API_HOST}/workflow_service/workflows`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}` // Replace with your actual token or header value
        }
      }); // Replace with your API endpoint
      const result = await response.json();
      if (response.ok) {
        const data = result["data"].map((workflowRecord) => {
          return new Workflow(workflowRecord)
        })
        this.setState({ workflows: data, loading: false });
      } else {
        this.setState({ error: result, loading: false });
      }
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  }

  render() {

    const { workflows, error, showWorkflowForm, selectedWorkflow, loading } = this.state;

    return (
      <div className='workflow-list-container'>
        <h1 className='page-title'>Workflow List</h1>
        {loading ? <CLoader height="200px" /> : <DataGrid
          dataSource={workflows}
          keyExpr="id"
          showBorders={true}
          width="100%"
          columnMinWidth="150px"
          showRowLines={true}
        >
          <Column dataField="name" caption="Name" calculateCellValue={(data) => data.name()} />
          <Column dataField="workflow_type" caption="Workflow Type" calculateCellValue={(data) => data.workflowType()} />
          <Column dataField="is_published" caption="Is Published" calculateCellValue={(data) => data.isPublished() ? "Published" : "Unpublished"} />
          <Column caption="Actions" cellRender={({data}) => (
            <Link to={`/workflows/${data.id()}`} className="ui button action-btn">{"View Details"}</Link>
          )} />
          <Toolbar>
            <Item location="after">
              <Link to="/workflows/new" className="ui button add-workflow-button">{"+ Add Workflow"}</Link>
            </Item>
          </Toolbar>
        </DataGrid>}
        

      </div>
    )
  }
}
