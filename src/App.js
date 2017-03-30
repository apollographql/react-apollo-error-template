import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { Switch } from 'react-router';

const Person = ({ person }) => (
  <div>
    <span>{person.id ? person.id : 'nil'}: </span>
    <strong>{person.name}</strong>
    <ul>
      {person.pets.map((pet, i) => (
        <li key={pet.id}>
          <span>{pet.id}: </span>
          <strong>{pet.name}</strong>
          <i>{pet.belonging.label}</i>
        </li>
      ))}
    </ul>
  </div>
);

const PetFragment = gql`
  fragment PetFragment on Pet {
    id,
    name
  }
`;

const PersonWithId = graphql(
  gql`
    {
      people {
        id,
        name,
        pets {
          ...PetFragment
          belonging {
            id,
            label
          }
        }
      }
    }
    ${PetFragment}
  `,
  { options: { fetchPolicy: 'cache-and-network' } },
)((props) => {
  const { data: { people = [], loading } } = props;
  if (loading) return <span>Loading...</span>;

  return (
    <ul>
      {people.map(person => (
        <li key={person.id}>
          <Person person={person} />
        </li>
      ))}
    </ul>
  );
});

const PersonWithoutId = graphql(
  gql`
    {
      people {
        id
        name,
        pets {
          id
          name
          belonging {
            label
          }
        }
      }
    }
  `,
  { options: { fetchPolicy: 'cache-and-network' } },
)((props) => {
  const { data: { people = [], loading } } = props;
  if (loading) return <span>Loading...</span>;

  return (
    <ul>
      {people.map((person, i) => (
        <li key={i}>
          <Person person={person} />
        </li>
      ))}
    </ul>
  );
});

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <main>
          <header>
            <h1>Apollo Client Error Template</h1>
            <ul>
              <li><Link to="/">Without Belonging ID</Link></li>
              <li><Link to="/withId">With Belonging ID</Link></li>
            </ul>
          </header>
          <section>
            <Switch>
              <Route exact path="/" component={PersonWithoutId} />
              <Route path="/withId" component={PersonWithId} />
            </Switch>
          </section>
        </main>
      </BrowserRouter>
    );
  }
}

export default App;
