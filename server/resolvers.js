import { getJobs, getJob } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
export const resolvers = {
  Query: {
    company: (_, args) => getCompany(args.id),
    job: (_, args) => getJob(args.id),
    jobs: async () => getJobs(),
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
