import deepFreezeObject from "@insite/client-framework/Common/Utilities/deepFreezeObject";
import produce, { Draft } from "immer";
import { Action } from "redux";

/** Creates a discriminated union of Redux action types from a function map in the form of 'ActionType': (state: State) => State. */
type SimpleActionHandlers<T> = {
    [P in keyof T]: Action<P> & // For each property on the object... // ...create an action typed as the property name... // ...combine that type with the result of a condition:...
        ((
            T[P] extends (...args: any) => any // ...if the property is a function (needed to satisfy the constraint on Parameters)...
                ? Parameters<T[P]>[1]
                : {} // ...get the type of the second parameter, otherwise provide an empty object type;...
        ) extends undefined
            ? {}
            : undefined); // ...if the above expression returns undefined (no second parameter) return {}, otherwise return undefined;...
}; // ...undefined properties coming out of this are eliminated later.

/** Creates a discriminated union of Redux action types from a function map in the form of 'ActionType': (state: State, action: any) => State. */
type ParameterizedActionHandlers<T> = {
    [P in keyof T]: Action<P> & // For each property on the object... // ...create an action typed as the property name... // ...combine that type with the result of a condition:...
        (T[P] extends (...args: any) => any // ...if the property is a function (needed to satisfy the constraint on Parameters)...
            ? Parameters<T[P]>[1]
            : {}); // ...get the type of the second parameter, otherwise provide an empty object type.
};

/** Creates a discriminated union of Redux action types from a function map in the form of 'ActionType': (state: State, <not required>action: any) => State. */
type ActionUnion<T> =
    | SimpleActionHandlers<T>[keyof SimpleActionHandlers<T>] // Rotate the output of SimpleActionHandlers into a discriminated union... // ...union the result of that with...
    | ParameterizedActionHandlers<T>[keyof ParameterizedActionHandlers<T>]; // ...the rotated output of ParameterizedActionHandlers.

type HandlerFunction<TState> = (state: TState, action: any) => TState;
type HandlerFunctionMap<TState> = { [key: string]: HandlerFunction<TState> | undefined };

/**
 * Creates a typed reducer function from a function map in the form of 'ActionType': (state: State, <not required>action: any) => State.
 * This is intended for use with conventional-style Redux where a complete state object is returned by the handlers.
 * @param initialState The initial state for the reducer, used when the provided state is `undefined`.
 * @param handlers A function map in the form of 'ActionType': (state: State, <not required>action: any) => State.
 */
export default function createTypedReducer<State extends object, Handlers extends HandlerFunctionMap<State>>(
    initialState: State,
    handlers: Handlers,
): (state: State | undefined, action: ActionUnion<Handlers>) => State {
    return (state = initialState, action) => {
        const handler = handlers[(action as any).type];
        return handler ? deepFreezeObject(handler(state, action)) : state;
    };
}

type ImmerHandlerFunction<TState> = (draft: Draft<TState>, action: any) => void;
type ImmerHandlerFunctionMap<TState> = { [key: string]: ImmerHandlerFunction<TState> | undefined };

/**
 * Creates a typed reducer function from a function map in the form of 'ActionType': (state: Draft<State>, <not required>action: any) => State.
 * The handler functions receive a draft created by `immer`, and are expected to directly modify the draft.
 * @param initialState The initial state for the reducer, used when the provided state is `undefined`.
 * @param handlers A function map in the form of 'ActionType': (state: Draft<State>, <not required>action: any) => State.
 */
export function createTypedReducerWithImmer<State extends object, Handlers extends ImmerHandlerFunctionMap<State>>(
    initialState: State,
    handlers: Handlers,
): (state: State | undefined, action: ActionUnion<Handlers>) => State {
    return (state = initialState, action) => {
        const handler = handlers[(action as any).type];
        if (!handler) {
            return state;
        }

        return deepFreezeObject(
            produce(state, draft => {
                return handler(draft, action);
            }),
        );
    };
}
