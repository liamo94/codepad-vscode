export interface Snippet extends SnippetMetaData {
  snippet: string;
  title?: string;
  description?: string;
  fileExtension?: string;
  fileType?: string;
  fileName: string;
  fullFilePath: string;
  createdAt: string;
  lines: LineRange;
  git?: Git;
}

export interface SnippetMetaData {
  loc?: string;
  fileSize?: number;
}

export interface Git {
  fileCommitHash: string;
  fileCommitUrl: string;
  lineCommitHash: string;
  lineCommitUrl: string;
  repository: string;
  url: string;
  ssh: string;
  branch: string;
  shareableLink: string;
}

export type LineRange = [from: number, to: number];

export const codepad = "codepad";
