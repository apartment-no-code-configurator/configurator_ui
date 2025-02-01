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
import RowHouseBuildingForm from './RowHouseBuildingForm';
import './RowHouseBuildings.css';
import { CLoader } from '../../../utils/CLoader';

class RowHouseBuildings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowHouseBuildings: [],
      blocks: [], // To store block data for dropdown
      showForm: false,
      selectedBuilding: null,
      loading: true
    };
  }

  componentDidMount() {
    this.fetchBlocks();
    this.fetchRowHouseBuildings();
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

  fetchRowHouseBuildings = () => {
    // Simulating API call
    setTimeout(() => {
      const stubData = [
        {
          id: 1,
          name: 'Row House A',
          blockId: 1,
          blockName: 'Block A',
          floors: 2,
          units: 10
        },
        {
          id: 2,
          name: 'Row House B',
          blockId: 2,
          blockName: 'Block B',
          floors: 2,
          units: 8
        },
      ];
      this.setState({ rowHouseBuildings: stubData, loading: false });
    }, 500);

    // Actual API call (uncomment and modify the route as needed)
    /*
    fetch(`https://your-api-endpoint.com/row_house_buildings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('your_token')}`
      }
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ rowHouseBuildings: data, loading: false });
    })
    .catch(error => {
      console.error('Error fetching row house buildings:', error);
      this.setState({ loading: false });
    });
    */
  };

  handleDelete = (buildingId) => {
    // Simulating API call
    setTimeout(() => {
      this.setState(prevState => ({
        rowHouseBuildings: prevState.rowHouseBuildings.filter(building => building.id !== buildingId)
      }));
    }, 500);

    // Actual API call (uncomment and modify the route as needed)
    /*
    fetch(`https://your-api-endpoint.com/row_house_buildings/${buildingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('your_token')}`
      }
    })
    .then(response => {
      if (response.ok) {
        this.setState(prevState => ({
          rowHouseBuildings: prevState.rowHouseBuildings.filter(building => building.id !== buildingId)
        }));
      }
    })
    .catch(error => {
      console.error('Error deleting row house building:', error);
    });
    */
  };

  handleEdit = (building) => {
    this.setState({ showForm: true, selectedBuilding: building });
  };

  handleAdd = () => {
    this.setState({ showForm: true, selectedBuilding: null });
  };

  handleFormClose = () => {
    this.setState({ showForm: false, selectedBuilding: null });
  };

  handleFormSubmit = (buildingData) => {
    // Get block name from block id
    const blockName = this.state.blocks.find(block => block.id === buildingData.blockId)?.name || '';

    // Simulating API call
    setTimeout(() => {
      if (buildingData.id) {
        // Edit
        this.setState(prevState => ({
          rowHouseBuildings: prevState.rowHouseBuildings.map(building =>
            building.id === buildingData.id ? { ...buildingData, blockName } : building
          ),
          showForm: false
        }));
      } else {
        // Create
        const newBuilding = {
          id: Math.max(...this.state.rowHouseBuildings.map(b => b.id), 0) + 1,
          ...buildingData,
          blockName
        };
        this.setState(prevState => ({
          rowHouseBuildings: [...prevState.rowHouseBuildings, newBuilding],
          showForm: false
        }));
      }
    }, 500);

    // Actual API call (uncomment and modify the route as needed)
    /*
    const method = buildingData.id ? 'PUT' : 'POST';
    const url = buildingData.id
      ? `https://your-api-endpoint.com/row_house_buildings/${buildingData.id}`
      : `https://your-api-endpoint.com/row_house_buildings`;

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('your_token')}`
      },
      body: JSON.stringify(buildingData)
    })
    .then(response => response.json())
    .then(data => {
      this.fetchRowHouseBuildings(); // Refresh the list
    })
    .catch(error => {
      console.error('Error saving row house building:', error);
    });
    */
  };

  renderActionButtons = (cellData) => {
    const building = cellData.data;
    return (
      <div className="action-buttons" style={{ display: 'flex', gap: '5px' }}>
        <Button icon onClick={() => this.handleEdit(building)} size="tiny">
          <Icon name="edit" />
        </Button>
        <Button icon onClick={() => this.handleDelete(building.id)} size="tiny">
          <Icon name="trash" />
        </Button>
      </div>
    );
  };

  render() {
    const { rowHouseBuildings, blocks, showForm, selectedBuilding, loading } = this.state;

    return (
      <div className="row-house-buildings">
        {loading ? <CLoader height="200px" /> : (
          <DataGrid
            dataSource={rowHouseBuildings}
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
              caption="Row House Building Name"
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
                  <Icon name="plus" /> Add New Row House Building
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
          <RowHouseBuildingForm
            building={selectedBuilding}
            blocks={blocks}
            onSubmit={this.handleFormSubmit}
            onClose={this.handleFormClose}
            onUpdateFloors={(buildingId, newFloors) => {
              const updatedBuildings = this.state.rowHouseBuildings.map(b =>
                b.id === buildingId ? { ...b, floors: newFloors } : b
              );
              this.setState({ rowHouseBuildings: [...updatedBuildings] });
            }}
          />
        )}
      </div>
    );
  }
}

export default RowHouseBuildings;
