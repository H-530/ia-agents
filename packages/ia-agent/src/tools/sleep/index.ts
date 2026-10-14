/**
 * Sleep Tool
 *
 * Pauses execution for a specified duration.
 */

import { tool } from 'agents-core';
import { z } from 'zod';

const MAX_SLEEP_MS = 60000; // 1 minute max

export const sleepTool = tool({
  name: 'sleep',
  description: 'Pause execution for a specified duration in milliseconds. Max 60 seconds.',
  parameters: z.object({
    duration_ms: z
      .number()
      .int()
      .min(0)
      .max(MAX_SLEEP_MS)
      .describe('Duration to sleep in milliseconds (0-60000)'),
  }),
  label: 'Sleep',
  execute: async (_toolCallId, { duration_ms }, signal) => {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, duration_ms);
      signal?.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Sleep aborted', 'AbortError'));
      });
    });
    return { result: `Slept for ${duration_ms}ms.` };
  },
});
