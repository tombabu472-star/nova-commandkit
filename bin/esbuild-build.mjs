// @ts-check
//
// esbuild-based project builder for the Nova CommandKit CLI.
//
// Why esbuild directly (instead of tsup) for the user-project build?
// tsup 8's internal `tinyglobby.glob` returns entry paths as *bare relative*
// specifiers (e.g. `src/index.mjs` with no `./` prefix). esbuild treats bare
// entry points as package specifiers and fails to resolve them on Node.js 22+,
// silently producing no output. Using esbuild directly with absolute entry
// paths + an explicit `absWorkingDir` resolves this robustly on Node.js 24+.

import * as esbuild from 'esbuild';
import { glob } from 'tinyglobby';
import { resolve, join, extname } from 'node:path';
import { readFileSync, existsSync, statSync } from 'node:fs';

const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs']);

/**
 * Collect absolute entry file paths from the configured `src`.
 * `src` may be a single file or a directory (recursively globbed).
 *
 * @param {string} src - The source file or directory (relative to cwd).
 * @param {string} cwd - The current working directory.
 * @param {string[]} ignore - Glob patterns to ignore.
 * @returns {Promise<string[]>} Absolute file paths.
 */
export async function collectEntries(src, cwd, ignore = []) {
    const absSrc = resolve(cwd, src);

    if (existsSync(absSrc) && statSync(absSrc).isFile()) {
        return [absSrc];
    }

    const files = await glob([`${absSrc}/**/*`], {
        absolute: true,
        onlyFiles: true,
        ignore: ['**/dist/**', '**/.commandkit/**', '**/node_modules/**', ...ignore.map((p) => `**/${p}/**`)],
    });

    return files.filter((f) => CODE_EXTENSIONS.has(extname(f)));
}

/**
 * Read the user's package.json and derive the list of packages that should be
 * kept external (i.e. not bundled into the output).
 *
 * @param {string} cwd - The current working directory.
 * @returns {string[]} Package names to externalize.
 */
export function collectExternals(cwd) {
    try {
        const pkgPath = join(cwd, 'package.json');
        if (!existsSync(pkgPath)) return [];
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
        return [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
            ...Object.keys(pkg.optionalDependencies || {}),
        ];
    } catch {
        return [];
    }
}

/**
 * @typedef {Object} BuildProjectOptions
 * @property {string} cwd - The current working directory.
 * @property {string} src - The source file or directory.
 * @property {string} outDir - The output directory.
 * @property {boolean|'inline'} [sourcemap] - Sourcemap option.
 * @property {boolean} [minify] - Whether to minify.
 * @property {string} [banner] - JS banner comment.
 * @property {string[]} [extraExternals] - Additional packages to externalize.
 * @property {Function} [onSuccess] - Called after a successful (re)build.
 * @property {boolean} [watch] - Whether to watch for changes.
 */

/**
 * Build (or watch) a user project with esbuild.
 *
 * @param {BuildProjectOptions} opts
 * @returns {Promise<esbuild.BuildContext | undefined>} The esbuild context when watching, otherwise undefined.
 */
export async function buildProject(opts) {
    const cwd = opts.cwd || process.cwd();
    const outDir = resolve(cwd, opts.outDir || 'dist');
    const entries = await collectEntries(opts.src, cwd);

    if (entries.length === 0) {
        throw new Error(`No source files found in "${opts.src}".`);
    }

    const external = [...collectExternals(cwd), ...(opts.extraExternals || [])];

    /** @type {esbuild.BuildOptions} */
    const config = {
        entryPoints: entries,
        absWorkingDir: cwd,
        bundle: true,
        format: 'esm',
        outExtension: { '.js': '.mjs' },
        outdir: outDir,
        platform: 'node',
        target: 'es2022',
        sourcemap: opts.sourcemap === 'inline' ? 'inline' : Boolean(opts.sourcemap),
        minify: Boolean(opts.minify),
        keepNames: true,
        external,
        logLevel: 'warning',
        banner: opts.banner ? { js: opts.banner } : undefined,
        plugins: [],
    };

    if (opts.onSuccess) {
        config.plugins = [
            {
                name: 'nova-on-success',
                setup(build) {
                    build.onEnd((result) => {
                        if (result.errors.length === 0) {
                            try {
                                opts.onSuccess();
                            } catch (e) {
                                build.logger.error(String(e));
                            }
                        }
                    });
                },
            },
        ];
    }

    if (opts.watch) {
        const ctx = await esbuild.context(config);
        await ctx.watch();
        return ctx;
    }

    await esbuild.build(config);
    return undefined;
}
