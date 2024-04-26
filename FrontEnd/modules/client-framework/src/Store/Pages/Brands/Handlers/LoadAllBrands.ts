import { createHandlerChainRunnerOptionalParameter, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import { getBrands, GetBrandsApiParameter } from "@insite/client-framework/Services/BrandService";
import { BrandCollectionModel, BrandModel } from "@insite/client-framework/Types/ApiModels";

type Parameter = Omit<GetBrandsApiParameter, "page"> & {
    /**
     * @deprecated This property is ignored. Loading all brands starting from a page is not supported.
     */
    page?: number;
};

type HandlerType = HandlerWithResult<Parameter, BrandModel[]>;

export const DispatchBeginLoadBrands: HandlerType = props => {
    props.dispatch({
        type: "Data/Brands/BeginLoadBrands",
        parameter: { key: "AllBrands" },
    });
};

export const RequestDataFromApi: HandlerType = async props => {
    const pages: BrandModel[][] = [];
    const pageSize = props.parameter.pageSize || 500;
    const getPage = async (page: number) => {
        const parameter = {
            ...props.parameter,
            pageSize,
            page,
        };
        const apiResult = await getBrands(parameter);
        pages[page] = apiResult.brands!;
        return apiResult;
    };

    const { pagination } = await getPage(1);
    const promises = [];
    for (let x = 2; (x - 1) * pageSize < pagination!.totalItemCount; x++) {
        promises.push(getPage(x));
    }
    await Promise.all(promises);

    let collection: BrandModel[] = [];
    for (const page of pages) {
        if (!page) {
            continue;
        }
        collection = collection.concat(page);
    }

    props.result = collection;
};

export const DispatchCompleteLoadBrands: HandlerType = props => {
    props.dispatch({
        type: "Data/Brands/CompleteLoadBrands",
        collection: { brands: props.result } as BrandCollectionModel,
        parameter: { key: "AllBrands" },
    });
};

export const chain = [DispatchBeginLoadBrands, RequestDataFromApi, DispatchCompleteLoadBrands];

const loadAllBrands = createHandlerChainRunnerOptionalParameter(
    chain,
    {
        page: 1,
        pageSize: 500,
    },
    "LoadAllBrands",
);
export default loadAllBrands;
