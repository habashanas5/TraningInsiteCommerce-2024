/* eslint-disable spire/export-styles */
import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";

interface OwnProps {
    title: string;
    id: string;
}

type Props = OwnProps;

const VmiLocationDetailTypeLink = ({ title, id }: Props) => {
    return createWidgetElement("Basic/PageTypeLink", {
        fields: {
            pageType: "VmiLocationDetailsPage",
            overrideTitle: title,
            queryString: `id=${id}`,
        },
    });
};

export default VmiLocationDetailTypeLink;
