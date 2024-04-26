import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setDashboardIsHomepage from "@insite/client-framework/Store/Context/Handlers/SetDashboardIsHomepage";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { MyAccountPageContext } from "@insite/content-library/Pages/MyAccountPage";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import CheckboxGroup, { CheckboxGroupComponentProps } from "@insite/mobius/CheckboxGroup";
import { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    dashboardIsHomepage: state.context.session.dashboardIsHomepage ?? undefined,
});

const mapDispatchToProps = {
    setDashboardIsHomepage,
};

export interface MyAccountHomepageSelectorStyles {
    checkboxGroup?: FieldSetGroupPresentationProps<CheckboxGroupComponentProps>;
    checkbox?: CheckboxPresentationProps;
}

export const myAccountHomepageSelectorStyles: MyAccountHomepageSelectorStyles = {
    checkboxGroup: {
        css: css`
            align-items: flex-end;
            height: 100%;
            justify-content: center;
        `,
    },
};

const styles = myAccountHomepageSelectorStyles;

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const MyAccountHomepageSelector = ({ dashboardIsHomepage, setDashboardIsHomepage }: Props) => {
    const [isCheckboxSelected, setIsCheckboxSelected] = useState(dashboardIsHomepage);
    const dashboardIsHomepageChangeHandler = (event: React.SyntheticEvent<Element, Event>, value: boolean) => {
        setIsCheckboxSelected(value);
        setDashboardIsHomepage({ dashboardIsHomepage: value });
    };

    return (
        <CheckboxGroup {...styles.checkboxGroup}>
            <Checkbox {...styles.checkbox} onChange={dashboardIsHomepageChangeHandler} checked={isCheckboxSelected}>
                {siteMessage("Dashboard_MakeMyHomepage")}
            </Checkbox>
        </CheckboxGroup>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MyAccountHomepageSelector),
    definition: {
        allowedContexts: [MyAccountPageContext],
        group: "My Account",
        displayName: "Homepage Selector",
    },
};

export default widgetModule;
