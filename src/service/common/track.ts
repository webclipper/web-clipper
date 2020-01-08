import { Token } from 'typedi';

export type TrackEventCategory =
  | 'Load_Web_Clipper' /** 加载插件，每次初始化时候记录。 */
  | 'Open_Page'; /** 打开页面 */

export interface ITrackService {
  enable: boolean;
  init(): void;
  toggle(): void;
  trackEvent(category: TrackEventCategory, action: string, label?: string): void;
}

export const ITrackService = new Token<ITrackService>();
