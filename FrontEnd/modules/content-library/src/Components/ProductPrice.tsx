import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import wrapInContainerStyles from "@insite/client-framework/Common/wrapInContainerStyles";
import { ProductContextModel } from "@insite/client-framework/Components/ProductContext";
import {
    getUnitListPrice,
    getUnitNetPrice,
    getUnitRegularPriceWithVat,
} from "@insite/client-framework/Services/Helpers/ProductPriceService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import { CartLineModel, ProductPriceDto } from "@insite/client-framework/Types/ApiModels";
import ProductPriceSavingsMessage from "@insite/content-library/Components/ProductPriceSavingsMessage";
import Tooltip, { TooltipPresentationProps } from "@insite/mobius/Tooltip";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    product: ProductContextModel | CartLineModel;
    currencySymbol?: string;
    showLabel?: boolean;
    showUnitOfMeasure?: boolean;
    showPack?: boolean;
    showSavings?: boolean;
    showSavingsAmount?: boolean;
    showSavingsPercent?: boolean;
    showInvalidPriceMessage?: boolean;
    extendedStyles?: ProductPriceStyles;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    currencySymbol: ownProps.currencySymbol ?? state.context.session.currency?.currencySymbol ?? "",
    canSeePrices: getSettingsCollection(state).productSettings.canSeePrices,
    enableVat: getSettingsCollection(state).productSettings.enableVat,
    vatPriceDisplay: getSettingsCollection(state).productSettings.vatPriceDisplay,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface ProductPriceStyles {
    wrapper?: any;
    priceLabelText?: TypographyPresentationProps;
    quoteMessageWrapper?: InjectableCss;
    quoteMessage?: RequiresQuoteMessageStyle;
    priceWrapper?: InjectableCss;
    price?: PriceStyles;
    invalidPriceText?: TypographyPresentationProps;
    secondaryPriceWrapper?: InjectableCss;
    secondaryPrice?: PriceStyles;
    packWrapper?: InjectableCss;
    packLabelText?: TypographyPresentationProps;
    packDescriptionText?: TypographyPresentationProps;
    savingsMessageText?: TypographyPresentationProps;
}

interface RequiresQuoteMessageStyle {
    text?: TypographyPresentationProps;
    tooltip?: TooltipPresentationProps;
}

interface PriceStyles {
    priceText?: TypographyPresentationProps;
    signInText?: TypographyPresentationProps;
    errorText?: TypographyPresentationProps;
    realTimeText?: TypographyPresentationProps;
    unitOfMeasureText?: TypographyPresentationProps;
    qtyPerBaseUnitOfMeasureText?: TypographyPresentationProps;
    vatLabelText?: TypographyPresentationProps;
}

export const productPriceStyles: ProductPriceStyles = {
    wrapper: {
        css: css`
            display: flex;
            flex-direction: column;
            width: 100%;
        `,
    },
    priceLabelText: {
        variant: "legend",
    },
    priceWrapper: {
        css: css`
            ${wrapInContainerStyles}
        `,
    },
    price: {
        priceText: { weight: "bold" },
        errorText: { weight: "bold" },
        realTimeText: {
            weight: "bold",
            css: css`
                display: inline-block;
                text-align: left;
                min-width: 25px;

                &::after {
                    overflow: hidden;
                    display: inline-block;
                    vertical-align: bottom;
                    animation: ellipsis steps(4, end) 900ms infinite 1s;
                    content: "\\2026";
                    width: 0;
                }

                @keyframes ellipsis {
                    to {
                        width: 1.25em;
                    }
                }
            `,
        },
        unitOfMeasureText: {
            css: css`
                white-space: nowrap;
            `,
        },
        vatLabelText: {
            css: css`
                font-size: 12px;
            `,
        },
    },
    invalidPriceText: {
        color: "danger",
    },
    secondaryPriceWrapper: {
        css: css`
            margin-top: 5px;
            ${wrapInContainerStyles}
        `,
    },
    secondaryPrice: {
        priceText: { weight: "bold" },
        errorText: { weight: "bold" },
        realTimeText: {
            weight: "bold",
            css: css`
                display: inline-block;
                text-align: left;
                min-width: 25px;

                &::after {
                    overflow: hidden;
                    display: inline-block;
                    vertical-align: bottom;
                    animation: ellipsis steps(4, end) 900ms infinite 1s;
                    content: "\\2026";
                    width: 0;
                }

                @keyframes ellipsis {
                    to {
                        width: 1.25em;
                    }
                }
            `,
        },
        unitOfMeasureText: {
            css: css`
                white-space: nowrap;
            `,
        },
        vatLabelText: {
            css: css`
                font-size: 12px;
            `,
        },
    },
    packWrapper: {
        css: css`
            margin-bottom: 8px;
        `,
    },
    packLabelText: {
        weight: "bold",
    },
    savingsMessageText: {
        italic: true,
        size: "12px",
    },
    quoteMessage: {
        text: { weight: "bold" },
    },
};

