import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import Link, { LinkProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useState } from "react";
import { css } from "styled-components";

type Props = {
    alphabet: LetterDetails[];
    prefix?: string;
    extendedStyles?: AlphabetNavigationStyles;
    onLetterClick?: (letter: string) => void;
};

export interface LetterDetails {
    letter: string;
    linkable: boolean;
}

export interface AlphabetNavigationStyles {
    container?: InjectableCss;
    navigationItem?: InjectableCss;
    navigationLink?: LinkProps;
    navigationLinkText?: TypographyPresentationProps;
    navigationTextEmpty?: TypographyPresentationProps;
}

export const alphabetNavigationStyles: AlphabetNavigationStyles = {
    container: {
        css: css`
            text-transform: uppercase;
            justify-items: center;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        `,
    },
    navigationItem: {
        css: css`
            margin: 0;
            display: inline-block;
            flex: 0 0 30px;
        `,
    },
    navigationLink: {
        css: css`
            display: block;
        `,
        typographyProps: {
            transform: "uppercase",
            variant: "headerTertiary",
            forwardAs: "span",
        },
    },
    navigationTextEmpty: {
        transform: "uppercase",
        variant: "headerTertiary",
        forwardAs: "span",
        color: "text.disabled",
    },
};

const StyledSpan = getStyledWrapper("span");

const AlphabetNavigation: FC<Props> = (props: Props) => {
    const [styles] = useState(() => mergeToNew(alphabetNavigationStyles, props.extendedStyles));
    const [alphabet] = useState(() => props.alphabet);

    const handleClickOfLetter = (letter: string) => {
        props.onLetterClick?.(letter);
    };
    const createHandleClickOfLetter = (letter: string) => () => {
        const letterElement = document.getElementById(`${props.prefix || ""}letter-${letter}`);
        if (letterElement) {
            window.scrollTo(0, letterElement.offsetTop);
        }
        return handleClickOfLetter(letter);
    };

    if (alphabet.length <= 0) {
        return null;
    }

    return (
        <StyledWrapper {...styles.container} data-test-selector="alphabetNavigation">
            {alphabet.map(alphabetItem => (
                <StyledSpan
                    {...styles.navigationItem}
                    key={alphabetItem.letter}
                    data-test-selector="alphabetNavigationItemLetter"
                >
                    {alphabetItem.linkable ? (
                        <Link {...styles.navigationLink} onClick={createHandleClickOfLetter(alphabetItem.letter)}>
                            <u>{alphabetItem.letter}</u>
                        </Link>
                    ) : (
                        <Typography {...styles.navigationTextEmpty}>{alphabetItem.letter}</Typography>
                    )}
                </StyledSpan>
            ))}
        </StyledWrapper>
    );
};

export default AlphabetNavigation;
