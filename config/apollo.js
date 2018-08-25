
import 'cross-fetch/polyfill';
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://api.graph.cool/simple/v1/cjksyk40v80sg0145j58iwet4'
});

module.exports = client