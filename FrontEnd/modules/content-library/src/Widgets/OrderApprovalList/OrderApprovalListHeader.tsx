import Zone from "@insite/client-framework/Components/Zone";
import { OrderApprovalsDataViewContext } from "@insite/client-framework/Store/Data/OrderApprovals/OrderApprovalsSelectors";
import toggleFiltersOpen from "@insite/client-framework/Store/Pages/OrderApprovalList/Handlers/ToggleFiltersOpen";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderApprovalListPageContext } from "@insite/content-library/Pages/OrderApprovalListPage";
import Clickable from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconProps } from "@insite/mobius/Icon";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { useContext } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapDispatchToProps = {
    toggleFiltersOpen,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderApprovalListHeaderStyles {
    container?: GridContainerProps;
    orderApprovalCountGridItem?: GridItemProps;
    toggleFilterGridItem?: GridItemProps;
    toggleFilterIcon?: IconProps;
}

export const headerStyles: OrderApprovalListHeaderStyles = {
    container: {
        gap: 8,
        css: css`
            padding-bottom: 10px;
        `,
    },
    orderApprovalCountGridItem: {
        width: 11,
        css: css`
            margin-top: 8px;
        `,
    },
    toggleFilterGridItem: {
        width: 1,
        css: css`
            margin-top: 8px;
            justify-content: flex-end;
        `,
    },
    toggleFilterIcon: { size: 24 },
};

const styles = headerStyles;

const OrderApprovalListHeader = (props: Props) => {
    const orderApprovalsDataView = useContext(OrderApprovalsDataViewContext);
    const orderApprovalsCount = orderApprovalsDataView.value
        ? orderApprovalsDataView.pagination
            ? orderApprovalsDataView.pagination.totalItemCount
            : 0
        : undefined;

    return (
        <>
            <Zone contentId={props.id} zoneName="Content00" />
            <GridContainer {...styles.container}>
                <GridItem {...styles.orderApprovalCountGridItem}>
                    {orderApprovalsCount !== undefined &&
                        orderApprovalsCount > 0 &&
                        translate("{0} orders", orderApprovalsCount.toString())}
                </GridItem>
                <GridItem {...styles.toggleFilterGridItem}>
                    <Clickable data-test-selector="orderApproval_toggleFilter" onClick={props.toggleFiltersOpen}>
                        <Icon src="Filter" {...styles.toggleFilterIcon} />
                        <VisuallyHidden>{translate("Toggle Filter")}</VisuallyHidden>
                    </Clickable>
                </GridItem>
            </GridContainer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(OrderApprovalListHeader),
    definition: {
        group: "Order Approval List",
        displayName: "Page Header",
        allowedContexts: [OrderApprovalListPageContext],
        isSystem: true,
    },
};

export default widgetModule;
