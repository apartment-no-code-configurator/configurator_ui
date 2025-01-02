import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Chatbot } from '../../lib/ChatbotLib';

class AddChatbot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatbot: null
    }
  }

  componentDidMount() {
    if (this.props.chatbot) {
      this.setState({
        chatbot: this.props.chatbot ? this.props.chatbot : new Chatbot()
      })
    }
  }

  handleInputChange = (e, data) => {
    const { name, value } = { ...data };
    const { chatbot } = this.state;
    chatbot.setValue(name, value);
    this.setState({
      chatbot
    })
  }

  handleAddChatbot = (e) => {
    e.preventDefault();
    const { chatbot } = this.state;
    try {
      this.props.updateChatBotList(chatbot.createChatbotRecord());
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  handleSidebarClose = () => {
    this.props.handleSidebarClose();
  }

  render() {

    const { chatbot } = this.props;

    return (
      <Form className="add-chatbot-form" onSubmit={this.handleFormSubmit}>
        <h2 className='heading'>Add Chatbot</h2>
        <Form.Input
          fluid
          label='Name'
          name="name"
          placeholder='Enter the chatbot name'
          value={chatbot.name()}
          onChange={this.handleInputChange}
          required
        />

        <Form.Input
          fluid
          label='API Details'
          name="api_token"
          placeholder='Enter the api token value'
          value={chatbot.apiToken()}
          onChange={this.handleInputChange}
          required
        />
        <Form.Input
          fluid
          label='Bot Username'
          name="bot_username"
          placeholder='Enter the chatbot username'
          value={chatbot.botUsername()}
          onChange={this.handleInputChange}
          required
        />
        <Form.Checkbox
          fluid
          label='Is Active'
          name="is_active"
          value={chatbot.isActive()}
          onChange={(e, data) => {
            chatbot.setValue(data.name, data.checked);
            this.setState({
              chatbot
            })
          }}
          required
        />
        <Form.Input
          fluid
          label='Chatbot Type'
          disabled
          name="chatBotType"
          value={chatbot.chatBotType()}
          required
        />
        <Button primary onClick={this.handleAddChatbot} type="submit">Add Chatbot</Button>
      </Form>
    );
  }
}


export default AddChatbot;
