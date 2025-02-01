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
import FlatForm from './FlatForm';
import './Flats.css';
import { CLoader } from '../../../utils/CLoader';

class Flats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flats: [],
      blocks: [], // To store block data for dropdown
      showForm: false,
      selectedFlat: null,
      loading: true
    };
  }

  componentDidMount() {
    this.fetchBlocks();
    this.fetchFlats();
  }

  // Stub API calls
  fetchBlocks = () => {
    // Simulating API call
    setTimeout(() => {
      const stubBlockData = [
        { id: 1, name: 'Block A', code: 'BLK-A' },
        { id: 2, name: 'Block B', code: 'BLK-B' },
      ];
      this.setState({ blocks: stubBlockData });
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
      this.setState({ blocks: data });
    })
    .catch(error => {
      console.error('Error fetching blocks:', error);
    });
    */
  };

  fetchFlats = () => {
    // Simulating API call
    setTimeout(() => {
      const stubData = [
        {
          id: 1,
          name: 'Building A',
          blockId: 1,
          blockName: 'Block A',
          floors: 5,
          units: 20
        },
        {
          id: 2,
          name: 'Building B',
          blockId: 2,
          blockName: 'Block B',
          floors: 4,
          units: 16
        },
      ];
      this.setState({ flats: stubData, loading: false });
    }, 500);

    // Actual API call (uncomment and modify the route as needed)
    /*
    fetch(`https://your-api-endpoint.com/flats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('your_token')}`
      }
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ flats: data, loading: false });
    })
    .catch(error => {
      console.error('Error fetching flats:', error);
      this.setState({ loading: false });
    });
    */
  };

  handleDelete = (flatId) => {
    // Simulating API call
    setTimeout(() => {
      this.setState(prevState => ({
        flats: prevState.flats.filter(flat => flat.id !== flatId)
      }));
    }, 500);

    // Actual API call (uncomment and modify the route as needed)
    /*
    fetch(`https://your-api-endpoint.com/flats/${flatId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('your_token')}`
      }
    })
    .then(response => {
      if (response.ok) {
        this.setState(prevState => ({
          flats: prevState.flats.filter(flat => flat.id !== flatId)
        }));
      }
    })
    .catch(error => {
      console.error('Error deleting flat:', error);
    });
    */
  };

  handleEdit = (flat) => {
    this.setState({ showForm: true, selectedFlat: flat });
  };

  handleAdd = () => {
    this.setState({ showForm: true, selectedFlat: null });
  };

  handleFormClose = () => {
    this.setState({ showForm: false, selectedFlat: null });
  };

  handleFormSubmit = (flatData) => {
    // Get block name from block id
    const blockName = this.state.blocks.find(block => block.id === flatData.blockId)?.name || '';

    // Simulating API call
    setTimeout(() => {
      if (flatData.id) {
        // Edit
        this.setState(prevState => ({
          flats: prevState.flats.map(flat =>
            flat.id === flatData.id ? { ...flatData, blockName } : flat
          ),
          showForm: false
        }));
      } else {
        // Create
        const newFlat = {
          id: Math.max(...this.state.flats.map(f => f.id), 0) + 1,
          ...flatData,
          blockName
        };
        this.setState(prevState => ({
          flats: [...prevState.flats, newFlat],
          showForm: false
        }));
      }
    }, 500);

    // Actual API call (uncomment and modify the route as needed)
    /*
    const method = flatData.id ? 'PUT' : 'POST';
    const url = flatData.id
      ? `https://your-api-endpoint.com/flats/${flatData.id}`
      : `https://your-api-endpoint.com/flats`;

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('your_token')}`
      },
      body: JSON.stringify(flatData)
    })
    .then(response => response.json())
    .then(data => {
      this.fetchFlats(); // Refresh the list
    })
    .catch(error => {
      console.error('Error saving flat:', error);
    });
    */
  };

  renderActionButtons = (cellData) => {
    const flat = cellData.data;
    return (
      <div className="action-buttons" style={{ display: 'flex', gap: '5px' }}>
        <Button icon onClick={() => this.handleEdit(flat)} size="tiny">
          <Icon name="edit" />
        </Button>
        <Button icon onClick={() => this.handleDelete(flat.id)} size="tiny">
          <Icon name="trash" />
        </Button>
      </div>
    );
  };

  render() {
    const { flats, blocks, showForm, selectedFlat, loading } = this.state;

    return (
      <div className="flats">
        {loading ? <CLoader height="200px" /> : (
          <DataGrid
            dataSource={flats}
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
              caption="Flat Building Name"
            />
            <Column
              dataField="blockName"
              caption="Block Name"
            />
            <Column
              dataField="floors"
              caption="Floors"
              dataType="number"
            />
            <Column
              dataField="units"
              caption="Units"
              dataType="number"
            />
            <Column
              caption="Actions"
              width="15%"
              allowFiltering={false}
              cellRender={this.renderActionButtons}
            />

            <Toolbar>
              <Item location="before">
                <Button primary onClick={this.handleAdd} style={{ marginRight: '10px' }}>
                  <Icon name="plus" /> Add New Flat
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
          <FlatForm
            flat={selectedFlat}
            blocks={blocks}
            onSubmit={this.handleFormSubmit}
            onClose={this.handleFormClose}
            onUpdateFloors={(flatId, newFloors) => {
              const updatedFlats = this.state.flats.map(f =>
                f.id === flatId ? { ...f, floors: newFloors } : f
              );
              this.setState({flats: [...updatedFlats] });
            }}
          />
        )}
      </div>
    );
  }
}

export default Flats;
