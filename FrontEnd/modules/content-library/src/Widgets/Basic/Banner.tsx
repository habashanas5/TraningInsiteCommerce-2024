import { getFocalPointStyles, parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { responsiveStyleRules } from "@insite/client-framework/Common/Utilities/responsive";
import { useShellContext } from "@insite/client-framework/Components/IsInShell";
import { useGetLink } from "@insite/client-framework/Store/Links/LinksSelectors";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { LinkPresentationProps } from "@insite/mobius/Link";
import Typography from "@insite/mobius/Typography";
import { useHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import parse from "html-react-parser";
import React, { FC } from "react";
import { css } from "styled-components";

const enum fields {
    background = "background",
    image = "image",
    focalPoint = "focalPoint",
    backgroundColor = "backgroundColor",
    heading = "heading",
    minimumHeight = "minimumHeight",
    subheading = "subheading",
    buttonLabel = "buttonLabel",
    buttonLink = "buttonLink",
    buttonVariant = "variant",
    bannerWidth = "bannerWidth",
    imageOverlay = "imageOverlay",
    partialOverlay = "partialOverlay",
    partialOverlayPositioning = "partialOverlayPositioning",
    disableButton = "disableButton",
    contentPadding = "contentPadding",
    centerTextVertically = "centerTextVertically",
    responsiveFontSizes = "responsiveFontSizes",
    customFontSizes = "customFontSizes",
    h1FontSize = "h1FontSize",
    h2FontSize = "h2FontSize",
    h3FontSize = "h3FontSize",
    h4FontSize = "h4FontSize",
    h5FontSize = "h5FontSize",
    h6FontSize = "h6FontSize",
    normalFontSize = "normalFontSize",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.background]: "image" | "color";
        [fields.image]: string;
        [fields.focalPoint]:
            | "topLeft"
            | "topCenter"
            | "topRight"
            | "centerLeft"
            | "center"
            | "centerRight"
            | "bottomLeft"
            | "bottomCenter"
            | "bottomRight";
        [fields.backgroundColor]: string;
        [fields.heading]: string;
        [fields.minimumHeight]: "1/4 viewport" | "1/2 viewport" | "3/4 viewport" | "fullViewport";
        [fields.subheading]: string;
        [fields.buttonLabel]: string;
        [fields.buttonLink]: LinkFieldValue;
        [fields.buttonVariant]: "primary" | "secondary" | "tertiary";
        [fields.imageOverlay]: string;
        [fields.partialOverlay]: boolean;
        [fields.partialOverlayPositioning]: "top" | "middle" | "bottom";
        [fields.disableButton]: boolean;
        [fields.contentPadding]: number;
        [fields.centerTextVertically]: boolean;
        [fields.responsiveFontSizes]: boolean;
        [fields.customFontSizes]: boolean;
        [fields.h1FontSize]: number;
        [fields.h2FontSize]: number;
        [fields.h3FontSize]: number;
        [fields.h4FontSize]: number;
        [fields.h5FontSize]: number;
        [fields.normalFontSize]: number;
    };
    extendedStyles?: BannerStyles;
}

export interface BannerStyles {
    wrapper?: InjectableCss;
    overlayWrapper?: InjectableCss;
    /**
     * @deprecated Use the `bannerButton` property instead.
     */
    slideCenteringWrapperStyles?: InjectableCss;
    bannerLink?: LinkPresentationProps;
    bannerButton?: ButtonPresentationProps;
}

export const bannerStyles: BannerStyles = {
    wrapper: {
        css: css`
            width: 100%;
            display: flex;
        `,
    },
    overlayWrapper: {
        css: css`
            width: 100%;
            color: white;
            text-align: center;
        `,
    },
};

