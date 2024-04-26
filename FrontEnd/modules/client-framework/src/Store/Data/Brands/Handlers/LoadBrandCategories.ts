import { ApiHandlerNoApiParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getBrandCategories, GetBrandCategoriesApiParameter } from "@insite/client-framework/Services/BrandService";
import { BrandCategoryCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerNoApiParameter<GetBrandCategoriesApiParameter, BrandCategoryCollectionModel>;

export const DispatchBeginLoadBrandCategories: HandlerType = props => {
    props.dispatch({
        type: "Data/Brands/BeginLoadCategories",
        parameter: props.parameter,
    });
};

export const RequestDataFromApi: HandlerType = async props => {
    const brandCategoriesCollection = await getBrandCategories(props.parameter);
    props.apiResult = brandCategoriesCollection;
};

export const DispatchCompleteLoadBrand: HandlerType = props => {
    props.dispatch({
        type: "Data/Brands/CompleteLoadCategories",
        parameter: props.parameter,
        collection: props.apiResult,
    });
};

export const chain = [DispatchBeginLoadBrandCategories, RequestDataFromApi, DispatchCompleteLoadBrand];

const loadBrandCategories = createHandlerChainRunner(chain, "LoadBrandCategories");
export default loadBrandCategories;
