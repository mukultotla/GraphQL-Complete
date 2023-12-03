import {
  getJobs,
  getJob,
  getJobsByCompany,
  createJob,
  deleteJob,
  updateJob,
} from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    company: async (_, args) => {
      const company = await getCompany(args.id);
      if (!company) {
        throw notFoundError(`No company found with id ${args.id}`);
      }
      return company;
    },
    job: async (_, args) => {
      const job = await getJob(args.id);
      if (!job) {
        throw notFoundError(`No job found with id ${args.id}`);
      }
      return job;
    },
    jobs: async () => getJobs(),
  },
  Company: {
    jobs: (company) => {
      return getJobsByCompany(company.id);
    },
  },
  Job: {
    date: (job) => {
      return job.createdAt.slice(0, "yyyy-mm-dd".length);
    },
    company: (job) => {
      return getCompany(job.companyId);
    },
  },

  Mutation: {
    createJob: (_, { input: { title, description } }, { auth }) => {
      if (!auth) {
        throw unauthorizedError("Missing authentication");
      }
      const companyId = "FjcJCHJALA4i";
      return createJob({ companyId, title, description });
    },
    deleteJob: (_, { id }) => {
      return deleteJob(id);
    },
    updateJob: (_, { input: { id, title, description } }) => {
      return updateJob({ id, title, description });
    },
  },
};

function notFoundError(message) {
  throw new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
}

function unauthorizedError(message) {
  throw new GraphQLError(message, {
    extensions: { code: "UNAUTHORIZED" },
  });
}
