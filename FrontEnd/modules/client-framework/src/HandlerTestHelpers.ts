import { Handler, HandlerProps } from "@insite/client-framework/HandlerCreator";
import ApplicationState, { WriteableState } from "@insite/client-framework/Store/ApplicationState";

export function testHandler<Parameter, Props>(handler: Handler<Parameter, Props>) {
    let state = {} as WriteableState;
    const getInitialProps = () => {
        return {
            getState: () => state as any as ApplicationState,
        } as HandlerProps<Parameter, Props>;
    };
    let props = getInitialProps();
    return {
        useProps: () => props,
        callHandler: () => {
            try {
                handler(props as HandlerProps<Parameter, Props>);
                return props;
            } finally {
                state = {};
                props = getInitialProps();
            }
        },
        useState: () => state,
    };
}
