import { Dictionary } from "@insite/client-framework/Common/Types";
import { get } from "@insite/shell/Services/ServiceBase";
import { SelectBrandModel } from "@insite/shell/Store/PageEditor/PageEditorState";

export const getAdminBrands = (parameter?: AdminODataApiParameter) =>
    getOData<SelectBrandModel[]>("brands", { ...parameter });

export const getAdminSystemListValues = (parameter?: AdminODataApiParameter) =>
    getOData<SystemListValue[]>("systemListValues", { ...parameter });

export interface AdminODataApiParameter {
    archiveFilter?: ArchiveFilter;
    $filter?: string;
    $orderBy?: string;
    $skip?: string;
    $top?: string;
    $select?: string;
    $count?: boolean;
}
function getOData<T>(endpoint: string, parameter?: Dictionary<any>) {
    return new Promise<T>(resolve => {
        get<AdminODataApiResult<T>>(`/api/v1/admin/${endpoint}`, parameter).then(data => {
            resolve(data.value);
        });
    });
}

interface AdminODataApiResult<T> {
    value: T;
}

export enum ArchiveFilter {
    Active = 0,
    Archived = 1,
    Both = 2,
}

export interface SystemListValue {
    name: string;
}
