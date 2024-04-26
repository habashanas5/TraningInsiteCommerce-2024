/* eslint-disable spire/export-styles */
import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";

interface OwnProps {
    title: string;
    invoiceNumber: string;
}

type Props = OwnProps;

const InvoiceDetailPageTypeLink: React.FunctionComponent<Props> = ({ title, invoiceNumber }) => {
    return createWidgetElement("Basic/PageTypeLink", {
        fields: {
            pageType: "InvoiceDetailsPage",
            overrideTitle: title,
            queryString: `invoiceNumber=${invoiceNumber}`,
        },
    });
};

export default InvoiceDetailPageTypeLink;
