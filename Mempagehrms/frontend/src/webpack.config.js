const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
    },
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      },
    ],
  },
  // Add other webpack configuration options here...
};
