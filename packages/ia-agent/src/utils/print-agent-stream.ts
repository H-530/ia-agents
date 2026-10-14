/**
 * Print Agent Stream
 *
 * Utility for printing formatted events from an AgentSession stream.
 * Delegates to the core printFormattedEvents helper.
 */

import { type FormatOptions, printFormattedEvents } from 'agents-core';
import type { AgentEvent } from 'agents-core';

export async function printAgentStream(
  stream: AsyncIterable<AgentEvent>,
  options?: FormatOptions
): Promise<void> {
  await printFormattedEvents(stream, options);
}
