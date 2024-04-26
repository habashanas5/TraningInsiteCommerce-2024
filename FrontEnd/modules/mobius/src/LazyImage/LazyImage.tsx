/* eslint-disable */
import * as React from "react";
import styled from "styled-components";
import { IconMemo, IconPresentationProps } from "../Icon";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import getProp from "../utilities/getProp";
import injectCss from "@insite/mobius/utilities/injectCss";
import resolveColor from "../utilities/resolveColor";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";
import qs from "qs";

export type LazyImagePresentationProps = {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<LazyImageProps>;
    /** Optional content to show while image is loading.
     * @themable */
    placeholder?: React.ReactNode;
    /** The height of the image.
     * @themable */
    height?: string;
    /** The width of the image.
     * @themable */
    width?: string;
    /** Props passed to the icon component that displays when the image fails to load.
     * @themable */
    errorIconProps?: IconPresentationProps;
    /** Props passed to the typography component that displays when the image fails to load.
     * @themable */
    errorTypographyProps?: TypographyPresentationProps;
};

export type LazyImageProps = MobiusStyledComponentProps<
    "div",
    LazyImagePresentationProps & {
        /** Props to be passed into the inner `img` element. */
        imgProps?: JSX.IntrinsicElements["img"];
        /** The URL to fetch the image from. If not provided, LazyImage renders `null`. */
        src?: string;
        /** The alternative text to display in place of the image. */
        altText?: string;
        /** Callback function that will be called when the image has finished loading. */
        onLoad?: () => void;
        /** Callback function that will be called if an error occurs when loading an image. */
        onError?: () => void;
        /** Allows to detect pdf generation */
        isShareEntity?: boolean;
    }
>;

// if the image loads in under this number of milliseconds, it doesn't fade in.
const fadeInThreshold = 100;

type State = {
    src?: string;
    loaded: boolean;
    error: boolean;
    startTime: number;
    imageShouldFade: boolean;
    showPlaceholder: boolean;
};

const LazyImageStyle = styled.div<Pick<State, "error" | "imageShouldFade" | "loaded"> & { isShareEntity?: boolean }>`
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: ${({ error, theme }) => (error ? resolveColor("common.accent", theme) : null)};
    ${({ error }) => error && "padding: 5px;"}
    width: ${getProp("width")};
    height: ${getProp("height")};
    overflow: hidden;
    img {
        width: 100%;
        height: auto;
        will-change: opacity;
        transition: opacity ${({ imageShouldFade }) => (imageShouldFade ? ".2s ease" : "0s")};
        ${({ loaded, isShareEntity }) => (isShareEntity ? "" : loaded ? "opacity: 1;" : "opacity: 0;")}
        ${({ error }) => error && "padding: 3px;"}
    }
    .LazyImage-Placeholder {
        width: 100%;
        height: 100%;
        position: absolute;
        will-change: opacity;
        transition: opacity ${({ imageShouldFade }) => (imageShouldFade ? ".2s ease" : "0s")};
        ${({ loaded, isShareEntity }) => (isShareEntity ? "" : loaded ? "opacity: 0;" : "opacity: 1;")}
    }
    p {
        text-align: center;
        display: inline-block;
        padding: 3px;
        width: 100%;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }
    ${injectCss}
`;

/**
 * Defers loading of an image until after its first render. If the asset takes over 100ms to load, the image is faded
 * into view.
 */
class LazyImage extends React.Component<LazyImageProps, State> {
    constructor(props: LazyImageProps) {
        super(props);

        const queryString = props.src && /\?.*/.exec(props.src);

        if (queryString) {
            const obj = qs.parse(queryString[0], { ignoreQueryPrefix: true });

            this.width = obj.width;
            this.height = obj.height;
        } else {
            this.width = "";
            this.height = "";
        }
    }

    image?: HTMLImageElement;
    fadeInTimeout?: number;
    width?: number | string;
    height?: number | string;

    state: State = {
        loaded: false,
        error: false,
        startTime: 0,
        imageShouldFade: false,
        showPlaceholder: false,
    };

    loadImage = () => {
        this.image = new Image();
        if (this.props.src) this.image.src = this.props.src;
        this.image.onload = () => {
            this.setState(
                currentState => ({
                    // fade if image takes more than 100ms to load (i.e. not cached)
                    imageShouldFade: Date.now() - currentState.startTime > fadeInThreshold,
                    loaded: true,
                    src: this.props.src,
                }),
                this.props.onLoad,
            );
        };
        this.image.onerror = () => {
            this.setState(
                {
                    loaded: true,
                    error: true,
                },
                this.props.onError,
            );
        };
    };

    reloadImage() {
        this.setState({ startTime: Date.now() });
        this.loadImage();
        this.fadeInTimeout = setTimeout(() => {
            this.setState({ showPlaceholder: true });
        }, fadeInThreshold);
    }

    componentDidMount() {
        this.reloadImage();
    }

    componentDidUpdate(prevProps: LazyImageProps) {
        if (this.props.src !== prevProps.src) {
            this.reloadImage();
        }
    }

    componentWillUnmount() {
        if (!this.image) return;

        this.image.onload = () => {};
        delete this.image;
        clearTimeout(this.fadeInTimeout);
    }

    render() {
        const { css, src: propSrc, placeholder, imgProps, altText, isShareEntity, ...otherProps } = this.props;
        const { error, imageShouldFade, loaded, showPlaceholder, src: stateSrc } = this.state;

        if (!propSrc) return null;

        const { spreadProps } = applyPropBuilder(this.props, { component: "lazyImage" });
        return (
            <LazyImageStyle {...{ css, error, imageShouldFade, loaded, isShareEntity }} {...otherProps}>
                {showPlaceholder && <span className="LazyImage-Placeholder">{placeholder}</span>}
                {loaded && error && <IconMemo {...spreadProps("errorIconProps")} title={altText} />}
                {!error && (
                    <img
                        width={this.width}
                        height={this.height}
                        alt={altText}
                        src={loaded && !error ? stateSrc : propSrc}
                        {...imgProps}
                    />
                )}
                {error && (
                    <Typography {...spreadProps("errorTypographyProps")} as="p">
                        {altText}
                    </Typography>
                )}
            </LazyImageStyle>
        );
    }

    static defaultProps = {
        height: "100%",
        width: "auto",
    };
}

/** @component */
export default LazyImage;

export { LazyImageStyle };
