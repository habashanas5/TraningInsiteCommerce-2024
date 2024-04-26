import useAccessibleSubmit from "@insite/client-framework/Common/Hooks/useAccessibleSubmit";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setQtyOrdered from "@insite/client-framework/Store/Pages/RfqJobQuoteDetails/Handlers/SetQtyOrdered";
import translate from "@insite/client-framework/Translate";
import { JobQuoteLineModel } from "@insite/client-framework/Types/ApiModels";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    jobQuoteLine: JobQuoteLineModel;
    isEditable: boolean;
    showLineNotes: boolean;
    currencySymbol: string;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    qtyOrdered: state.pages.rfqJobQuoteDetails.qtyOrderedByJobQuoteLineId[ownProps.jobQuoteLine.id] ?? 0,
});

const mapDispatchToProps = {
    setQtyOrdered,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RfqJobQuoteDetailsProductCardStyles {
    container?: GridContainerProps;
    productImageGridItem?: GridItemProps;
    productImage?: ProductImageStyles;
    quoteLineInfoGridItem?: GridItemProps;
    quoteLineInfoContainer?: GridContainerProps;
    infoGridItem?: GridItemProps;
    infoContainer?: GridContainerProps;
    productBrandAndDescriptionGridItem?: GridItemProps;
    productBrand?: ProductBrandStyles;
    productDescription?: ProductDescriptionStyles;
    productPartNumbers?: ProductPartNumbersStyles;
    productPrice?: ProductPriceStyles;
    quantitiesGridItem?: GridItemProps;
    quantitiesContainer?: GridContainerProps;
    jobQuantityGridItem?: GridItemProps;
    jobQuantityHeadingAndText?: SmallHeadingAndTextStyles;
    purchasedQuantityGridItem?: GridItemProps;
    purchasedQuantityHeadingAndText?: SmallHeadingAndTextStyles;
    quantityRemainingGridItem?: GridItemProps;
    quantityRemainingHeadingAndText?: SmallHeadingAndTextStyles;
    qtyOrderedGridItem?: GridItemProps;
    qtyOrderedTextField?: TextFieldPresentationProps;
    notesGridItem?: GridItemProps;
    toggleNotesLink?: LinkPresentationProps;
    notesText?: TypographyPresentationProps;
}

export const rfqJobQuoteDetailsProductCardStyles: RfqJobQuoteDetailsProductCardStyles = {
    container: {
        gap: 20,
        css: css`
            border-bottom: 1px solid ${getColor("common.border")};
            padding: 1rem 0;
        `,
    },
    productImageGridItem: {
        width: 2,
    },
    quoteLineInfoGridItem: {
        width: 10,
    },
    quoteLineInfoContainer: {
        gap: 20,
    },
    infoGridItem: {
        width: [12, 12, 12, 5, 6],
    },
    infoContainer: {
        gap: 20,
    },
    productBrandAndDescriptionGridItem: {
        css: css`
            flex-direction: column;
        `,
        width: 12,
    },
    productBrand: {
        nameText: {
            color: "text.main",
        },
    },
    productPrice: {
        wrapper: {
            css: css`
                margin-top: 10px;
            `,
        },
        price: {
            priceText: { size: 18 },
            unitOfMeasureText: { size: 18 },
        },
        savingsMessageText: { size: 14 },
    },
    quantitiesGridItem: {
        width: [12, 12, 12, 7, 6],
        css: css`
            flex-direction: column;
        `,
    },
    quantitiesContainer: {
        gap: 20,
    },
    jobQuantityGridItem: {
        width: [6, 6, 3, 3, 3],
    },
    purchasedQuantityGridItem: {
        width: [6, 6, 3, 3, 3],
    },
    quantityRemainingGridItem: {
        width: [6, 6, 3, 3, 3],
    },
    qtyOrderedGridItem: {
        width: [6, 6, 3, 3, 3],
    },
    notesGridItem: {
        width: 12,
    },
    toggleNotesLink: {
        css: css`
            margin-bottom: 10px;
        `,
    },
};

const styles = rfqJobQuoteDetailsProductCardStyles;

const RfqJobQuoteDetailsProductCard = ({
    jobQuoteLine,
    isEditable,
    showLineNotes,
    currencySymbol,
    qtyOrdered,
    setQtyOrdered,
}: Props) => {
    const qtyOrderedSubmitHandler = (value: string) => {
        const inputQty = Number.parseInt(value, 10);

        setQtyOrdered({
            jobQuoteLineId: jobQuoteLine.id,
            qtyOrdered: Number.isNaN(inputQty) ? 0 : inputQty,
        });
    };

    const {
        value: localOrderQuantity,
        changeHandler: qtyOrderedChangeHandler,
        keyDownHandler: qtyOrderedKeyDownHandler,
        blurHandler: qtyOrderedBlurHandler,
    } = useAccessibleSubmit(qtyOrdered.toString(), qtyOrderedSubmitHandler);

    const [showNotes, setShowNotes] = useState(false);
    const toggleNotesClickHandler = () => {
        setShowNotes(!showNotes);
    };

    const toggleNotesHeading = showNotes ? translate("Hide Line Notes") : translate("Show Line Notes");
    const exceedsQtyRemainingError = translate("Order quantity exceeds quantity remaining");
    const qtyRemaining = jobQuoteLine.qtyOrdered! - (jobQuoteLine.qtySold || 0);

    return (
        <GridContainer
            {...styles.container}
            data-test-selector={`jobQuoteLine_${jobQuoteLine.productId}_${jobQuoteLine.unitOfMeasure}`}
        >
            <GridItem {...styles.productImageGridItem}>
                <ProductImage product={jobQuoteLine} extendedStyles={styles.productImage} />
            </GridItem>
            <GridItem {...styles.quoteLineInfoGridItem}>
                <GridContainer {...styles.quoteLineInfoContainer}>
                    <GridItem {...styles.infoGridItem}>
                        <GridContainer {...styles.infoContainer}>
                            <GridItem {...styles.productBrandAndDescriptionGridItem}>
                                {jobQuoteLine.brand && (
                                    <ProductBrand brand={jobQuoteLine.brand} extendedStyles={styles.productBrand} />
                                )}
                                <ProductDescription product={jobQuoteLine} extendedStyles={styles.productDescription} />
                                <ProductPartNumbers
                                    productNumber={jobQuoteLine.erpNumber}
                                    customerProductNumber={jobQuoteLine.customerName}
                                    manufacturerItem={jobQuoteLine.manufacturerItem}
                                    extendedStyles={styles.productPartNumbers}
                                />
                                <ProductPrice
                                    product={jobQuoteLine}
                                    currencySymbol={currencySymbol}
                                    showLabel={false}
                                    extendedStyles={styles.productPrice}
                                />
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.quantitiesGridItem}>
                        <GridContainer {...styles.quantitiesContainer}>
                            <GridItem {...styles.jobQuantityGridItem}>
                                <SmallHeadingAndText
                                    heading={translate("Job QTY")}
                                    text={jobQuoteLine.qtyOrdered!}
                                    extendedStyles={styles.jobQuantityHeadingAndText}
                                />
                            </GridItem>
                            <GridItem {...styles.purchasedQuantityGridItem}>
                                <SmallHeadingAndText
                                    heading={translate("Purchased QTY")}
                                    text={jobQuoteLine.qtySold}
                                    extendedStyles={styles.purchasedQuantityHeadingAndText}
                                />
                            </GridItem>
                            <GridItem {...styles.quantityRemainingGridItem}>
                                <SmallHeadingAndText
                                    heading={translate("QTY Remaining")}
                                    text={qtyRemaining}
                                    extendedStyles={styles.quantityRemainingHeadingAndText}
                                />
                            </GridItem>
                            <GridItem {...styles.qtyOrderedGridItem}>
                                {isEditable && (
                                    <TextField
                                        {...styles.qtyOrderedTextField}
                                        type="number"
                                        min={0}
                                        max={qtyRemaining}
                                        label={translate("Order QTY")}
                                        value={localOrderQuantity}
                                        disabled={qtyRemaining <= 0}
                                        error={qtyOrdered > qtyRemaining ? exceedsQtyRemainingError : undefined}
                                        onChange={qtyOrderedChangeHandler}
                                        onKeyDown={qtyOrderedKeyDownHandler}
                                        onBlur={qtyOrderedBlurHandler}
                                    />
                                )}
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    {showLineNotes && !jobQuoteLine.isPromotionItem && (
                        <GridItem {...styles.notesGridItem}>
                            {jobQuoteLine.notes && (
                                <Link {...styles.toggleNotesLink} onClick={toggleNotesClickHandler}>
                                    {toggleNotesHeading}
                                </Link>
                            )}
                            {showNotes && <Typography {...styles.notesText}>{jobQuoteLine.notes}</Typography>}
                        </GridItem>
                    )}
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(RfqJobQuoteDetailsProductCard));
