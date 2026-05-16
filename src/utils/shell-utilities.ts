export const DANGEROUS_SHELL_UTILITY_NAMES = [
  'echo',
  'cat',
  'printf',
  'tee',
  'true',
  'false',
  'pwd',
  'sh',
  'bash',
  'zsh',
  'dash',
  'ksh',
  'env',
  'eval',
  'exec',
] as const;

export const DANGEROUS_SHELL_UTILITY_SET = new Set<string>(DANGEROUS_SHELL_UTILITY_NAMES);
