import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';

class Food extends Component {
  render() {
    const { data: { loading, food } } = this.props;
    return (
      <main>
        <header>
          Please look at the console to see this component query makes a trip to server, only the first time.
        </header>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <ul>

            {food.map(food => (
              <li key={food.id}>
                {food.name}
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
    food {
      id
      name
    }
  }`,
  {
    fetchPolicy: 'network-only',
  }
)(Food)