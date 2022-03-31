const axios = require('axios');
const _ = require('lodash');
const logger = require('../config/winston');
require('dotenv').config({ path: '../.env' });

const API_TOKEN = process.env.SLACK_API_TOKEN;

class Slack {
  static get Colors() {
    return {
      primary: '#007bff',
      info: '#17a2b8',
      success: '#28a745',
      warning: '#ffc107',
      danger: '#dc3545',
    };
  }

  static get Channels() {
    return {
      general: API_TOKEN,
    };
  }

  static async sendMessage(message) {
    if (!message) {
      logger.error('메시지 포멧이 없습니다.');
      return;
    }

    const data = {
      mrkdwn: true,
      text: '',
      attachments: [],
    };

    if (_.isString(message)) {
      data.text = message;
    } else {
      if (!message.title && !message.text) {
        logger.error('메시지 내용이 없습니다.');
        return;
      }

      message.ts = Math.floor(Date.now() / 1000);
      message.footer = `From API Server [${process.env.NODE_ENV}]`;
      data.attachments.push(message);
    }

    axios({
      url: this.Channels.general,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    });
  }
}

module.exports = Slack;
