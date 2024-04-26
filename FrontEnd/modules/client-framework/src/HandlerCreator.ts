import logger from "@insite/client-framework/Logger";
import { addTask } from "@insite/client-framework/ServerSideRendering";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { AnyAction } from "@insite/client-framework/Store/Reducers";

/**
 * Redux's typings include a `Dispatch` helper type, but it doesn't alert if the dispatched action has extra properties.
 * This solution isn't perfect because it doesn't return the provided action type, but its stricter input checking is more important.
 */
type StrictInputDispatch = (
    action: AnyAction | ((dispatch: StrictInputDispatch, getState: () => ApplicationState) => void),
) => AnyAction;

export type HandlerProps<Parameter, Props> = Props & {
    readonly parameter: Readonly<Parameter>;
    dispatch: StrictInputDispatch;
    getState: () => ApplicationState;
};

/** The a basic step in a handler chain.  If the boolean value `false` is returned, the chain stops on that step. */
export type Handler<Parameter = {}, Props = {}> = (
    props: HandlerProps<Parameter, Props>,
) => false | void | Promise<false | void>;

/** An extension of Handler that adds a `result` property. */
export type HandlerWithResult<Parameter, Result, Props = {}> = Handler<
    Parameter,
    Props & {
        result: Result;
    }
>;

/** An extension of Handler that adds an `apiParameter` and `apiResult` property, where `apiParameter` is also the input parameter. */
export type ApiHandler<Parameter, Model = never, Props = {}> = Handler<
    Parameter,
    Props & {
        apiParameter: Parameter;
        apiResult: Model;
    }
>;

/** An extension of Handler that adds an `apiParameter` and `apiResult` property, where `apiParameter` is separate from the input parameter. */
export type ApiHandlerDiscreteParameter<Parameter, ApiParameter, Model = never, Props = {}> = Handler<
    Parameter,
    Props & {
        apiParameter: ApiParameter;
        apiResult: Model;
    }
>;

/** An extension of Handler that adds an `apiResult` property. */
export type ApiHandlerNoApiParameter<Parameter, Model = never, Props = {}> = Handler<
    Parameter,
    Props & {
        apiResult: Model;
    }
>;

/**
 * An extension of Handler that adds an `apiResult` property and (currently).
 * To be forward-compatible with parameters in the future, the result of creating the chain still has a parameter object with no properties.
 */
export type ApiHandlerNoParameter<Model = never, Props = {}> = Handler<
    {},
    Props & {
        apiResult: Model;
    }
>;

/** An extension of Handler that adds an unknown-typed `error` property and optionally any additional properties. */
export type ErrorHandler<MoreProps extends {} = {}> = Handler<HasError & MoreProps>;
type HasError = { error: unknown };

