import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import TestComponent from './TestComponent.js';
import Food from './Food.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.showTestComponent = this.showTestComponent.bind(this);
    this.showFoodComponent = this.showFoodComponent.bind(this);
    this.state = {
      showTestComponent: false,
      showFoodComponent: false,
    };
  }

  showTestComponent() {
    const newVal = !this.state.showTestComponent;
    this.setState({showTestComponent: newVal});
  }

  showFoodComponent() {
    const newVal = !this.state.showFoodComponent;
    this.setState({showFoodComponent: newVal});
  }

  render() {
    const { data: { loading, people } } = this.props;
    return (
      <main>
        <header>
          <h1>Apollo Client Error Template</h1>
          <p>
            This is a template that you can use to demonstrate an error in Apollo Client.
            Edit the source code and watch your browser window reload with the changes.
          </p>
          <p>
            The code which renders this component lives in <code>./src/App.js</code>.
          </p>
          <p>
            The GraphQL schema is in <code>./src/graphql/schema</code>.
            Currently the schema just serves a list of people with names and ids.
          </p>
        </header>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div>
            <ul>
              {people.map(person => (
                <li key={person.id}>
                  {person.name}
                </li>
              ))}
            </ul>
            <br />
            <input type="button" value="Click Me Test!!!!" onClick={this.showTestComponent} /><br /><br />
            {
              this.state.showTestComponent ?
              <TestComponent /> : null
            }
            <br />
            <input type="button" value="Click Me Load / Hide Food!!!!" onClick={this.showFoodComponent} /><br /><br />
            {
              this.state.showFoodComponent ?
              <Food /> : null
            }
          </div>
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
)(App)
