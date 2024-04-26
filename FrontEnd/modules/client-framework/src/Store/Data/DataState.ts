import { Dictionary, SafeDictionary } from "@insite/client-framework/Common/Types";
import deepFreezeObject from "@insite/client-framework/Common/Utilities/deepFreezeObject";
import { AccountsState } from "@insite/client-framework/Store/Data/Accounts/AccountsState";
import { AccountShipTosState } from "@insite/client-framework/Store/Data/AccountShipTos/AccountShipTosState";
import { AddressFieldsState } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsState";
import { BillTosState } from "@insite/client-framework/Store/Data/BillTos/BillTosState";
import { BrandsState } from "@insite/client-framework/Store/Data/Brands/BrandsState";
import { BudgetCalendarsState } from "@insite/client-framework/Store/Data/BudgetCalendars/BudgetCalendarsState";
import { BudgetsState } from "@insite/client-framework/Store/Data/Budgets/BudgetsState";
import { CartsState } from "@insite/client-framework/Store/Data/Carts/CartsState";
import { CatalogPagesState } from "@insite/client-framework/Store/Data/CatalogPages/CatalogPagesState";
import { CategoriesState } from "@insite/client-framework/Store/Data/Categories/CategoriesState";
import { CountriesState } from "@insite/client-framework/Store/Data/Countries/CountriesState";
import { DealersState } from "@insite/client-framework/Store/Data/Dealers/DealersState";
import { InvoicesState } from "@insite/client-framework/Store/Data/Invoices/InvoicesState";
import { JobQuotesState } from "@insite/client-framework/Store/Data/JobQuotes/JobQuotesState";
import { MessagesState } from "@insite/client-framework/Store/Data/Messages/MessagesState";
import { OrderApprovalsState } from "@insite/client-framework/Store/Data/OrderApprovals/OrderApprovalsState";
import { OrdersState } from "@insite/client-framework/Store/Data/Orders/OrdersState";
import { OrderStatusMappingsState } from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsState";
import { PagesState } from "@insite/client-framework/Store/Data/Pages/PagesState";
import { PaymentProfilesState } from "@insite/client-framework/Store/Data/PaymentProfiles/PaymentProfilesState";
import { ProductsState } from "@insite/client-framework/Store/Data/Products/ProductsState";
import { PromotionsState } from "@insite/client-framework/Store/Data/Promotions/PromotionsState";
import { QuotesState } from "@insite/client-framework/Store/Data/Quotes/QuotesState";
import { RequisitionsState } from "@insite/client-framework/Store/Data/Requisitions/RequisitionsState";
import { ShipTosState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosState";
import { VmiBinsState } from "@insite/client-framework/Store/Data/VmiBins/VmiBinsState";
import { VmiLocationsState } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsState";
import { WarehousesState } from "@insite/client-framework/Store/Data/Warehouses/WarehousesState";
import { WishListLinesState } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesState";
import { WishListsState } from "@insite/client-framework/Store/Data/WishLists/WishListsState";
import { PaginationModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";
import assign from "lodash/assign";
import sortBy from "lodash/sortBy";

export interface DataView {
    readonly fetchedDate: Date;
    readonly ids?: string[];
    readonly isLoading: boolean;
    readonly pagination?: Readonly<PaginationModel>;
    readonly properties: Dictionary<string>;
}

interface HasById<Model> {
    readonly isLoading: Dictionary<boolean>;
    readonly byId: Dictionary<Readonly<Model>>;
    readonly errorStatusCodeById?: Dictionary<Readonly<number>>;
}

export interface DataViewState<Model, DataViewModel extends DataView = DataView> extends HasById<Model> {
    readonly dataViews: Dictionary<DataViewModel>;
}

export default interface DataState {
    readonly accounts: AccountsState;
    readonly accountShipTos: AccountShipTosState;
    readonly addressFields: AddressFieldsState;
    readonly billTos: BillTosState;
    readonly brands: BrandsState;
    readonly budgets: BudgetsState;
    readonly budgetCalendars: BudgetCalendarsState;
    readonly carts: CartsState;
    readonly catalogPages: CatalogPagesState;
    readonly categories: CategoriesState;
    readonly countries: CountriesState;
    readonly dealers: DealersState;
    readonly invoices: InvoicesState;
    readonly jobQuotes: JobQuotesState;
    readonly messages: MessagesState;
    readonly orderApprovals: OrderApprovalsState;
    readonly orders: OrdersState;
    readonly orderStatusMappings: OrderStatusMappingsState;
    readonly pages: PagesState;
    readonly paymentProfiles: PaymentProfilesState;
    readonly products: ProductsState;
    readonly promotions: PromotionsState;
    readonly quotes: QuotesState;
    readonly requisitions: RequisitionsState;
    readonly shipTos: ShipTosState;
    readonly vmiBins: VmiBinsState;
    readonly vmiLocations: VmiLocationsState;
    readonly warehouses: WarehousesState;
    readonly wishLists: WishListsState;
    readonly wishListLines: WishListLinesState;
}

export function assignById<T extends { id: string }>(draft: Draft<DataViewState<T>>, value: T) {
    const existingValue = draft.byId[value.id] ?? {};
    assign(existingValue, value);
    draft.byId[value.id] = existingValue;
}

export function setDataViewLoading<T extends { id: string }>(dataViewState: DataViewState<T>, parameter: object) {
    dataViewState.dataViews[getDataViewKey(parameter)] = {
        isLoading: true,
        ids: undefined,
        fetchedDate: new Date(),
        properties: {},
    };
}

export function setDataViewLoaded<
    T extends { id: string },
    DataViewModel extends DataView,
    CollectionType extends { pagination?: PaginationModel | null; properties?: Dictionary<string> },
>(
    draft: Draft<DataViewState<T>>,
    parameter: object,
    collection: CollectionType,
    getModels: (collection: CollectionType) => T[],
    modelAction?: (value: T) => void,
    addExtraData?: (dataView: DataViewModel) => void,
) {
    const ids: string[] = [];
    const values = getModels(collection);
    for (const value of values) {
        ids.push(value.id);
        if (modelAction) {
            modelAction(value);
        }
        assignById(draft, value);
    }

    const dataView: DataView = {
        isLoading: false,
        ids,
        pagination: collection.pagination ? collection.pagination : undefined,
        properties: collection.properties ? collection.properties : {},
        fetchedDate: new Date(),
    };
    if (addExtraData) {
        addExtraData(dataView as DataViewModel);
    }

    draft.dataViews[getDataViewKey(parameter)] = dataView;
}

export function replaceDataView<T extends { id: string }, DataViewModel extends DataView>(
    draft: Draft<DataViewState<T>>,
    parameter: object,
    dataView: object,
) {
    draft.dataViews[getDataViewKey(parameter)] = dataView as DataViewModel;
}

const cacheMap = new WeakMap<object, SafeDictionary<any>>();

export const dataViewNotFound = Object.freeze({
    isLoading: false,
    value: undefined,
} as const);

export function getDataView<T extends { id: string }, DataViewModel extends DataView>(
    dataViewState: DataViewState<T, DataViewModel>,
    parameter: object | undefined,
) {
    const key = getDataViewKey(parameter);
    const dataView = dataViewState.dataViews[key];
    if (!dataView) {
        return dataViewNotFound;
    }

    return getOrStoreCachedResult(dataViewState, key, () => {
        let models: T[] | undefined;
        const { ids, ...otherProps } = dataView;
        if (ids) {
            models = [];
            for (const id of ids) {
                models.push(dataViewState.byId[id]);
            }
        }

        return {
            value: models,
            ...otherProps,
        };
    });
}

export const idNotFound = Object.freeze({
    isLoading: false,
    value: undefined,
    errorStatusCode: undefined,
    id: undefined,
} as const);

export function getById<T>(dataViewState: HasById<T>, id: string | undefined, mapId?: (id: string) => string) {
    if (!id) {
        return idNotFound;
    }

    return getOrStoreCachedResult(dataViewState, id, () => {
        const isLoading = dataViewState.isLoading[id];
        return {
            id,
            value: dataViewState.byId[!mapId ? id : mapId(id)],
            errorStatusCode: dataViewState.errorStatusCodeById && dataViewState.errorStatusCodeById[id],
            isLoading: !!isLoading,
        };
    });
}

export function getOrStoreCachedResult<ModelType, ResultType extends object>(
    dataViewState: HasById<ModelType>,
    key: string,
    createResult: () => ResultType,
) {
    const cached = cacheMap.get(dataViewState)?.[key];

    if (cached) {
        return cached as Readonly<ResultType>;
    }

    const result = deepFreezeObject(createResult());
    let dictionary = cacheMap.get(dataViewState);
    if (!dictionary) {
        dictionary = {};
        cacheMap.set(dataViewState, dictionary);
    }

    dictionary[key] = result;

    return result;
}

export function getDataViewKey(parameter?: object | undefined) {
    if (!parameter) {
        return "EMPTY_KEY";
    }
    let dataViewKey = "";
    const keys = sortBy(Object.keys(parameter), o => o);
    for (const key of keys) {
        // eslint-disable-next-line no-prototype-builtins
        if (parameter.hasOwnProperty(key)) {
            const value = (parameter as Dictionary<string>)[key];
            const type = typeof value;
            if (type === "undefined" || type === "function") {
                continue;
            }
            const stringValue = value.toString();
            if (key === "page" && stringValue === "1") {
                continue;
            }
            dataViewKey += `${key}=${stringValue}&`;
        }
    }

    dataViewKey = dataViewKey.length > 0 ? dataViewKey.substr(0, dataViewKey.length - 1) : dataViewKey;

    return dataViewKey === "" ? "EMPTY_KEY" : dataViewKey;
}
