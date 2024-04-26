import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import updateQuote from "@insite/client-framework/Store/Data/Quotes/Handlers/UpdateQuote";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import setQuoteLineForCalculation from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/SetQuoteLineForCalculation";
import translate from "@insite/client-framework/Translate";
import { QuoteLineModel } from "@insite/client-framework/Types/ApiModels";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import RfqQuoteDetailsQuotedPricing, {
    RfqQuoteDetailsQuotedPricingStyles,
} from "@insite/content-library/Widgets/RfqQuoteDetails/RfqQuoteDetailsQuotedPricing";
import RfqQuoteDetailsQuoteLineCalculator from "@insite/content-library/Widgets/RfqQuoteDetails/RfqQuoteDetailsQuoteLineCalculator";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import Percent from "@insite/mobius/Icons/Percent";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Select, { SelectProps } from "@insite/mobius/Select";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { ChangeEvent, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    quoteState: getQuoteState(state, state.pages.rfqQuoteDetails.quoteId),
    quoteLineForCalculation: state.pages.rfqQuoteDetails.quoteLineForCalculation,
});

const mapDispatchToProps = {
    updateQuote,
    setQuoteLineForCalculation,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RfqQuoteDetailsSalesRepProductListStyles {
    mainWrapper?: InjectableCss;
    headerWrapper?: InjectableCss;
    headerContainer?: GridContainerProps;
    countGridItem?: GridItemProps;
    countLabelText?: TypographyPresentationProps;
    countValueText?: TypographyPresentationProps;
    quoteAllGridItem?: GridItemProps;
    quoteAllButton?: ButtonPresentationProps;
    itemContainer?: GridContainerProps;
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
    infoCenterColumn?: GridItemProps;
    infoContainer?: GridContainerProps;
    quantityGridItem?: GridItemProps;
    quantityHeadingAndText?: SmallHeadingAndTextStyles;
    uomGridItem?: GridItemProps;
    uomHeadingAndText?: SmallHeadingAndTextStyles;
    quotedPricingGridItem?: GridItemProps;
    quotedPricingText?: TypographyPresentationProps;
    quotedPricingStyles?: RfqQuoteDetailsQuotedPricingStyles;
    infoRightColumn?: GridItemProps;
    quoteLineButton?: ButtonPresentationProps;
    quoteCalculationModal?: ModalPresentationProps;
    quoteCalculationContainer?: GridContainerProps;
    quoteCalculationHeaderGridItem?: GridItemProps;
    quoteCalculationHeaderText?: TypographyPresentationProps;
    quoteCalculationMethodGridItem?: GridItemProps;
    quoteCalculationMethodSelect?: SelectProps;
    quoteCalculationPercentGridItem?: GridItemProps;
    quoteCalculationPercentTextField?: TextFieldPresentationProps;
    quoteCalculationPercentIcon?: IconPresentationProps;
    quoteCalculationErrorGridItem?: GridItemProps;
    quoteCalculationErrorText?: TypographyPresentationProps;
    quoteCalculationCancelGridItem?: GridItemProps;
    quoteCalculationCancelButton?: ButtonPresentationProps;
    quoteCalculationApplyAllGridItem?: GridItemProps;
    quoteCalculationApplyAllButton?: ButtonPresentationProps;
    quoteLineCalculationModal?: ModalPresentationProps;
}

export const rfqQuoteDetailsSalesRepProductListStyles: RfqQuoteDetailsSalesRepProductListStyles = {
    headerWrapper: {
        css: css`
            padding-bottom: 15px;
            border-bottom: 1px solid ${getColor("common.border")};
        `,
    },
    headerContainer: { gap: 20 },
    countGridItem: {
        width: 6,
        css: css`
            align-items: center;
        `,
    },
    countLabelText: {
        weight: 600,
        css: css`
            margin-left: 5px;
        `,
    },
    countValueText: { weight: 600 },
    quoteAllGridItem: {
        width: 6,
        css: css`
            justify-content: flex-end;
        `,
    },
    itemContainer: {
        gap: 20,
        css: css`
            border-bottom: 1px solid ${getColor("common.border")};
            padding: 1rem 0;
        `,
    },
    productImageGridItem: { width: 2 },
    quoteLineInfoGridItem: { width: 10 },
    quoteLineInfoContainer: { gap: 20 },
    infoLeftColumn: { width: [12, 12, 12, 12, 5] },
    infoLeftColumnContainer: { gap: 20 },
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
    infoCenterColumn: { width: [12, 12, 12, 6, 4] },
    infoContainer: { gap: 20 },
    quantityGridItem: { width: 6 },
    quantityHeadingAndText: {
        heading: {
            weight: "bold",
            size: 14,
            transform: "none",
        },
    },
    uomGridItem: { width: 6 },
    uomHeadingAndText: {
        heading: {
            weight: "bold",
            size: 14,
        },
    },
    quotedPricingGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    quotedPricingText: { weight: "bold" },
    infoRightColumn: {
        width: [12, 12, 12, 6, 3],
        css: css`
            justify-content: flex-end;
        `,
    },
    quoteLineButton: {
        css: css`
            ${({ theme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        null,
                        css`
                            width: 100%;
                        `,
                    ],
                    "max",
                )}
        `,
    },
    quoteCalculationModal: { sizeVariant: "small" },
    quoteCalculationContainer: { gap: 20 },
    quoteCalculationHeaderGridItem: { width: 12 },
    quoteCalculationMethodGridItem: { width: [7, 9, 9, 8, 8] },
    quoteCalculationPercentIcon: {
        src: Percent,
        css: css`
            margin: 8px 4px;
        `,
    },
    quoteCalculationPercentGridItem: {
        width: [5, 3, 3, 4, 4],
        align: "bottom",
    },
    quoteCalculationErrorGridItem: { width: 12 },
    quoteCalculationErrorText: { color: "danger" },
    quoteCalculationCancelGridItem: { width: 6 },
    quoteCalculationCancelButton: {
        variant: "secondary",
        css: css`
            width: 100%;
        `,
    },
    quoteCalculationApplyAllGridItem: { width: 6 },
    quoteCalculationApplyAllButton: {
        css: css`
            width: 100%;
        `,
    },
    quoteLineCalculationModal: { sizeVariant: "large" },
};

const styles = rfqQuoteDetailsSalesRepProductListStyles;

const RfqQuoteDetailsSalesRepProductList = ({
    quoteState,
    updateQuote,
    quoteLineForCalculation,
    setQuoteLineForCalculation,
}: Props) => {
    const [quoteCalculationModalIsOpen, setQuoteCalculationModalIsOpen] = useState(false);
    const [quoteCalculationError, setQuoteCalculationError] = useState("");
    const [calculationMethod, setCalculationMethod] = useState(quoteState.value?.calculationMethods?.[0]);
    const [percent, setPercent] = useState(0);
    const [quoteLineCalculationModalIsOpen, setQuoteLineCalculationModalIsOpen] = useState(false);

    const quote = quoteState.value;
    if (!quote || !quote.quoteLineCollection) {
        return null;
    }

    const quoteAllClickHandler = () => {
        setQuoteCalculationModalIsOpen(true);
    };

    const quoteCalculationModalCloseHandler = () => {
        setQuoteCalculationModalIsOpen(false);
    };

    const quoteCalculationModalAfterCloseHandler = () => {
        setQuoteCalculationError("");
        setCalculationMethod(quoteState.value?.calculationMethods?.[0]);
        setPercent(0);
    };

    const calculationMethodChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        setCalculationMethod(quoteState.value?.calculationMethods?.find(o => o.name === event.currentTarget.value));
    };

    const percentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setPercent(parseFloat(event.currentTarget.value));
    };

    const percentBlurHandler = () => {
        setPercent(percent || 0);
    };

    const cancelClickHandler = () => {
        setQuoteCalculationModalIsOpen(false);
    };

    const applyAllClickHandler = () => {
        updateQuote({
            apiParameter: {
                quoteId: quote.id,
                calculationMethod: calculationMethod?.name,
                percent,
            },
            onSuccess: () => {
                setQuoteCalculationModalIsOpen(false);
            },
            onError: error => {
                setQuoteCalculationError(error);
            },
            onComplete(resultProps) {
                if (resultProps.result?.quote) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                } else if (resultProps.result?.errorMessage) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onError?.(resultProps.result.errorMessage);
                }
            },
        });
    };

    const quoteLineClickHandler = (quoteLine: QuoteLineModel) => {
        setQuoteLineForCalculation({ quoteLine });
        setQuoteLineCalculationModalIsOpen(true);
    };

    const quoteLineCalculationModalCloseHandler = () => {
        setQuoteLineCalculationModalIsOpen(false);
    };

    return (
        <StyledWrapper {...styles.mainWrapper}>
            <StyledWrapper {...styles.headerWrapper}>
                <GridContainer {...styles.headerContainer}>
                    <GridItem {...styles.countGridItem}>
                        <Typography {...styles.countValueText}>{quote.quoteLineCollection.length}</Typography>
                        <Typography {...styles.countLabelText}>
                            {quote.quoteLineCollection.length > 1 ? translate("Products") : translate("Product")}
                        </Typography>
                    </GridItem>
                    <GridItem {...styles.quoteAllGridItem}>
                        {quote.isEditable && (
                            <Button {...styles.quoteAllButton} onClick={quoteAllClickHandler}>
                                {translate("Quote All")}
                            </Button>
                        )}
                    </GridItem>
                </GridContainer>
            </StyledWrapper>
            {quote.quoteLineCollection.map(quoteLine => (
                <GridContainer
                    key={`${quoteLine.productId}_${quoteLine.unitOfMeasure}`}
                    {...styles.itemContainer}
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
                                            <ProductBrand
                                                brand={quoteLine.brand}
                                                extendedStyles={styles.productBrand}
                                            />
                                        )}
                                        <ProductDescription
                                            product={quoteLine}
                                            extendedStyles={styles.productDescription}
                                        />
                                        <ProductPartNumbers
                                            productNumber={quoteLine.erpNumber}
                                            customerProductNumber={quoteLine.customerName}
                                            manufacturerItem={quoteLine.manufacturerItem}
                                            extendedStyles={styles.productPartNumbers}
                                        />
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                            <GridItem {...styles.infoCenterColumn}>
                                <GridContainer {...styles.infoContainer}>
                                    <GridItem {...styles.quantityGridItem}>
                                        <VisuallyHidden>{translate("Quantity Requested")}</VisuallyHidden>
                                        <SmallHeadingAndText
                                            heading={translate("QTY Req.")}
                                            text={quoteLine.qtyOrdered || 1}
                                            extendedStyles={styles.quantityHeadingAndText}
                                        />
                                    </GridItem>
                                    <GridItem {...styles.uomGridItem}>
                                        {quoteLine.unitOfMeasure && (
                                            <>
                                                <VisuallyHidden>{translate("Unit of Measure")}</VisuallyHidden>
                                                <SmallHeadingAndText
                                                    heading={translate("U/M")}
                                                    text={quoteLine.unitOfMeasure}
                                                    extendedStyles={styles.uomHeadingAndText}
                                                />
                                            </>
                                        )}
                                    </GridItem>
                                    <GridItem {...styles.quotedPricingGridItem}>
                                        <Typography {...styles.quotedPricingText}>
                                            {translate("Quoted Pricing")}
                                        </Typography>
                                        <RfqQuoteDetailsQuotedPricing
                                            quote={quote}
                                            quoteLine={quoteLine}
                                            extendedStyles={styles.quotedPricingStyles}
                                        />
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                            <GridItem {...styles.infoRightColumn}>
                                {quote.isEditable && (
                                    <Button
                                        {...styles.quoteLineButton}
                                        onClick={() => quoteLineClickHandler(quoteLine)}
                                    >
                                        {translate("Quote")}
                                    </Button>
                                )}
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                </GridContainer>
            ))}
            <Modal
                {...styles.quoteCalculationModal}
                headline={translate("Quote All")}
                isOpen={quoteCalculationModalIsOpen}
                handleClose={quoteCalculationModalCloseHandler}
                onAfterClose={quoteCalculationModalAfterCloseHandler}
            >
                <GridContainer {...styles.quoteCalculationContainer}>
                    <GridItem {...styles.quoteCalculationHeaderGridItem}>
                        <Typography {...styles.quoteCalculationHeaderText}>
                            {siteMessage("Rfq_QuoteOrderHeader")}
                        </Typography>
                    </GridItem>
                    <GridItem {...styles.quoteCalculationMethodGridItem}>
                        <Select
                            {...styles.quoteCalculationMethodSelect}
                            label={translate("Discount By")}
                            value={calculationMethod?.name}
                            onChange={calculationMethodChangeHandler}
                        >
                            {quote.calculationMethods?.map(cm => (
                                <option key={cm.name} value={cm.name}>
                                    {cm.displayName}
                                </option>
                            ))}
                        </Select>
                    </GridItem>
                    <GridItem {...styles.quoteCalculationPercentGridItem}>
                        <TextField
                            {...styles.quoteCalculationPercentTextField}
                            type="number"
                            min={calculationMethod?.minimumMargin}
                            max={
                                calculationMethod && parseFloat(calculationMethod.maximumDiscount) > 0
                                    ? parseFloat(calculationMethod.maximumDiscount)
                                    : undefined
                            }
                            value={percent}
                            onChange={percentChangeHandler}
                            onBlur={percentBlurHandler}
                        />
                        <Icon {...styles.quoteCalculationPercentIcon} />
                    </GridItem>
                    {quoteCalculationError && (
                        <GridItem {...styles.quoteCalculationErrorGridItem}>
                            <Typography {...styles.quoteCalculationErrorText}>{quoteCalculationError}</Typography>
                        </GridItem>
                    )}
                    <GridItem {...styles.quoteCalculationCancelGridItem}>
                        <Button {...styles.quoteCalculationCancelButton} onClick={cancelClickHandler}>
                            {translate("Cancel")}
                        </Button>
                    </GridItem>
                    <GridItem {...styles.quoteCalculationApplyAllGridItem}>
                        <Button {...styles.quoteCalculationApplyAllButton} onClick={applyAllClickHandler}>
                            {translate("Apply Quote")}
                        </Button>
                    </GridItem>
                </GridContainer>
            </Modal>
            <Modal
                {...styles.quoteLineCalculationModal}
                headline={translate("Quote")}
                isOpen={quoteLineCalculationModalIsOpen}
                handleClose={quoteLineCalculationModalCloseHandler}
            >
                {quoteLineForCalculation && (
                    <RfqQuoteDetailsQuoteLineCalculator
                        quote={quote}
                        quoteLine={quoteLineForCalculation}
                        onCancel={quoteLineCalculationModalCloseHandler}
                        onApply={quoteLineCalculationModalCloseHandler}
                    />
                )}
            </Modal>
        </StyledWrapper>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(RfqQuoteDetailsSalesRepProductList);
