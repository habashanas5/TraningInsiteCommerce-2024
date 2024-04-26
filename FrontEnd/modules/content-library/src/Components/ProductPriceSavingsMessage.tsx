/* eslint-disable spire/export-styles */
import getLocalizedCurrency from "@insite/client-framework/Common/Utilities/getLocalizedCurrency";
import { getUnitListPrice, getUnitNetPrice } from "@insite/client-framework/Services/Helpers/ProductPriceService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import translate from "@insite/client-framework/Translate";
import { ProductPriceDto } from "@insite/client-framework/Types/ApiModels";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { FC } from "react";
import { connect } from "react-redux";

type OwnProps = TypographyPresentationProps & {
    pricing: ProductPriceDto;
    showSavingsAmount: boolean;
    showSavingsPercent: boolean;
    currencySymbol: string;
    qtyOrdered?: number;
};

const mapStateToProps = (state: ApplicationState) => ({
    language: state.context.session.language,
});

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

const ProductPriceSavingsMessage: FC<Props> = ({
    pricing,
    showSavingsAmount,
    showSavingsPercent,
    currencySymbol,
    qtyOrdered = 1,
    language,
    ...otherProps
}) => {
    const { price: unitNetPrice } = getUnitNetPrice(pricing, qtyOrdered);
    const { price: unitListPrice, priceDisplay: unitListPriceDisplay } = getUnitListPrice(pricing, qtyOrdered);
    const hasPriceSavings = unitNetPrice < unitListPrice;
    if (!language || !pricing || !hasPriceSavings) {
        return null;
    }

    const savingsAmount = Math.round((unitListPrice - unitNetPrice) * 100) / 100;
    const localizedSavingsAmount = getLocalizedCurrency({ amount: savingsAmount, language, currencySymbol });
    const savingsPercent = Math.round((savingsAmount / unitListPrice) * 100);

    let message = "";
    if (showSavingsAmount && showSavingsPercent) {
        message = translate(
            "Regular Price: {0}, you save {1} ({2}%)",
            unitListPriceDisplay,
            localizedSavingsAmount,
            `${savingsPercent}`,
        );
    } else if (showSavingsPercent) {
        message = translate("Regular Price: {0}, you save {1}%", unitListPriceDisplay, `${savingsPercent}`);
    } else if (showSavingsAmount) {
        message = translate("Regular Price: {0}, you save {1}", unitListPriceDisplay, localizedSavingsAmount);
    } else {
        message = translate("Regular Price: {0}", unitListPriceDisplay);
    }

    return (
        <Typography {...otherProps} data-test-selector="productPriceSavingsMessage">
            {message}
        </Typography>
    );
};

export default connect(mapStateToProps)(ProductPriceSavingsMessage);
