import React, { Component } from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';

class UnitForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.unit?.id || null,
      code: props.unit?.code || '',
      floorNumber: props.unit?.floorNumber || '',
      buildingName: props.unit?.buildingName || '',
      blockId: props.unit?.blockId || '',
      owner: props.unit?.owner || '',
      floors: [],
      availableBuildings: [],
      users: [],
      loading: {
        floors: false,
        buildings: false,
        users: false,
        initialData: true
      }
    };
  }

  componentDidMount() {
    // Fetch all initial data
    Promise.all([
      this.fetchUsers(),
      this.fetchInitialData()
    ]).then(() => {
      this.setState(prevState => ({
        loading: { ...prevState.loading, initialData: false }
      }));
    });
  }

  fetchInitialData = async () => {
    if (this.props.unit) {
      // If editing, we need to:
      // 1. Fetch buildings for the selected block
      // 2. Fetch floors for the selected building
      await this.fetchBuildingsByBlock(this.props.unit.blockId);

      const building = this.state.availableBuildings.find(b => b.name === this.props.unit.buildingName);
      if (building) {
        await this.fetchFloorsByBuilding(building.id);
      }
    }
  };

  fetchUsers = () => {
    return new Promise((resolve) => {
      this.setState(prevState => ({
        loading: { ...prevState.loading, users: true }
      }));

      // Simulating API call
      setTimeout(() => {
        const stubUsers = [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
        ];
        this.setState(prevState => ({
          users: stubUsers,
          loading: { ...prevState.loading, users: false }
        }), resolve);
      }, 500);
    });
  };

  fetchBuildingsByBlock = (blockId) => {
    return new Promise((resolve) => {
      if (!blockId) {
        this.setState({ availableBuildings: [] }, resolve);
        return;
      }

      this.setState(prevState => ({
        loading: { ...prevState.loading, buildings: true }
      }));

      // Simulating API call
      setTimeout(() => {
        const filteredBuildings = this.props.buildings.filter(building =>
          building.blockId === blockId
        );
        this.setState(prevState => ({
          availableBuildings: filteredBuildings,
          loading: { ...prevState.loading, buildings: false }
        }), resolve);
      }, 500);
    });
  };

  fetchFloorsByBuilding = (buildingId) => {
    return new Promise((resolve) => {
      if (!buildingId) {
        this.setState({ floors: [] }, resolve);
        return;
      }

      this.setState(prevState => ({
        loading: { ...prevState.loading, floors: true }
      }));

      // Simulating API call
      setTimeout(() => {
        const building = this.props.buildings.find(b => b.id === buildingId);
        const floorCount = building?.floors || 5;
        const floors = Array.from({ length: floorCount }, (_, i) => ({
          key: i + 1,
          text: `Floor ${i + 1}`,
          value: i + 1
        }));

        this.setState(prevState => ({
          floors,
          loading: { ...prevState.loading, floors: false }
        }), resolve);
      }, 500);
    });
  };

  handleChange = async (e, { name, value }) => {
    this.setState({ [name]: value });

    if (name === 'blockId') {
      // Reset and fetch new building data
      this.setState({
        buildingName: '',
        floorNumber: '',
        floors: []
      });
      await this.fetchBuildingsByBlock(value);
    } else if (name === 'buildingName') {
      // Reset and fetch new floor data
      this.setState({ floorNumber: '' });
      const building = this.props.buildings.find(b => b.name === value);
      if (building) {
        await this.fetchFloorsByBuilding(building.id);
      }
    }
  };

  handleSubmit = () => {
    const { id, code, floorNumber, buildingName, blockId, owner } = this.state;
    this.props.onSubmit({
      id,
      code,
      floorNumber,
      buildingName,
      blockId,
      owner
    });
  };

  render() {
    const {
      code,
      floorNumber,
      buildingName,
      blockId,
      owner,
      floors,
      availableBuildings,
      users,
      loading
    } = this.state;
    const { blocks, onClose } = this.props;

    const blockOptions = blocks.map(block => ({
      key: block.id,
      text: block.name,
      value: block.id
    }));

    const buildingOptions = availableBuildings.map(building => ({
      key: building.id,
      text: building.name,
      value: building.name
    }));

    const userOptions = users.map(user => ({
      key: user.id,
      text: `${user.name} (${user.email})`,
      value: user.id
    }));

    return (
      <Modal
        open={true}
        onClose={onClose}
        className="unit-form-modal slide-in"
        closeIcon
      >
        <Modal.Header>
          {this.state.id ? 'Edit Unit' : 'Add New Unit'}
        </Modal.Header>
        <Modal.Content scrolling>
          <Form loading={loading.initialData}>
            <Form.Input
              fluid
              label="Code"
              name="code"
              value={code}
              onChange={this.handleChange}
              required
            />
            <Form.Select
              fluid
              label="Block"
              name="blockId"
              options={blockOptions}
              value={blockId}
              onChange={this.handleChange}
              required
            />
            <Form.Select
              fluid
              label="Building Name"
              name="buildingName"
              options={buildingOptions}
              value={buildingName}
              onChange={this.handleChange}
              disabled={!blockId || loading.buildings}
              loading={loading.buildings}
              required
            />
            <Form.Select
              fluid
              label="Floor Number"
              name="floorNumber"
              options={floors}
              value={floorNumber}
              onChange={this.handleChange}
              disabled={!buildingName || loading.floors}
              loading={loading.floors}
              required
            />
            <Form.Select
              fluid
              label="Owner"
              name="owner"
              options={userOptions}
              value={owner}
              onChange={this.handleChange}
              loading={loading.users}
              required
              search
              placeholder="Search users..."
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            primary
            onClick={this.handleSubmit}
            disabled={!code || !blockId || !buildingName || !floorNumber || !owner || loading.initialData}
          >
            {this.state.id ? 'Update' : 'Create'}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default UnitForm;
