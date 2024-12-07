import axios from 'axios';
import { API_HOST } from '../utils/Constants';

export class Chatbot {
  static createChatbot(attributes) {
    return new Chatbot(attributes);
  }

  constructor(record = null) {
    this.record = record || {};
  }

  setValue(key, value) {
    this.record[key] = typeof value === 'string' ? value.trim() : value;
  }

  id() {
    return this.record.id;
  }

  name() {
    return this.record.name;
  }

  apiToken() {
    return this.record.api_token;
  }

  botUsername() {
    return this.record.bot_username;
  }

  isActive() {
    return this.record.is_active;
  }

  chatBotType() {
    return this.record.chat_bot_type;
  }

  generateHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}`
    };
  }

  async createChatbotRecord() {
    const payload = {
      chat_bot_details: {
        name: this.name(),
        chat_bot_type: this.chatBotType().toLowerCase(),
        api_details: {
          api_token: this.apiToken(),
          adapter: "telegram",
          username: this.botUsername()
        }
      }
    };

    try {
      const response = await axios.post(
        `https://${API_HOST}/telegram_chat_service/create_chat_bot`,
        payload,
        { headers: this.generateHeaders() }
      );
      
      if (response.status === 200 || response.status === 201) {
        this.record = response.data;
        return this;
      }
      throw new Error(response.data.message || 'Failed to create chatbot');
    } catch (error) {
      console.error('Create chatbot error:', error);
      throw error;
    }
  }

  async editRecord() {
    try {
      const payload = {
        chat_bot_details: {
          is_active: !this.isActive(),
          name: this.name(),
          chat_bot_type: this.chatBotType().toLowerCase(),
          api_details: {
            api_token: this.apiToken(),
            adapter: "telegram",
            username: this.botUsername()
          }
        }
      };

      const response = await axios.put(
        `https://${API_HOST}/telegram_chat_service/chat_bots/${this.id()}`,
        payload,
        { headers: this.generateHeaders() }
      );

      if (response.status === 200) {
        this.record.is_active = !this.record.is_active;
        return this;
      }
      throw new Error(response.data.message || 'Failed to update chatbot');
    } catch (error) {
      console.error('Edit chatbot error:', error);
      throw error;
    }
  }

  async deleteRecord() {
    try {
      const response = await axios.delete(
        `https://${API_HOST}/telegram_chat_service/delete_chat_bot/${this.id()}`,
        { headers: this.generateHeaders() }
      );

      if (response.status === 200) {
        return this;
      }
      throw new Error(response.data.message || 'Failed to delete chatbot');
    } catch (error) {
      console.error('Delete chatbot error:', error);
      throw error;
    }
  }
}