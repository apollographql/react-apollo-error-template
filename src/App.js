import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { Switch } from 'react-router';

const Person = ({ person }) => (
  <div>
    <span>{person.id}: </span>
    <strong>{person.name}</strong>
    <ul>
      {person.pets.map((pet, i) => (
        <li key={pet.id}>
          <span>{pet.id}: </span>
          <strong>{pet.name} - </strong>
          <i>{pet.belonging.label} (id: {pet.belonging.id || 'none'})</i>
        </li>
      ))}
    </ul>
  </div>
);

const WithId = graphql(
  gql`{
    people {
      id,
      name,
      pets {
        id,
        name,
        belonging {
          id,
          label
        }
      }
    }
  }`,
  // important fetchPolicy
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

const WithoutId = graphql(
  gql`{
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
  }`,
  // important fetchPolicy
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

const Code = ({ children }) => <pre style={{ display: 'inline', fontSize: '1.2em' }}>{children}</pre>;

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <main style={{ maxWidth: '50%', margin: '0 auto', }}>
          <header>
            <h1>Apollo Client Error Template</h1>
            <p>There are two queries. The error is for the <Code>belonging</Code> object, which is 3 levels deep (<Code>person -> pet -> belonging</Code>). The first query request the <Code>belonging</Code> by specifying its <Code>id</Code> and <Code>label</Code> fields. However, the second query requests the belonging with only the <Code>label</Code> field. When you mount the component using the second query (using react router <Code>Switch</Code> to demonstrate), it gets stuck in a loading state, never updating the component.</p>
            <ol>
              <li><Link to="/">With Belonging ID (Base)</Link></li>
              <li><Link to="/noId">Without Belonging ID</Link></li>
            </ol>
          </header>
          <section>
            <Switch>
              <Route exact path="/" component={WithId} />
              <Route path="/noId" component={WithoutId} />
            </Switch>
          </section>
        </main>
      </BrowserRouter>
    );
  }
}

export default App;
