import { requestJson } from "@insite/shell/Services/ServiceBase";

export const importContent = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return requestJson<{ success: boolean; errorMessage: string }>(
        "/admin/websites/importSpireContent",
        "POST",
        {},
        formData,
    );
};

export const restoreContent = () =>
    requestJson<{ success: boolean; errorMessage: string }>("/admin/websites/restoreSpireContent", "POST");
