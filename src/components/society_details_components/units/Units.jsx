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
import UnitForm from './UnitForm';
import './Units.css';
import { CLoader } from '../../../utils/CLoader';

class Units extends Component {
  constructor(props) {
    super(props);
    this.state = {
      units: [],
      buildings: [], // To store building data for dropdown
      blocks: [], // To store block data for dropdown
      showForm: false,
      selectedUnit: null,
      loading: true
    };
  }

  componentDidMount() {
    this.fetchBlocks();
    this.fetchBuildings();
    this.fetchUnits();
  }

  fetchBlocks = () => {
    // Simulating API call
    setTimeout(() => {
      const stubData = [
        { id: 1, name: 'Block A', code: 'BLK-A' },
        { id: 2, name: 'Block B', code: 'BLK-B' },
      ];
      this.setState({ blocks: stubData });
    }, 500);
  };

  fetchBuildings = () => {
    // Simulating API call
    setTimeout(() => {
      const stubData = [
        { id: 1, name: 'Building A', blockId: 1 },
        { id: 2, name: 'Building B', blockId: 2 },
      ];
      this.setState({ buildings: stubData });
    }, 500);
  };

  fetchUnits = () => {
    // Simulating API call
    setTimeout(() => {
      const stubData = [
        {
          id: 1,
          code: 'UNIT-101',
          floorNumber: 1,
          buildingName: 'Building A',
          blockCode: 'BLK-A',
          owner: 'John Doe'
        },
        {
          id: 2,
          code: 'UNIT-102',
          floorNumber: 1,
          buildingName: 'Building A',
          blockCode: 'BLK-A',
          owner: 'Jane Smith'
        },
      ];
      this.setState({ units: stubData, loading: false });
    }, 500);
  };

  handleDelete = (unitId) => {
    this.setState(prevState => ({
      units: prevState.units.filter(unit => unit.id !== unitId)
    }));
  };

  handleEdit = (unit) => {
    this.setState({ showForm: true, selectedUnit: unit });
  };

  handleAdd = () => {
    this.setState({ showForm: true, selectedUnit: null });
  };

  handleFormClose = () => {
    this.setState({ showForm: false, selectedUnit: null });
  };

  handleFormSubmit = (unitData) => {
    const building = this.state.buildings.find(b => b.name === unitData.buildingName);
    const block = this.state.blocks.find(b => b.id === building?.blockId);
    const blockCode = block?.code || '';

    if (unitData.id) {
      // Edit
      this.setState(prevState => ({
        units: prevState.units.map(unit =>
          unit.id === unitData.id ? { ...unitData, blockCode } : unit
        ),
        showForm: false
      }));
    } else {
      // Create
      const newUnit = {
        id: Math.max(...this.state.units.map(u => u.id), 0) + 1,
        ...unitData,
        blockCode
      };
      this.setState(prevState => ({
        units: [...prevState.units, newUnit],
        showForm: false
      }));
    }
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
    const unit = cellData.data;
    return (
      <div className="action-buttons" style={{ display: 'flex', gap: '5px' }}>
        <Button icon onClick={() => this.handleEdit(unit)} size="tiny">
          <Icon name="edit" />
        </Button>
        <Button icon onClick={() => this.handleDelete(unit.id)} size="tiny">
          <Icon name="trash" />
        </Button>
      </div>
    );
  };

  render() {
    const { units, buildings, blocks, showForm, selectedUnit, loading } = this.state;

    return (
      <div className="units">
        {loading ? <CLoader height="200px" /> : (
          <DataGrid
            dataSource={units}
            showBorders={true}
            width="100%"
            columnMinWidth="120px"
            showRowLines={true}
            height="calc(100vh - 200px)"
          >
            <HeaderFilter visible={true} />
            <SearchPanel visible={true} placeholder="Search..." />

            <Column dataField="code" caption="Code" />
            <Column dataField="floorNumber" caption="Floor Number" dataType="number" />
            <Column dataField="buildingName" caption="Building Name" />
            <Column dataField="blockCode" caption="Block Code" />
            <Column dataField="owner" caption="Owner" />
            <Column
              caption="Actions"
              width="15%"
              allowFiltering={false}
              cellRender={this.renderActionButtons}
            />

            <Toolbar>
              <Item location="before">
                <Button primary onClick={this.handleAdd} style={{ marginRight: '10px' }}>
                  <Icon name="plus" /> Add New Unit
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
          <UnitForm
            unit={selectedUnit}
            buildings={buildings}
            blocks={blocks}
            onSubmit={this.handleFormSubmit}
            onClose={this.handleFormClose}
          />
        )}
      </div>
    );
  }
}

export default Units;
