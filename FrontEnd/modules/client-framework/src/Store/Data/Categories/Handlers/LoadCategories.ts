import {
    createHandlerChainRunnerOptionalParameter,
    Handler,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import {
    CategoryCollection,
    getCategories,
    GetCategoriesApiParameter,
} from "@insite/client-framework/Services/CategoryService";
import { getCategoriesDataView } from "@insite/client-framework/Store/Data/Categories/CategoriesSelectors";

type Parameter = GetCategoriesApiParameter & HasOnSuccess<CategoryCollection>;

type Props = {
    apiResult: CategoryCollection;
    apiParameter: GetCategoriesApiParameter;
};

type HandlerType = Handler<Parameter, Props>;

export const CheckIfDataViewLoading: HandlerType = props => {
    const categoriesDataView = getCategoriesDataView(props.getState(), props.parameter);
    if (categoriesDataView.isLoading) {
        return false;
    }
};

export const DispatchBeginLoadCategories: HandlerType = props => {
    props.dispatch({
        type: "Data/Categories/BeginLoadCategories",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const { onSuccess, ...parameter } = props.parameter;
    props.apiParameter = parameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    try {
        props.apiResult = await getCategories(props.apiParameter);
    } catch (error) {
        if (error?.status === 404) {
            if (props.apiParameter.startCategoryId) {
                props.dispatch({
                    type: "Data/Categories/FailedToLoadCategory",
                    categoryId: props.apiParameter.startCategoryId,
                    status: error.status,
                });
            }
            return false;
        }
        throw error;
    }
};

export const DispatchCompleteLoadCategories: HandlerType = props => {
    props.dispatch({
        type: "Data/Categories/CompleteLoadCategories",
        collection: props.apiResult!,
        parameter: props.parameter,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.apiResult);
};

export const chain = [
    CheckIfDataViewLoading,
    DispatchBeginLoadCategories,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadCategories,
];

const loadCategories = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadCategories");
export default loadCategories;
