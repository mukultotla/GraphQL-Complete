import { getJobs, getJob, getJobsByCompany } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    company: async (_, args) => {
      const company = await getCompany(args.id);
      if (!company) {
        notFoundError(`No company found with id ${args.id}`);
      }
      return company;
    },
    job: async (_, args) => {
      const job = await getJob(args.id);
      if (!job) {
        notFoundError(`No job found with id ${args.id}`);
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
};

function notFoundError(message) {
  throw new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
}
