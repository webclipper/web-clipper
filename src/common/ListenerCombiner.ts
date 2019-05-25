import { ActionCreator, AnyAction, isType } from './typescript-fsa';

export type Handler<P> = (
  payload: P,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) => any;

interface Case<P> {
  actionCreator: ActionCreator<P>;
  handler: Handler<P>;
}

interface ListenerCombiner {
  case<P>(actionCreator: ActionCreator<P>, handler: Handler<P>): ListenerCombiner;
}

export class MessageListenerCombiner implements ListenerCombiner {
  private cases: Map<string, Case<any>>;

  constructor() {
    this.cases = new Map();
  }

  case = <P>(actionCreator: ActionCreator<P>, handler: Handler<P>) => {
    this.cases.set(actionCreator.type, { actionCreator, handler });
    return this;
  };

  handle = (action: AnyAction, sender: any, sendResponse: any) => {
    const actionCase = this.cases.get(action.type);
    if (actionCase) {
      const { actionCreator, handler } = actionCase;
      if (isType(action, actionCreator)) {
        return handler(action.payload, sender, sendResponse);
      }
    }
  };
}
