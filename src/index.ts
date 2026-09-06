export * from './CommandKit';
export * from './components';
export * from './config';
export * from './utils/signal';
export type * from './types';

import { CommandKit } from './CommandKit';

/**
 * Alias for {@link CommandKit}.
 *
 * `NovaCommandKit` is the primary class name for this fork, while `CommandKit`
 * is kept as a backward-compatible alias so existing projects can migrate
 * incrementally.
 */
export const NovaCommandKit = CommandKit;
