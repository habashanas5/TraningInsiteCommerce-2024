import { ApiHandlerNoApiParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getBrandProductLines, GetBrandProductLinesApiParameter } from "@insite/client-framework/Services/BrandService";
import { BrandProductLineCollectionModel, BrandProductLineModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerNoApiParameter<GetBrandProductLinesApiParameter, BrandProductLineCollectionModel>;

export const DispatchBeginLoadBrandProductLines: HandlerType = props => {
    props.dispatch({
        type: "Data/Brands/BeginLoadProductLines",
        parameter: props.parameter,
    });
};

export const RequestDataFromApi: HandlerType = async props => {
    const brandProductLineCollection = await getBrandProductLines(props.parameter);
    props.apiResult = brandProductLineCollection;
};

export const SortApiRequestData: HandlerType = props => {
    props.apiResult.productLines?.sort(sortBySortOrderThenName);
};

const sortBySortOrderThenName = (productLine1: BrandProductLineModel, productLine2: BrandProductLineModel) => {
    return productLine1.sortOrder - productLine2.sortOrder || productLine1.name.localeCompare(productLine2.name);
};

export const DispatchCompleteLoadBrandProductLines: HandlerType = props => {
    props.dispatch({
        type: "Data/Brands/CompleteLoadProductLines",
        parameter: props.parameter,
        collection: props.apiResult,
    });
};

export const chain = [
    DispatchBeginLoadBrandProductLines,
    RequestDataFromApi,
    SortApiRequestData,
    DispatchCompleteLoadBrandProductLines,
];

const loadBrandProductLines = createHandlerChainRunner(chain, "LoadBrandProductLines");
export default loadBrandProductLines;
