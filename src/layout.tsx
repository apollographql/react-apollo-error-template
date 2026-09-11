import { Outlet, Link } from "react-router-dom";

export function Layout() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Apollo Client Issue Reproduction</h1>
        <p>
          This application can be used to demonstrate an error in Apollo Client.
        </p>

        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/subscriptions-wslink">
                Subscriptions (GraphQLWsLink)
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="Grid-column">
        <Outlet />
      </div>
    </div>
  );
}
