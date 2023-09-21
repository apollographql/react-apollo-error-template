import { graphql } from "msw";

/** @type {import('msw').RequestHandler[]} */
export const handlers = [
  graphql.query("AllPeople", (req, res, ctx) => {
    return res(
      ctx.data({ people: null }),
      ctx.errors([
        {
          message: "Invalid profile",
          locations: [{ line: 2, column: 3 }],
          path: ["people"],
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        },
      ])
    );
  }),
];
