import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { css } from "styled-components";

export interface CardContainerMultiColumnStyles {
    cardDivider?: InjectableCss;
    gridItem?: GridItemProps;
}

export const cardContainerMultiColumnStyles: CardContainerMultiColumnStyles = {
    gridItem: {
        width: [12, 12, 6, 4, 4],
        css: css`
            padding: 10px 0;
        `,
    },
    cardDivider: {
        css: css`
            padding: 15px;
            height: 100%;
            width: 100%;
            overflow: hidden;
            border-bottom: 1px solid ${getColor("common.border")};
        `,
    },
};

const CardContainerMultiColumn: FC<{
    extendedStyles?: CardContainerMultiColumnStyles;
}> = ({ extendedStyles, children, ...otherProps }) => {
    const [styles] = React.useState(() => mergeToNew(cardContainerMultiColumnStyles, extendedStyles));

    return (
        <GridItem {...styles.gridItem} {...otherProps}>
            <StyledWrapper {...styles.cardDivider}>{children}</StyledWrapper>
        </GridItem>
    );
};

export default CardContainerMultiColumn;
