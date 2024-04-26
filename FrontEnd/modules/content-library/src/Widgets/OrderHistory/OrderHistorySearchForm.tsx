import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => ({
    filtersOpen: state.pages.orderHistory.filtersOpen,
});

export interface OrderHistorySearchFormStyles {
    wrapper?: InjectableCss;
    headingText?: TypographyPresentationProps;
}

export const searchFormStyles: OrderHistorySearchFormStyles = {
    wrapper: {
        css: css`
            margin-bottom: 10px;
        `,
    },
    headingText: { variant: "h5" },
};

const styles = searchFormStyles;

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

const OrderHistorySearchForm: React.FunctionComponent<Props> = props => {
    if (!props.filtersOpen) {
        return <Zone contentId={props.id} zoneName="Content01" />;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography as="h3" {...styles.headingText}>
                {translate("Filter")}
            </Typography>
            <Zone contentId={props.id} zoneName="Content" />
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(OrderHistorySearchForm),
    definition: {
        group: "Order History",
        displayName: "Search Form",
        allowedContexts: [OrderHistoryPageContext],
    },
};

export default widgetModule;
