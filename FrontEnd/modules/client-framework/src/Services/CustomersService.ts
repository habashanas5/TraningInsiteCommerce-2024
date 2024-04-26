import {
    ApiParameter,
    API_URL_CURRENT_FRAGMENT,
    doesNotHaveExpand,
    get,
    HasPagingParameters,
    patch,
    post,
} from "@insite/client-framework/Services/ApiService";
import {
    BillToCollectionModel,
    BillToModel,
    ShipToCollectionModel,
    ShipToModel,
} from "@insite/client-framework/Types/ApiModels";

export interface GetBillToApiParameter extends ApiParameter {
    billToId: string;
    expand?: ("shipTos" | "accountsReceivable" | "excludeOneTime" | "validation" | "costCodes")[];
    additionalExpands?: string[];
}

export interface UpdateBillToApiParameter extends ApiParameter {
    billTo: BillToModel;
}

export interface GetShipToApiParameter extends ApiParameter {
    billToId: string;
    shipToId: string;
    expand?: "validation"[];
    additionalExpands?: string[];
}

export interface UpdateShipToApiParameter extends ApiParameter {
    billToId: string;
    shipTo: ShipToModel;
}

export interface GetShipTosApiParameter extends ApiParameter, HasPagingParameters {
    expand?: ("validation" | "approvals" | "assignedOnly" | "excludeShowAll" | "excludeOneTime" | "excludeCreateNew")[];
    exclude?: ("showAll" | "createNew" | "billTo" | "oneTime")[];
    additionalExpands?: string[];
    filter?: string;
    billToId?: string;
}

export interface GetBillTosApiParameter extends ApiParameter, HasPagingParameters {
    expand?: ("shipTos" | "state" | "excludeOneTime")[];
    additionalExpands?: string[];
    filter?: string;
}

export interface CreateShipToApiParameter extends ApiParameter {
    billToId?: string;
    shipTo: ShipToModel;
}

export interface UpdateEnforcementLevelApiParameter extends ApiParameter {
    billTo: BillToModel;
}

const billTosUrl = "/api/v1/billtos";

export async function getBillTo(parameter: GetBillToApiParameter) {
    const { billToId, ...newParameter } = parameter;
    const billToModel = await get<BillToModel>(`${billTosUrl}/${billToId}`, newParameter);
    cleanBillToModel(billToModel, parameter);
    return billToModel;
}

export async function updateBillTo(parameter: UpdateBillToApiParameter) {
    const updatedBillTo = { ...parameter.billTo };
    delete updatedBillTo.shipTos;
    delete updatedBillTo.budgetEnforcementLevel;

    const billToModel = await patch<BillToModel>(`${billTosUrl}/${updatedBillTo.id}`, updatedBillTo);
    cleanBillToModel(billToModel);
    return billToModel;
}

export async function getBillTos(parameter: GetBillTosApiParameter): Promise<BillToCollectionModel> {
    const billTos = await get<BillToCollectionModel>(billTosUrl, parameter);
    billTos.billTos?.forEach(o => cleanBillToModel(o, parameter));
    return billTos;
}

export async function updateEnforcementLevel(parameter: UpdateEnforcementLevelApiParameter) {
    const billToModel = await patch<BillToModel>(`${billTosUrl}/current`, parameter.billTo);
    cleanBillToModel(billToModel);
    return billToModel;
}

function cleanBillToModel(billToModel: BillToModel, parameter?: { expand?: string[]; additionalExpands?: string[] }) {
    if (doesNotHaveExpand(parameter, "shipTos")) {
        delete billToModel.shipTos;
    }
    if (doesNotHaveExpand(parameter, "costCodes")) {
        delete billToModel.costCodes;
    }
    if (doesNotHaveExpand(parameter, "accountsReceivable")) {
        delete billToModel.accountsReceivable;
    }
    if (doesNotHaveExpand(parameter, "validation")) {
        delete billToModel.validation;
        if (billToModel.shipTos) {
            billToModel.shipTos.forEach(o => {
                delete o.validation;
            });
        }
    }
}

export async function getShipTo(parameter: GetShipToApiParameter): Promise<ShipToModel> {
    const { billToId, shipToId, ...newParameter } = parameter;
    const shipToModel = await get<ShipToModel>(`${billTosUrl}/${billToId}/shiptos/${shipToId}`, newParameter);

    cleanShipToModel(shipToModel, parameter);

    return shipToModel;
}

export async function updateShipTo(parameter: UpdateShipToApiParameter) {
    const shipToModel = await patch<ShipToModel>(
        `${billTosUrl}/${parameter.billToId}/shiptos/${parameter.shipTo.id}`,
        parameter.shipTo,
    );
    cleanShipToModel(shipToModel);
    return shipToModel;
}

export async function getShipTos(parameter: GetShipTosApiParameter) {
    const billToId = parameter.billToId || API_URL_CURRENT_FRAGMENT;
    const shipTos = await get<ShipToCollectionModel>(`${billTosUrl}/${billToId}/shiptos`, parameter);
    shipTos.shipTos?.forEach(o => cleanShipToModel(o, parameter));
    return shipTos;
}

export async function createShipTo(parameter: CreateShipToApiParameter) {
    const shipTo = await post<ShipToModel>(
        `${billTosUrl}/${parameter.billToId ?? "current"}/shiptos`,
        parameter.shipTo,
    );
    cleanShipToModel(shipTo);
    return shipTo;
}

function cleanShipToModel(shipToModel: ShipToModel, parameter?: { expand?: string[]; additionalExpands?: string[] }) {
    if (doesNotHaveExpand(parameter, "validation")) {
        delete shipToModel.validation;
    }
    if (shipToModel.id.trim() === "") {
        shipToModel.id = shipToModel.label;
    }
}

export const defaultVmiLocationGetShipTosApiParameter = (billToId: string | undefined) => {
    return {
        page: 1,
        pageSize: 20,
        billToId,
        expand: ["excludeShowAll", "excludeOneTime", "excludeCreateNew"],
    } as GetShipTosApiParameter;
};
