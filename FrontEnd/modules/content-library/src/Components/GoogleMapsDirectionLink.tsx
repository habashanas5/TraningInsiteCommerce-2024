/* eslint-disable spire/export-styles */
import translate from "@insite/client-framework/Translate";
import Link, { LinkProps } from "@insite/mobius/Link";
import * as React from "react";

type Props = LinkProps & {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
};

const GoogleMapsDirectionLink: React.FC<Props> = ({
    address1,
    address2,
    city,
    state,
    postalCode,
    target = "_blank",
    ...otherProps
}) => {
    const linkAddress = `http://maps.google.com/maps?daddr=${address1} ${address2}, ${city}, ${state} ${postalCode}`;
    return (
        <Link href={linkAddress} target={target} {...otherProps}>
            {translate("Directions")}
        </Link>
    );
};

export default GoogleMapsDirectionLink;
