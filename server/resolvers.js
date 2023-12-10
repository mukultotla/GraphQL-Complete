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
    createJob: (_, { input: { title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      const companyId = user.companyId;
      return createJob({ companyId, title, description });
    },
    deleteJob: async (_, { id }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }

      const job = await deleteJob(id, user.companyId);
      if (!job) {
        throw notFoundError(`No job found with id: ${id}`);
      }
      return job;
    },
    updateJob: async (_, { input: { id, title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      const companyId = user.companyId;
      const job = await updateJob({ id, companyId, title, description });
      if (!job) {
        throw notFoundError(`No job found with id: ${id}`);
      }
      return job;
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
