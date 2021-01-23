export interface LeanoteBackendServiceConfig {
  leanote_host: string;
  email: string;
  pwd: boolean;
  token_cached: string;
}

export interface LeanoteResponse {
  Ok: string;
  Msg: string;
  Token: string;
}

export interface LeanoteNotebook {
  NotebookId: string;
  Title: string;
}

export interface LeanoteNote {
  NotebookId: string;
  Title: string;
  Content: string;
}
