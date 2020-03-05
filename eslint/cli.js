#!/usr/bin/env node
const eslint = require('eslint')
let defaultExts = '.js'
try {
  const config = require('fs').readFileSync('./.eslintrc.json', 'utf8')
  if (config.includes('vue-eslint-parser')) defaultExts = '.js,.vue'
  // eslint-disable-next-line
} catch (err) {}

// eslint-disable-next-line max-len
const extensions = [...new Set((process.env.DRONE_PLUGIN_EXTENSIONS || defaultExts).split(/[ ,]/).filter(Boolean))]
const cli = new eslint.CLIEngine({extensions, cwd: process.cwd()})
const argv = process.argv.slice(2)
const files = argv.length ? argv : ['./']

const {errorCount, warningCount, results} = cli.executeOnFiles(files)
const message = []

if (errorCount) {
  process.exitCode = 1
  message.push(`${errorCount} Errors`)
}

if (warningCount) {
  message.push(`${warningCount} Warnings`)
}

if (!message.length) {
  message.push(`Congrats, everything's fine`)
}

const format = cli.getFormatter('pretty')
const log = format(results)

process.stdout.write(`${message.join('\n')}\n`)
if (log) process.stdout.write(log)

if (process.env.GH_TOKEN) {
  const github = require('@octokit/rest')()
  github.authenticate({type: 'token', token: process.env.GH_TOKEN})

  github.repos.createStatus({
    sha: process.env.DRONE_COMMIT_SHA,
    target_url: `${process.env.DRONE_BUILD_LINK}`,
    owner: process.env.DRONE_REPO_OWNER,
    repo: process.env.DRONE_REPO_NAME,
    context: 'eslint',
    description: message.join(', '),
    state: errorCount ? 'failure' : 'success'
  })
}
