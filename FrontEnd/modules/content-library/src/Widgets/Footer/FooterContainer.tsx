import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { FooterContext } from "@insite/content-library/Pages/Footer";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {
    extendedStyles?: FooterContainerStyles;
}

export interface FooterContainerStyles {
    widgetGridContainer?: GridContainerProps;
    logoGridItem?: GridItemProps;
    linkList1GridItem?: GridItemProps;
    linkList2GridItem?: GridItemProps;
    linkList3GridItem?: GridItemProps;
    linkList4GridItem?: GridItemProps;
    subscribeGridItem?: GridItemProps;
    socialLinksGridItem?: GridItemProps;
    siteMapLinksGridItem?: GridItemProps;
    richContentGridItem?: GridItemProps;
    logoWrapper?: InjectableCss;
}

export const footerContainerStyles: FooterContainerStyles = {
    logoGridItem: {
        width: 12,
        css: css`
            width: 100%;
            display: flex;
            justify-content: center;
            img {
                height: 78px;
            }
        `,
    },
    linkList1GridItem: {
        width: [6, 6, 4, 2, 2],
    },
    linkList2GridItem: {
        width: [6, 6, 4, 2, 2],
    },
    linkList3GridItem: {
        width: [6, 6, 4, 2, 2],
    },
    linkList4GridItem: {
        width: [6, 6, 4, 2, 2],
    },
    subscribeGridItem: {
        width: [12, 12, 8, 4, 4],
    },
    socialLinksGridItem: {
        width: 12,
    },
    siteMapLinksGridItem: {
        width: 12,
    },
    richContentGridItem: {
        width: 12,
    },
    logoWrapper: {
        css: css`
            width: 110px;
        `,
    },
};

const FooterContainer: FC<OwnProps> = ({ id, extendedStyles }) => {
    const [styles] = React.useState(() => mergeToNew(footerContainerStyles, extendedStyles));
    return (
        <GridContainer {...styles.widgetGridContainer}>
            <GridItem {...styles.logoGridItem}>
                <StyledWrapper {...styles.logoWrapper}>
                    <Zone zoneName="Logo" contentId={id} />
                </StyledWrapper>
            </GridItem>
            <GridItem {...styles.linkList1GridItem}>
                <Zone zoneName="LinkList1" contentId={id} />
            </GridItem>
            <GridItem {...styles.linkList2GridItem}>
                <Zone zoneName="LinkList2" contentId={id} />
            </GridItem>
            <GridItem {...styles.linkList3GridItem}>
                <Zone zoneName="LinkList3" contentId={id} />
            </GridItem>
            <GridItem {...styles.linkList4GridItem}>
                <Zone zoneName="LinkList4" contentId={id} />
            </GridItem>
            <GridItem {...styles.subscribeGridItem}>
                <Zone zoneName="Subscribe" contentId={id} />
            </GridItem>
            <GridItem {...styles.socialLinksGridItem}>
                <Zone zoneName="SocialLinks" contentId={id} />
            </GridItem>
            <GridItem {...styles.siteMapLinksGridItem}>
                <Zone zoneName="SiteMapLinks" contentId={id} />
            </GridItem>
            <GridItem {...styles.richContentGridItem}>
                <Zone zoneName="RichContent" contentId={id} />
            </GridItem>
        </GridContainer>
    );
};

const footerContainer: WidgetModule = {
    component: FooterContainer,
    definition: {
        group: "Footer",
        allowedContexts: [FooterContext],
    },
};

export default footerContainer;
