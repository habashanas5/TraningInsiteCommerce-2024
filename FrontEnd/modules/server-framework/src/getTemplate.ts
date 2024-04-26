import { PageModel } from "@insite/client-framework/Types/PageProps";
import { getTemplatePathForPageType, getTemplatePathsForPageType } from "@insite/server-framework/SiteGeneration";
import { Request, Response } from "express";
import { readFile } from "fs";
import { promisify } from "util";

const readFileAsync = promisify(readFile);

const getTemplate = async (request: Request, response: Response) => {
    const { pageType, pageTemplate } = request.query;

    const { templatePath, checkedFilePaths } = pageTemplate
        ? { templatePath: pageTemplate, checkedFilePaths: [] }
        : await getTemplatePathForPageType(pageType);

    if (!templatePath) {
        throw new Error(
            `There was no template found for the pageType of ${pageType} at any of the following paths \n${checkedFilePaths.join(
                "\n",
            )}`,
        );
    }

    const template = JSON.parse(await readFileAsync(templatePath, "utf8")) as PageModel;
    if (template.type !== pageType) {
        throw new Error(
            `The page template at ${templatePath} specified a type of ${template.type} which did not match the requested type of ${pageType}`,
        );
    }

    response.json(template);
};

export const getTemplatePaths = async (request: Request, response: Response) => {
    const { pageType } = request.query;

    const paths = await getTemplatePathsForPageType(pageType);

    response.json(paths);
};

export default getTemplate;
