# Apollo Client Issue Reproduction

Welcome! If you are here then you were likely referred to this repo when reporting an error to [`apollographql/apollo-client`][1]. The core team is invested in making the best client for GraphQL possible, so when you hit an error it is important to the team that the error is resolved as soon as possible.

Unfortunately, describing an error in GitHub is often not enough to truly understand the reported issue. By creating a small reproduction test case using this template repo the Apollo Client team will be able to identify and fix your error much faster then they could without.

This repo was created with [`vite`][2] and is appropriate for reproductions of client-rendered React applications. To make changes in the GraphQL schema make sure to look at the `./src/index.jsx` file where we define a GraphQL schema using [GraphQL.js][5] which will run in the browser.

| ☑️  Apollo Client User Survey |
| :----- |
| What do you like best about Apollo Client? What needs to be improved? Please tell us by taking a [one-minute survey](https://docs.google.com/forms/d/e/1FAIpQLSczNDXfJne3ZUOXjk9Ursm9JYvhTh1_nFTDfdq3XBAFWCzplQ/viewform?usp=pp_url&entry.1170701325=Apollo+Client&entry.204965213=Readme). Your responses will help us understand Apollo Client usage and allow us to serve you better. |

## Reproductions with other frameworks

- **Next.js**: see our [`apollographql/next-apollo-example`][3] repository
- **React Native**: see our [`apollographql/rn-apollo-client-testbed`][4] repository

If you are not using React, a small reproduction case with your framework of choice would go a long way.

[1]: https://github.com/apollographql/apollo-client
[2]: https://vitejs.dev/
[3]: https://github.com/apollographql/next-apollo-example
[4]: https://github.com/apollographql/rn-apollo-client-testbed
[5]: http://graphql.org/graphql-js/

# Reproduction Creation Steps

1. Fork this repository to your GitHub account, or fork the [CodeSandbox](https://codesandbox.io/s/github/apollographql/react-apollo-error-template?file=/src/index.jsx) and skip steps 2-4.
2. By default, cloning this repostiory gives you an Apollo Client 3.0-based application. If you would like to start with a legacy Apollo Client 2.6 application, clone or checkout the `ac2` branch:
  ```sh
  git clone --branch ac2 git@github.com:apollographql/react-apollo-error-template.git
  # Or, after cloning the repository:
  git checkout -t origin/ac2
  ```
3. After cloning, install all dependencies with `npm install`.
4. Start the development server with `npm start`.
5. Make the changes that will reproduce this error locally.
6. When ready, push your changes back to GitHub and let the [`apollo-client` team](https://github.com/apollographql/apollo-client#maintainers) know where they can be found.
