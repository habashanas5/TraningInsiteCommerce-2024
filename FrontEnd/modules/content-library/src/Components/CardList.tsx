import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import React, { FC, useState } from "react";

import { StyledProp } from "@insite/mobius/utilities/InjectableCss";

export interface CardListStyles {
    gridContainer?: GridContainerProps;
}

export const cardListStyles: CardListStyles = {
    gridContainer: {
        gap: 40,
    },
};

const CardList: FC<{
    extendedStyles?: CardListStyles;
    css?: StyledProp;
}> = ({ extendedStyles, children, ...otherProps }) => {
    const [styles] = useState(() => mergeToNew(cardListStyles, extendedStyles));

    return (
        <GridContainer {...styles.gridContainer} {...otherProps}>
            {children}
        </GridContainer>
    );
};

export default CardList;
