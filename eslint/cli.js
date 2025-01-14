#!/usr/bin/env node
'use strict'
const {Octokit} = require('@octokit/rest')
const {ESLint} = require('eslint')
const path = require('path')

async function run (directory) {
  const dir = path.join(process.cwd(), directory)
  const eslint = new ESLint({cwd: dir})
  const argv = process.argv.slice(2)
  const files = argv.length ? argv : ['./']

  const results = await eslint.lintFiles(files)
  const {e: errorCount, w: warningCount} = results.reduce(({e, w}, r) => ({
    e: e + r.errorCount,
    w: w + r.warningCount
  }), {e: 0, w: 0})

  const message = [`Directory: ${dir}`]

  if (errorCount) message.push(`${errorCount} Errors`)
  if (warningCount) message.push(`${warningCount} Warnings`)
  if (!message.length) message.push(`Congrats, everything's fine`)

  const formatter = await eslint.loadFormatter('pretty')
  const log = formatter.format(results)

  process.stdout.write(`${message.join('\n')}\n`)
  if (log) process.stdout.write(log)

  return {errorCount, warningCount}
}

async function start () {
  const directories = (process.env.PLUGIN_DIRECTORY || './').split(/, ?/)
  const githubToken = process.env.PLUGIN_GH_TOKEN || process.env.GH_TOKEN
  const github = githubToken && new Octokit({
    auth: githubToken,
    userAgent: 'marcbachmann/eslint:8.47.0'
  })

  if (github) {
    await github.repos.createCommitStatus({
      sha: process.env.DRONE_COMMIT_SHA,
      target_url: `${process.env.DRONE_BUILD_LINK}`,
      owner: process.env.DRONE_REPO_OWNER,
      repo: process.env.DRONE_REPO_NAME,
      context: 'eslint',
      description: `Running eslint on directories ${directories.join(', ')}`,
      state: 'pending'
    })
  }

  let errorCount = 0
  let warningCount = 0

  for (const dir of directories) {
    const res = await run(dir)
    errorCount += res.errorCount
    warningCount += res.warningCount
  }

  if (errorCount) process.exitCode = 1

  if (github) {
    const message = []
    if (errorCount) message.push(`${errorCount} Errors`)
    if (warningCount) message.push(`${warningCount} Warnings`)
    if (!message.length) message.push(`Congrats, everything's fine`)

    await github.repos.createCommitStatus({
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
