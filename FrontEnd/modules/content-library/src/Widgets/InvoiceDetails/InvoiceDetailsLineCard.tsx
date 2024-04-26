import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { getIsShareEntity } from "@insite/client-framework/ServerSideRendering";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import { InvoiceLineModel } from "@insite/client-framework/Types/ApiModels";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    invoiceLine: InvoiceLineModel;
    extendedStyles?: InvoiceDetailsLineCardStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    enableVat: getSettingsCollection(state).productSettings.enableVat,
    vatPriceDisplay: getSettingsCollection(state).productSettings.vatPriceDisplay,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface InvoiceDetailsLineCardStyles {
    container?: GridContainerProps;
    imageItem?: GridItemProps;
    imageLink?: LinkPresentationProps;
    image?: LazyImageProps;
    infoItem?: GridItemProps;
    infoInnerContainer?: GridContainerProps;
    infoLeftColumn?: GridItemProps;
    infoLeftColumnContainer?: GridContainerProps;
    brandItem?: GridItemProps;
    brandStyles?: ProductBrandStyles;
    productNameItem?: GridItemProps;
    productNameLink?: LinkPresentationProps;
    numbersItem?: GridItemProps;
    numbersInnerContainer?: GridContainerProps;
    partItem?: GridItemProps;
    partStyles?: SmallHeadingAndTextStyles;
    myPartItem?: GridItemProps;
    myPartStyles?: SmallHeadingAndTextStyles;
    mgfItem?: GridItemProps;
    mgfGridContainer?: GridContainerProps;
    mgfStyles?: SmallHeadingAndTextStyles;
    notesItem?: GridItemProps;
    notesStyles?: SmallHeadingAndTextStyles;
    infoRightColumn?: GridItemProps;
    infoRightColumnContainer?: GridContainerProps;
    priceItem?: GridItemProps;
    priceStyles?: SmallHeadingAndTextStyles;
    qtyItem?: GridItemProps;
    qtyStyles?: SmallHeadingAndTextStyles;
    totalItem?: GridItemProps;
    totalStyles?: SmallHeadingAndTextStyles;
    subtotalWithoutVatHeadingAndText?: SmallHeadingAndTextStyles;
    vatLabelText?: TypographyPresentationProps;
    secondaryPriceText?: TypographyPresentationProps;
    secondaryVatLabelText?: TypographyPresentationProps;
    productDescriptionText?: TypographyPresentationProps;
}

export const cardStyles: InvoiceDetailsLineCardStyles = {
    imageItem: {
        width: 2,
        css: css`
            @media print {
                max-height: 83px;
                max-width: 83px;
            }
        `,
    },
    image: {
        height: "auto",
    },
    infoItem: {
        width: 10,
    },
    infoInnerContainer: {
        gap: 8,
    },
    infoLeftColumn: {
        width: [12, 12, 10, 7, 7],
        printWidth: 7,
    },
    infoLeftColumnContainer: {
        gap: 8,
    },
    brandItem: {
        width: 12,
    },
    brandStyles: {
        nameText: {
            css: css`
                color: ${getColor("text.main")};
            `,
        },
    },
    productNameItem: {
        width: 12,
    },
    numbersItem: {
        width: 12,
    },
    numbersInnerContainer: {
        gap: 8,
    },
    partItem: {
        width: [6, 6, 4, 4, 4],
        printWidth: 4,
    },
    myPartItem: {
        width: [6, 6, 4, 4, 4],
        printWidth: 4,
    },
    mgfItem: {
        width: [6, 6, 4, 4, 4],
        printWidth: 4,
    },
    notesItem: {
        width: 12,
    },
    infoRightColumn: {
        width: [12, 12, 2, 5, 5],
        printWidth: 5,
    },
    infoRightColumnContainer: {
        gap: 8,
    },
    priceItem: {
        width: [6, 6, 12, 5, 5],
        printWidth: 5,
        css: css`
            flex-direction: column;
        `,
    },
    priceStyles: {
        text: {
            weight: "bold",
        },
    },
    vatLabelText: {
        size: 12,
    },
    secondaryVatLabelText: {
        size: 12,
    },
    qtyItem: {
        width: [6, 6, 12, 3, 3],
        printWidth: 3,
    },
    totalItem: {
        width: [12, 12, 12, 4, 4],
        printWidth: 4,
        css: css`
            font-weight: 600;
            flex-direction: column;
        `,
    },
    productNameLink: {
        css: css`
            white-space: nowrap;
        `,
    },
    mgfGridContainer: {
        css: css`
            padding: 4px;
        `,
    },
};

