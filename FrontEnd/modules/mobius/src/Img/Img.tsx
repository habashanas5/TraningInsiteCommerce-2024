import { injectCss } from "@insite/mobius/utilities";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import qs from "qs";
import React from "react";
import styled from "styled-components";

interface ImagePresentationProps {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<ImgProps>;
}

export type ImgProps = MobiusStyledComponentProps<
    "img",
    ImagePresentationProps & {
        /** The URL to fetch the image from. If not provided, Img renders `null`. */
        src?: string;
        /** The alternative text to display in place of the image. */
        altText?: string;
        /** Controls whether the img is lazy or eager loaded, default is eager */
        loading?: string;
        // Event handler for screen readers accessing an image modal in ProductPrimaryImage.tsx
        onKeyPress?: React.KeyboardEventHandler<HTMLImageElement>;
    }
>;

function Img(props: ImgProps) {
    const { src, altText, loading, ...otherProps } = props;

    const dimensions = useQueryStringsDimensions(src);

    if (!src) {
        return null;
    }

    return (
        <StyledImg
            {...otherProps}
            loading={loading || "lazy"}
            src={src}
            alt={altText}
            width={dimensions.width}
            height={dimensions.height}
        />
    );
}

const useQueryStringsDimensions = (src?: string) => {
    return React.useMemo(() => {
        const queryStrings = src && /\?.*/.exec(src);
        const noDimensions = {
            width: "",
            height: "",
        };

        if (queryStrings) {
            const queryStringsObj = qs.parse(queryStrings[0], { ignoreQueryPrefix: true });

            if (!queryStringsObj.width || !queryStringsObj.height) {
                return noDimensions;
            }
            return queryStringsObj;
        }
        return noDimensions;
    }, [src]);
};

const StyledImg = styled.img<InjectableCss>`
    ${injectCss}
`;

export default Img;
