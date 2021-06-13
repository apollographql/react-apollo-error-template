/*** APP ***/
import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useQuery,
} from "@apollo/client";
import "./index.css";

const queryReg = /method=([^&]*)/;

function Container() {
  const [count, setCount] = useState(0);
  const [on, toggle] = useState(true);
  const [method, switchMethod] = useState(true);

  const name = method ? "apollo" : "fetch";

  useEffect(() => {
    setInterval(() => setCount(c => c + 1), 1000);
  }, []);

  return (
    <div>
      <button onClick={() => switchMethod(x => !x)}>switch method</button>{" "}
      {name}
      <div>--------------</div>
      <div>Count: {count}</div>
      <div>
        <button onClick={() => toggle(x => !x)}>toggle</button>
      </div>
      {on && (
        <iframe
          title="inner"
          src={`/?v=${count}&method=${name}`}
          name="inner"
        />
      )}
    </div>
  );
}

const URL = "https://countries.trevorblades.com/";

const client = new ApolloClient({
  uri: URL,
  cache: new InMemoryCache(),
});

const fetchQuery = `{ countries { name } }`;

const apolloQuery = gql`
  query {
    countries {
      name
    }
  }
`;

function execFetch() {
  console.log("-> starting fetch");
  return fetch(URL, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ query: fetchQuery }),
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log("<- data received", data);
      return data;
    })
    .catch(e => console.error("xx data error", e));
}

function FetchTest() {
  const [data, setData] = useState();
  useEffect(() => {
    execFetch().then(data => setData(data));
  }, []);

  return (
    <div>
      <b>Fetch</b> result is: {JSON.stringify(data)}
    </div>
  );
}

function ApolloTest() {
  const { data } = useQuery(apolloQuery, {
    client: client,
  });

  return (
    <div>
      <b>Apollo</b> result is: {JSON.stringify(data)}
    </div>
  );
}

function App() {
  const regRes = queryReg.exec(window.location.search);
  const method = regRes && regRes[1];

  return (
    window.name === 'inner' && method === 'apollo'
    ? <ApolloTest />
    : window.name === 'inner' && method === 'fetch'
    ? <FetchTest />
    : <Container />
  );
}

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
