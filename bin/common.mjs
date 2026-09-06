// @ts-check

import { rimrafSync } from 'rimraf';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';

const resetColor = '\x1b[0m';

export const Colors = {
    reset: (text) => `${text}${resetColor}`,
    bright: (text) => `\x1b[1m${text}${resetColor}`,
    dim: (text) => `\x1b[2m${text}${resetColor}`,
    underscore: (text) => `\x1b[4m${text}${resetColor}`,
    blink: (text) => `\x1b[5m${text}${resetColor}`,
    reverse: (text) => `\x1b[7m${text}${resetColor}`,
    hidden: (text) => `\x1b[8m${text}${resetColor}`,

    black: (text) => `\x1b[30m${text}${resetColor}`,
    red: (text) => `\x1b[31m${text}${resetColor}`,
    green: (text) => `\x1b[32m${text}${resetColor}`,
    yellow: (text) => `\x1b[33m${text}${resetColor}`,
    blue: (text) => `\x1b[34m${text}${resetColor}`,
    magenta: (text) => `\x1b[35m${text}${resetColor}`,
    cyan: (text) => `\x1b[36m${text}${resetColor}`,
    white: (text) => `\x1b[37m${text}${resetColor}`,

    bgBlack: (text) => `\x1b[40m${text}${resetColor}`,
    bgRed: (text) => `\x1b[41m${text}${resetColor}`,
    bgGreen: (text) => `\x1b[42m${text}${resetColor}`,
    bgYellow: (text) => `\x1b[43m${text}${resetColor}`,
    bgBlue: (text) => `\x1b[44m${text}${resetColor}`,
    bgMagenta: (text) => `\x1b[45m${text}${resetColor}`,
    bgCyan: (text) => `\x1b[46m${text}${resetColor}`,
    bgWhite: (text) => `\x1b[47m${text}${resetColor}`,
};

export function write(message) {
    process.stdout.write(message);
    process.stdout.write('\n');
}

/**
 * @returns {never}
 */
export function panic(message) {
    write(Colors.red(`Error: ${message}`));
    process.exit(1);
}

export function findPackageJSON() {
    const cwd = process.cwd();
    const target = join(cwd, 'package.json');

    if (!fs.existsSync(target)) {
        panic('Could not find package.json in current directory.');
    }

    return JSON.parse(fs.readFileSync(target, 'utf8'));
}

const possibleFileNames = [
    'commandkit.json',
    'commandkit.config.json',
    'commandkit.js',
    'commandkit.config.js',
    'commandkit.mjs',
    'commandkit.config.mjs',
    'commandkit.cjs',
    'commandkit.config.cjs',
    'nova.json',
    'nova.config.json',
    'nova.js',
    'nova.config.js',
    'nova.mjs',
    'nova.config.mjs',
];

export async function findCommandKitConfig(src) {
    const cwd = process.cwd();
    const locations = src ? [join(cwd, src)] : possibleFileNames.map((name) => join(cwd, name));

    for (const location of locations) {
        try {
            return await loadConfigInner(location);
        } catch (e) {
            continue;
        }
    }

    panic('Could not locate nova-commandkit config.');
}

async function loadConfigInner(target) {
    const isJSON = target.endsWith('.json');

    // Node.js 22+ removed the `assert` import option (import assertions) in favor
    // of `with` (import attributes). Node.js 24 only supports `with`.
    // This is the key compatibility fix for nova-commandkit on Node.js 24+.
    const importOptions = isJSON ? { with: { type: 'json' } } : undefined;

    /**
     * @type {import('..').CommandKitConfig}
     */
    const config = await import(pathToFileURL(target).href, importOptions).then(
        (conf) => conf.default || conf,
    );

    return config;
}

export function erase(dir) {
    rimrafSync(dir);
}
