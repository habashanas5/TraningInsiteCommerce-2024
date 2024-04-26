import createTypedReducer, { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { AnyAction, reducers } from "@insite/client-framework/Store/Reducers";
import { Draft } from "immer";

type CounterState = Readonly<{
    total: number;
}>;

const initialCounterState: CounterState = { total: 0 };

const customReducerUsingImmer = createTypedReducerWithImmer(initialCounterState, {
    "Custom/Immer/Add": (draft: Draft<CounterState>, action: { amount: number }) => {
        draft.total += action.amount;
    },
});

const customReducerTraditional = createTypedReducer(initialCounterState, {
    "Custom/Traditional/Add": (state: CounterState, action: { amount: number }): CounterState => ({
        // You would normally use `...state` to copy the existing state, but this only has one property.
        total: state.total + action.amount,
    }),
});

(reducers as any).customReducerUsingImmer = customReducerUsingImmer;
(reducers as any).customReducerTraditional = customReducerTraditional;

export type CustomState = {
    customReducerUsingImmer: CounterState;
    customReducerTraditional: CounterState;
} & ApplicationState;

type Reducers = {
    customReducerUsingImmer: typeof customReducerUsingImmer;
    customReducerTraditional: typeof customReducerTraditional;
};

export type CustomActions = Parameters<Reducers[keyof Reducers]>[1] | AnyAction;
