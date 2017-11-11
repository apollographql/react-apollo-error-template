import React, { Component } from "react";
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";

class App extends Component {
  static defaultProps = {
    onClick: () => {},
  };

  handleClick = () => {
    const people = this.props.data.people;
    const person = people[0];
    const newPotatoes = person.potatoes.filter(p => p.id !== "1");
    this.props.client.writeFragment({
      id: `Person${person.id}`,
      fragmentName: 'filterOutAPotatoe',
      fragment: gql`
        fragment filterOutAPotatoe on Person {
          potatoes {
            id
          }
        }
      `,
      data: {
        potatoes: newPotatoes,
        __typename: 'Person',
      },
    });
    this.props.onClick();
  };

  render() {
    const { data: { loading, people } } = this.props;
    return (
      <main>
        <header>
          <h1>Apollo Client Error Template</h1>
          <p>
            This is a template that you can use to demonstrate an error in
            Apollo Client. Edit the source code and watch your browser window
            reload with the changes.
          </p>
          <p>
            The code which renders this component lives in{" "}
            <code>./src/App.js</code>.
          </p>
          <p>
            The GraphQL schema is in <code>./src/graphql/schema</code>.
            Currently the schema just serves a list of people with names and
            ids.
          </p>
        </header>
        {loading || !people ? (
          <p>{loading ? 'Loading…' : `ERROR NO PEOPLE: ${JSON.stringify(this.props.data)}`}</p>
        ) : (
          <ul>
            {people.map(person =>
              <li key={person.id}>
                {person.name}
                <ul>
                  <li>Potatoes: </li>
                   {(person.potatoes || []).map(p =>
                     <li key={p.id}>{p.type}</li>
                   )}
                </ul>
              </li>)}
            <li><button type="button" onClick={this.handleClick}>Click me!</button></li>
            <li>is clicked? {this.props.clicked}</li>
          </ul>
        )}
        {}
      </main>
    );
  }
}

const AppWithData = withApollo(graphql(
  gql`
    query ErrorTemplate {
      people {
        id
        name
        potatoes {
          id
          type
        }
      }
    }
  `
)(App));

// Had to add a wrapper, otherwise it didn't trigger a rerender! <-- this is super suspicious on what might be the bug
// You can try it without the wrapper by just exporting AppWithData and commenting out this one.
export default class Wrapper extends Component {
  state = { clicked: false };
  render() {
    return (
      <AppWithData
        clicked={this.state.clicked}
        onClick={() => this.setState({ clicked: true })}
      />
    );
  }
}

