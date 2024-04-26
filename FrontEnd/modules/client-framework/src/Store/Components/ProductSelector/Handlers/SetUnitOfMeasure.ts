import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{
    unitOfMeasure: string;
}>;

export const DispatchCompleteSetProduct: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductSelector/SetUnitOfMeasure",
        unitOfMeasure: props.parameter.unitOfMeasure,
    });
};

export const chain = [DispatchCompleteSetProduct];

const setUnitOfMeasure = createHandlerChainRunner(chain, "SetUnitOfMeasure");
export default setUnitOfMeasure;
