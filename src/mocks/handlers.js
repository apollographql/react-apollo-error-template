import { graphql, HttpResponse } from "msw";

const peopleData = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Sara Smith" },
  { id: 3, name: "Budd Deey" },
];

/** @type {import('msw').RequestHandler[]} */
export const handlers = [
  graphql.query("AllPeople", () => {
    return HttpResponse.json({ data: { people: peopleData } });
  }),
  graphql.mutation("AddPerson", ({ variables }) => {
    const person = {
      id: peopleData[peopleData.length - 1].id + 1,
      name: variables.name,
    };
    peopleData.push(person);
    return HttpResponse.json({ data: { addPerson: person } });
  }),
];
