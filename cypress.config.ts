import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    HOST_APP: "http://localhost:3000",
    HOST_API: "https://devapi.legendtrading.com",
    // HOST_APP: "https://fedev.legendtrading.com",
    // HOST_API: "https://devapi.legendtrading.com",
  },
  viewportWidth:1800,
  viewportHeight:1000,
});
