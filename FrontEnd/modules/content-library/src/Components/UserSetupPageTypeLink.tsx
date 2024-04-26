/* eslint-disable spire/export-styles */
import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";

interface OwnProps {
    title: string;
    userId: string;
}

type Props = OwnProps;

const UserSetupPageTypeLink: React.FunctionComponent<Props> = ({ title, userId }) => {
    return createWidgetElement("Basic/PageTypeLink", {
        fields: {
            pageType: "UserSetupPage",
            overrideTitle: title,
            queryString: `userId=${userId}`,
        },
    });
};

export default UserSetupPageTypeLink;
