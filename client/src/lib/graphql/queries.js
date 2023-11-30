import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("http://localhost:9000/graphql");

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
  const data = await client.request(query, { companyId });
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
  const data = await client.request(query, { id });
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
  const data = await client.request(query);
  return data.jobs;
}
