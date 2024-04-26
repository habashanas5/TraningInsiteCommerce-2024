import { headerShipToAddressStyles } from "@insite/content-library/Widgets/Common/HeaderShipToAddress";
import { css } from "styled-components";

headerShipToAddressStyles.titleIcon = {
    size: 22,
    color: "white",
};

headerShipToAddressStyles.titleTypography = {
    css: css`
        margin-left: 10px;
        color: white;
    `,
    ellipsis: true,
    transform: "uppercase",
};