const devTools =
    !IS_PRODUCTION && typeof window !== "undefined" && (window as any).__REDUX_DEVTOOLS_EXTENSION__
        ? (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect({ name: "Typed Handlers" })
        : null;

/** Check for the same function appearing in a handler chain multiple times.  It probably won't work. */
const checkChainForDuplicates = (chain: Function[]) => {
    if (IS_PRODUCTION) {
        return;
    }

    const duplicated = chain.filter((value, index, self) => self.indexOf(value) !== index);
    if (duplicated.length !== 0) {
        logger.warn(`Handler chain functions duplicated: ${duplicated.map(func => func.name).join(", ")}`);
    }
};

const checkForSyntheticEvent = <Parameter>(parameter: Parameter, name: string) => {
    if (IS_PRODUCTION) {
        return;
    }

    if ((parameter as any)?.nativeEvent) {
        logger.warn(`Parameter is React.SyntheticEvent for handler ${name}. This causes problems with redux devtools.
This usually happens if onClick is bound directly to the handler chain. IE onClick={handlerChain} vs onClick={() => handlerChain()}`);
    }
};

let errorHandler: (parameter: {
    error: unknown;
}) => (dispatch: StrictInputDispatch, getState: () => ApplicationState) => void;

// we can't import handleError directly or we end up with circular imports
export function setErrorHandler(value: typeof errorHandler) {
    errorHandler = value;
}

const runChain = async <Parameter extends HasOnException & HasOnComplete<Props>, Props = {}>(
    parameter: Parameter,
    dispatch: StrictInputDispatch,
    getState: () => ApplicationState,
    chain: Handler<Parameter, Props>[],
    name: string,
    callOnComplete = true,
) => {
    // An "initial props" parameter would make the props value below correct, but no handlers written so far require it.
    // `as any` needed due to `props` not having any required fields from Props.
    const props = { parameter, dispatch, getState, skipOnComplete: false } as any;
    // This approach to handler "chains" doesn't give TypeScript enough info to recognize transitions in values and nullness.
    let x = 0;
    if (!IS_SERVER_SIDE) {
        if ((window as any).activeHandlers === undefined) {
            (window as any).activeHandlers = 0;
        }
        (window as any).activeHandlers += 1;
    }

    for (const handler of chain) {
        try {
            const possiblePromise = handler(props);
            const result = possiblePromise instanceof Promise ? await possiblePromise : possiblePromise;
            if (devTools) {
                try {
                    devTools.send(`${name} ${x}-${handler.name}`, props);
                } catch (e) {
                    logger.warn(e);
                }
            }

            // we want to compare this directly to false so that we don't include void results in the break
            if (result === false) {
                // checking for onException to detect promise
                if (props.parameter.onException) {
                    props.parameter.onSuccess?.();
                }
                break;
            }
        } catch (e) {
            props.parameter.onException?.(e);
            if (IS_SERVER_SIDE && !IS_PRODUCTION) {
                if (callOnComplete && !props.skipOnComplete) {
                    props.parameter.onComplete?.(props);
                }
                throw e;
            }
            dispatch(errorHandler({ error: e }));
            break;
        }
        x += 1;
    }

    if (callOnComplete && !props.skipOnComplete) {
        props.parameter.onComplete?.(props);
    }

    if (!IS_SERVER_SIDE) {
        (window as any).activeHandlers -= 1;
    }
};

/**
 * @deprecated this should not be used for any new handlers. It is used for existing handlers that defined onComplete before it was added to all handlers.
 */
export const createHandlerChainRunnerForOldOnComplete = <Parameter, Props = {}, CompleteResult = {}>(
    chain: Handler<Parameter, Props>[],
    name: string,
) => {
    return internalCreateHandlerChainRunner(chain, name, false);
};

/**
 * Creates a redux-mapDispatchToProps-compatible executor for an array of handler chain steps.
 * The source array is not copied, so changes to it will affect the operation.
 */
export const createHandlerChainRunner = <Parameter, Props = {}>(chain: Handler<Parameter, Props>[], name: string) => {
    return internalCreateHandlerChainRunner<Parameter, Parameter & HasOnComplete<Props>, Props>(chain, name);
};

const internalCreateHandlerChainRunner = <ChainParameter, ReturnedParameter extends ChainParameter, Props = {}>(
    chain: Handler<ChainParameter, Props>[],
    name: string,
    callOnComplete = true,
) => {
    checkChainForDuplicates(chain);

    return (parameter: ReturnedParameter) => (dispatch: StrictInputDispatch, getState: () => ApplicationState) => {
        checkForSyntheticEvent(parameter, name);
        addTask(runChain(parameter, dispatch, getState, chain, name, callOnComplete));
    };
};

/**
 * Creates a redux-mapDispatchToProps-compatible executor for an array of handler chain steps.
 * The default parameter value provided here is used to make the parameter optional in the resulting function.
 * The source array is not copied, so changes to it will affect the operation.
 */
export const createHandlerChainRunnerOptionalParameter = <Parameter, Props = {}>(
    chain: Handler<Parameter, Props>[],
    defaultParameter: Parameter,
    name: string,
) => {
    checkChainForDuplicates(chain);

    return (parameter: Parameter = defaultParameter) =>
        (dispatch: StrictInputDispatch, getState: () => ApplicationState) => {
            checkForSyntheticEvent(parameter, name);
            addTask(runChain(parameter, dispatch, getState, chain, name));
        };
};

/** The standard pattern for parameters that report their success. */
export type HasOnSuccess<Result = void> = {
    /** Called upon success of the handler chain. */
    onSuccess?: (result: Result) => void;
};

export type HasOnError<Result = void> = {
    /** Called upon failure of the handler chain. */
    onError?: (result: Result) => void;
};

export type HasOnException<Result = void> = {
    /** Called upon non catched failure of the handler chain. */
    onException?: (result: Result) => void;
};

export type HasOnComplete<Result = unknown> = {
    onComplete?: (result: Partial<Result>) => void;
};

type Thunk<Result> = (dispatch: StrictInputDispatch, getState: () => ApplicationState) => Result;

/**  Converts a handler chain that has an `onSuccess` method to return a `Promise` that can be used in conjunction with `await`. */
export const makeHandlerChainAwaitable =
    <Parameter extends HasOnSuccess<Result>, Result>(handlerChain: (parameter: Parameter) => Thunk<void>) =>
    (parameter: Omit<Parameter, "onSuccess">): Thunk<Promise<Result>> =>
    dispatch =>
        new Promise<Result>((resolve, reject) => {
            dispatch(
                handlerChain({
                    ...(parameter as Parameter),
                    onSuccess: resolve,
                    onException: reject,
                }),
            );
        });

export const executeAwaitableHandlerChain = <Parameter extends HasOnSuccess<Result>, Result>(
    handlerChain: (parameter: Parameter) => Thunk<void>,
    parameter: Parameter,
    props: {
        dispatch: StrictInputDispatch;
        getState: () => ApplicationState;
    },
): Promise<Result> => {
    const awaitable = makeHandlerChainAwaitable<Parameter, Result>(handlerChain);
    return awaitable(parameter)(props.dispatch, props.getState);
};

export function addToStartOfChain<Parameter, Props>(
    chain: Handler<Parameter, Props>[],
    handler: Handler<Parameter, Props>,
) {
    chain.unshift(handler);
}

export function addToEndOfChain<Parameter, Props>(
    chain: Handler<Parameter, Props>[],
    handler: Handler<Parameter, Props>,
) {
    chain.push(handler);
}

export function addToChainBefore<Parameter, Props>(
    chain: Handler<Parameter, Props>[],
    beforeHandler: Handler<Parameter, Props>,
    handler: Handler<Parameter, Props>,
) {
    splice(chain, beforeHandler, "beforeHandler", index => chain.splice(index, 0, handler));
}

export function addToChainAfter<Parameter, Props>(
    chain: Handler<Parameter, Props>[],
    afterHandler: Handler<Parameter, Props>,
    handler: Handler<Parameter, Props>,
) {
    splice(chain, afterHandler, "afterHandler", index => chain.splice(index + 1, 0, handler));
}

export function replaceInChain<Parameter, Props>(
    chain: Handler<Parameter, Props>[],
    replaceHandler: Handler<Parameter, Props>,
    handler: Handler<Parameter, Props>,
) {
    splice(chain, replaceHandler, "replaceHandler", index => chain.splice(index, 1, handler));
}

export function markSkipOnCompleteIfOnSuccessIsSet<Result>(props: { parameter: HasOnSuccess<Result> }) {
    if (props.parameter.onSuccess) {
        (props as any).skipOnComplete = true;
    }
}

export function markSkipOnCompleteIfOnErrorIsSet<Result>(props: { parameter: HasOnError<Result> }) {
    if (props.parameter.onError) {
        (props as any).skipOnComplete = true;
    }
}

function splice<Parameter, Props>(
    chain: Handler<Parameter, Props>[],
    newHandler: Handler<Parameter, Props>,
    name: string,
    splice: (index: number) => void,
) {
    const index = chain.indexOf(newHandler);
    if (index === -1) {
        logger.warn(`The ${name} '${newHandler.name || "anonymousFunction"}' was not found in the requested chain.`);
        return;
    }

    splice(index);
}
