import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';

class TestComponent extends Component {
  render() {
    const { data: { loading, people } } = this.props;
    return (
      <main>
        <header>
          Loading the same people query again here, but with option fetchpolicy network-only. Please look at the console to see that it does not make a trip to server.
        </header>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <ul>
            {people.map(person => (
              <li key={person.id}>
                {person.name}
              </li>
            ))}
          </ul>
        )}
      </main>
    );
  }
}

export default graphql(
  gql`{
    people {
      id
      name
    }
  }`,
  {
    fetchPolicy: 'network-only',
  }
)(TestComponent)