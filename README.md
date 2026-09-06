<div align="center">

# Nova CommandKit

**Beginner friendly command & event handler for Discord.js — Node.js 24+ ready.**

[![node](https://img.shields.io/badge/node-%E2%89%A524.0.0-brightgreen)](https://nodejs.org)
[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
![GitHub package version](https://img.shields.io/github/package-json/v/tombabu472-star/nova-commandkit)

</div>

> **What is this?**
> Nova CommandKit is a Node.js 24+ compatible fork of [CommandKit](https://github.com/underctrl-io/commandkit)
> by **Under Ctrl**. The original library targeted Node.js 20 and broke on newer
> runtimes because it used the removed `assert` import option. Nova CommandKit
> modernizes the toolchain and fixes those incompatibilities so it runs cleanly
> on Node.js 22, 24, and beyond. All credit for the original design goes to the
> CommandKit authors — this fork is published under the same MIT license.

## Features

- Beginner friendly 🚀
- Slash + context menu commands support ✅
- Multiple dev guilds, users, & roles support 🤝
- Automatic command updates 🤖
- REST registration behaviour 📍
- Easy command line interface 🖥️
- **Node.js 24+ support** 🟢 (import attributes, stabilized watch mode, modern toolchain)

## Requirements

- [Node.js](https://nodejs.org) `>= 20.10.0` (Node.js 22 LTS or 24 recommended)
- [discord.js](https://discord.js.org) `^14`

## Installation

This package is distributed via **GitHub Packages** under the `@tombabu472-star`
scope. Because GitHub Packages requires authentication (even for reads), you
need a Personal Access Token (PAT) with `read:packages` scope to install it.

### Step 1 — Create a PAT

1. Go to https://github.com/settings/tokens (or Settings → Developer settings →
   Personal access tokens → Tokens (classic)).
2. Generate a new token with at least the **`read:packages`** scope.
3. Copy the token (`ghp_...` or `github_pat_...`).

### Step 2 — Authenticate npm to GitHub Packages

Create or edit a file named `.npmrc` in your project root (or in `~/.npmrc` for
global use):

```ini
# .npmrc
@tombabu472-star:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_PAT_HERE
```

> Tip: For CI, use an environment variable instead of pasting the token:
> ```ini
> //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
> ```

### Step 3 — Install

```bash
npm install @tombabu472-star/nova-commandkit discord.js
```

Yarn:

```bash
yarn add @tombabu472-star/nova-commandkit discord.js
```

pnpm:

```bash
pnpm add @tombabu472-star/nova-commandkit discord.js
```

### Install development version

```bash
npm install nova-commandkit@dev
```

> ⚠️ The development version is likely to have bugs.

## Usage

This is a simple overview of how to set up this library with all the options.

```js
// index.js
const { Client, GatewayIntentBits } = require('discord.js');
const { CommandKit } = require('@tombabu472-star/nova-commandkit');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

new CommandKit({
    // Your discord.js client object
    client,

    // Path to the commands folder
    commandsPath: path.join(__dirname, 'commands'),

    // Path to the events folder
    eventsPath: path.join(__dirname, 'events'),

    // Path to the validations folder (only valid if "commandsPath" was provided)
    validationsPath: path.join(__dirname, 'validations'),

    // Array of development server IDs (used to register and run devOnly commands)
    devGuildIds: ['1234567890', '0987654321'],

    // Array of developer user IDs (used for devOnly commands)
    devUserIds: ['1234567890', '0987654321'],

    // Array of developer role IDs (used for devOnly commands)
    devRoleIds: ['1234567890', '0987654321'],

    // Disable CommandKit's built-in validations
    skipBuiltInValidations: true,

    // Update command registration/reload behaviour to register all commands at once
    bulkRegister: true,
});

client.login('YOUR_TOKEN_HERE');
```

### Using the `NovaCommandKit` alias

`NovaCommandKit` is the primary class name for this fork. `CommandKit` is kept as
a backward-compatible alias, so both of these work:

```js
const { CommandKit } = require('@tombabu472-star/nova-commandkit');
const { NovaCommandKit } = require('@tombabu472-star/nova-commandkit');
```

## Command Line Interface

Nova CommandKit ships with a CLI for development, building, and production:

```bash
# Start your bot in development mode (with watch + hot reload)
nova-commandkit dev

# Build your project for production
nova-commandkit build

# Start your bot in production mode (after building)
nova-commandkit start
```

A short `nova` alias is also installed alongside `nova-commandkit`.

### Configuration

Create a `commandkit.json` (or `commandkit.js` / `.mjs` / `.cjs`) file in your
project root:

```json
{
    "src": "src",
    "main": "index.mjs",
    "watch": true,
    "outDir": "dist",
    "minify": false,
    "sourcemap": false,
    "antiCrash": true,
    "requirePolyfill": true,
    "envExtra": true,
    "clearRestartLogs": true,
    "nodeOptions": []
}
```

## What changed vs. the original CommandKit?

This fork focuses on **Node.js 24+ compatibility**. Key changes:

| Area | Original (CommandKit 0.1.10) | Nova CommandKit |
| --- | --- | --- |
| Config loading | `import(path, { assert: { type: 'json' } })` ❌ removed in Node 22+ | `import(path, { with: { type: 'json' } })` ✅ import attributes |
| File URL resolution | manual string concatenation | `node:url` `pathToFileURL` (robust on all platforms) |
| `@types/node` | `^20` | `^22` |
| `tsup` | `^7` | `^8` |
| `tsx` | `^3` | `^4` |
| `commander` | `^11` | `^12` |
| `rimraf` | `^5` | `^6` |
| `ora` | `^7` | `^8` |
| TypeScript | `^5.1` | `^5.6` |
| `engines.node` | _(none)_ | `>= 20.10.0` |
| Class export | `CommandKit` | `CommandKit` + `NovaCommandKit` alias |

See the [CHANGELOG](./CHANGELOG.md) for the full list.

## License

MIT — see [LICENSE](./LICENSE).

Nova CommandKit is derived from [CommandKit](https://github.com/underctrl-io/commandkit)
© 2023 Under Ctrl, used under the MIT license.
