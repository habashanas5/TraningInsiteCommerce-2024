import { ApiHandler, createHandlerChainRunnerOptionalParameter } from "@insite/client-framework/HandlerCreator";
import { getBrands, GetBrandsApiParameter } from "@insite/client-framework/Services/BrandService";
import { BrandCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetBrandsApiParameter, BrandCollectionModel>;

export const DispatchBeginLoadBrands: HandlerType = props => {
    props.dispatch({
        type: "Data/Brands/BeginLoadBrands",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getBrands(props.apiParameter);
};

export const DispatchCompleteLoadBrandGallery: HandlerType = props => {
    props.dispatch({
        type: "Data/Brands/CompleteLoadBrands",
        parameter: props.parameter,
        collection: props.apiResult,
    });
};

export const chain = [
    DispatchBeginLoadBrands,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadBrandGallery,
];

const loadBrands = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadBrandGallery");
export default loadBrands;