const InvoiceDetailsLineCard = ({ invoiceLine, enableVat, vatPriceDisplay, extendedStyles }: Props) => {
    const [styles] = React.useState(() => mergeToNew(cardStyles, extendedStyles));

    const isShareEntity = getIsShareEntity();

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.imageItem}>
                <Link href={invoiceLine.productUri} {...styles.imageLink}>
                    <LazyImage src={invoiceLine.mediumImagePath} {...styles.image} isShareEntity={isShareEntity} />
                </Link>
            </GridItem>
            <GridItem {...styles.infoItem}>
                <GridContainer {...styles.infoInnerContainer}>
                    <GridItem {...styles.infoLeftColumn}>
                        <GridContainer {...styles.infoLeftColumnContainer}>
                            {invoiceLine.brand && (
                                <GridItem {...styles.brandItem} data-test-selector="invoiceLine_brand">
                                    <ProductBrand
                                        brand={invoiceLine.brand}
                                        showLogo={false}
                                        extendedStyles={styles.brandStyles}
                                    />
                                </GridItem>
                            )}
                            <GridItem {...styles.productNameItem}>
                                {invoiceLine.productUri && (
                                    <Link
                                        {...styles.productNameLink}
                                        href={invoiceLine.productUri}
                                        data-test-selector="invoiceLine_product"
                                    >
                                        {invoiceLine.shortDescription || invoiceLine.description}
                                    </Link>
                                )}
                                {!invoiceLine.productUri && (
                                    <Typography
                                        as="p"
                                        data-test-selector="invoiceLine_product"
                                        {...styles.productDescriptionText}
                                    >
                                        {invoiceLine.shortDescription || invoiceLine.description}
                                    </Typography>
                                )}
                            </GridItem>
                            <GridItem {...styles.numbersItem}>
                                <GridContainer {...styles.numbersInnerContainer}>
                                    <GridItem {...styles.partItem}>
                                        <SmallHeadingAndText
                                            heading={translate("Part #")}
                                            text={invoiceLine.productERPNumber}
                                            extendedStyles={styles.partStyles}
                                        />
                                    </GridItem>
                                    <GridItem {...styles.myPartItem}>
                                        <SmallHeadingAndText
                                            heading={translate("My Part #")}
                                            text={invoiceLine.customerProductNumber}
                                            extendedStyles={styles.myPartStyles}
                                        />
                                    </GridItem>
                                    <GridContainer {...styles.mgfGridContainer}>
                                        <GridItem {...styles.mgfItem}>
                                            <SmallHeadingAndText
                                                heading={translate("MFG #")}
                                                text={invoiceLine.manufacturerItem}
                                                extendedStyles={styles.mgfStyles}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                </GridContainer>
                            </GridItem>
                            {invoiceLine.notes && (
                                <GridItem {...styles.notesItem}>
                                    <SmallHeadingAndText
                                        heading={translate("Line Notes")}
                                        text={invoiceLine.notes}
                                        extendedStyles={styles.notesStyles}
                                    />
                                </GridItem>
                            )}
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.infoRightColumn}>
                        <GridContainer {...styles.infoRightColumnContainer}>
                            <GridItem {...styles.priceItem}>
                                <SmallHeadingAndText
                                    heading={translate("Price")}
                                    text={
                                        (enableVat && vatPriceDisplay !== "DisplayWithoutVat"
                                            ? invoiceLine.unitPriceWithVatDisplay
                                            : invoiceLine.unitPriceDisplay) +
                                        (invoiceLine.unitOfMeasure ? ` / ${invoiceLine.unitOfMeasure}` : "")
                                    }
                                    extendedStyles={styles.priceStyles}
                                />
                                {enableVat && (
                                    <>
                                        <Typography as="p" {...styles.vatLabelText}>
                                            {vatPriceDisplay === "DisplayWithVat" ||
                                            vatPriceDisplay === "DisplayWithAndWithoutVat"
                                                ? `${translate("Inc. VAT")} (${invoiceLine.taxRate}%)`
                                                : translate("Ex. VAT")}
                                        </Typography>
                                        {vatPriceDisplay === "DisplayWithAndWithoutVat" && (
                                            <>
                                                <Typography {...styles.secondaryPriceText} as="p">
                                                    {invoiceLine.unitPriceDisplay +
                                                        (invoiceLine.unitOfMeasure
                                                            ? ` / ${invoiceLine.unitOfMeasure}`
                                                            : "")}
                                                </Typography>
                                                <Typography as="p" {...styles.secondaryVatLabelText}>
                                                    {translate("Ex. VAT")}
                                                </Typography>
                                            </>
                                        )}
                                    </>
                                )}
                            </GridItem>
                            <GridItem {...styles.qtyItem}>
                                <SmallHeadingAndText
                                    heading={translate("QTY Invoiced")}
                                    text={invoiceLine.qtyInvoiced}
                                    extendedStyles={styles.qtyStyles}
                                />
                            </GridItem>
                            <GridItem {...styles.totalItem}>
                                {enableVat && vatPriceDisplay === "DisplayWithAndWithoutVat" && (
                                    <SmallHeadingAndText
                                        heading={`${translate("Subtotal")} (${translate("Ex. VAT")})`}
                                        text={invoiceLine.lineTotalDisplay}
                                        extendedStyles={styles.subtotalWithoutVatHeadingAndText}
                                    />
                                )}
                                <SmallHeadingAndText
                                    heading={
                                        !enableVat
                                            ? translate("Subtotal")
                                            : vatPriceDisplay !== "DisplayWithoutVat"
                                            ? `${translate("Subtotal")} (${translate("Inc. VAT")})`
                                            : `${translate("Subtotal")} (${translate("Ex. VAT")})`
                                    }
                                    text={
                                        enableVat && vatPriceDisplay !== "DisplayWithoutVat"
                                            ? invoiceLine.netPriceWithVatDisplay
                                            : invoiceLine.lineTotalDisplay
                                    }
                                    extendedStyles={styles.totalStyles}
                                />
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps)(InvoiceDetailsLineCard);
