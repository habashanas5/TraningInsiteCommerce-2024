import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import {
    getPageLinkByNodeId,
    LinkModel,
    useGetLink,
    useGetLinks,
} from "@insite/client-framework/Store/Links/LinksSelectors";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Link from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { FC } from "react";
import { css } from "styled-components";

const enum fields {
    direction = "direction",
    alignment = "alignment",
    title = "title",
    titleLink = "titleLink",
    links = "links",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.direction]: "vertical" | "horizontal";
        [fields.alignment]: "left" | "center" | "right";
        [fields.title]: string;
        [fields.titleLink]: LinkFieldValue;
        [fields.links]: LinkModel[];
    };
    extendedStyles?: LinkListStyles;
}

export interface LinkListStyles {
    linkListWrapper?: InjectableCss;
    titleWrapper?: InjectableCss;
    title?: TypographyPresentationProps;
    linkWrapper?: InjectableCss;
}

export const linkListStyles: LinkListStyles = {
    linkListWrapper: {
        css: css`
            text-transform: uppercase;
            padding: 10px 0;
        `,
    },
    titleWrapper: {
        css: css`
            font-weight: bold;
        `,
    },
    linkWrapper: {
        css: css`
            padding: 1px 18px 0 0;
        `,
    },
};

export const LinkList: FC<OwnProps> = ({ fields, extendedStyles }) => {
    const links = useGetLinks(fields.links, o => o.fields.destination);
    const titleLink = useGetLink(fields.titleLink);
    const styles = useMergeStyles("linkList", linkListStyles, extendedStyles);

    const alignmentStyles = css`
        text-align: ${fields.alignment || "right"};
        ${styles.linkListWrapper?.css}
    `;

    const directionStyles = css`
        ${fields.direction === "horizontal" ? "display: inline-block;" : "padding: 1px 0 0 0;"};
        ${styles.linkWrapper?.css}
    `;

    return (
        <StyledWrapper css={alignmentStyles}>
            <StyledWrapper {...styles.titleWrapper}>
                {titleLink ? (
                    <Link href={titleLink.url}>{fields.title || titleLink.title}</Link>
                ) : (
                    <Typography as="h3" {...styles.title}>
                        {fields.title}
                    </Typography>
                )}
            </StyledWrapper>
            {links.map((link, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <StyledWrapper key={index} css={directionStyles}>
                    {link.url && (
                        <Link href={link.url} target={fields.links[index].fields.openInNewWindow ? "_blank" : ""}>
                            {fields.links[index].fields.overriddenTitle || link.title}
                        </Link>
                    )}
                </StyledWrapper>
            ))}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: LinkList,
    definition: {
        group: "Basic",
        icon: "LinkList",
        fieldDefinitions: [
            {
                name: fields.direction,
                editorTemplate: "DropDownField",
                defaultValue: "vertical",
                fieldType: "General",
                options: [
                    {
                        displayName: "Vertical",
                        value: "vertical",
                    },
                    {
                        displayName: "Horizontal",
                        value: "horizontal",
                    },
                ],
                hideEmptyOption: true,
            },
            {
                name: fields.alignment,
                editorTemplate: "DropDownField",
                defaultValue: "left",
                fieldType: "General",
                options: [
                    {
                        displayName: "Left",
                        value: "left",
                    },
                    {
                        displayName: "Center",
                        value: "center",
                    },
                    {
                        displayName: "Right",
                        value: "right",
                    },
                ],
                hideEmptyOption: true,
            },
            {
                name: fields.title,
                editorTemplate: "TextField",
                defaultValue: "",
                fieldType: "Translatable",
            },
            {
                fieldType: "General",
                name: fields.titleLink,
                displayName: "Title Link",
                editorTemplate: "LinkField",
                defaultValue: { type: "Page", value: "" },
            },
            {
                name: fields.links,
                editorTemplate: "ListField",
                getDisplay: (item: HasFields, state) => {
                    const {
                        destination: { type, value },
                        overriddenTitle,
                    } = item.fields;
                    if (overriddenTitle) {
                        return overriddenTitle;
                    }
                    if (type === "Page") {
                        const link = getPageLinkByNodeId(state, value);
                        return link?.title;
                    }
                    if (type === "Category") {
                        let displayValue = "";
                        const categories = (state as any).pageEditor.categories;
                        if (!categories) {
                            displayValue = "Loading...";
                        } else {
                            const matchingCategories = categories.filter((o: { id: string }) => o.id === value);
                            if (matchingCategories.length === 0) {
                                displayValue = "Unknown";
                            } else {
                                displayValue = matchingCategories[0].shortDescription;
                            }
                        }

                        return displayValue;
                    }
                    if (type === "Url") {
                        return value;
                    }
                    return value;
                },
                defaultValue: [],
                fieldType: "General",
                fieldDefinitions: [
                    {
                        name: "destination",
                        editorTemplate: "LinkField",
                        defaultValue: {
                            value: "",
                            type: "Page",
                        },
                        isRequired: true,
                    },
                    {
                        name: "overriddenTitle",
                        displayName: "Title",
                        editorTemplate: "TextField",
                        defaultValue: "",
                    },
                    {
                        name: "openInNewWindow",
                        editorTemplate: "CheckboxField",
                        defaultValue: false,
                    },
                ],
            },
        ],
    },
};

export default widgetModule;
