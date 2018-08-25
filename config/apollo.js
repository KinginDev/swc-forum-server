
require('cross-fetch/polyfill');
const ApolloClient = require('apollo-boost');

const client = new ApolloClient({
  uri: 'https://api.graph.cool/simple/v1/cjksyk40v80sg0145j58iwet4'
});

module.exports = client