export const Banner: FC<OwnProps> = ({ fields, extendedStyles }) => {
    const { url, title } = useGetLink(fields.buttonLink);
    const history = useHistory();
    const { isInShell } = useShellContext();

    const onClick = () => {
        if (!url) {
            return;
        }

        if (url.startsWith("http")) {
            if (isInShell) {
                return;
            }

            window.location.href = url;
        } else {
            history.push(url);
        }
    };

    const backgroundStyles =
        fields.background === "image"
            ? `background-image: url(${fields.image});
           background-size: cover;`
            : `background-color: ${fields.backgroundColor};`;

    const focalPointStyles = getFocalPointStyles(fields.focalPoint);

    let minimumHeightStyles;
    switch (fields.minimumHeight) {
        case "1/4 viewport":
            minimumHeightStyles = "min-height: 25vh;";
            break;
        case "1/2 viewport":
            minimumHeightStyles = "min-height: 50vh;";
            break;
        case "3/4 viewport":
            minimumHeightStyles = "min-height: 75vh;";
            break;
        case "fullViewport":
            minimumHeightStyles = "min-height: 100vh;";
            break;
    }

    let overlayPositioningStyles;
    if (!fields.partialOverlay) {
        overlayPositioningStyles = "align-items: stretch;";
    } else if (fields.partialOverlayPositioning === "top") {
        overlayPositioningStyles = "align-items: flex-start;";
    } else if (fields.partialOverlayPositioning === "middle") {
        overlayPositioningStyles = "align-items: center;";
    } else if (fields.partialOverlayPositioning === "bottom") {
        overlayPositioningStyles = "align-items: flex-end;";
    }

    const styles = useMergeStyles("banner", bannerStyles, extendedStyles);

    let fontSizeStyles;
    if (fields.responsiveFontSizes || fields.customFontSizes) {
        fontSizeStyles = responsiveStyleRules(fields.responsiveFontSizes, fields.customFontSizes ? fields : undefined);
    }

    const wrapperStyles = {
        css: css`
            ${styles.wrapper?.css || ""}
            ${backgroundStyles}
            ${focalPointStyles}
            ${minimumHeightStyles}
            ${overlayPositioningStyles}
            ${fontSizeStyles}
        `,
    };

    const overlayWrapperStyles = {
        css: css`
            ${styles.overlayWrapper?.css || ""}
            background-color: ${fields.background === "image" ? fields.imageOverlay : ""};
            padding: ${fields.contentPadding}px;
            ${fields.centerTextVertically &&
            `
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;`}
        `,
    };

    return (
        <StyledWrapper {...wrapperStyles}>
            <StyledWrapper {...overlayWrapperStyles}>
                <StyledWrapper {...styles.slideCenteringWrapperStyles}>
                    <Typography>{parse(fields.heading, parserOptions)}</Typography>
                    <Typography>{parse(fields.subheading, parserOptions)}</Typography>
                    {!fields.disableButton && (
                        <Button {...styles.bannerButton} variant={fields.variant} onClick={onClick}>
                            {fields.buttonLabel || title || url}
                        </Button>
                    )}
                </StyledWrapper>
            </StyledWrapper>
        </StyledWrapper>
    );
};

const basicTab = {
    displayName: "Basic",
    sortOrder: 0,
};

const settingsTab = {
    displayName: "Settings",
    sortOrder: 1,
};

