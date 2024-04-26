import { SafeDictionary } from "@insite/client-framework/Common/Types";
import {
    ApiParameter,
    del,
    doesNotHaveExpand,
    get,
    HasPagingParameters,
    patch,
    post,
    requestVoid,
} from "@insite/client-framework/Services/ApiService";
import {
    WishListCollectionModel,
    WishListLineCollectionModel,
    WishListLineModel,
    WishListModel,
} from "@insite/client-framework/Types/ApiModels";

export enum ShareOptions {
    IndividualUsers = "IndividualUsers",
    AllCustomerUsers = "AllCustomerUsers",
    Private = "Private",
}

export interface GetWishListsApiParameter extends ApiParameter, HasPagingParameters {
    sort?: string;
    query?: string;
    expand?: "top3products"[];
    additionalExpands?: string[];
    filter?: string;
}

export interface GetWishListApiParameter extends ApiParameter {
    wishListId: string;
    exclude?: "listLines"[];
    expand?: ("schedule" | "sharedUsers" | "staticList" | "getAllLines")[];
}

export interface GetWishListLinesApiParameter extends ApiParameter, HasPagingParameters {
    wishListId: string;
    query?: string;
}

export interface DeleteWishListApiParameter extends ApiParameter {
    wishListId: string;
}

export interface AddWishListApiParameter extends ApiParameter {
    name?: string;
    description?: string;
}

export interface SendWishListCopyApiParameter extends ApiParameter {
    wishList: WishListModel;
}

export interface UpdateWishListApiParameter extends ApiParameter {
    /**
     * @deprecated Use the `wishList.id` property instead.
     */
    wishListId?: string;
    /**
     * @deprecated Use the `wishList.name` property instead.
     */
    name?: string;
    /**
     * @deprecated Use the `wishList.description` property instead.
     */
    description?: string;
    wishList?: WishListModel;
}

export interface PostWishListLineModel {
    productId: string;
    qtyOrdered: number;
    unitOfMeasure: string;
}

export interface AddWishListLineApiParameter extends ApiParameter {
    wishList: WishListModel;
    line: PostWishListLineModel;
}

export interface AddWishListLinesApiParameter extends ApiParameter {
    wishList: WishListModel;
    lines: PostWishListLineModel[];
}

export interface AddAllWishListLinesApiParameter extends ApiParameter {
    wishList: WishListModel;
    copyFromWishListId: string;
    changedListLineQuantities?: { [key: string]: number } | null;
}

export interface UpdateWishListLineApiParameter extends ApiParameter {
    wishListId: string;
    wishListLineId: string;
    wishListLine: WishListLineModel;
}

export interface UpdateWishListLinesApiParameter extends ApiParameter {
    wishListId: string;
    changedSharedListLinesQuantities?: SafeDictionary<number>;
    includeListLines: boolean;
}

export interface DeleteWishListLineApiParameter extends ApiParameter {
    wishListId: string;
    wishListLineId: string;
}

export interface DeleteWishListLinesApiParameter extends ApiParameter {
    wishListId: string;
    wishListLineIds: string[];
}

export interface UpdateWishListScheduleApiParameter extends ApiParameter {
    wishList: WishListModel;
}

export interface DeleteWishListShareApiParameter extends ApiParameter {
    wishListId: string;
    wishListShareId?: string;
}

export interface ActivateInviteApiParameter extends ApiParameter {
    invite: string;
}

const wishListUrl = "/api/v1/wishlists";

export async function getWishLists(parameter: GetWishListsApiParameter) {
    const wishListCollection = await get<WishListCollectionModel>(wishListUrl, parameter);
    wishListCollection.wishListCollection?.forEach(o => {
        cleanWishList(o, parameter);
    });
    return wishListCollection;
}

export async function getWishList(parameter: GetWishListApiParameter) {
    const { wishListId, ...newParameter } = parameter;
    const wishList = await get<WishListModel>(`${wishListUrl}/${wishListId}`, newParameter);
    cleanWishList(wishList, parameter);
    return wishList;
}

export function getWishListLines(parameter: GetWishListLinesApiParameter) {
    const { wishListId, ...newParameter } = parameter;
    return get<WishListLineCollectionModel>(`${wishListUrl}/${wishListId}/wishlistlines`, newParameter);
}

