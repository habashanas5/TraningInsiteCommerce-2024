import { ApiHandlerNoApiParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getBrandByPath } from "@insite/client-framework/Services/BrandService";
import { BrandModel } from "@insite/client-framework/Types/ApiModels";

export interface LoadBrandByPathParameter {
    path: string;
}

type HandlerType = ApiHandlerNoApiParameter<LoadBrandByPathParameter, BrandModel>;

export const DispatchBeginLoadBrand: HandlerType = props => {
    props.dispatch({
        type: "Data/Brands/BeginLoadBrandByPath",
        path: props.parameter.path,
    });
};

export const RequestDataFromApi: HandlerType = async props => {
    const brand = await getBrandByPath(props.parameter);
    props.apiResult = brand;
};

export const DispatchCompleteLoadBrand: HandlerType = props => {
    props.dispatch({
        type: "Data/Brands/CompleteLoadBrandByPath",
        path: props.parameter.path,
        brand: props.apiResult,
    });
};

export const chain = [DispatchBeginLoadBrand, RequestDataFromApi, DispatchCompleteLoadBrand];

const loadBrandByPath = createHandlerChainRunner(chain, "LoadBrandByPath");
export default loadBrandByPath;
