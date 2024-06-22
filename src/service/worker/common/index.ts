import { Token } from 'typedi';

export interface IWorkerService {
  changeIcon(icon: string): Promise<void>;

  initContextMenu(): Promise<void>;
}

export const IWorkerService = new Token<IWorkerService>('IWorkerService');
