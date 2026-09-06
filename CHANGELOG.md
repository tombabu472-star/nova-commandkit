# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - Nova CommandKit (Node.js 24+ fork)

This is the first release of **Nova CommandKit**, a Node.js 24+ compatible fork
of CommandKit (`0.1.10`) by Under Ctrl.

### Added

-   **Node.js 24+ support.** The CLI config loader now uses import attributes
    (`with: { type: 'json' }`) instead of the removed import assertions
    (`assert: { type: 'json' }`), which were removed in Node.js 22+.
-   `NovaCommandKit` class export as the primary name, with `CommandKit` kept as
    a backward-compatible alias.
-   `engines.node: ">= 20.10.0"` field to declare runtime requirements.
-   Robust file URL resolution via `node:url` `pathToFileURL`.
-   Broader experimental-warning suppression in the dev server stderr stream.
-   Short `nova` CLI alias alongside `nova-commandkit`.

### Changed

-   Bumped `@types/node` from `^20` to `^22`.
-   Bumped `tsup` from `^7` to `^8`.
-   Bumped `tsx` from `^3` to `^4`.
-   Bumped `commander` from `^11` to `^12`.
-   Bumped `rimraf` from `^5` to `^6`.
-   Bumped `ora` from `^7` to `^8`.
-   Bumped `typescript` from `^5.1` to `^5.6`.
-   Made `tsconfig.json` self-contained (no longer extends a workspace package).
-   Rebranded package metadata, CLI, and user-facing strings to Nova CommandKit.

## [0.1.10] - 2023-12-12

### Fixed

-   CommonJS projects crash when using commandkit cli with watch mode.

## [0.1.9] - 2023-12-12

### Changes (breaking)

-   Update `ValidationFunctionProps` type name to `ValidationProps`.
-   Update `autocompleteRun` command function name to `autocomplete`.
-   Update `AutocompleteCommandProps` type name to `AutocompleteProps`.

### Deprecated

-   `guildOnly` in command options. CommandKit no longer handles the `guildOnly` condition. Use `dm_permission` in your command `data` object instead.

### Fixed

-   Broken docs links.

### Added

-   `ValidationProps` type definition.
