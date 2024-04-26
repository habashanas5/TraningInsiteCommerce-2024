import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import unsubscribeFromCartReminders from "@insite/client-framework/Store/Pages/CartReminderUnsubscribe/Handlers/UnsubscribeFromCartReminders";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const { search } = getLocation(state);
    const parsedQuery = parseQueryString<{ username?: string; unsubscribeToken?: string }>(search);
    return {
        userName: parsedQuery.username,
        unsubscribeToken: parsedQuery.unsubscribeToken,
    };
};

const mapDispatchToProps = {
    unsubscribeFromCartReminders,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const CartReminderUnsubscribePage = ({ id, userName, unsubscribeToken, unsubscribeFromCartReminders }: Props) => {
    useEffect(() => {
        if (userName && unsubscribeToken) {
            unsubscribeFromCartReminders({ userName, unsubscribeToken });
        }
    }, [userName, unsubscribeToken]);

    return (
        <Page>
            <Zone contentId={id} zoneName="Content" />
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CartReminderUnsubscribePage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
        pageType: "System",
    },
};

export default pageModule;

export const CartReminderUnsubscribePageContext = "CartReminderUnsubscribePage";
