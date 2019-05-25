export interface AnyAction {
  type: any;
}

export type Meta = null | { [key: string]: any };

export interface Action<Payload> extends AnyAction {
  type: string;
  payload: Payload;
  error?: boolean;
  meta?: Meta;
}

/**
 * Returns `true` if action has the same type as action creator.
 * Defines Type Guard that lets TypeScript know `payload` type inside blocks
 * where `isType` returned `true`.
 *
 * @example
 *
 *    const somethingHappened =
 *      actionCreator<{foo: string}>('SOMETHING_HAPPENED');
 *
 *    if (isType(action, somethingHappened)) {
 *      // action.payload has type {foo: string}
 *    }
 */
export function isType<Payload>(
  action: AnyAction,
  actionCreator: ActionCreator<Payload>
): action is Action<Payload> {
  return action.type === actionCreator.type;
}

export type ActionCreator<Payload> = {
  type: string;
  match: (action: AnyAction) => action is Action<Payload>;
} & (Payload extends void
  ? {
      (payload?: Payload, meta?: Meta): Action<Payload>;
    }
  : {
      (payload: Payload, meta?: Meta): Action<Payload>;
    });

type OptionalParams<Params> = Params extends void
  ? {
      params?: Params;
    }
  : {
      params: Params;
    };

type OptionalResult<Result> = Result extends void
  ? {
      result?: Result;
    }
  : {
      result: Result;
    };

export type Success<Params, Result> = OptionalResult<Result> & OptionalParams<Params>;

export type Failure<Params, Error> = {
  error: Error;
} & OptionalParams<Params>;

export interface AsyncActionCreators<Params, Result, Error = {}> {
  type: string;
  started: ActionCreator<Params>;
  done: ActionCreator<Success<Params, Result>>;
  failed: ActionCreator<Failure<Params, Error>>;
}

export interface ActionCreatorFactory {
  <Payload = void>(type: string, commonMeta?: Meta, isError?: boolean): ActionCreator<Payload>;

  <Payload = void>(
    type: string,
    commonMeta?: Meta,
    isError?: (payload: Payload) => boolean
  ): ActionCreator<Payload>;

  async<Params, Result, Error = {}>(
    type: string,
    commonMeta?: Meta
  ): AsyncActionCreators<Params, Result, Error>;
}

declare const process: {
  env: {
    NODE_ENV?: string;
  };
};

export function actionCreatorFactory(
  prefix?: string | null,
  defaultIsError: (payload: any) => boolean = p => p instanceof Error
): ActionCreatorFactory {
  const actionTypes: { [type: string]: boolean } = {};

  const base = prefix ? `${prefix}/` : '';

  function actionCreator<Payload>(
    type: string,
    commonMeta?: Meta,
    isError: ((payload: Payload) => boolean) | boolean = defaultIsError
  ) {
    const fullType = base + type;

    if (process.env.NODE_ENV !== 'production') {
      if (actionTypes[fullType]) throw new Error(`Duplicate action type: ${fullType}`);

      actionTypes[fullType] = true;
    }

    return Object.assign(
      (payload: Payload, meta?: Meta) => {
        const action: Action<Payload> = {
          type: fullType,
          payload,
        };

        if (commonMeta || meta) {
          action.meta = Object.assign({}, commonMeta, meta);
        }

        if (isError && (typeof isError === 'boolean' || isError(payload))) {
          action.error = true;
        }

        return action;
      },
      {
        type: fullType,
        toString: () => fullType,
        match: (action: AnyAction): action is Action<Payload> => action.type === fullType,
      }
    ) as ActionCreator<Payload>;
  }

  function asyncActionCreators<Params, Result, Error>(
    type: string,
    commonMeta?: Meta
  ): AsyncActionCreators<Params, Result, Error> {
    return {
      type: base + type,
      started: actionCreator<Params>(`${type}_STARTED`, commonMeta, false),
      done: actionCreator<Success<Params, Result>>(`${type}_DONE`, commonMeta, false),
      failed: actionCreator<Failure<Params, Error>>(`${type}_FAILED`, commonMeta, true),
    };
  }

  return Object.assign(actionCreator, { async: asyncActionCreators });
}

export default actionCreatorFactory;
