import type { FindingEvidence } from '../types/index.js';

const PROMPT_ARMOR_BOB = 'https://www.promptarmor.com/resources/ibm-ai-(-bob-)-downloads-and-executes-malware';
const SNYK_TOXIC_SKILLS = 'https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/';
const OX_MOTHER_OF_AI = 'https://www.ox.security/blog/the-mother-of-all-ai-supply-chains-critical-systemic-vulnerability-at-the-core-of-the-mcp/';
const COMMENT_AND_CONTROL = 'https://oddguan.com/blog/comment-and-control-prompt-injection-credential-theft-claude-code-gemini-cli-github-copilot/';
const ARXIV_AGENT_PRIV_ESC = 'https://arxiv.org/abs/2601.17548';
const BOB_DOCS_MODES = 'https://bob.ibm.com/docs/ide/features/modes';

export const EVIDENCE = {
  promptArmor(): FindingEvidence {
    return {
      primarySource: 'PromptArmor 2026-01-07',
      references: [PROMPT_ARMOR_BOB],
    };
  },
  snyk(extra?: string): FindingEvidence {
    const refs = [SNYK_TOXIC_SKILLS];
    if (extra) refs.push(extra);
    return { primarySource: 'Snyk ToxicSkills 2026-02-05', references: refs };
  },
  ox(): FindingEvidence {
    return {
      primarySource: 'OX Security 2026-04-16',
      cveIds: ['CVE-2026-30615', 'CVE-2026-30625', 'CVE-2025-65720'],
      references: [OX_MOTHER_OF_AI],
    };
  },
  commentAndControl(): FindingEvidence {
    return {
      primarySource: 'Aonan Guan + Johns Hopkins 2026-04-15',
      references: [COMMENT_AND_CONTROL],
    };
  },
  customMode(): FindingEvidence {
    return {
      primarySource: 'arXiv 2601.17548 + Snyk ToxicSkills 2026-02-05',
      references: [ARXIV_AGENT_PRIV_ESC, SNYK_TOXIC_SKILLS, BOB_DOCS_MODES],
    };
  },
};
