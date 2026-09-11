/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type AllPeopleQueryVariables = Exact<{ [key: string]: never }>;

export type AllPeopleQuery = {
  people: Array<{
    __typename: "Person";
    id: string | null;
    name: string | null;
  } | null> | null;
};

export type AddPersonMutationVariables = Exact<{
  name?: string | null | undefined;
}>;

export type AddPersonMutation = {
  addPerson: {
    __typename: "Person";
    id: string | null;
    name: string | null;
  } | null;
};

export type NumberIncrementedSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type NumberIncrementedSubscription = {
  numberIncremented: number | null;
};
