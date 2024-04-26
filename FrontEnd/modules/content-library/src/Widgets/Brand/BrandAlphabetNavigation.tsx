import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import AlphabetNavigation, {
    AlphabetNavigationStyles,
    LetterDetails,
} from "@insite/content-library/Widgets/Brand/AlphabetNavigation";
import React, { FC, useState } from "react";

interface Props {
    letterDetails: LetterDetails[];
    extendedStyles?: BrandAlphabetNavigationStyles;
    onBrandLetterClick?: (letter: string) => void;
}

export interface BrandAlphabetNavigationStyles {
    alphabetNavigation?: AlphabetNavigationStyles;
}

export const brandAlphabetNavigationStyles: BrandAlphabetNavigationStyles = {};

const BrandAlphabetNavigation: FC<Props> = ({ letterDetails, onBrandLetterClick, extendedStyles }) => {
    const [styles] = useState(() => mergeToNew(brandAlphabetNavigationStyles, extendedStyles));

    return (
        <AlphabetNavigation
            alphabet={letterDetails}
            extendedStyles={styles.alphabetNavigation}
            onLetterClick={onBrandLetterClick}
        />
    );
};

export default BrandAlphabetNavigation;
