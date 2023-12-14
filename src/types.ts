export interface Snippet {
  snippet: string;
  fileExtension?: string;
  fileType?: string;
  fileName: string;
  fullFilePath: string;
  createdAt: string;
  lines?: string;
  git?: Git;
}

export interface Git {
  fileCommitHash: string;
  fileCommitUrl: string;
  lineCommitHash?: string;
  lineCommitUrl?: string;
  repository: string;
  url: string;
  ssh: string;
  branch: string;
}
