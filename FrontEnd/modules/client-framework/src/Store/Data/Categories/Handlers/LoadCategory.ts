import { createHandlerChainRunner, Handler, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import {
    Category,
    getCategoryById,
    GetCategoryByIdApiParameter,
} from "@insite/client-framework/Services/CategoryService";

type Parameter = GetCategoryByIdApiParameter & HasOnSuccess<Category>;
type Props = {
    apiParameter: GetCategoryByIdApiParameter;
    apiResult: Category;
};

type HandlerType = Handler<Parameter, Props>;

export const DispatchBeginLoadCategory: HandlerType = props => {
    props.dispatch({
        type: "Data/Categories/BeginLoadCategory",
        id: props.parameter.id,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        ...props.parameter,
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    try {
        props.apiResult = await getCategoryById(props.apiParameter);
    } catch (error) {
        if (error?.status === 404) {
            if (props.apiParameter.id) {
                props.dispatch({
                    type: "Data/Categories/FailedToLoadCategory",
                    categoryId: props.apiParameter.id,
                    status: error.status,
                });
            }
            return false;
        }
        throw error;
    }
};

export const DispatchCompleteLoadCategory: HandlerType = props => {
    props.dispatch({
        type: "Data/Categories/CompleteLoadCategory",
        model: props.apiResult,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.apiResult);
};

export const chain = [
    DispatchBeginLoadCategory,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadCategory,
    ExecuteOnSuccessCallback,
];

const loadCategory = createHandlerChainRunner(chain, "LoadCategory");
export default loadCategory;
