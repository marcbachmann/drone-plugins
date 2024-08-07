#!/usr/bin/env node
'use strict'
const {Octokit} = require('@octokit/rest')
const {ESLint} = require('eslint')

async function start () {
  const eslint = new ESLint({cwd: process.cwd()})
  const argv = process.argv.slice(2)
  const files = argv.length ? argv : ['./']

  const results = await eslint.lintFiles(files)
  const {e: errorCount, w: warningCount} = results.reduce(({e, w}, r) => ({
    e: e + r.errorCount,
    w: w + r.warningCount
  }), {e: 0, w: 0})

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

  const formatter = await eslint.loadFormatter('pretty')
  const log = formatter.format(results)

  process.stdout.write(`${message.join('\n')}\n`)
  if (log) process.stdout.write(log)

  if (process.env.GH_TOKEN) {
    const github = new Octokit({
      auth: process.env.GH_TOKEN,
      userAgent: 'marcbachmann/eslint:8.47.0'
    })

    github.repos.createCommitStatus({
      sha: process.env.DRONE_COMMIT_SHA,
      target_url: `${process.env.DRONE_BUILD_LINK}`,
      owner: process.env.DRONE_REPO_OWNER,
      repo: process.env.DRONE_REPO_NAME,
      context: 'eslint',
      description: message.join(', '),
      state: errorCount ? 'failure' : 'success'
    })
  }
}

start()
