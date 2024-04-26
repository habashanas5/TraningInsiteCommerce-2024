import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import * as React from "react";
import { css } from "styled-components";

export interface SkipNavStyles {
    skipToContent?: ButtonPresentationProps;
}

export const skipNavStyles: SkipNavStyles = {
    skipToContent: {
        variant: "primary",
        css: css`
            margin: 7px;
            position: absolute;
            clip: rect(0, 0, 0, 0);
            &:focus {
                clip: unset;
                z-index: 1;
            }
        `,
    },
};

interface OwnProps {
    text: string;
    destination?: React.RefObject<HTMLElement>;
    extendedStyles?: SkipNavStyles;
    focusFunction?: () => void;
}

const SkipNav: React.FC<OwnProps> = (props: OwnProps) => {
    const [styles] = React.useState(() => mergeToNew(skipNavStyles, props.extendedStyles));
    if (props.focusFunction) {
        return (
            <Button {...styles.skipToContent} onClick={props.focusFunction}>
                {props.text}
            </Button>
        );
    }
    return (
        <Button {...styles.skipToContent} onClick={() => props.destination?.current?.focus()}>
            {props.text}
        </Button>
    );
};

export default SkipNav;
