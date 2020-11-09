module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/variables.scss";`
      }
    }
  },
  publicPath:
    process.env.HEROKU_DEPLOY === "true" ||
    process.env.NODE_ENV === "development"
      ? "/" //This is for deployment to Heroku.
      : "/genie-ai-test/" //This is for deployment to Github Pages.
};
