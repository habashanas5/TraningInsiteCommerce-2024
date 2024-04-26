import Zone from "@insite/client-framework/Components/Zone";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { MyAccountPageContext } from "@insite/content-library/Pages/MyAccountPage";
import AccountMessages from "@insite/content-library/Widgets/MyAccount/AccountMessages";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import * as React from "react";

interface OwnProps extends WidgetProps {}

type Props = OwnProps;

export interface MyAccountViewStyles {
    quickLinksGridItem?: GridItemProps;
    mainSectionGridItem?: GridItemProps;
    mainSectionGridContainer?: GridContainerProps;
    accountMessagesGridItem?: GridItemProps;
    dashboardWidgetsGridItem?: GridItemProps;
}

export const myAccountViewStyles: MyAccountViewStyles = {
    quickLinksGridItem: { width: [12, 12, 12, 2, 2] },
    mainSectionGridItem: { width: [12, 12, 12, 10, 10] },
    accountMessagesGridItem: { width: 12 },
    dashboardWidgetsGridItem: { width: 12 },
};

const styles = myAccountViewStyles;

class MyAccountView extends React.PureComponent<Props> {
    render() {
        return (
            <GridContainer>
                <GridItem {...styles.quickLinksGridItem}>
                    <Zone contentId={this.props.id} zoneName="NavigationList" />
                </GridItem>
                <GridItem {...styles.mainSectionGridItem}>
                    <GridContainer {...styles.mainSectionGridContainer}>
                        <GridItem {...styles.accountMessagesGridItem}>
                            <AccountMessages />
                        </GridItem>
                        <GridItem {...styles.dashboardWidgetsGridItem}>
                            <Zone contentId={this.props.id} zoneName="DashboardWidgets" />
                        </GridItem>
                    </GridContainer>
                </GridItem>
            </GridContainer>
        );
    }
}

const myAccountViewWidget: WidgetModule = {
    component: MyAccountView,
    definition: {
        allowedContexts: [MyAccountPageContext],
        group: "My Account",
    },
};

export default myAccountViewWidget;
