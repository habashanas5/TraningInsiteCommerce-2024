/* eslint-disable spire/export-styles */
import getLocalizedCurrency from "@insite/client-framework/Common/Utilities/getLocalizedCurrency";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import React, { FC } from "react";
import { connect } from "react-redux";

interface OwnProps {
    amount: number;
    currencySymbol?: string;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    language: state.context.session.language,
    currencySymbol: ownProps.currencySymbol ?? state.context.session.currency?.currencySymbol,
});

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

/**
 * This component will return a currency amount formatted with the session currency and language.
 * This component should only be used in cases where the formatted currency amount cannot be generated server side.
 * dependency: @insite/content-library/Common/Utilities/getLocalizedCurrency
 */
const LocalizedCurrency: FC<Props> = ({ amount, language, currencySymbol }) => {
    if (!language || !currencySymbol) {
        return null;
    }

    return <>{getLocalizedCurrency({ amount, language, currencySymbol })}</>;
};

export default connect(mapStateToProps)(LocalizedCurrency);
