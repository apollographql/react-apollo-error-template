import React, { Component } from 'react';
import Video from './Video'
import Companies from './Companies'

export default class App extends Component {
  state = {
    showCompanies: false,
  }

  render() {
    const { showCompanies } = this.state;
    return (
      <main>
        <Video />
        <h2>Always visible:</h2>
        <p>
          This list is fetched correctly from graphql because it's done before
          the video player is initialized.
        </p>
        <Companies locale="en" />
        <br/>

        <h2>Toggled by user:</h2>
        <p>
          This list is toggled when the user clicks on the button. The request will not be sent
          to graphql.
        </p>
        <button onClick={() => this.setState({ showCompanies: !showCompanies })}>
          Toggle Companies
        </button>
        {showCompanies && <Companies />}
      </main>
    );
  }
}
