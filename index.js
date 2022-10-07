const core = require('@actions/core');
const github = require('@actions/github');
const { SiteChecker } = require('broken-link-checker');


try {

  const options = {
    excludedKeywords: ["linkedin"]
  }

  const siteChecker = new SiteChecker(options)
    // .on('error', (error) => {})
    // .on('robots', (robots, customData) => {})
    // .on('html', (tree, robots, response, pageURL, customData) => {})
    // .on('queue', () => {})
    // .on('junk', (result, customData) => {})
    // .on('link', (result, customData) => {})
    .on('page', (error, pageURL, customData) => {
      console.log("-----PAGE-----")
      console.log(error)
      console.log(pageURL)
    })
    .on('site', (error, siteURL, customData) => {
      console.log("-----SITE-----")
      console.log(error)
      console.log(siteURL)
    })
    .on('end', () => {});

  siteChecker.enqueue("https://www.justfix.org/en/learn/");

//  // `who-to-greet` input defined in action metadata file
//   const nameToGreet = core.getInput('who-to-greet');
//   console.log(`Hello ${nameToGreet}!`);
//   const time = (new Date()).toTimeString();
//   core.setOutput("time", time);
//   // Get the JSON webhook payload for the event that triggered the workflow
//   const payload = JSON.stringify(github.context.payload, undefined, 2)
//   console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}