const banner: WidgetModule = {
    component: Banner,
    definition: {
        group: "Basic",
        icon: "Banner",
        fieldDefinitions: [
            {
                fieldType: "General",
                name: fields.background,
                displayName: "Background",
                editorTemplate: "DropDownField",
                options: [
                    { displayName: "Image", value: "image" },
                    { displayName: "Color", value: "color" },
                ],
                defaultValue: "image",
                hideEmptyOption: true,
                tab: basicTab,
            },
            {
                fieldType: "Translatable",
                name: fields.image,
                editorTemplate: "ImagePickerField",
                defaultValue: "",
                isVisible: widget => widget.fields.background === "image",
                tab: basicTab,
            },
            {
                fieldType: "General",
                name: fields.imageOverlay,
                displayName: "Image Color Overlay",
                editorTemplate: "ColorPickerField",
                defaultValue: "",
                isVisible: widget => widget.fields.background === "image",
                tab: basicTab,
            },
            {
                fieldType: "General",
                name: fields.partialOverlay,
                editorTemplate: "CheckboxField",
                defaultValue: false,
                tab: basicTab,
            },
            {
                fieldType: "General",
                name: fields.partialOverlayPositioning,
                editorTemplate: "DropDownField",
                options: [
                    { displayName: "Top", value: "top" },
                    { displayName: "Middle", value: "middle" },
                    { displayName: "Bottom", value: "bottom" },
                ],
                hideEmptyOption: true,
                defaultValue: "bottom",
                isVisible: widget => widget.fields.partialOverlay,
                tab: basicTab,
            },
            {
                fieldType: "General",
                name: fields.focalPoint,
                displayName: "Focal Point",
                editorTemplate: "DropDownField",
                options: [
                    { displayName: "Top Left", value: "topLeft" },
                    { displayName: "Top Center", value: "topCenter" },
                    { displayName: "Top Right", value: "topRight" },
                    { displayName: "Center Left", value: "centerLeft" },
                    { displayName: "Center", value: "center" },
                    { displayName: "Center Right", value: "centerRight" },
                    { displayName: "Bottom Left", value: "bottomLeft" },
                    { displayName: "Bottom Center", value: "bottomCenter" },
                    { displayName: "Bottom Right", value: "bottomRight" },
                ],
                defaultValue: "center",
                hideEmptyOption: true,
                isVisible: widget => widget.fields.background === "image",
                tab: basicTab,
            },
            {
                fieldType: "General",
                name: fields.backgroundColor,
                editorTemplate: "ColorPickerField",
                displayName: "Color",
                defaultValue: "black",
                isVisible: widget => widget.fields.background === "color",
                tab: basicTab,
            },
            {
                fieldType: "Translatable",
                name: fields.heading,
                editorTemplate: "RichTextField",
                displayName: "Heading",
                defaultValue: "",
                extendedConfig: { height: 100 },
                expandedToolbarButtons: {
                    moreMisc: {},
                    code: {},
                },
                tab: basicTab,
            },
            {
                fieldType: "Translatable",
                name: fields.subheading,
                editorTemplate: "RichTextField",
                displayName: "Subheading",
                defaultValue: "",
                extendedConfig: { height: 170 },
                expandedToolbarButtons: {
                    moreMisc: {},
                    code: {},
                },
                tab: basicTab,
            },
            {
                fieldType: "Translatable",
                name: fields.buttonLabel,
                editorTemplate: "TextField",
                displayName: "Button Label",
                defaultValue: "",
                tab: basicTab,
            },
            {
                fieldType: "General",
                name: fields.buttonLink,
                displayName: "Button Link",
                editorTemplate: "LinkField",
                defaultValue: { type: "Page", value: "" },
                tab: basicTab,
            },
            {
                name: fields.buttonVariant,
                displayName: "Button Variant",
                editorTemplate: "DropDownField",
                options: [
                    { displayName: "Primary", value: "primary" },
                    { displayName: "Secondary", value: "secondary" },
                    { displayName: "Tertiary", value: "tertiary" },
                ],
                hideEmptyOption: true,
                defaultValue: "primary",
                fieldType: "General",
                tab: basicTab,
            },
            {
                fieldType: "General",
                name: fields.minimumHeight,
                displayName: "Minimum Banner Height",
                editorTemplate: "DropDownField",
                options: [
                    { displayName: "1/4 Viewport", value: "1/4 viewport" },
                    { displayName: "1/2 Viewport", value: "1/2 viewport" },
                    { displayName: "3/4 Viewport", value: "3/4 viewport" },
                    { displayName: "Full Viewport", value: "fullViewport" },
                ],
                defaultValue: "1/4 viewport",
                hideEmptyOption: true,
                tab: basicTab,
            },
            {
                fieldType: "General",
                name: fields.disableButton,
                editorTemplate: "CheckboxField",
                defaultValue: false,
                tab: basicTab,
            },
            {
                name: fields.responsiveFontSizes,
                editorTemplate: "CheckboxField",
                fieldType: "General",
                tab: settingsTab,
                defaultValue: true,
            },
            {
                fieldType: "General",
                name: fields.contentPadding,
                editorTemplate: "IntegerField",
                defaultValue: 50,
                tab: basicTab,
            },
            {
                fieldType: "General",
                name: "centerTextVertically",
                editorTemplate: "CheckboxField",
                defaultValue: false,
                tab: basicTab,
            },
            {
                name: fields.customFontSizes,
                editorTemplate: "CheckboxField",
                fieldType: "General",
                tab: settingsTab,
                defaultValue: false,
            },
            {
                name: fields.normalFontSize,
                editorTemplate: "IntegerField",
                fieldType: "General",
                tab: settingsTab,
                min: 1,
                defaultValue: null,
                isVisible: item => item?.fields[fields.customFontSizes],
            },
            {
                name: fields.h1FontSize,
                editorTemplate: "IntegerField",
                fieldType: "General",
                tab: settingsTab,
                min: 1,
                defaultValue: 40,
                isVisible: item => item?.fields[fields.customFontSizes],
            },
            {
                name: fields.h2FontSize,
                editorTemplate: "IntegerField",
                fieldType: "General",
                tab: settingsTab,
                min: 1,
                defaultValue: 32,
                isVisible: item => item?.fields[fields.customFontSizes],
            },
            {
                name: fields.h3FontSize,
                editorTemplate: "IntegerField",
                fieldType: "General",
                tab: settingsTab,
                min: 1,
                defaultValue: null,
                isVisible: item => item?.fields[fields.customFontSizes],
            },
            {
                name: fields.h4FontSize,
                editorTemplate: "IntegerField",
                fieldType: "General",
                tab: settingsTab,
                min: 1,
                defaultValue: null,
                isVisible: item => item?.fields[fields.customFontSizes],
            },
            {
                name: fields.h5FontSize,
                editorTemplate: "IntegerField",
                fieldType: "General",
                tab: settingsTab,
                min: 1,
                defaultValue: null,
                isVisible: item => item?.fields[fields.customFontSizes],
            },
            {
                name: fields.h6FontSize,
                editorTemplate: "IntegerField",
                fieldType: "General",
                tab: settingsTab,
                min: 1,
                defaultValue: null,
                isVisible: item => item?.fields[fields.customFontSizes],
            },
        ],
    },
};

export default banner;
