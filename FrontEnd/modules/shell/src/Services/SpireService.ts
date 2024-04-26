import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { PageModel } from "@insite/client-framework/Types/PageProps";
import { TemplateInfo } from "@insite/client-framework/Types/SiteGenerationModel";
import { get } from "@insite/shell/Services/ServiceBase";

export const getAutoUpdatedPageTypes = () => get<{ autoUpdatedPageTypes: string[] }>("/.spire/autoUpdatedPageTypes");

export const getTemplate = (pageType: string, pageTemplate?: string) =>
    get<PageModel>("/.spire/content/getTemplate", { pageType, pageTemplate });

export const getTemplatePaths = (pageType: string) =>
    get<TemplateInfo[]>("/.spire/content/getTemplatePaths", { pageType });

export const getDiagnostics = () => get<SafeDictionary<string>>("/.spire/diagnostics");
