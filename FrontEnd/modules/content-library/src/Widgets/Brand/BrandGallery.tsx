import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getBrandsDataView } from "@insite/client-framework/Store/Data/Brands/BrandsSelectors";
import loadBrands from "@insite/client-framework/Store/Data/Brands/Handlers/LoadBrands";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import SkipNav, { SkipNavStyles } from "@insite/content-library/Components/SkipNav";
import { BrandsPageContext } from "@insite/content-library/Pages/BrandsPage";
import { HomePageContext } from "@insite/content-library/Pages/HomePage";
import FlexItem, { FlexItemProps } from "@insite/content-library/Widgets/Brand/FlexItem";
import FlexWrapContainer, { FlexWrapContainerProps } from "@insite/content-library/Widgets/Brand/FlexWrapContainer";
import Clickable from "@insite/mobius/Clickable";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import { LinkProps } from "@insite/mobius/Link";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    title = "title",
    brandsToDisplay = "brandsToDisplay",
    numberOfBrandsToDisplay = "numberOfBrandsToDisplay",
    brandsSelected = "brandsSelected",
    maximumNumberOfBrandsPerRow = "maximumNumberOfBrandsPerRow",
    maximumBrandImageHeight = "maximumBrandImageHeight",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.title]: string;
        [fields.brandsToDisplay]: "random" | "select-brands";
        [fields.numberOfBrandsToDisplay]: string;
        [fields.brandsSelected]: string[];
        [fields.maximumNumberOfBrandsPerRow]: string;
        [fields.maximumBrandImageHeight]: number;
    };
}

const mapStateToProps = (state: ApplicationState, props: OwnProps) => {
    const brandGalleryParameter = {
        brandIds: props.fields.brandsSelected,
        randomize: props.fields.brandsToDisplay === "random",
        pageSize: parseInt(props.fields.numberOfBrandsToDisplay || "0", 10),
        select: "id,detailPagePath,logoSmallImagePath,logoAltText",
    };
    const brandsState = getBrandsDataView(state, brandGalleryParameter);
    const shouldLoadBrandGallery = !brandsState.isLoading && !brandsState.value;

    return {
        brandsState,
        shouldLoadBrandGallery,
        brandGalleryParameter,
    };
};

