import { getJobs, getJob, getJobsByCompany } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
export const resolvers = {
  Query: {
    company: (_, args) => getCompany(args.id),
    job: (_, args) => getJob(args.id),
    jobs: async () => getJobs(),
  },
  Company: {
    jobs: (company) => {
      return getJobsByCompany(company.id);
    }
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
