// import { GraphQLClient } from "graphql-request";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";
import { getAccessToken } from "../auth";

// const client = new GraphQLClient("http://localhost:9000/graphql", {
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       return {
//         Authorization: `Bearer ${accessToken}`,
//       };
//     }
//     return {};
//   },
// });

const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: "network-only",
  //   },
  //   watchQuery: {
  //     fetchPolicy: "network-only",
  //   },
  // },
});

export async function getCompany(companyId) {
  const query = gql`
    query CompanyById($companyId: ID!) {
      company(id: $companyId) {
        id
        name
        description
        jobs {
          id
          date
          title
        }
      }
    }
  `;
  const { data } = await apolloClient.query({
    query,
    variables: { companyId },
  });
  return data.company;
}

export async function getJob(id) {
  const query = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        id
        date
        title
        description
        company {
          id
          name
          description
        }
      }
    }
  `;
  const { data } = await apolloClient.query({ query, variables: { id } });
  return data.job;
}

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        id
        title
        date
        company {
          id
          name
        }
      }
    }
  `;
  const { data } = await apolloClient.query({
    query,
    fetchPolicy: "network-only",
  });
  return data.jobs;
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation Mutation($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;
  const { data } = await apolloClient.mutate({
    mutation,
    variables: {
      input: { title, description },
    },
  });
  return data.job;
}
