import { ApiHandlerNoApiParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getBrandById } from "@insite/client-framework/Services/BrandService";
import { BrandModel } from "@insite/client-framework/Types/ApiModels";

export interface LoadBrandByIdParameter {
    brandId: string;
    expand?: "htmlContent"[];
    additionalExpands?: string[];
}

type HandlerType = ApiHandlerNoApiParameter<LoadBrandByIdParameter, BrandModel>;

export const DispatchBeginLoadBrand: HandlerType = props => {
    props.dispatch({
        type: "Data/Brands/BeginLoadBrand",
        id: props.parameter.brandId,
    });
};

export const RequestDataFromApi: HandlerType = async props => {
    const brand = await getBrandById(props.parameter);
    props.apiResult = brand;
};

export const DispatchCompleteLoadBrand: HandlerType = props => {
    props.dispatch({
        type: "Data/Brands/CompleteLoadBrand",
        id: props.parameter.brandId,
        brand: props.apiResult,
    });
};

export const chain = [DispatchBeginLoadBrand, RequestDataFromApi, DispatchCompleteLoadBrand];

const loadBrand = createHandlerChainRunner(chain, "LoadBrandById");
export default loadBrand;
