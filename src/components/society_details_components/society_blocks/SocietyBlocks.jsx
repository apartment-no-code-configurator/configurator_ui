import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import DataGrid, {
  Column,
  Paging,
  Pager,
  SearchPanel,
  HeaderFilter,
  Toolbar,
  Item
} from 'devextreme-react/data-grid';
import BlockForm from './BlockForm';
import { formatDate } from '../../../utils/dateUtils';
import './SocietyBlocks.css';
import { CLoader } from '../../../utils/CLoader';

class SocietyBlocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blocks: [],
      showForm: false,
      selectedBlock: null,
      loading: true
    };
  }

  componentDidMount() {
    this.fetchBlocks();
  }

  // Stub API calls
  fetchBlocks = () => {
    // Simulating API call
    setTimeout(() => {
      const stubData = [
        { id: 1, name: 'Block A', code: 'BLK-A', updatedAt: '2024-03-20T10:00:00Z' },
        { id: 2, name: 'Block B', code: 'BLK-B', updatedAt: '2024-03-19T15:30:00Z' },
      ];
      this.setState({ blocks: stubData, loading: false });
    }, 500);

    // Actual API call (uncomment and modify the route as needed)
    /*
    fetch(`https://your-api-endpoint.com/society_blocks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('your_token')}`
      }
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ blocks: data, loading: false });
    })
    .catch(error => {
      console.error('Error fetching blocks:', error);
      this.setState({ loading: false });
    });
    */
  };

  handleDelete = (blockId) => {
    // Simulating API call
    setTimeout(() => {
      this.setState(prevState => ({
        blocks: prevState.blocks.filter(block => block.id !== blockId)
      }));
    }, 500);

    // Actual API call (uncomment and modify the route as needed)
    /*
    fetch(`https://your-api-endpoint.com/society_blocks/${blockId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('your_token')}`
      }
    })
    .then(response => {
      if (response.ok) {
        this.setState(prevState => ({
          blocks: prevState.blocks.filter(block => block.id !== blockId)
        }));
      } else {
        console.error('Error deleting block:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error deleting block:', error);
    });
    */
  };

  handleEdit = (block) => {
    this.setState({ showForm: true, selectedBlock: block });
  };

  handleAdd = () => {
    this.setState({ showForm: true, selectedBlock: null });
  };

  handleFormClose = () => {
    this.setState({ showForm: false, selectedBlock: null });
  };

  handleFormSubmit = (blockData) => {
    // Simulating API call
    setTimeout(() => {
      if (blockData.id) {
        // Edit
        this.setState(prevState => ({
          blocks: prevState.blocks.map(block =>
            block.id === blockData.id ? { ...blockData, updatedAt: new Date().toISOString() } : block
          ),
          showForm: false
        }));
      } else {
        // Create
        const newBlock = {
          id: Math.max(...this.state.blocks.map(b => b.id), 0) + 1,
          ...blockData,
          updatedAt: new Date().toISOString()
        };
        this.setState(prevState => ({
          blocks: [...prevState.blocks, newBlock],
          showForm: false
        }));
      }
    }, 500);

    // Actual API call (uncomment and modify the route as needed)
    /*
    const method = blockData.id ? 'PUT' : 'POST';
    const url = blockData.id
      ? `https://your-api-endpoint.com/society_blocks/${blockData.id}`
      : `https://your-api-endpoint.com/society_blocks`;

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('your_token')}`
      },
      body: JSON.stringify(blockData)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error saving block');
      }
    })
    .then(data => {
      this.setState(prevState => ({
        blocks: blockData.id
          ? prevState.blocks.map(block => block.id === data.id ? data : block)
          : [...prevState.blocks, data],
        showForm: false
      }));
    })
    .catch(error => {
      console.error('Error saving block:', error);
    });
    */
  };

  handleTemplateDownload = () => {
    // Implement template download logic
    console.log('Downloading template...');
  };

  handleTemplateUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Implement template upload logic
      console.log('Uploading template...', file);
    }
  };

  renderActionButtons = (cellData) => {
    const block = cellData.data;
    return (
      <div className="action-buttons" style={{ display: 'flex', gap: '5px' }}>
        <Button icon onClick={() => this.handleEdit(block)} size="tiny">
          <Icon name="edit" />
        </Button>
        <Button icon onClick={() => this.handleDelete(block.id)} size="tiny">
          <Icon name="trash" />
        </Button>
      </div>
    );
  };

  render() {
    const { blocks, showForm, selectedBlock, loading } = this.state;

    return (
      <div className="society-blocks">
        {loading ? <CLoader height="200px" /> : (
          <DataGrid
            dataSource={blocks}
            showBorders={true}
            width="100%"
            columnMinWidth="120px"
            showRowLines={true}
            height="calc(100vh - 200px)"
          >
            <HeaderFilter visible={true} />
            <SearchPanel visible={true} placeholder="Search..." />

            <Column
              dataField="name"
              caption="Name of Block"
            />
            <Column
              dataField="code"
              caption="Code of Block"
            />
            <Column
              dataField="updatedAt"
              caption="Last Updated At"
              cellRender={(cellData) => formatDate(cellData.value)}
            />
            <Column
              caption="Actions"
              width="15%"
              allowFiltering={false}
              cellRender={this.renderActionButtons}
            />

            <Toolbar style={{ marginTop: '10px' }}>
              <Item location="before">
                <Button primary onClick={this.handleAdd} style={{ marginRight: '10px' }}>
                  <Icon name="plus" /> Add New Block
                </Button>
                <Button onClick={this.handleTemplateDownload} style={{ marginRight: '10px' }}>
                  <Icon name="download" /> Download Template
                </Button>
                <Button as="label" htmlFor="template-upload" style={{ marginRight: '10px' }}>
                  <Icon name="upload" /> Upload Template
                  <input
                    type="file"
                    id="template-upload"
                    hidden
                    onChange={this.handleTemplateUpload}
                    accept=".xlsx,.xls,.csv"
                  />
                </Button>
              </Item>
            </Toolbar>

            <Paging defaultPageSize={10} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={[5, 10, 20]}
              showInfo={true}
            />
          </DataGrid>
        )}

        {showForm && (
          <BlockForm
            block={selectedBlock}
            onSubmit={this.handleFormSubmit}
            onClose={this.handleFormClose}
          />
        )}
      </div>
    );
  }
}

export default SocietyBlocks;
