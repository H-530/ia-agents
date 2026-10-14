/**
 * Tool Wrapping
 *
 * Wraps tools to inject beforeToolExecute and afterToolExecute hooks.
 */

import type { AgentTool, AgentToolResult } from 'agents-core';
import type { HookRunner } from '../hooks/runner';

export function wrapToolsWithHooks(tools: AgentTool[], hooks: HookRunner): AgentTool[] {
  return tools.map((tool) => ({
    ...tool,
    execute: async (toolCallId, args, signal, onUpdate) => {
      // Run beforeToolExecute hooks
      const approval = await hooks.emit('beforeToolExecute', {
        type: 'beforeToolExecute',
        toolName: tool.name,
        toolCallId,
        arguments: args,
      });

      // Check for block
      if (!approval.allow) {
        return {
          result: `Blocked: ${approval.reason || 'Tool execution blocked by hook'}`,
          isError: true,
        };
      }

      // Use modified arguments if provided
      const effectiveArgs = approval.arguments ?? args;

      // Execute original tool
      let result: AgentToolResult;
      try {
        result = await tool.execute(toolCallId, effectiveArgs, signal, onUpdate);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        result = { result: `Error: ${message}`, isError: true };
      }

      // Run afterToolExecute hooks
      const modified = await hooks.emit('afterToolExecute', {
        type: 'afterToolExecute',
        toolName: tool.name,
        toolCallId,
        result,
      });

      // Return modified result or original
      return modified.result ?? result;
    },
  }));
}
