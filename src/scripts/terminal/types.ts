// src/scripts/terminal/types.ts - Type Definitions for Portfolio Terminal Engine

export type LangCode = 'en' | 'sv';

export type FileNode = {
  type: 'file';
  size: string;
  description: string;
  content: string;
  isExecutable?: boolean;
  actionUrl?: string;
};

export type DirNode = {
  type: 'dir';
  description?: string;
  children: Record<string, DirNode | FileNode>;
};

export type CommandContext = {
  currentPath: string[];
  fileSystem: DirNode;
  lang: LangCode;
  navigateWithCli: (url: string, messageHtml?: string) => boolean;
  resolvePath: (basePath: string[], pathStr: string) => string[];
  resolveNode: (pathArr: string[]) => DirNode | FileNode | null;
  getCurrentDir: () => DirNode;
  getCwdLabel: () => string;
  setCurrentPath: (newPath: string[]) => void;
  renderMarkdownCard: (rawMd: string) => string;
  escapeHtml: (str: string) => string;
  clearHistory: () => void;
  exitTerminal: () => void;
};

export type CommandHandler = (args: string[], ctx: CommandContext) => string | void;