const mapDispatchToProps = {
    loadBrandGallery: loadBrands,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface BrandListStyles {
    titleText?: TypographyProps;
    container?: InjectableCss;
    imageContainer?: FlexWrapContainerProps;
    imageItem?: FlexItemProps;
    link?: LinkProps;
    image?: LazyImageProps;
    skipToContent?: SkipNavStyles;
}

export const listStyles: BrandListStyles = {
    titleText: {
        variant: "h3",
        transform: "inherit",
        css: css`
            border-width: 20px;
            text-align: center;
        `,
    },
    imageItem: {
        css: css`
            padding: 5px;
            justify-content: center;
        `,
    },
};

const styles = listStyles;

class BrandGallery extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const { loadBrandGallery, shouldLoadBrandGallery, brandGalleryParameter } = this.props;
        if (shouldLoadBrandGallery) {
            loadBrandGallery(brandGalleryParameter);
        }
    }

    render() {
        const {
            brandsState: { isLoading, value: brandList },
            fields,
        } = this.props;

        if (isLoading || !brandList) {
            return null;
        }

        const desktop = parseInt(fields.maximumNumberOfBrandsPerRow, 10);
        const tablet = Math.ceil(desktop / 2);
        const mobile = Math.ceil(tablet / 2);

        const imgProps = {
            style: {
                width: "auto",
                maxWidth: "100%",
                maxHeight: `${fields.maximumBrandImageHeight}px`,
            },
        };

        return (
            <StyledWrapper {...styles.container} data-test-selector="brandGallery">
                <VisuallyHidden as="h1">{translate("Explore available brands")}</VisuallyHidden>
                {this.props.fields.title && (
                    <Typography variant="headerSecondary" {...styles.titleText} data-test-selector="brandGalleryTitle">
                        {this.props.fields.title}
                    </Typography>
                )}
                <FlexWrapContainer {...styles.imageContainer}>
                    {brandList.map(brand => {
                        if (brand === brandList[0]) {
                            const focusFunction = () => {
                                const elementToFocus = document.getElementById("collapseButton");
                                if (elementToFocus) {
                                    elementToFocus.focus();
                                } else {
                                    document.getElementById("expandButton")?.focus();
                                }
                            };
                            return (
                                <FlexItem
                                    key={brand.id}
                                    flexColumns={[mobile, tablet, tablet, desktop, desktop]}
                                    {...styles.imageItem}
                                >
                                    <SkipNav
                                        extendedStyles={styles.skipToContent}
                                        text={translate("Skip to full brand list")}
                                        focusFunction={focusFunction}
                                    />
                                    <Clickable href={brand.detailPagePath} {...styles.link}>
                                        <LazyImage
                                            imgProps={imgProps}
                                            {...styles.image}
                                            src={brand.logoSmallImagePath}
                                            altText={
                                                brand.logoAltText
                                                    ? `${translate("Go to brand page")} ${brand.logoAltText}`
                                                    : `${translate("Go to brand page")} ${brand.name}`
                                            }
                                        />
                                    </Clickable>
                                </FlexItem>
                            );
                        }
                        return (
                            <FlexItem
                                key={brand.id}
                                flexColumns={[mobile, tablet, tablet, desktop, desktop]}
                                {...styles.imageItem}
                            >
                                <Clickable href={brand.detailPagePath} {...styles.link}>
                                    <LazyImage
                                        imgProps={imgProps}
                                        {...styles.image}
                                        src={brand.logoSmallImagePath}
                                        altText={
                                            brand.logoAltText
                                                ? `${translate("Go to brand page")} ${brand.logoAltText}`
                                                : `${translate("Go to brand page")} ${brand.name}`
                                        }
                                    />
                                </Clickable>
                            </FlexItem>
                        );
                    })}
                </FlexWrapContainer>
            </StyledWrapper>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(BrandGallery),
    definition: {
        group: "Brands",
        icon: "Image",
        displayName: "Brand Gallery",
        allowedContexts: [BrandsPageContext, HomePageContext],
        fieldDefinitions: [
            {
                name: fields.title,
                displayName: "Title",
                editorTemplate: "TextField",
                defaultValue: "",
                fieldType: "Translatable",
            },
            {
                name: fields.brandsToDisplay,
                displayName: "Brands to display",
                editorTemplate: "RadioButtonsField",
                options: [
                    {
                        displayName: "Random",
                        value: "random",
                    },
                    {
                        displayName: "Select brands",
                        value: "select-brands",
                    },
                ],
                defaultValue: "random",
                fieldType: "General",
                tooltip:
                    "Brand logos can be picked at random on page load, or you can select specific brands to display.",
            },
            {
                name: fields.numberOfBrandsToDisplay,
                displayName: "Number of brands to display",
                editorTemplate: "DropDownField",
                defaultValue: "12",
                options: [
                    { displayName: "1", value: "1" },
                    { displayName: "2", value: "2" },
                    { displayName: "3", value: "3" },
                    { displayName: "4", value: "4" },
                    { displayName: "5", value: "5" },
                    { displayName: "6", value: "6" },
                    { displayName: "7", value: "7" },
                    { displayName: "8", value: "8" },
                    { displayName: "9", value: "9" },
                    { displayName: "10", value: "10" },
                    { displayName: "11", value: "11" },
                    { displayName: "12", value: "12" },
                    { displayName: "13", value: "13" },
                    { displayName: "14", value: "14" },
                    { displayName: "15", value: "15" },
                    { displayName: "16", value: "16" },
                    { displayName: "17", value: "17" },
                    { displayName: "18", value: "18" },
                ],
                fieldType: "General",
                isVisible: item => item.fields.brandsToDisplay === "random",
            },
            {
                name: fields.brandsSelected,
                displayName: "Select brands",
                editorTemplate: "SelectBrandsField",
                isVisible: item => item.fields.brandsToDisplay === "select-brands",
                defaultValue: [],
                fieldType: "General",
            },
            {
                name: fields.maximumNumberOfBrandsPerRow,
                displayName: "Maximum brands per row",
                editorTemplate: "DropDownField",
                defaultValue: "6",
                options: [
                    { displayName: "1", value: "1" },
                    { displayName: "2", value: "2" },
                    { displayName: "3", value: "3" },
                    { displayName: "4", value: "4" },
                    { displayName: "5", value: "5" },
                    { displayName: "6", value: "6" },
                ],
                fieldType: "General",
                tooltip:
                    "Up to 6 brands can display per row. This number should be adjusted based on the number of brands you choose to display. For example, if you display 10 brands you likely want 5 to display per row. Logos will also stack responsively for smaller screen sizes.",
            },
            {
                name: fields.maximumBrandImageHeight,
                displayName: "Maximum brand image height",
                editorTemplate: "IntegerField",
                defaultValue: 100,
                fieldType: "General",
                tooltip:
                    "By default, images will scale to meet the width of the screen for the number of brands to display per row. The maximum height value can be used to scale brand logos to be smaller. Default value is 100 pixels.",
            },
        ],
    },
};

export default widgetModule;
