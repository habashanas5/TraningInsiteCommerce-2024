import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { useGetLinks } from "@insite/client-framework/Store/Links/LinksSelectors";
import { WidgetDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Camera from "@insite/mobius/Icons/Camera";
import Facebook from "@insite/mobius/Icons/Facebook";
import FileText from "@insite/mobius/Icons/FileText";
import Instagram from "@insite/mobius/Icons/Instagram";
import Linkedin from "@insite/mobius/Icons/Linkedin";
import Rss from "@insite/mobius/Icons/Rss";
import Twitter from "@insite/mobius/Icons/Twitter";
import User from "@insite/mobius/Icons/User";
import Video from "@insite/mobius/Icons/Video";
import Youtube from "@insite/mobius/Icons/Youtube";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
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
    visibilityState = "visibilityState",
    iconSize = "iconSize",
    iconColor = "iconColor",
    backgroundColor = "backgroundColor",
    linksPerRow = "linksPerRow",
}

const enum icons {
    instagram = "Instagram",
    facebook = "Facebook",
    youtube = "Youtube",
    twitter = "Twitter",
    rss = "Rss",
    user = "User",
    linkedin = "Linkedin",
    camera = "Camera",
    video = "Video",
    notebook = "Notebook",
}

const enum visibilityState {
    both = "both",
    label = "label",
    icon = "icon",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.direction]: "vertical" | "horizontal";
        [fields.alignment]: "left" | "right";
        [fields.visibilityState]: visibilityState;
        [fields.title]: string;
        [fields.iconSize]: number;
        [fields.linksPerRow]: number;
        [fields.iconColor]: string;
        [fields.backgroundColor]: string;
        [fields.titleLink]: LinkFieldValue;
        [fields.links]: LinkModel[];
    };
}

interface LinkModel {
    fields: {
        title: string;
        icon: string;
        openInNewWindow: boolean;
        destination: LinkFieldValue;
        overriddenTitle: string;
    };
}

export interface LinkListStyles {
    socialLinkListWrapper?: InjectableCss;
    linkWrapper?: InjectableCss;
    link?: LinkPresentationProps;
}

export const linkListStyles: LinkListStyles = {
    socialLinkListWrapper: {
        css: css`
            width: 100%;
            padding: 10px 0;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
        `,
    },
    linkWrapper: {
        css: css`
            padding: 1px 18px 0 0;
            margin-right: 5px;
            flex-shrink: 0;
        `,
    },
    link: {
        typographyProps: {
            color: "text.main",
        },
    },
};

export const socialLinksStyles = linkListStyles;

const GetIcon = (icon: string) => {
    switch (icon) {
        case icons.youtube:
            return Youtube;
        case icons.twitter:
            return Twitter;
        case icons.facebook:
            return Facebook;
        case icons.instagram:
            return Instagram;
        case icons.linkedin:
            return Linkedin;
        case icons.notebook:
            return FileText;
        case icons.rss:
            return Rss;
        case icons.user:
            return User;
        case icons.video:
            return Video;
        case icons.camera:
            return Camera;
        default:
            break;
    }

    return "";
};

export const SocialLinks: FC<OwnProps> = ({ fields }) => {
    const links = useGetLinks(fields.links, o => o.fields.destination);

    const styles = useMergeStyles("socialLinks", linkListStyles);

    const socialLinkListStyle = css`
        ${fields.direction === "horizontal" ? "flex-direction: row;" : "flex-direction: column;"}
        ${fields.backgroundColor && `background-color: ${fields.backgroundColor};`}
        ${styles.socialLinkListWrapper?.css}
    `;

    const linkWrapperStyle = css`
        ${fields.direction === "horizontal" && `flex-basis: calc(${100 / fields.linksPerRow}% - 20px);`}
        ${fields.direction === "horizontal" && fields.linksPerRow > links.length ? "flex-grow: 1;" : "flex-grow: 0;"}
        ${styles.linkWrapper?.css}
    `;

    const showIcon = fields.visibilityState === visibilityState.both || fields.visibilityState === visibilityState.icon;
    const showLabel =
        fields.visibilityState === visibilityState.both || fields.visibilityState === visibilityState.label;

    return (
        <StyledWrapper css={socialLinkListStyle}>
            {links.map((link, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <StyledWrapper css={linkWrapperStyle} key={index}>
                    {link.url && (
                        <Link
                            {...styles.link}
                            href={link.url}
                            target={fields.links[index].fields.openInNewWindow ? "_blank" : ""}
                            icon={{
                                iconProps: {
                                    size: fields.iconSize,
                                    color: fields.iconColor,
                                    css: css`
                                        margin: 5px;
                                    `,
                                    src: showIcon ? GetIcon(fields.links[index].fields.icon) : undefined,
                                },
                                position: fields.alignment,
                            }}
                        >
                            {showLabel && link.title}
                        </Link>
                    )}
                </StyledWrapper>
            ))}
        </StyledWrapper>
    );
};

