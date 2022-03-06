const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config({
  path: './.env',
});

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'node',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PORT':
        process.env.NODE_ENV === 'development'
          ? JSON.stringify('development')
          : JSON.stringify('production'),
      'process.env.PORT': JSON.stringify(process.env.PORT),
      'process.env.DB_HOST': JSON.stringify(process.env.DB_HOST),
      'process.env.DB_USER': JSON.stringify(process.env.DB_USER),
      'process.env.DB_PASSWORD': JSON.stringify(process.env.DB_PASSWORD),
      'process.env.DB_PORT': JSON.stringify(process.env.DB_PORT),
      'process.env.DB_NAME': JSON.stringify(process.env.DB_NAME),
      'process.env.FIREBASE_TYPE': JSON.stringify(process.env.FIREBASE_TYPE),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(
        process.env.FIREBASE_PROJECT_ID,
      ),
      'process.env.FIREBASE_PRIVATE_KEY': JSON.stringify(
        process.env.FIREBASE_PRIVATE_KEY,
      ),
      'process.env.FIREBASE_CLIENT_EMAIL': JSON.stringify(
        process.env.FIREBASE_CLIENT_EMAIL,
      ),
      'process.env.FIREBASE_CLIENT_ID': JSON.stringify(
        process.env.FIREBASE_CLIENT_ID,
      ),
      'process.env.FIREBASE_AUTH_URI': JSON.stringify(
        process.env.FIREBASE_AUTH_URI,
      ),
      'process.env.FIREBASE_TOKEN_URI': JSON.stringify(
        process.env.FIREBASE_TOKEN_URI,
      ),
      'process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URI': JSON.stringify(
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URI,
      ),
      'process.env.FIREBASE_CLIENT_X509_CERT_URI': JSON.stringify(
        process.env.FIREBASE_CLIENT_X509_CERT_URI,
      ),
      'process.env.JWT_SECRET_KEY': JSON.stringify(process.env.JWT_SECRET_KEY),
      'process.env.WISHBOARD_GMAIL_ID': JSON.stringify(
        process.env.WISHBOARD_GMAIL_ID,
      ),
      'process.env.WISHBOARD_GMAIL_PW': JSON.stringify(
        process.env.WISHBOARD_GMAIL_PW,
      ),
    }),
  ],
  stats: {
    errorDetails: true,
  },
};
