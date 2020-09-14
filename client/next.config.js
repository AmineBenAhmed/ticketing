module.exports = {
  webpackDevMiddleware: config => {
  config.watchOptions.poll = 300;
  return config;
  }
};
//this file is loaded automatically by nextjs when a project starts up
//it calls the webpackDevMiddleware function with the some middlepack configuration that's created by default
//we are change a single option "watchOptions" to tell webpack rather than to watch file changes with some automated fasion
//instead of that poll all different files inside the project all the 300ms automatically