const SectionWrapper = getStyledWrapper("section");

const ProductPrice = ({
    product: pricingData,
    currencySymbol,
    canSeePrices,
    showLabel = true,
    showUnitOfMeasure = true,
    showPack = true,
    showSavings = false,
    showSavingsAmount = false,
    showSavingsPercent = false,
    showInvalidPriceMessage = false,
    enableVat,
    vatPriceDisplay,
    extendedStyles,
}: Props) => {
    const [styles] = React.useState(() => mergeToNew(productPriceStyles, extendedStyles));

    const productContextModel = pricingData as ProductContextModel;
    const cartLineModel = pricingData as CartLineModel;

    const unitOfMeasureDescription =
        "product" in pricingData
            ? pricingData.product.unitOfMeasures?.find(o => o.unitOfMeasure === pricingData.productInfo.unitOfMeasure)
                  ?.description
            : pricingData.unitOfMeasureDescription;
    const unitOfMeasureDisplay =
        "product" in pricingData
            ? pricingData.product.unitOfMeasures?.find(o => o.unitOfMeasure === pricingData.productInfo.unitOfMeasure)
                  ?.unitOfMeasureDisplay
            : pricingData.unitOfMeasureDisplay;
    const quoteRequired = productContextModel.product
        ? productContextModel.product.quoteRequired
        : cartLineModel.quoteRequired;
    const qtyOrdered = productContextModel.product
        ? productContextModel.productInfo.qtyOrdered
        : cartLineModel.qtyOrdered;

    const pricing = "product" in pricingData ? pricingData.productInfo.pricing : pricingData.pricing;
    const allowZeroPricing =
        "product" in pricingData ? pricingData.product.allowZeroPricing : pricingData.allowZeroPricing;
    const isPromotionItem = "product" in pricingData ? false : pricingData.isPromotionItem;
    const isInvalidPrice =
        !quoteRequired &&
        !isPromotionItem &&
        !allowZeroPricing &&
        pricing?.unitNetPrice === 0 &&
        pricing?.unitRegularPrice === 0;

    const unitOfMeasure = unitOfMeasureDescription || unitOfMeasureDisplay;
    const showQtyPerBaseUnitOfMeasure =
        "baseUnitOfMeasure" in pricingData &&
        pricingData.unitOfMeasure !== pricingData.baseUnitOfMeasure &&
        pricingData.qtyPerBaseUnitOfMeasure > 0;
    const packDescription = "product" in pricingData ? pricingData.product.packDescription : undefined;

    const quoteStyles = styles.quoteMessage || {};
    const priceStyles = styles.price || {};
    const secondaryPriceStyles = styles.secondaryPrice || {};

    if (!canSeePrices) {
        return (
            <StyledWrapper {...styles.wrapper}>
                <Typography {...priceStyles.signInText}>{siteMessage("Pricing_SignInForPrice")}</Typography>
            </StyledWrapper>
        );
    }

    if ("product" in pricingData && pricingData.productInfo.failedToLoadPricing) {
        return (
            <SectionWrapper {...styles.wrapper}>
                <Typography {...priceStyles.errorText}>{siteMessage("RealTimePricing_PriceLoadFailed")}</Typography>
            </SectionWrapper>
        );
    }

    if (quoteRequired) {
        return (
            <SectionWrapper {...styles.wrapper}>
                {showLabel && <Typography {...styles.priceLabelText}>{translate("Price")}</Typography>}
                <StyledWrapper {...styles.quoteMessageWrapper}>
                    <Typography {...quoteStyles.text} data-test-selector="quoteRequiredText">
                        {translate("Requires Quote")}
                    </Typography>
                    <Tooltip {...quoteStyles.tooltip} text={siteMessage("Rfq_TooltipMessage").toString()} />
                </StyledWrapper>
            </SectionWrapper>
        );
    }

    const displayVatForPrice = vatPriceDisplay === "DisplayWithVat" || vatPriceDisplay === "DisplayWithAndWithoutVat";
    const showSecondaryPrice = enableVat && vatPriceDisplay === "DisplayWithAndWithoutVat";

    return (
        <SectionWrapper {...styles.wrapper}>
            {showLabel && <Typography {...styles.priceLabelText}>{translate("Price")}</Typography>}
            <StyledWrapper {...styles.priceWrapper}>
                <Price
                    currencySymbol={currencySymbol}
                    pricing={pricing}
                    qtyOrdered={qtyOrdered}
                    unitOfMeasure={unitOfMeasure}
                    showUnitOfMeasure={showUnitOfMeasure}
                    enableVat={enableVat}
                    displayWithVat={displayVatForPrice}
                    styles={priceStyles}
                    salePriceLabel={
                        productContextModel.product?.salePriceLabel ||
                        cartLineModel?.salePriceLabel ||
                        translate("Sale Price:")
                    }
                />
                {isInvalidPrice && showInvalidPriceMessage && (
                    <Typography as="p" {...styles.invalidPriceText}>
                        {translate("Invalid Price")}
                    </Typography>
                )}
            </StyledWrapper>
            {showSecondaryPrice && (
                <StyledWrapper {...styles.secondaryPriceWrapper}>
                    <Price
                        currencySymbol={currencySymbol}
                        pricing={pricing}
                        qtyOrdered={qtyOrdered}
                        unitOfMeasure={unitOfMeasure}
                        showUnitOfMeasure={showUnitOfMeasure}
                        enableVat={enableVat}
                        displayWithVat={false}
                        styles={secondaryPriceStyles}
                    />
                </StyledWrapper>
            )}
            {showQtyPerBaseUnitOfMeasure && "baseUnitOfMeasure" in pricingData && (
                <Typography {...priceStyles.qtyPerBaseUnitOfMeasureText}>
                    {`${pricingData.qtyPerBaseUnitOfMeasure} ${pricingData.baseUnitOfMeasureDisplay} / ${unitOfMeasure}`}
                </Typography>
            )}
            {packDescription && showPack && (
                <StyledWrapper {...styles.packWrapper}>
                    <Typography {...styles.packLabelText}>{translate("Pack")}:&nbsp;</Typography>
                    <Typography {...styles.packDescriptionText}>{packDescription}</Typography>
                </StyledWrapper>
            )}
            {pricing && showSavings && (
                <ProductPriceSavingsMessage
                    pricing={pricing}
                    qtyOrdered={qtyOrdered || 1}
                    showSavingsAmount={showSavingsAmount}
                    showSavingsPercent={showSavingsPercent}
                    currencySymbol={currencySymbol}
                    {...styles.savingsMessageText}
                />
            )}
        </SectionWrapper>
    );
};

