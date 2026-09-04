// Automatically intercepts all fetch calls across the whole project
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const originalFetch = window.fetch;

window.fetch = async (...args) => {
  let [resource, config] = args;

  if (typeof resource === "string") {
    // Replace old CloudFront URL or localhost automatically
    resource = resource
      .replace("https://d3dwbpl48ewtpl.cloudfront.net", API_BASE_URL)
      .replace("http://localhost:5000", API_BASE_URL);
  }

  return originalFetch(resource, config);
};
