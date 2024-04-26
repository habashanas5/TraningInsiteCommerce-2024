import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import * as StoreModule from "@insite/client-framework/Store/Reducers";
import {
    applyMiddleware,
    combineReducers,
    compose,
    createStore,
    StoreEnhancer,
    StoreEnhancerStoreCreator,
} from "redux";
import reduxThunk from "redux-thunk";

const reducers = StoreModule.reducers;

export function configureStore(initialState?: ApplicationState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    const windowIfDefined = typeof window === "undefined" ? null : (window as any);
    // If devTools is installed, connect to it
    const devToolsExtension = windowIfDefined?.__REDUX_DEVTOOLS_EXTENSION__ as (options?: {
        trace?: boolean;
    }) => StoreEnhancer;
    const createStoreWithMiddleware = compose<StoreEnhancerStoreCreator<ApplicationState>>(
        applyMiddleware(reduxThunk),
        devToolsExtension ? devToolsExtension({ trace: true }) : <S>(next: StoreEnhancerStoreCreator<S>) => next,
    )(createStore);

    const store = createStoreWithMiddleware(combineReducers(reducers as any), initialState as any);

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept("./Reducers", () => {
            // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
            const nextRootReducer = require<typeof StoreModule>("./Reducers");
            store.replaceReducer(combineReducers(nextRootReducer.reducers as any));
        });
    }

    return store;
}
