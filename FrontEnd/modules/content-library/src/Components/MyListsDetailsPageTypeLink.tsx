/* eslint-disable spire/export-styles */
import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";

interface OwnProps {
    title: string;
    wishListId: string;
    testSelector: string;
}

type Props = OwnProps;

const MyListsDetailsPageTypeLink: React.FunctionComponent<Props> = ({ title, wishListId, testSelector }) => {
    return createWidgetElement("Basic/PageTypeLink", {
        fields: {
            testSelector,
            pageType: "MyListsDetailsPage",
            overrideTitle: title,
            queryString: `id=${wishListId}`,
        },
    });
};

export default MyListsDetailsPageTypeLink;
