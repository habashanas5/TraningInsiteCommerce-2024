/* eslint-disable spire/export-styles */
import { LocationModel } from "@insite/client-framework/Common/Hooks/useLocationFilterSearch";
import translate from "@insite/client-framework/Translate";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import * as React from "react";

type LocationContentLinkProps = LinkPresentationProps & {
    location: LocationModel;
    onOpenLocationContent: (location: LocationModel) => void;
};

const LocationContentLink: React.FC<LocationContentLinkProps> = ({
    location,
    onOpenLocationContent,
    ...otherProps
}) => {
    if (!location.htmlContent) {
        return null;
    }
    const handleContentClicked = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        onOpenLocationContent(location);
    };
    return (
        <Link onClick={handleContentClicked} {...otherProps}>
            {translate("Hours")}
        </Link>
    );
};

export default LocationContentLink;