export function addWishList(parameter: AddWishListApiParameter) {
    return post<WishListModel>(wishListUrl, {
        name: parameter.name,
        description: parameter.description,
    } as WishListModel);
}

export async function sendWishListCopy(parameter: SendWishListCopyApiParameter) {
    const { id: wishListId, ...wishListToUpdate } = parameter.wishList;
    const wishList = await patch<WishListModel>(`${wishListUrl}/${wishListId}/sendacopy`, wishListToUpdate);
    cleanWishList(wishList);
    return wishList;
}

export async function updateWishList(parameter: UpdateWishListApiParameter) {
    const wishListId = parameter.wishList?.id || parameter.wishListId;
    const wishListToUpdate = parameter.wishList || {
        name: parameter.name,
        description: parameter.description,
    };
    const wishList = await patch<WishListModel>(`${wishListUrl}/${wishListId}`, wishListToUpdate);
    cleanWishList(wishList, {});
    return wishList;
}

export function deleteWishList(parameter: DeleteWishListApiParameter) {
    return del(`${wishListUrl}/${parameter.wishListId}`);
}

export function addWishListLine(parameter: AddWishListLineApiParameter) {
    const wishListLinesUri = parameter.wishList.wishListLinesUri.substr(
        parameter.wishList.wishListLinesUri.indexOf("/api/v1"),
    );
    return post(`${wishListLinesUri}`, parameter.line);
}

export function addWishListLines(parameter: AddWishListLinesApiParameter) {
    const wishListLinesUri = parameter.wishList.wishListLinesUri.substr(
        parameter.wishList.wishListLinesUri.indexOf("/api/v1"),
    );
    return post(`${wishListLinesUri}/batch`, { wishListLines: parameter.lines });
}

export function addAllWishListLines(parameter: AddAllWishListLinesApiParameter) {
    const wishListLinesUri = parameter.wishList.wishListLinesUri.substr(
        parameter.wishList.wishListLinesUri.indexOf("/api/v1"),
    );
    return post(`${wishListLinesUri}/batch/${parameter.copyFromWishListId}`, {
        changedListLineQuantities: parameter.changedListLineQuantities,
        wishListLines: [],
        pagination: null,
    });
}

export function updateWishListLine(parameter: UpdateWishListLineApiParameter) {
    return patch<WishListLineModel>(
        `${wishListUrl}/${parameter.wishListId}/wishlistlines/${parameter.wishListLineId}`,
        parameter.wishListLine,
    );
}

export function updateWishListLines(parameter: UpdateWishListLinesApiParameter) {
    return patch<WishListLineCollectionModel>(
        `${wishListUrl}/${parameter.wishListId}/wishlistlines/batch`,
        parameter as unknown as WishListLineCollectionModel,
    );
}

export function deleteWishListLine(parameter: DeleteWishListLineApiParameter) {
    return del(`${wishListUrl}/${parameter.wishListId}/wishlistlines/${parameter.wishListLineId}`);
}

export function deleteWishListLines(parameter: DeleteWishListLinesApiParameter) {
    const query = parameter.wishListLineIds.map(o => `wishListLineIds=${o}`).join("&");
    return requestVoid(`${wishListUrl}/${parameter.wishListId}/wishlistlines/batch?${query}`, "DELETE", {
        "Content-Type": "application/json",
    });
}

export function updateWishListSchedule(parameter: UpdateWishListScheduleApiParameter) {
    return patch<WishListModel>(`${wishListUrl}/${parameter.wishList.id}/schedule`, parameter.wishList);
}

export function deleteWishListShare(parameter: DeleteWishListShareApiParameter) {
    return del(`${wishListUrl}/${parameter.wishListId}/share/${parameter.wishListShareId || "current"}`);
}

export function activateInvite(parameter: ActivateInviteApiParameter) {
    return patch<WishListModel>(`${wishListUrl}/activateinvite`, parameter as unknown as WishListModel);
}

function cleanWishList(wishList: WishListModel, parameter?: { expand?: string[]; exclude?: string[] }) {
    if (doesNotHaveExpand(parameter, "schedule")) {
        delete wishList.schedule;
    }
    if (doesNotHaveExpand(parameter, "sharedUsers")) {
        delete wishList.sharedUsers;
    }
    if (parameter?.exclude && parameter?.exclude.indexOf("listLines") > -1) {
        delete wishList.wishListLineCollection;
        delete wishList.wishListLinesCount;
    }
}
