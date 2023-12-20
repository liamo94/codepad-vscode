export interface Snippet extends SnippetMetaData {
  snippet: string;
  title?: string;
  description?: string;
  fileExtension?: string;
  fileType?: string;
  fileName: string;
  fullFilePath: string;
  createdAt: string;
  lines: [from: number, to: number];
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
