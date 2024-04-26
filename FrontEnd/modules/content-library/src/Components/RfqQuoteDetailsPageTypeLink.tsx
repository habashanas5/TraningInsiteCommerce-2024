/* eslint-disable spire/export-styles */
import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";
import { FC } from "react";

interface OwnProps {
    title: string;
    quoteId: string;
}

type Props = OwnProps;

const RfqQuoteDetailsPageTypeLink: FC<Props> = ({ title, quoteId }) => {
    return createWidgetElement("Basic/PageTypeLink", {
        fields: {
            pageType: "RfqQuoteDetailsPage",
            overrideTitle: title,
            queryString: `quoteId=${quoteId}`,
        },
    });
};

export default RfqQuoteDetailsPageTypeLink;
