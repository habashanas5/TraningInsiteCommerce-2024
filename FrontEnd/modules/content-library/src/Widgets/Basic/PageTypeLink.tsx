/* eslint-disable spire/export-styles */
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Link from "@insite/mobius/Link";
import * as React from "react";
import { connect } from "react-redux";

const enum fields {
    pageType = "pageType",
    overrideTitle = "overrideTitle",
    queryString = "queryString",
    testSelector = "testSelector",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.pageType]: string;
        [fields.overrideTitle]: string;
        [fields.queryString]: string;
        [fields.testSelector]: string;
    };
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    pageLink: getPageLinkByPageType(state, ownProps.fields.pageType),
});

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

export const PageTypeLink: React.FC<Props> = ({ pageLink, fields: { queryString, testSelector, overrideTitle } }) => {
    if (!pageLink) {
        return null;
    }

    const url = queryString ? `${pageLink.url}?${queryString}` : pageLink.url;

    const selector = testSelector;
    return (
        <Link href={url} data-test-selector={selector}>
            {overrideTitle || pageLink.title}
        </Link>
    );
};

const pageTypeLink: WidgetModule = {
    component: connect(mapStateToProps)(PageTypeLink),
    definition: {
        group: "Basic",
        icon: "Link",
        fieldDefinitions: [
            {
                fieldType: "General",
                name: fields.pageType,
                editorTemplate: "TextField",
                defaultValue: "",
                isRequired: true,
            },
            {
                fieldType: "Translatable",
                name: fields.overrideTitle,
                editorTemplate: "TextField",
                defaultValue: "",
            },
            {
                fieldType: "Translatable",
                name: fields.queryString,
                editorTemplate: "TextField",
                defaultValue: "",
            },
        ],
    },
};

export default pageTypeLink;
