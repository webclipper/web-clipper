import { Action, ActionCreator, AnyAction } from '../typescript-fsa';

export interface ReducerBuilder<InS extends OutS, OutS = InS> {
  case<P>(
    actionCreator: ActionCreator<P>,
    handler: Handler<InS, OutS, P>
  ): ReducerBuilder<InS, OutS>;
  caseWithAction<P>(
    actionCreator: ActionCreator<P>,
    handler: Handler<InS, OutS, Action<P>>
  ): ReducerBuilder<InS, OutS>;

  // cases variadic overloads
  cases<P1>(
    actionCreators: [ActionCreator<P1>],
    handler: Handler<InS, OutS, P1>
  ): ReducerBuilder<InS, OutS>;
  cases<P1, P2>(
    actionCreators: [ActionCreator<P1>, ActionCreator<P2>],
    handler: Handler<InS, OutS, P1 | P2>
  ): ReducerBuilder<InS, OutS>;
  cases<P1, P2, P3>(
    actionCreators: [ActionCreator<P1>, ActionCreator<P2>, ActionCreator<P3>],
    handler: Handler<InS, OutS, P1 | P2 | P3>
  ): ReducerBuilder<InS, OutS>;
  cases<P1, P2, P3, P4>(
    actionCreators: [
      ActionCreator<P1>,
      ActionCreator<P2>,
      ActionCreator<P3>,
      ActionCreator<P4>
    ],
    handler: Handler<InS, OutS, P1 | P2 | P3 | P4>
  ): ReducerBuilder<InS, OutS>;
  cases<P>(
    actionCreators: Array<ActionCreator<P>>,
    handler: Handler<InS, OutS, P>
  ): ReducerBuilder<InS, OutS>;

  // casesWithAction variadic overloads
  casesWithAction<P1>(
    actionCreators: [ActionCreator<P1>],
    handler: Handler<InS, OutS, Action<P1>>
  ): ReducerBuilder<InS, OutS>;
  casesWithAction<P1, P2>(
    actionCreators: [ActionCreator<P1>, ActionCreator<P2>],
    handler: Handler<InS, OutS, Action<P1 | P2>>
  ): ReducerBuilder<InS, OutS>;
  casesWithAction<P1, P2, P3>(
    actionCreators: [ActionCreator<P1>, ActionCreator<P2>, ActionCreator<P3>],
    handler: Handler<InS, OutS, Action<P1 | P2 | P3>>
  ): ReducerBuilder<InS, OutS>;
  casesWithAction<P1, P2, P3, P4>(
    actionCreators: [
      ActionCreator<P1>,
      ActionCreator<P2>,
      ActionCreator<P3>,
      ActionCreator<P4>
    ],
    handler: Handler<InS, OutS, Action<P1 | P2 | P3 | P4>>
  ): ReducerBuilder<InS, OutS>;
  casesWithAction<P>(
    actionCreators: Array<ActionCreator<P>>,
    handler: Handler<InS, OutS, Action<P>>
  ): ReducerBuilder<InS, OutS>;

  withHandling(
    updateBuilder: (
      builder: ReducerBuilder<InS, OutS>
    ) => ReducerBuilder<InS, OutS>
  ): ReducerBuilder<InS, OutS>;

  // Intentionally avoid AnyAction in return type so packages can export reducers
  // created using .default() or .build() without requiring a dependency on typescript-fsa.
  default(
    defaultHandler: Handler<InS, OutS, AnyAction>
  ): (state: InS | undefined, action: { type: any }) => OutS;
  build(): (state: InS | undefined, action: { type: any }) => OutS;
  (state: InS | undefined, action: AnyAction): OutS;
}

export type Handler<InS extends OutS, OutS, P> = (
  state: InS,
  payload: P
) => OutS;

export function reducerWithInitialState<S>(initialState: S): ReducerBuilder<S> {
  return makeReducer<S, S>(initialState);
}

export function reducerWithoutInitialState<S>(): ReducerBuilder<S> {
  return makeReducer<S, S>();
}

export function upcastingReducer<InS extends OutS, OutS>(): ReducerBuilder<
  InS,
  OutS
> {
  return makeReducer<InS, OutS>();
}

function makeReducer<InS extends OutS, OutS>(
  initialState?: InS
): ReducerBuilder<InS, OutS> {
  const handlersByActionType: {
    [actionType: string]: Handler<InS, OutS, any>;
  } = {};
  const reducer = getReducerFunction(
    initialState,
    handlersByActionType
  ) as ReducerBuilder<InS, OutS>;

  reducer.caseWithAction = <P>(
    actionCreator: ActionCreator<P>,
    handler: Handler<InS, OutS, Action<P>>
  ) => {
    handlersByActionType[actionCreator.type] = handler;
    return reducer;
  };

  reducer.case = <P>(
    actionCreator: ActionCreator<P>,
    handler: Handler<InS, OutS, P>
  ) =>
    reducer.caseWithAction(actionCreator, (state, action) =>
      handler(state, action.payload)
    );

  reducer.casesWithAction = <P>(
    actionCreators: Array<ActionCreator<P>>,
    handler: Handler<InS, OutS, Action<P>>
  ) => {
    for (const actionCreator of actionCreators) {
      reducer.caseWithAction(actionCreator, handler);
    }
    return reducer;
  };

  reducer.cases = <P>(
    actionCreators: Array<ActionCreator<P>>,
    handler: Handler<InS, OutS, P>
  ) =>
    reducer.casesWithAction(actionCreators, (state, action) =>
      handler(state, action.payload)
    );

  reducer.withHandling = (
    updateBuilder: (
      builder: ReducerBuilder<InS, OutS>
    ) => ReducerBuilder<InS, OutS>
  ) => updateBuilder(reducer);

  reducer.default = (defaultHandler: Handler<InS, OutS, AnyAction>) =>
    getReducerFunction(
      initialState,
      { ...handlersByActionType },
      defaultHandler
    );

  reducer.build = () =>
    getReducerFunction(initialState, { ...handlersByActionType });

  return reducer;
}

function getReducerFunction<InS extends OutS, OutS>(
  initialState: InS | undefined,
  handlersByActionType: { [actionType: string]: Handler<InS, OutS, any> },
  defaultHandler?: Handler<InS, OutS, AnyAction>
) {
  return (state = initialState as InS, action: AnyAction) => {
    const handler = handlersByActionType[action.type] || defaultHandler;
    return handler ? handler(state, action) : state;
  };
}
