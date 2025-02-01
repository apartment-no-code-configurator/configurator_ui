import React, { Component } from 'react';
import { Form, Button, Dropdown, Message, Icon } from 'semantic-ui-react';

class FlatForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.flat ? props.flat.name : '',
      blockId: props.flat ? props.flat.blockId : '',
      floors: props.flat ? props.flat.floors : 1,
      units: props.flat ? props.flat.units : '',
      flashMessage: null
    };
  }

  showFlashMessage = (message, isError = false) => {
    this.setState({
      flashMessage: {
        message,
        type: isError ? 'error' : 'success'
      }
    });
    setTimeout(() => {
      this.setState({ flashMessage: null });
    }, 3000);
  };

  handleFloorChange = async (increment) => {
    const newFloors = increment ? this.state.floors + 1 : this.state.floors - 1;
    const { flat, onUpdateFloors } = this.props;

    if (newFloors < 1) {
      this.showFlashMessage('Floors cannot be less than 1', true);
      return;
    }

    try {
      // Simulating API call
      setTimeout(() => {
        this.setState({ floors: newFloors });
        if (flat?.id) {
          onUpdateFloors(flat.id, newFloors);
        }
        this.showFlashMessage(`Successfully ${increment ? 'increased' : 'decreased'} floors to ${newFloors}`);
      }, 500);

      // Actual API call (uncomment and modify as needed)
      /*
      const flatId = this.props.flat?.id;
      if (flatId) {
        const response = await fetch(`https://your-api-endpoint.com/flats/${flatId}/floors`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('your_token')}`
          },
          body: JSON.stringify({ floors: newFloors })
        });

        if (!response.ok) throw new Error('Failed to update floors');

        const data = await response.json();
        this.setState({ floors: data.floors });
        onUpdateFloors(flatId, data.floors);
        this.showFlashMessage(`Successfully ${increment ? 'increased' : 'decreased'} floors to ${data.floors}`);
      } else {
        this.setState({ floors: newFloors });
      }
      */
    } catch (error) {
      this.showFlashMessage('Failed to update floors', true);
      console.error('Error updating floors:', error);
    }
  };

  handleSubmit = () => {
    const { flat, onSubmit } = this.props;
    const formData = {
      id: flat ? flat.id : null,
      ...this.state
    };
    onSubmit(formData);
  };

  getBlockOptions = () => {
    return this.props.blocks.map(block => ({
      key: block.id,
      value: block.id,
      text: block.name
    }));
  };

  render() {
    const { name, blockId, floors, units } = this.state;
    const { flat, onClose } = this.props;

    return (
      <div className="form-overlay">
        <div className="form-container" style={formStyles.container}>
          <h3>{flat ? 'Edit Flat' : 'Add New Flat'}</h3>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label>Flat Building Name</label>
              <input
                placeholder="Enter flat building name"
                value={name}
                onChange={e => this.setState({ name: e.target.value })}
              />
            </Form.Field>
            <Form.Field>
              <label>Block Name</label>
              <Dropdown
                placeholder="Select block"
                fluid
                selection
                options={this.getBlockOptions()}
                value={blockId}
                onChange={(e, { value }) => this.setState({ blockId: value })}
              />
            </Form.Field>
            <Form.Field>
              <label>Floors</label>
              <input
                type="number"
                placeholder="Enter number of floors"
                value={floors}
                disabled={true}
                onChange={e => this.setState({ floors: parseInt(e.target.value) || '' })}
              />
            </Form.Field>
            <Form.Field>
              <label>Units</label>
              <input
                type="number"
                placeholder="Enter number of units"
                value={units}
                disabled={true}
                onChange={e => this.setState({ units: parseInt(e.target.value) || '' })}
              />
            </Form.Field>
            <div style={formStyles.buttons}>
              <Button type="submit" primary>
                {flat ? 'Update' : 'Create'}
              </Button>
              <Button type="button" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

const formStyles = {
  container: {
    position: 'fixed',
    right: 0,
    top: 0,
    width: '400px',
    height: '100%',
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
    overflowY: 'auto'
  },
  buttons: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px'
  }
};

export default FlatForm;
