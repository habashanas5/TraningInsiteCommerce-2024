import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { Ref } from "react";
import styled, { css } from "styled-components";

interface OwnProps {
    extendedStyles?: PaymetricDetailsEntryStyles;
}

export interface PaymetricDetailsEntryStyles {
    paymetricGridItem?: GridItemProps;
    paymetricIframe?: InjectableCss;
}

export const paymetricDetailsEntryStyles: PaymetricDetailsEntryStyles = {
    paymetricGridItem: {
        width: 12,
    },
    paymetricIframe: {
        css: css`
            width: 100%;
        `,
    },
};

const PaymetricIframe = styled.iframe<InjectableCss>`
    ${({ css }) => css}
`;

const PaymetricDetailsEntry = ({ extendedStyles }: OwnProps, ref: Ref<HTMLIFrameElement>) => {
    const [styles] = React.useState(() => mergeToNew(paymetricDetailsEntryStyles, extendedStyles));

    return (
        <GridItem {...styles.paymetricGridItem}>
            <PaymetricIframe id="paymetricIframe" ref={ref} {...styles.paymetricIframe} />
        </GridItem>
    );
};

export default React.forwardRef(PaymetricDetailsEntry);
