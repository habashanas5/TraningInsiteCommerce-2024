import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{
    key: string;
    value: string;
}>;

export const DispatchSetFieldValue: HandlerType = props => {
    props.dispatch({
        type: "Components/ContactUsForm/SetFieldValue",
        key: props.parameter.key,
        value: props.parameter.value,
    });
};

export const chain = [DispatchSetFieldValue];

const setFieldValue = createHandlerChainRunner(chain, "SetFieldValue");
export default setFieldValue;
