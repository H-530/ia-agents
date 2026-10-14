

import * as fs from 'node:fs';
import { type AgentTool, createAgentSession } from 'ia-agent';
import { formatEvent, printStream } from 'agents-core';

// ============================================================================
// Create session with hooks
// ============================================================================

const session = createAgentSession({
  model: 'gemini-3-flash-preview',
  systemInstruction: 'You are a helpful file assistant. Be concise.',
});

session.send('What is your name, what can you do tools, subagents, skills?');

for await (const event of session.stream()) {
  const formatted = formatEvent(event, { verbosity: 'verbose' });
  if (formatted) console.log(formatted);
}


