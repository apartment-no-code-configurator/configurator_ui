import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';

class BlockForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.block ? props.block.name : '',
      code: props.block ? props.block.code : '',
    };
  }

  handleSubmit = () => {
    const { block, onSubmit } = this.props;
    const { name, code } = this.state;

    onSubmit({
      id: block ? block.id : null,
      name,
      code
    });
  };

  render() {
    const { name, code } = this.state;
    const { block, onClose } = this.props;

    return (
      <div className="form-overlay">
        <div className="form-container" style={formStyles.container}>
          <h3>{block ? 'Edit Block' : 'Add New Block'}</h3>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label>Name of Block</label>
              <input
                placeholder="Enter block name"
                value={name}
                onChange={e => this.setState({ name: e.target.value })}
              />
            </Form.Field>
            <Form.Field>
              <label>Code of Block</label>
              <input
                placeholder="Enter block code"
                value={code}
                onChange={e => this.setState({ code: e.target.value })}
              />
            </Form.Field>
            <div style={formStyles.buttons}>
              <Button type="submit" primary>
                {block ? 'Update' : 'Create'}
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

export default BlockForm;
