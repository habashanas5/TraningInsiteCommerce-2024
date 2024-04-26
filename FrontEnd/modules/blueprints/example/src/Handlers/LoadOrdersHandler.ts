/*
 * This illustrates how to modify the LoadOrdersHandler in a number of different ways.
 * The LoadOrdersHandler is used by the order history page to load order data
 */

import {
    addToChainAfter,
    addToChainBefore,
    addToEndOfChain,
    addToStartOfChain,
    replaceInChain,
} from "@insite/client-framework/HandlerCreator";
import { chain, RequestDataFromApi } from "@insite/client-framework/Store/Data/Orders/Handlers/LoadOrders";

// this will enable HMR for custom handlers
if (module.hot) {
    module.hot.accept();
    const originalChain = chain.slice();
    module.hot.dispose(data => {
        chain.length = 0;
        originalChain.forEach(o => chain.push(o));
    });
}

addToStartOfChain(chain, props => {
    // The function can be `async` and use `await` in its body.
    // an anonymous function will show up without a name in the redux tools for handlers
});

addToEndOfChain(chain, namedFunction);

// get the type of props using this
type loadOrdersHandlerProps = Parameters<typeof RequestDataFromApi>[0];

function namedFunction(props: loadOrdersHandlerProps) {
    // a named function will show with the name in redux tools for handlers
    // this requires knowing the type of props to write
}

addToChainBefore(chain, RequestDataFromApi, props => {});

// trying to reference a handler not in the chain will result in a warning and the chain will not be modified
replaceInChain(
    chain,
    props => {},
    props => {},
);

addToChainAfter(chain, RequestDataFromApi, props => {});

// replacing RequestDataFromApi with an empty function would lead to the site not working.
// take care when replacing handlers
// replaceInChain(chain, RequestDataFromApi, props => { });

// the chain is just an array, so it can be modified directly instead of using the helper functions
chain.push(props => {
    // Added to end of chain.
});
