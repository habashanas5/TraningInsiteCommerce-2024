/*
 * This is a custom version of the PageTitle widget. See ../config.js for how to get this to replace the standard one.
 */

import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Typography from "@insite/mobius/Typography";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    pageTitle: getCurrentPage(state).fields.title,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

const PageTitle: React.FunctionComponent<Props> = ({ pageTitle }) => (
    <Typography
        variant="h2"
        as="h1"
        ellipsis
        css={css`
            text-decoration: underline;
        `}
    >
        🐶 {pageTitle}!!
    </Typography>
);

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(PageTitle),
    definition: {
        group: "Basic",
    },
};

export default widgetModule;
