/* eslint-disable spire/export-styles */
import { useGetLink } from "@insite/client-framework/Store/Links/LinksSelectors";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import MobiusLink from "@insite/mobius/Link";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { FC } from "react";

const enum fields {
    destination = "destination",
    overrideTitle = "overrideTitle",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.destination]: LinkFieldValue;
        [fields.overrideTitle]: string;
    };
}

const linkStyles: InjectableCss = {};

export const Link: FC<OwnProps> = ({ fields }) => {
    const { title, url } = useGetLink(fields.destination);

    const styles = useMergeStyles("link", linkStyles);

    if (!url) {
        return null;
    }

    return (
        <MobiusLink {...styles} href={url}>
            {fields.overrideTitle || title || url}
        </MobiusLink>
    );
};

const widgetModule: WidgetModule = {
    component: Link,
    definition: {
        group: "Basic",
        icon: "Link",
        fieldDefinitions: [
            {
                name: fields.destination,
                editorTemplate: "LinkField",
                defaultValue: { type: "Page", value: "" },
                fieldType: "General",
                isRequired: true,
            },
            {
                name: fields.overrideTitle,
                editorTemplate: "TextField",
                defaultValue: "",
                fieldType: "Translatable",
            },
        ],
    },
};

export default widgetModule;
