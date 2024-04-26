import { useEagerLogoLoading } from "@insite/client-framework/Common/EagerLoadingLogo";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getHomePageUrl } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Img, { ImgProps } from "@insite/mobius/Img";
import { LazyImageProps } from "@insite/mobius/LazyImage";
import Link from "@insite/mobius/Link";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    homePageLink: getHomePageUrl(state),
});

const enum fields {
    logoImage = "logoImage",
    isMobileSpecific = "isMobileSpecific",
    mobileSpecificImage = "mobileSpecificImage",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.logoImage]: string;
        [fields.isMobileSpecific]: boolean;
        [fields.mobileSpecificImage]: string;
    };
    extendedStyles?: LogoStyles;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface LogoStyles {
    wrapper?: InjectableCss;
    /**
     * @deprecated Use img instead
     */
    image?: LazyImageProps;
    img?: ImgProps;
}

export const logoStyles: LogoStyles = {
    wrapper: {
        css: css`
            max-width: 110px;
            max-height: 110px;
        `,
    },
    image: {
        css: css`
            width: 100%;
        `,
    },
    img: {
        css: css`
            width: 100%;
        `,
    },
};

export const Logo: React.FunctionComponent<Props> = ({ fields, extendedStyles, homePageLink }: Props) => {
    const styles = useMergeStyles("logo", logoStyles, extendedStyles);
    const isEager = useEagerLogoLoading();

    return (
        <StyledWrapper {...styles.wrapper}>
            <Link href={homePageLink}>
                <Img
                    src={fields.logoImage}
                    loading={isEager ? "eager" : "lazy"}
                    altText={translate("Home")}
                    {...styles.img}
                />
            </Link>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(Logo),
    definition: {
        group: "Basic",
        icon: "Logo",
        fieldDefinitions: [
            {
                name: fields.logoImage,
                displayName: "Logo Image",
                editorTemplate: "ImagePickerField",
                defaultValue: "",
                fieldType: "Translatable",
            },
            {
                name: fields.isMobileSpecific,
                displayName: "Mobile Specific Image",
                editorTemplate: "CheckboxField",
                defaultValue: false,
                fieldType: "General",
                isRequired: true,
                variant: "toggle",
            },
            {
                name: fields.mobileSpecificImage,
                displayName: "Mobile Logo",
                editorTemplate: "ImagePickerField",
                defaultValue: "",
                fieldType: "Translatable",
                isVisible: widget => widget.fields.isMobileSpecific,
            },
        ],
    },
};

export default widgetModule;
