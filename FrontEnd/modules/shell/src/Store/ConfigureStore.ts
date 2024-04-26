import { siteHoleMessenger } from "@insite/shell/Components/Shell/SiteHole";
import * as StoreModule from "@insite/shell/Store/Reducers";
import ShellState from "@insite/shell/Store/ShellState";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { History } from "history";
import {
    applyMiddleware,
    combineReducers,
    compose,
    createStore,
    ReducersMapObject,
    StoreEnhancer,
    StoreEnhancerStoreCreator,
} from "redux";
import reduxThunk from "redux-thunk";

const reducers = StoreModule.reducers;

export function configureStore(history: History, initialState?: ShellState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    const windowIfDefined = typeof window === "undefined" ? null : (window as any);
    // If devTools is installed, connect to it
    const devToolsExtension = windowIfDefined?.__REDUX_DEVTOOLS_EXTENSION__ as (options?: {
        trace?: boolean;
    }) => StoreEnhancer;
    const createStoreWithMiddleware = compose<StoreEnhancerStoreCreator<ShellState>>(
        applyMiddleware(siteHoleMessenger, reduxThunk, routerMiddleware(history)),
        devToolsExtension ? devToolsExtension({ trace: true }) : <S>(next: StoreEnhancerStoreCreator<S>) => next,
    )(createStore);

    const routerReducer = connectRouter(history);

    function buildRootReducer(allReducers: ReducersMapObject) {
        return combineReducers({ ...allReducers, router: routerReducer });
    }

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(reducers as any);
    const store = createStoreWithMiddleware(allReducers, initialState as any);

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept("./Reducers", () => {
            // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
            const nextRootReducer = require<typeof StoreModule>("./Reducers");
            store.replaceReducer(buildRootReducer(nextRootReducer.reducers as any));
        });
    }

    return store;
}
