import React, { Component } from 'react';
import { Button, Form, Table, TableCell } from 'semantic-ui-react';
import { Option } from '../../lib/OptionLib';

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

    const { clickedIndex, options, selectedVariable, newOption } = this.state;

    return (
      <div className="options-section">
        <h2>Options Section</h2>
        <h3>Existing Options</h3>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Label</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {options.filter((option) => option.isDeleted === false).map((option, index) => (
              <Table.Row key={index}>
                <TableCell>{ clickedIndex === index ? <input onChange={(event) => this.editOption(event, option, "label")} value={option.label()}/> : option.label() } </TableCell>
                <TableCell>{ clickedIndex === index ? <input onChange={(event) => this.editOption(event, option, "value")} value={option.value()}/> : option.value() } </TableCell>
                <TableCell>{ clickedIndex === index ? <input onChange={(event) => this.editOption(event, option, "description")} value={option.description()}/> : option.description() } </TableCell>
                <TableCell>
                  <Button onClick={(event) => {
                    event.preventDefault();
                    const { clickedIndex } = this.state;
                    console.log("clickedIndex - ", clickedIndex)
                    if (clickedIndex !== null) {
                      this.setState({
                        clickedIndex: null
                      })
                    } else {
                      this.setState({
                        clickedIndex: index
                      })
                    }

                  }}>{ clickedIndex === index ? "Save Changes" : "Edit Option"}</Button>
                  <button type="button" className="ui button red" onClick={(event) => this.deleteOption(event, index)}>Delete</button>
                </TableCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <div>
          <h3>Add New Option</h3>
          <Form>
          <Form.Field>
            <label> Option Label </label>
            <input type="text" value={newOption.label()} onChange={(event) => this.changeNewOptionData(event, "label")} placeholder="Label" />
          </Form.Field>
          <Form.Field>
          <label> Option Value </label>
            <input type="text" value={newOption.value()} onChange={(event) => this.changeNewOptionData(event, "value")} placeholder="Value" />
          </Form.Field>
          <Form.Field>
            <label>Variable Description</label>
            <textarea
            value={newOption.description()}
            onChange={(event) => this.changeNewOptionData(event, "description")}
            placeholder="Description"
            />
          </Form.Field>
          <Button onClick={(event) => this.addOption(event)}>Add Option</Button>
          </Form>
        </div>
      </div>
    );
  }

  editOption = (event, option, key, index) => {
    // Implement edit option functionality
    // You can populate a form with the selected option's data for editing
    const { selectedVariable } = this.state;
    const value = event.target.value
    option.changeValue(key, value)
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
      newOption: new Option("","","")
    })
  };

  changeNewOptionData = (event, key) => {
    event.preventDefault();
    const { newOption } = this.state
    const value = event.target.value
    newOption.changeValue(key, value)
    this.setState({
      newOption
    })
  }
}

export default OptionsSection;
