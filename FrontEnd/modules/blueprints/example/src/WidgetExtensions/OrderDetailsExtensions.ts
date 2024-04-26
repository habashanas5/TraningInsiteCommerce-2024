import { billingAddressStyles } from "@insite/content-library/Widgets/OrderDetails/OrderDetailsBillingAddress";
import { notesStyles } from "@insite/content-library/Widgets/OrderDetails/OrderDetailsNotes";
import { shippingAddressStyles } from "@insite/content-library/Widgets/OrderDetails/OrderDetailsShippingAddress";
import { titleStyles } from "@insite/content-library/Widgets/OrderDetails/OrderDetailsTitle";
import getColor from "@insite/mobius/utilities/getColor";
import { css } from "styled-components";

titleStyles.titleText = {
    variant: "h3",
};

billingAddressStyles.addressDisplay = {
    companyNameText: {
        underline: true,
    },
};

shippingAddressStyles.addressDisplay = {
    address1Text: {
        underline: true,
    },
};

notesStyles.wrapper = {
    css: css`
        border: 1px solid ${getColor("secondary")};
    `,
};
