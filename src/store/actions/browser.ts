import { BROWSER } from './actionTypes';
import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory();

export const doYouAliveNow = actionCreator(BROWSER.DO_YOU_ALIVE_NOW);
export const clickIcon = actionCreator(BROWSER.CLICK_ICON);
