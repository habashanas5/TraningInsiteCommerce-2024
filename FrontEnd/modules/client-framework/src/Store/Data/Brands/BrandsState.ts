import { Dictionary } from "@insite/client-framework/Common/Types";
import { DataViewState } from "@insite/client-framework/Store/Data/DataState";
import {
    BrandCategoryModel,
    BrandModel,
    BrandProductLineModel,
    PaginationModel,
} from "@insite/client-framework/Types/ApiModels";

export interface BrandsState extends DataViewState<BrandModel> {
    readonly idByPath: Dictionary<string>;
    readonly brandCategoryDataView: Dictionary<DateViewCollection<BrandCategoryModel>>;
    readonly brandProductLineDataView: Dictionary<DateViewCollection<BrandProductLineModel>>;
}

export interface DateViewCollection<T> {
    readonly isLoading: boolean;
    readonly pagination?: Readonly<PaginationModel> | null;
    readonly properties?: { [key: string]: string };
    readonly value: T[] | null | undefined;
    readonly fetchedDate?: Date;
}
