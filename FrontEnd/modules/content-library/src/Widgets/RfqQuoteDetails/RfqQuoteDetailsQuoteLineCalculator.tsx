import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import addPriceBreak from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/AddPriceBreak";
import resetPriceBreaks from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/ResetPriceBreaks";
import updateQuoteLine from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/UpdateQuoteLine";
import validatePriceBreaks from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/ValidatePriceBreaks";
import translate from "@insite/client-framework/Translate";
import { BreakPriceRfqModel, QuoteLineModel, QuoteModel } from "@insite/client-framework/Types/ApiModels";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import RfqQuoteDetailsQuoteLineCalculatorRow from "@insite/content-library/Widgets/RfqQuoteDetails/RfqQuoteDetailsQuoteLineCalculatorRow";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import PlusCircle from "@insite/mobius/Icons/PlusCircle";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    quote: QuoteModel;
    quoteLine: QuoteLineModel;
    onCancel?: () => void;
    onApply?: () => void;
}

const mapStateToProps = (state: ApplicationState) => ({
    priceBreakValidations: state.pages.rfqQuoteDetails.priceBreakValidations,
});

const mapDispatchToProps = {
    addPriceBreak,
    resetPriceBreaks,
    validatePriceBreaks: makeHandlerChainAwaitable(validatePriceBreaks),
    updateQuoteLine,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RfqQuoteDetailsQuoteLineCalculatorStyles {
    container?: GridContainerProps;
    infoGridItem?: GridItemProps;
    infoWrapper?: InjectableCss;
    productBrand?: ProductBrandStyles;
    productDescription?: ProductDescriptionStyles;
    productPartNumbers?: ProductPartNumbersStyles;
    itemPricingHeader?: TypographyPresentationProps;
    itemPricingContainer?: GridContainerProps;
    unitCostGridItem?: GridItemProps;
    unitCostHeadingAndText?: SmallHeadingAndTextStyles;
    listPriceGridItem?: GridItemProps;
    listPriceHeadingAndText?: SmallHeadingAndTextStyles;
    customerPriceGridItem?: GridItemProps;
    customerPriceHeadingAndText?: SmallHeadingAndTextStyles;
    minimumPriceAllowedGridItem?: GridItemProps;
    minimumPriceAllowedHeadingAndText?: SmallHeadingAndTextStyles;
    qtyAvailableGridItem?: GridItemProps;
    qtyAvailableHeadingAndText?: SmallHeadingAndTextStyles;
    priceBreaksGridItem?: GridItemProps;
    priceBreaksTable?: DataTableProps;
    priceBreaksHead?: DataTableHeadProps;
    qtyHeader?: DataTableHeaderProps;
    priceHeader?: DataTableHeaderProps;
    buttonsHeader?: DataTableHeaderProps;
    calculatorHeader?: DataTableHeaderProps;
    priceBreaksBody?: DataTableBodyProps;
    addPriceBreakLink?: LinkPresentationProps;
    errorText?: TypographyPresentationProps;
    buttonsGridItem?: GridItemProps;
    cancelButton?: ButtonPresentationProps;
    resetButton?: ButtonPresentationProps;
    applyButton?: ButtonPresentationProps;
}

export const rfqQuoteDetailsQuoteLineCalculatorStyles: RfqQuoteDetailsQuoteLineCalculatorStyles = {
    container: { gap: 20 },
    infoGridItem: {
        width: [12, 12, 6, 6, 6],
        css: css`
            flex-direction: column;
        `,
    },
    infoWrapper: {
        css: css`
            width: 100%;
            padding: 10px;
            background-color: ${getColor("common.accent")};
        `,
    },
    itemPricingHeader: {
        variant: "h5",
        css: css`
            margin: 10px 0 5px 0;
        `,
    },
    itemPricingContainer: { gap: 20 },
    unitCostGridItem: { width: 3 },
    listPriceGridItem: { width: 3 },
    customerPriceGridItem: { width: 3 },
    minimumPriceAllowedGridItem: { width: 3 },
    qtyAvailableGridItem: { width: 12 },
    unitCostHeadingAndText: {
        heading: {
            variant: "h6",
            css: css`
                margin-bottom: 0;
            `,
        },
    },
    listPriceHeadingAndText: {
        heading: {
            variant: "h6",
            css: css`
                margin-bottom: 0;
            `,
        },
    },
    customerPriceHeadingAndText: {
        heading: {
            variant: "h6",
            css: css`
                margin-bottom: 0;
            `,
        },
    },
    minimumPriceAllowedHeadingAndText: {
        heading: {
            variant: "h6",
            css: css`
                margin-bottom: 0;
            `,
        },
    },
    qtyAvailableHeadingAndText: {
        heading: {
            variant: "h6",
            css: css`
                margin-bottom: 0;
            `,
        },
    },
    priceBreaksGridItem: {
        width: [12, 12, 6, 6, 6],
        css: css`
            flex-direction: column;
        `,
    },
    priceBreaksTable: {
        cssOverrides: {
            table: css`
                position: relative;
            `,
        },
    },
    priceHeader: { alignX: "right" },
    buttonsHeader: {
        css: css`
            width: 100px;
        `,
    },
    calculatorHeader: {
        css: css`
            display: none;
        `,
    },
    addPriceBreakLink: {
        icon: {
            iconProps: { src: PlusCircle },
        },
        typographyProps: {
            css: css`
                padding-left: 5px;
            `,
        },
        css: css`
            margin-top: 10px;
        `,
    },
    errorText: {
        color: "danger",
        css: css`
            margin: 5px 30px;
        `,
    },
    buttonsGridItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
    cancelButton: {
        variant: "secondary",
        css: css`
            margin-right: 10px;
        `,
    },
    resetButton: {
        variant: "tertiary",
        css: css`
            margin-right: 10px;
        `,
    },
};

const styles = rfqQuoteDetailsQuoteLineCalculatorStyles;

const MAX_PRICE_BREAKS = 5;

const RfqQuoteDetailsQuoteLineCalculator = ({
    quote,
    quoteLine,
    priceBreakValidations,
    onCancel,
    onApply,
    addPriceBreak,
    resetPriceBreaks,
    validatePriceBreaks,
    updateQuoteLine,
}: Props) => {
    const [priceBreakCalculatorIndex, setPriceBreakCalculatorIndex] = useState<number | undefined>(undefined);

    const shouldShowPriceBreak = (priceBreak: BreakPriceRfqModel) => {
        if (!quote || !quoteLine) {
            return false;
        }

        if (quote.isJobQuote) {
            return (
                quoteLine.pricingRfq?.priceBreaks
                    ?.slice()
                    .sort((a, b) => b.startQty - a.startQty)
                    .filter(x => x.startQty <= quoteLine.qtyOrdered!)[0].startQty === priceBreak.startQty
            );
        }

        return true;
    };

    const addPriceBreakClickHandler = () => {
        addPriceBreak();
    };

    const openCalculator = (index: number) => {
        setPriceBreakCalculatorIndex(index);
    };

    const cancelClickHandler = () => {
        onCancel?.();
    };

    const resetClickHandler = () => {
        resetPriceBreaks();
    };

    const applyClickHandler = async () => {
        if (!quote || !quoteLine) {
            return;
        }

        const isValid = await validatePriceBreaks({});
        if (!isValid) {
            return;
        }

        updateQuoteLine({
            quoteId: quote.id,
            quoteLineId: quoteLine.id,
            quoteLine: {
                id: quoteLine.id,
                pricingRfq: quoteLine.pricingRfq,
            } as QuoteLineModel,
            onSuccess: onApply,
            onComplete(resultProps) {
                if (resultProps.result?.quoteLine) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                }
            },
        });
    };

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.infoGridItem}>
                <StyledWrapper {...styles.infoWrapper}>
                    {quoteLine.brand && <ProductBrand brand={quoteLine.brand} extendedStyles={styles.productBrand} />}
                    <ProductDescription product={quoteLine} extendedStyles={styles.productDescription} />
                    <ProductPartNumbers
                        productNumber={quoteLine.erpNumber}
                        customerProductNumber={quoteLine.customerName}
                        manufacturerItem={quoteLine.manufacturerItem}
                        extendedStyles={styles.productPartNumbers}
                    />
                    <Typography {...styles.itemPricingHeader}>{translate("Item Pricing")}</Typography>
                    <GridContainer {...styles.itemPricingContainer}>
                        {quoteLine.pricingRfq?.showUnitCost && (
                            <GridItem {...styles.unitCostGridItem}>
                                <SmallHeadingAndText
                                    heading={translate("Unit Cost")}
                                    text={quoteLine.pricingRfq.unitCostDisplay}
                                    extendedStyles={styles.unitCostHeadingAndText}
                                />
                            </GridItem>
                        )}
                        {quoteLine.pricingRfq?.showListPrice && (
                            <GridItem {...styles.listPriceGridItem}>
                                <SmallHeadingAndText
                                    heading={translate("List")}
                                    text={quoteLine.pricingRfq.listPriceDisplay}
                                    extendedStyles={styles.listPriceHeadingAndText}
                                />
                            </GridItem>
                        )}
                        {quoteLine.pricingRfq?.showCustomerPrice && (
                            <GridItem {...styles.customerPriceGridItem}>
                                <SmallHeadingAndText
                                    heading={translate("Customer")}
                                    text={
                                        quote.isJobQuote
                                            ? quoteLine.pricing?.unitNetPriceDisplay || ""
                                            : quoteLine.pricingRfq.customerPriceDisplay
                                    }
                                    extendedStyles={styles.customerPriceHeadingAndText}
                                />
                            </GridItem>
                        )}
                        {quoteLine.pricingRfq && quoteLine.pricingRfq.minimumPriceAllowed > 0 && (
                            <GridItem {...styles.minimumPriceAllowedGridItem}>
                                <SmallHeadingAndText
                                    heading={translate("Minimum")}
                                    text={quoteLine.pricingRfq.minimumPriceAllowedDisplay}
                                    extendedStyles={styles.minimumPriceAllowedHeadingAndText}
                                />
                            </GridItem>
                        )}
                        <GridItem {...styles.qtyAvailableGridItem}>
                            <SmallHeadingAndText
                                heading={translate("Quantity Available")}
                                text={quoteLine.qtyOnHand}
                                extendedStyles={styles.qtyAvailableHeadingAndText}
                            />
                        </GridItem>
                    </GridContainer>
                </StyledWrapper>
            </GridItem>
            <GridItem {...styles.priceBreaksGridItem}>
                <DataTable {...styles.priceBreaksTable}>
                    <DataTableHead {...styles.priceBreaksHead}>
                        <DataTableHeader {...styles.qtyHeader}>{translate("Quantity")}</DataTableHeader>
                        <DataTableHeader {...styles.priceHeader}>{translate("Price")}</DataTableHeader>
                        <DataTableHeader {...styles.buttonsHeader}></DataTableHeader>
                        {priceBreakCalculatorIndex !== undefined && (
                            <DataTableHeader {...styles.calculatorHeader}></DataTableHeader>
                        )}
                    </DataTableHead>
                    <DataTableBody {...styles.priceBreaksBody}>
                        {quoteLine.pricingRfq?.priceBreaks?.filter(shouldShowPriceBreak).map((priceBreak, index) => (
                            <RfqQuoteDetailsQuoteLineCalculatorRow
                                key={index}
                                quote={quote}
                                quoteLine={quoteLine}
                                priceBreak={priceBreak}
                                index={index}
                                calculatorIsOpen={priceBreakCalculatorIndex === index}
                                openCalculator={openCalculator}
                            />
                        ))}
                    </DataTableBody>
                </DataTable>
                {!quote.isJobQuote &&
                    quoteLine.pricingRfq?.priceBreaks &&
                    quoteLine.pricingRfq.priceBreaks.length < MAX_PRICE_BREAKS && (
                        <Link {...styles.addPriceBreakLink} onClick={addPriceBreakClickHandler}>
                            {translate("Add Price Break")}
                        </Link>
                    )}
                {priceBreakValidations.some(o => o.priceRequired) && (
                    <Typography {...styles.errorText}>{siteMessage("Field_Required", translate("Price"))}</Typography>
                )}
                {priceBreakValidations.some(o => o.invalidPrice) && (
                    <Typography {...styles.errorText}>{siteMessage("Rfq_InvalidLinePrice")}</Typography>
                )}
                {priceBreakValidations.some(o => o.invalidQty) && (
                    <Typography {...styles.errorText}>{siteMessage("Rfq_InvalidQty")}</Typography>
                )}
            </GridItem>
            <GridItem {...styles.buttonsGridItem}>
                <Button {...styles.cancelButton} onClick={cancelClickHandler}>
                    {translate("Cancel")}
                </Button>
                <Button {...styles.resetButton} onClick={resetClickHandler}>
                    {translate("Reset")}
                </Button>
                <Button {...styles.applyButton} onClick={applyClickHandler}>
                    {translate("Apply Quote")}
                </Button>
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(RfqQuoteDetailsQuoteLineCalculator);
