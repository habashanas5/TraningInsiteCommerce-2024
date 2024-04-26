import throwErrorIfTesting from "@insite/client-framework/Common/ThrowErrorIfTesting";
import { createHandlerChainRunner, Handler, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import {
    CatalogPage,
    CatalogPageResult,
    getCatalogPageByPath,
    GetCatalogPageByPathApiParameter,
} from "@insite/client-framework/Services/CategoryService";

type Parameter = {
    path: string;
} & HasOnSuccess<CatalogPage>;
type Props = {
    apiParameter: GetCatalogPageByPathApiParameter;
    apiResult: CatalogPageResult;
};

type HandlerType = Handler<Parameter, Props>;

export const DispatchBeginLoadCatalogPage: HandlerType = props => {
    throwErrorIfTesting();

    props.dispatch({
        type: "Data/CatalogPages/BeginLoadCatalogPage",
        id: props.parameter.path,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getCatalogPageByPath(props.apiParameter);
};

export const DispatchCompleteLoadCatalogPage: HandlerType = props => {
    props.dispatch({
        type: "Data/CatalogPages/CompleteLoadCatalogPage",
        model: props.apiResult.catalogPage,
        path: props.apiParameter.path,
    });

    if (props.apiResult.categoriesById) {
        props.dispatch({
            type: "Data/Categories/CompleteLoadCategoriesById",
            categoriesById: props.apiResult.categoriesById,
        });
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.apiResult.catalogPage);
};

export const chain = [
    DispatchBeginLoadCatalogPage,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadCatalogPage,
    ExecuteOnSuccessCallback,
];

const loadCatalogPageByPath = createHandlerChainRunner(chain, "LoadCatalogPageByPath");
export default loadCatalogPageByPath;
