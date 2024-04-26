/* eslint-disable spire/export-styles */
import translate from "@insite/client-framework/Translate";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import * as React from "react";

type Props = TypographyPresentationProps & {
    unitOfMeasure: DistanceUnitOfMeasure;
    distance: number;
};

export type DistanceUnitOfMeasure = "Imperial" | "Metric";

const DistanceDisplay: React.FC<Props> = ({ unitOfMeasure, distance, ...otherProps }) => {
    const unit = unitOfMeasure === "Imperial" ? translate("mi") : translate("km");

    if (unitOfMeasure === "Metric") {
        distance = distance * 1.60934;
    }

    const value = translate("Distance {0} {1}")
        .replace("{0}", `${distance.toFixed(2)}`)
        .replace("{1}", unit);

    return <Typography {...otherProps}>{value}</Typography>;
};

export default DistanceDisplay;
