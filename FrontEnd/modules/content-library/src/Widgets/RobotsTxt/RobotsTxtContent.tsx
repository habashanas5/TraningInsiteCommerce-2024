/* eslint-disable spire/export-styles */
import PageProps from "@insite/client-framework/Types/PageProps";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RobotsTxtPageContext } from "@insite/content-library/Pages/RobotsTxtPage";
import Typography from "@insite/mobius/Typography";
import React, { FC } from "react";

const defaultDisallowText = "User-Agent: *\nDisallow: /\n";
const defaultAllowText = "User-Agent: *\nDisallow:\n";

const enum fields {
    contentField = "contentField",
    disallow = "disallow",
    sitemap = "sitemap",
}

interface Props extends PageProps, WidgetProps {
    contentField: {
        [fields.contentField]: string;
        [fields.disallow]: boolean;
    };
}

const RobotsTxtContent: FC<Props> = props => {
    const domain = typeof window === "undefined" ? "" : window.location.host?.toLowerCase();

    return (
        <div>
            <Typography style={{ whiteSpace: "pre-wrap" }}>
                {props.fields[fields.disallow] ? defaultDisallowText : props.fields[fields.contentField]}
                {props.fields[fields.sitemap] && domain && `\nsitemap: https://${domain}/sitemapindex.xml`}
            </Typography>
        </div>
    );
};

const widgetModule: WidgetModule = {
    component: RobotsTxtContent,
    definition: {
        group: "Robots Txt",
        displayName: "Content",
        allowedContexts: [RobotsTxtPageContext],
        fieldDefinitions: [
            {
                name: "disallow",
                displayName: "Disallow crawling for the site",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                isRequired: true,
                sortOrder: 0,
            },
            {
                name: "sitemap",
                displayName: "Include sitemap url",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                isRequired: true,
                sortOrder: 1,
            },
            {
                name: "contentField",
                displayName: "Content",
                editorTemplate: "MultilineTextField",
                defaultValue: defaultAllowText,
                fieldType: "General",
                isRequired: true,
                sortOrder: 2,
                isEnabled: item => !item?.fields[fields.disallow],
            },
        ],
    },
};

export default widgetModule;
