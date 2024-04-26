import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadCurrentShipTos from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadCurrentShipTos";
import { getCurrentShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import SearchFieldWrapper, {
    SearchFieldWrapperStyles,
} from "@insite/content-library/Widgets/OrderHistory/SearchFieldWrapper";
import Select, { SelectProps } from "@insite/mobius/Select";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => {
    return {
        currentShipTosDataView: getCurrentShipTosDataView(state),
        parameter: state.pages.orderHistory.getOrdersParameter,
    };
};

const mapDispatchToProps = {
    updateSearchFields,
    loadCurrentShipTos,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderHistorySearchFieldShipToStyles {
    select?: SelectProps;
    wrapper?: SearchFieldWrapperStyles;
}

export const shipToStyles: OrderHistorySearchFieldShipToStyles = {};
const styles = shipToStyles;

class OrderHistorySearchFieldShipTos extends React.Component<Props> {
    componentDidMount() {
        if (!this.props.currentShipTosDataView.value) {
            this.props.loadCurrentShipTos();
        }
    }

    handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.props.updateSearchFields({ customerSequence: event.currentTarget.value });
    };

    render() {
        const shipToOptions = this.props.currentShipTosDataView.value || [];

        return (
            <SearchFieldWrapper extendedStyles={styles.wrapper}>
                <Select
                    label={translate("Ship To")}
                    {...styles.select}
                    value={this.props.parameter.customerSequence}
                    onChange={this.handleChange}
                >
                    {shipToOptions.map(shipTo => (
                        <option key={shipTo.customerSequence} value={shipTo.customerSequence}>
                            {shipTo.label}
                        </option>
                    ))}
                </Select>
            </SearchFieldWrapper>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderHistorySearchFieldShipTos),
    definition: {
        group: "Order History",
        displayName: "Ship To",
        allowedContexts: [OrderHistoryPageContext],
    },
};

export default widgetModule;
