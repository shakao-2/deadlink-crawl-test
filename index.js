const core = require('@actions/core');
const github = require('@actions/github');
const { SiteChecker } = require('broken-link-checker');


try {
  const repoToken = core.getInput('token');
  const octokit = github.getOctokit(repoToken)

  const result = {}
  let brokenLinks = [];

  const options = {
    excludedKeywords: ["linkedin"]
  }

  const handlers = {
    link: (result) => {
      if (result.broken) {
        brokenLinks.push(result.url.original)
      }
    },
    page: (error, pageURL) => {
      console.log(`Scanned... ${pageURL}`)
      if (brokenLinks.length) {
        console.log(`${brokenLinks.length} broken links\r\n`)
        result[pageURL] = brokenLinks;
        brokenLinks = [];
      }
    },
    site: (error, siteURL) => {
      console.log("Done scanning!")
      console.log(result)

      const context = github.context;

      const newIssue = octokit.rest.issues.create({
        ...context.repo,
        title: 'New issue!',
        body: 'Hello Universe!'
      });
    },
  }

  const siteChecker = new SiteChecker(options, handlers)
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