interface PriceProps {
    currencySymbol: string;
    pricing: ProductPriceDto | null | undefined;
    qtyOrdered: number | null;
    unitOfMeasure?: string;
    showUnitOfMeasure?: boolean;
    enableVat: boolean;
    displayWithVat: boolean;
    styles: PriceStyles;
    salePriceLabel?: string;
}

const Price = ({
    currencySymbol,
    pricing,
    qtyOrdered,
    unitOfMeasure,
    showUnitOfMeasure = true,
    enableVat,
    displayWithVat,
    styles,
    salePriceLabel,
}: PriceProps) => {
    let salePriceLabelPrefix = "";
    if (pricing && salePriceLabel) {
        const { price: unitNetPrice } = getUnitNetPrice(pricing, qtyOrdered || 1);
        const { price: unitListPrice } = getUnitListPrice(pricing, qtyOrdered || 1);
        if (unitNetPrice < unitListPrice) {
            salePriceLabelPrefix = `${salePriceLabel} `;
        }
    }
    return (
        <>
            {pricing ? (
                <Typography {...styles.priceText} data-test-selector="productPrice_unitNetPrice">
                    {salePriceLabelPrefix}
                    {enableVat && displayWithVat
                        ? getUnitRegularPriceWithVat(pricing, qtyOrdered || 1).priceDisplay
                        : getUnitNetPrice(pricing, qtyOrdered || 1).priceDisplay}
                </Typography>
            ) : (
                <Typography {...styles.realTimeText} data-test-selector="productPrice_unitNetPrice">
                    {currencySymbol}
                </Typography>
            )}
            {unitOfMeasure && showUnitOfMeasure && (
                <Typography {...styles.unitOfMeasureText} data-test-selector="productPrice_unitOfMeasureLabel">
                    &nbsp;/&nbsp;{unitOfMeasure}
                </Typography>
            )}
            {pricing && enableVat && (
                <Typography as="p" {...styles.vatLabelText}>
                    {displayWithVat ? `${translate("Inc. VAT")} (${pricing.vatRate}%)` : translate("Ex. VAT")}
                </Typography>
            )}
        </>
    );
};

export default connect(mapStateToProps)(ProductPrice);