const contentTab = {
    displayName: "Content",
    sortOrder: 1,
};
const settingsTab = {
    displayName: "Settings",
    sortOrder: 2,
};

const definition: WidgetDefinition = {
    group: "Basic",
    icon: "Link",
    isSystem: true,
    fieldDefinitions: [
        {
            name: fields.links,
            editorTemplate: "ListField",
            tab: contentTab,
            getDisplay: (item: HasFields) => {
                return item.fields.title;
            },
            defaultValue: [],
            fieldType: "Translatable",
            fieldDefinitions: [
                {
                    name: "title",
                    editorTemplate: "TextField",
                    defaultValue: "",
                },
                {
                    name: "icon",
                    displayName: "Select Icon",
                    editorTemplate: "DropDownField",
                    options: [
                        { displayName: "Instagram", value: icons.instagram },
                        { displayName: "Youtube", value: icons.youtube },
                        { displayName: "Facebook", value: icons.facebook },
                        { displayName: "Twitter", value: icons.twitter },
                        { displayName: "Rss", value: icons.rss },
                        { displayName: "User", value: icons.user },
                        { displayName: "Linkedin", value: icons.linkedin },
                        { displayName: "Camera", value: icons.camera },
                        { displayName: "Video", value: icons.video },
                        { displayName: "Notebook", value: icons.notebook },
                    ],
                    defaultValue: "",
                },
                {
                    name: "destination",
                    editorTemplate: "LinkField",
                    defaultValue: {
                        value: "",
                        type: "Url",
                    },
                    isRequired: true,
                },
                {
                    name: "openInNewWindow",
                    editorTemplate: "CheckboxField",
                    defaultValue: false,
                },
            ],
        },
        {
            name: fields.direction,
            displayName: "Display",
            editorTemplate: "RadioButtonsField",
            defaultValue: "horizontal",
            fieldType: "General",
            tab: settingsTab,
            sortOrder: 1,
            options: [
                {
                    displayName: "Column",
                    value: "vertical",
                },
                {
                    displayName: "Row",
                    value: "horizontal",
                },
            ],
        },
        {
            name: fields.alignment,
            displayName: "Text Position",
            editorTemplate: "RadioButtonsField",
            defaultValue: "left",
            fieldType: "General",
            tab: settingsTab,
            sortOrder: 2,
            options: [
                {
                    displayName: "Left of icon",
                    value: "left",
                },
                {
                    displayName: "Right of icon",
                    value: "right",
                },
            ],
        },
        {
            name: fields.visibilityState,
            displayName: "Visibility",
            editorTemplate: "RadioButtonsField",
            tab: settingsTab,
            options: [
                {
                    displayName: "Show Both",
                    value: visibilityState.both,
                },
                {
                    displayName: "Show Label Only",
                    value: visibilityState.label,
                },
                {
                    displayName: "Show Icon Only",
                    value: visibilityState.icon,
                },
            ],
            defaultValue: visibilityState.both,
            fieldType: "General",
            sortOrder: 4,
        },
        {
            name: fields.iconSize,
            displayName: "Icon Size",
            editorTemplate: "IntegerField",
            defaultValue: 30,
            min: 1,
            fieldType: "General",
            sortOrder: 3,
            tab: settingsTab,
        },
        {
            name: fields.linksPerRow,
            displayName: "Icons Per Row",
            fieldType: "General",
            editorTemplate: "DropDownField",
            options: [
                { value: 1 },
                { value: 2 },
                { value: 3 },
                { value: 4 },
                { value: 5 },
                { value: 6 },
                { value: 7 },
                { value: 8 },
            ],
            sortOrder: 3,
            defaultValue: 8,
            isVisible: (item?: HasFields) => {
                return item?.fields.direction === "horizontal";
            },
            tab: settingsTab,
        },
        {
            name: fields.iconColor,
            displayName: "Icon Color",
            editorTemplate: "ColorPickerField",
            defaultValue: "",
            fieldType: "General",
            sortOrder: 5,
            tab: settingsTab,
        },
        {
            name: fields.backgroundColor,
            displayName: "Background Color",
            editorTemplate: "ColorPickerField",
            defaultValue: "",
            fieldType: "General",
            sortOrder: 6,
            tab: settingsTab,
        },
    ],
};

const widgetModule: WidgetModule = {
    component: SocialLinks,
    definition,
};

export default widgetModule;
