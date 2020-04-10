export interface WizNoteConfig {
  origin: string;
  spaceId: number;
}

export interface WizNoteUserInfo {
  result: {
    email: string;
    userGuid: string;
    displayName: string;
    token: string;
    kbGuid: string;
  };
}
