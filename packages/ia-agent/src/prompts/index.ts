import type { AgentTool } from 'agents-core';
import { CONFIG } from '../config';
import { loadSkills, loadSubagents } from '../load_artifacts';
import { createSkillSystemInstruction } from '../tools/skills';
import { createSubagentSystemInstruction } from '../tools/subagent';

export function buildToolSystemInstruction(
  initialSystemInstruction: string,
  tools: AgentTool[]
): string {
  let result = initialSystemInstruction;

  // Add skills section if skills tool is present
  const hasSkillsTool = tools.some((t) => t.name === 'skills');
  if (hasSkillsTool) {
    const skills = loadSkills().filter((s) => !CONFIG.disabledSkills.includes(s.name));
    const skillsSection = createSkillSystemInstruction(skills);
    result += skillsSection;
  }

  // Add subagents section if subagent tool is present
  const hasSubagentTool = tools.some((t) => t.name === 'delegate_to_subagent');
  if (hasSubagentTool) {
    const subagents = loadSubagents().filter((s) => !CONFIG.disabledSubagents.includes(s.name));
    const subagentsSection = createSubagentSystemInstruction(subagents);
    result += subagentsSection;
  }

  return result;
}
