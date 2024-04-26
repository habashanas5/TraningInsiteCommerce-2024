import useAccessibleSubmit from "@insite/client-framework/Common/Hooks/useAccessibleSubmit";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import updateQuoteLine from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/UpdateQuoteLine";
import translate from "@insite/client-framework/Translate";
import { QuoteLineModel, QuoteModel } from "@insite/client-framework/Types/ApiModels";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import RfqQuoteDetailsQuotedPricing, {
    RfqQuoteDetailsQuotedPricingStyles,
} from "@insite/content-library/Widgets/RfqQuoteDetails/RfqQuoteDetailsQuotedPricing";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { ChangeEvent, useContext, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    quote: QuoteModel;
    quoteLine: QuoteLineModel;
    extendedStyles?: RfqQuoteDetailsProposedDetailsGridItemStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    enableVat: getSettingsCollection(state).productSettings.enableVat,
    vatPriceDisplay: getSettingsCollection(state).productSettings.vatPriceDisplay,
});

const mapDispatchToProps = {
    updateQuoteLine,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RfqQuoteDetailsProposedDetailsGridItemStyles {
    container?: GridContainerProps;
    productImageGridItem?: GridItemProps;
    productImage?: ProductImageStyles;
    quoteLineInfoGridItem?: GridItemProps;
    quoteLineInfoContainer?: GridContainerProps;
    infoLeftColumn?: GridItemProps;
    infoLeftColumnContainer?: GridContainerProps;
    productBrandAndDescriptionGridItem?: GridItemProps;
    productBrand?: ProductBrandStyles;
    productDescription?: ProductDescriptionStyles;
    productPartNumbers?: ProductPartNumbersStyles;
    productPrice?: ProductPriceStyles;
    quotedPricingGridItem?: GridItemProps;
    quotedPricingText?: TypographyPresentationProps;
    quotedPricingStyles?: RfqQuoteDetailsQuotedPricingStyles;
    quantityAndSubtotalGridItem?: GridItemProps;
    quantityAndSubtotalContainer?: GridContainerProps;
    quantityGridItem?: GridItemProps;
    quantityTextField?: TextFieldPresentationProps;
    subtotalGridItem?: GridItemProps;
    subtotalText?: TypographyPresentationProps;
    vatLabelText?: TypographyPresentationProps;
    subtotalWithoutVatText?: TypographyPresentationProps;
    notesAndCostCodeGridItem?: GridItemProps;
    notesAndCostCodesContainer?: GridContainerProps;
    notesGridItem?: GridItemProps;
    toggleNotesLink?: LinkPresentationProps;
    notesTextArea?: TextAreaProps;
    costCodeGridItem?: GridItemProps;
    costCodeLabelText?: TypographyPresentationProps;
    costCodeSelect?: SelectPresentationProps;
    costCodeText?: TypographyPresentationProps;
}

export const rfqQuoteDetailsProposedDetailsGridItemStyles: RfqQuoteDetailsProposedDetailsGridItemStyles = {
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
    infoLeftColumn: {
        width: [12, 12, 6, 6, 5],
    },
    infoLeftColumnContainer: {
        gap: 20,
    },
    productBrandAndDescriptionGridItem: {
        css: css`
            flex-direction: column;
        `,
        width: 12,
    },
    productPrice: {
        wrapper: {
            css: css`
                margin-top: 10px;
            `,
        },
    },
    quotedPricingGridItem: {
        width: [12, 12, 6, 6, 5],
        css: css`
            flex-direction: column;
        `,
    },
    quotedPricingText: {
        weight: "bold",
    },
    quantityAndSubtotalGridItem: {
        width: [12, 12, 12, 12, 2],
    },
    quantityAndSubtotalContainer: {
        gap: 20,
    },
    quantityGridItem: {
        width: [6, 6, 6, 6, 12],
    },
    subtotalGridItem: {
        width: [6, 6, 6, 6, 12],
        align: "bottom",
        css: css`
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-end;
        `,
    },
    subtotalText: {
        weight: 700,
    },
    vatLabelText: {
        size: 12,
    },
    subtotalWithoutVatText: {
        weight: "bold",
        css: css`
            margin-top: 5px;
        `,
    },
    notesAndCostCodeGridItem: {
        width: 12,
    },
    notesAndCostCodesContainer: {
        gap: 20,
    },
    notesGridItem: {
        width: 6,
        css: css`
            flex-direction: column;
        `,
    },
    toggleNotesLink: {
        css: css`
            margin-bottom: 10px;
        `,
    },
    costCodeGridItem: {
        width: 6,
        css: css`
            flex-direction: column;
        `,
    },
    costCodeLabelText: {
        css: css`
            margin-bottom: 10px;
        `,
    },
    notesTextArea: {
        css: css`
            min-width: 100%;
            max-width: 100%;
            min-height: 50px;
        `,
    },
};

const styles = rfqQuoteDetailsProposedDetailsGridItemStyles;

const RfqQuoteDetailsProposedDetailsGridItem = ({
    quote,
    quoteLine,
    enableVat,
    vatPriceDisplay,
    updateQuoteLine,
}: Props) => {
    const toasterContext = useContext(ToasterContext);

    const qtyOrderedSubmitHandler = (value: string) => {
        const inputQty = Number.parseInt(value, 10);
        if (Number.isNaN(inputQty)) {
            return;
        }

        updateQuoteLine({
            quoteId: quote.id,
            quoteLineId: quoteLine.id,
            quoteLine: {
                ...quoteLine,
                qtyOrdered: inputQty,
            },
            onSuccess: () => {
                toasterContext.addToast({ body: translate("Quantity updated"), messageType: "success" });
            },
            onComplete(resultProps) {
                if (resultProps.result?.quoteLine) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                }
            },
        });
    };

    const {
        value: qtyOrdered,
        changeHandler: qtyOrderedChangeHandler,
        keyDownHandler: qtyOrderedKeyDownHandler,
        blurHandler: qtyOrderedBlurHandler,
    } = useAccessibleSubmit(quoteLine.qtyOrdered!.toString(), qtyOrderedSubmitHandler);

    const [showNotes, setShowNotes] = useState(false);
    const toggleNotesClickHandler = () => {
        setShowNotes(!showNotes);
    };

    const [notes, setNotes] = useState(quoteLine.notes);

    const notesChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(event.currentTarget.value);
    };

    const notesBlurHandler = () => {
        updateQuoteLine({
            quoteId: quote.id,
            quoteLineId: quoteLine.id,
            quoteLine: {
                ...quoteLine,
                notes,
            },
            onSuccess: () => {
                toasterContext.addToast({ body: translate("Notes updated"), messageType: "success" });
            },
            onComplete(resultProps) {
                if (resultProps.result?.quoteLine) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                }
            },
        });
    };

    const toggleNotesHeading = showNotes
        ? translate("Hide Line Notes")
        : quoteLine.notes.length === 0
        ? translate("Add Line Notes")
        : translate("Show Line Notes");

    return (
        <GridContainer
            {...styles.container}
            data-test-selector={`quoteLine_${quoteLine.productId}_${quoteLine.unitOfMeasure}`}
        >
            <GridItem {...styles.productImageGridItem}>
                <ProductImage product={quoteLine} extendedStyles={styles.productImage} />
            </GridItem>
            <GridItem {...styles.quoteLineInfoGridItem}>
                <GridContainer {...styles.quoteLineInfoContainer}>
                    <GridItem {...styles.infoLeftColumn}>
                        <GridContainer {...styles.infoLeftColumnContainer}>
                            <GridItem {...styles.productBrandAndDescriptionGridItem}>
                                {quoteLine.brand && (
                                    <ProductBrand brand={quoteLine.brand} extendedStyles={styles.productBrand} />
                                )}
                                <ProductDescription product={quoteLine} extendedStyles={styles.productDescription} />
                                <ProductPartNumbers
                                    productNumber={quoteLine.erpNumber}
                                    customerProductNumber={quoteLine.customerName}
                                    manufacturerItem={quoteLine.manufacturerItem}
                                    extendedStyles={styles.productPartNumbers}
                                />
                                <ProductPrice
                                    product={quoteLine}
                                    currencySymbol={quote.currencySymbol}
                                    showLabel={false}
                                    extendedStyles={styles.productPrice}
                                />
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.quotedPricingGridItem}>
                        <Typography {...styles.quotedPricingText}>{translate("Quoted Pricing")}</Typography>
                        <RfqQuoteDetailsQuotedPricing
                            quote={quote}
                            quoteLine={quoteLine}
                            extendedStyles={styles.quotedPricingStyles}
                        />
                    </GridItem>
                    <GridItem {...styles.quantityAndSubtotalGridItem}>
                        <GridContainer {...styles.quantityAndSubtotalContainer}>
                            <GridItem {...styles.quantityGridItem}>
                                <TextField
                                    {...styles.quantityTextField}
                                    type="number"
                                    min={0}
                                    defaultValue="1"
                                    label={translate("QTY")}
                                    value={qtyOrdered}
                                    disabled={quoteLine.isPromotionItem || quote.isJobQuote}
                                    onChange={qtyOrderedChangeHandler}
                                    onKeyDown={qtyOrderedKeyDownHandler}
                                    onBlur={qtyOrderedBlurHandler}
                                />
                            </GridItem>
                            <GridItem {...styles.subtotalGridItem}>
                                {quoteLine.pricing && (
                                    <>
                                        <VisuallyHidden>{translate("Subtotal")}</VisuallyHidden>
                                        <Typography {...styles.subtotalText}>
                                            {enableVat && vatPriceDisplay !== "DisplayWithoutVat"
                                                ? quoteLine.pricing.extendedUnitRegularPriceWithVatDisplay
                                                : quoteLine.pricing.extendedUnitNetPriceDisplay}
                                        </Typography>
                                        {enableVat && (
                                            <>
                                                <Typography as="p" {...styles.vatLabelText}>
                                                    {vatPriceDisplay === "DisplayWithVat" ||
                                                    vatPriceDisplay === "DisplayWithAndWithoutVat"
                                                        ? `${translate("Inc. VAT")} (${quoteLine.pricing.vatRate}%)`
                                                        : translate("Ex. VAT")}
                                                </Typography>
                                                {vatPriceDisplay === "DisplayWithAndWithoutVat" && (
                                                    <>
                                                        <Typography {...styles.subtotalWithoutVatText}>
                                                            {quoteLine.pricing.extendedUnitNetPriceDisplay}
                                                        </Typography>
                                                        <Typography as="p" {...styles.vatLabelText}>
                                                            {translate("Ex. VAT")}
                                                        </Typography>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    {quote.showLineNotes && !quoteLine.isPromotionItem && (
                        <GridItem {...styles.notesAndCostCodeGridItem}>
                            <GridContainer {...styles.notesAndCostCodesContainer}>
                                <GridItem {...styles.notesGridItem}>
                                    <Link {...styles.toggleNotesLink} onClick={toggleNotesClickHandler}>
                                        {toggleNotesHeading}
                                    </Link>
                                    {showNotes && (
                                        <TextArea
                                            {...styles.notesTextArea}
                                            value={notes}
                                            disabled={!quote.canModifyOrder}
                                            onChange={notesChangeHandler}
                                            onBlur={notesBlurHandler}
                                        />
                                    )}
                                </GridItem>
                                <GridItem {...styles.costCodeGridItem}>
                                    {quote.showCostCode && (
                                        <>
                                            <Typography {...styles.costCodeLabelText}>{quote.costCodeLabel}</Typography>
                                            {quote.canEditCostCode ? (
                                                <Select {...styles.costCodeSelect}>
                                                    {quote.costCodes?.map(costCode => (
                                                        <option key={costCode.costCode} value={costCode.costCode}>
                                                            {costCode.description}
                                                        </option>
                                                    ))}
                                                </Select>
                                            ) : (
                                                <Typography {...styles.costCodeText}>{quoteLine.costCode}</Typography>
                                            )}
                                        </>
                                    )}
                                </GridItem>
                            </GridContainer>
                        </GridItem>
                    )}
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(RfqQuoteDetailsProposedDetailsGridItem);
