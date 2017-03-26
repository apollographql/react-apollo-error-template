import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';

class Companies extends Component {
  render() {
    const { data: { loading, companies } } = this.props;
    return (
      <div>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <ul>
            {companies.map((c,i) => <li key={i}>{c.name}</li>)}
          </ul>
        )}
      </div>
    );
  }
}

export default graphql(
  gql`
    query CompanyList($locale:String!){
      companies: CompanyList(length:5,locale:$locale) {
        id: _id
        name: companyName
      }
    }
  `,
  {
    options: (props) => ({
      variables: { locale: props.locale }
    })
  }
)(Companies)
