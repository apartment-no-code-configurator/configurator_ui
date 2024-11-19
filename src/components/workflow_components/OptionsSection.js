import React, { Component } from 'react';
import { Button, Form, Segment, TextArea, Input } from 'semantic-ui-react';
import { Option } from '../../lib/OptionLib';
import { OPTIONS_TABLE_HEADERS } from "../../constants";
import { FaSave, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

class OptionsSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Initialize your state here
      originalVariable: props.selectedVariable,
      selectedVariable: props.selectedVariable,
      options: props.selectedVariable ? props.selectedVariable.options : [],
      clickedIndex: null,
      newOption: new Option("", "", "", props.selectedVariable)
    };
  }

  render() {

    const { clickedIndex, options, newOption } = this.state;
    const existingOptions = options.filter((option) => option.isDeleted === false);
    return (
      <Segment className="options-section">
        {existingOptions?.length > 0 && (
          <>
            <h4>Existing Options</h4>
            <div className='options-table'>
              <div className='options-headers'>
                {OPTIONS_TABLE_HEADERS.map((heading) => <span key={`options_heading_${heading}`}>{heading}</span>)}
              </div>
              
                {existingOptions.map((option, index) => (
                  <div className='options-list-content' key={`option_item_${index}`}>
                    <div className='option-item'>
                      {clickedIndex === index ? <Input size="mini" name="label" value={option.label()} fluid onChange={(evt, data) => this.editOption(evt, option, data, index)} /> : option.label()}
                    </div>
                    <div className='option-item'>
                      {clickedIndex === index ? <Input size="mini" name="description" value={option.description()} small fluid onChange={(evt, data) => this.editOption(evt, option, data, index)} /> : option.description()}
                    </div>
                    <div className='option-item'>
                      {clickedIndex === index ? <Input size="mini" name="value" value={option.value()} fluid onChange={(evt, data) => this.editOption(evt, option, data, index)} /> : option.value()}
                    </div>
                    <div className='action-icons'>
                      {clickedIndex === index ? <FaSave className='save' onClick={() => {
                        this.setState({
                          clickedIndex: null
                        })
                      }} title="Save Changes" /> : <FaRegEdit className="edit" onClick={() => {
                        this.setState({
                          clickedIndex: index
                        })
                      }} title="Edit Option" />
                      }
                      <FaRegTrashAlt className="delete" onClick={(event) => this.deleteOption(event, index)} title='Delete' />
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
        <h4>Add New Option</h4>
        <Form>
          <Form.Group widths='equal'>
            <Form.Input
              fluid
              label='Label'
              name="label"
              placeholder='Label'
              value={newOption.label()}
              onChange={this.changeNewOptionData}
            />
            <Form.Input
              fluid
              label="Value"
              name="value"
              placeholder="Value"
              type='text'
              value={newOption.value()}
              onChange={this.changeNewOptionData}
            />
          </Form.Group>
          <Form.Field>
            <label>Description</label>
            <TextArea
              name="description"
              value={newOption.description()}
              onChange={this.changeNewOptionData}
              placeholder="Description"
            />
          </Form.Field>
          <Button onClick={this.addOption}>Add Option</Button>
        </Form>
      </Segment>
    );
  }

  editOption = (event, option, data, index) => {
    const { selectedVariable } = this.state;
    option.changeValue(data.name, data.value)
    selectedVariable.editOption(option, index)
    this.setState({
      selectedVariable,
      options: [...selectedVariable.options]
    })
  };

  deleteOption = (event, index) => {
    // Implement delete option functionality
    // Remove the selected option from the options array in the state
    event.preventDefault();
    const { selectedVariable } = this.state;
    selectedVariable.deleteOption(index)
    this.setState({
      selectedVariable,
      options: [...selectedVariable.options],
      clickedIndex: null
    })
  };

  addOption = (event) => {
    event.preventDefault();
    const { selectedVariable, newOption } = this.state;
    selectedVariable.addOption(newOption);
    this.setState({
      selectedVariable,
      options: [...selectedVariable.options],
      newOption: new Option("", "", "")
    })
  };

  changeNewOptionData = (event, data) => {
    const { newOption } = this.state
    newOption.changeValue(data.name, data.value)
    this.setState({
      newOption
    });
  }
}

export default OptionsSection;
