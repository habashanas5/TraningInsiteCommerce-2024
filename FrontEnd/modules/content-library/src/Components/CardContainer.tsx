import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { css } from "styled-components";

export interface CardContainerStyles {
    cardDivider?: InjectableCss;
    gridItem?: GridItemProps;
}

export const cardContainerStyles: CardContainerStyles = {
    cardDivider: {
        css: css`
            width: calc(100% - 20px);
            margin: 0 10px;
            border-bottom: 1px solid ${getColor("common.border")};
        `,
    },
    gridItem: {
        width: 12,
    },
};

const CardContainer: FC<{
    extendedStyles?: CardContainerStyles;
}> = ({ extendedStyles, children }) => {
    const [styles] = React.useState(() => mergeToNew(cardContainerStyles, extendedStyles));

    return (
        <StyledWrapper {...styles.cardDivider} className="card_container__wrapper">
            <GridItem {...styles.gridItem}>{children}</GridItem>
        </StyledWrapper>
    );
};

export default CardContainer;
