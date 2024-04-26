import clearSearch from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/ClearSearch";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import SearchFieldWrapper, {
    SearchFieldWrapperStyles,
} from "@insite/content-library/Widgets/OrderHistory/SearchFieldWrapper";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapDispatchToProps = {
    clearSearch,
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderHistorySearchClearButtonStyles {
    clearButton?: ButtonPresentationProps;
    wrapper?: SearchFieldWrapperStyles;
}

export const clearButtonStyles: OrderHistorySearchClearButtonStyles = {
    clearButton: {
        variant: "secondary",
        css: css`
            float: right;
        `,
    },
};

const styles = clearButtonStyles;

class OrderHistorySearchClearButton extends React.Component<Props> {
    clearSearch = () => {
        this.props.clearSearch();
    };

    render() {
        return (
            <SearchFieldWrapper extendedStyles={styles.wrapper}>
                <Button
                    {...styles.clearButton}
                    data-test-selector="orderHistory_clearFilters"
                    onClick={this.clearSearch}
                >
                    {translate("Clear Filters")}
                </Button>
            </SearchFieldWrapper>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(OrderHistorySearchClearButton),
    definition: {
        group: "Order History",
        displayName: "Clear Filters Button",
        allowedContexts: [OrderHistoryPageContext],
    },
};

export default widgetModule;
