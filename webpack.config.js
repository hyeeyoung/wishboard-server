const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config({
  path: './.env',
});

module.exports = {
  target: 'node',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PORT': JSON.stringify(process.env.PORT),
      'process.env.DB_DEV_HOST': JSON.stringify(process.env.DB_DEV_HOST),
      'process.env.DB_DEV_USER': JSON.stringify(process.env.DB_DEV_USER),
      'process.env.DB_DEV_PASSWORD': JSON.stringify(
        process.env.DB_DEV_PASSWORD,
      ),
      'process.env.DB_PORT': JSON.stringify(process.env.DB_PORT),
      'process.env.DB_DEV_NAME': JSON.stringify(process.env.DB_DEV_NAME),
      'process.env.REDIS_DEV_HOST': JSON.stringify(process.env.REDIS_DEV_HOST),
      'process.env.REDIS_PORT': JSON.stringify(process.env.REDIS_PORT),
      'process.env.REDIS_DEV_PASSWORD': JSON.stringify(
        process.env.REDIS_DEV_PASSWORD,
      ),
      'process.env.JWT_SECRET_KEY': JSON.stringify(process.env.JWT_SECRET_KEY),
      'process.env.WISHBOARD_GMAIL_ID': JSON.stringify(
        process.env.WISHBOARD_GMAIL_ID,
      ),
      'process.env.WISHBOARD_GMAIL_PW': JSON.stringify(
        process.env.WISHBOARD_GMAIL_PW,
      ),
      'process.env.AWS_ACCESS_KEY': JSON.stringify(process.env.AWS_ACCESS_KEY),
      'process.env.AWS_SECRET_KEY': JSON.stringify(process.env.AWS_SECRET_KEY),
      'process.env.BUCKET_NAME': JSON.stringify(process.env.BUCKET_NAME_DEV),
    }),
  ],
  stats: {
    errorDetails: true,
  },
};
