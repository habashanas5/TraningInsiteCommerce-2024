import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import PageProps from "@insite/client-framework/Types/PageProps";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { css } from "styled-components";

export interface LogoLinksSearchStyles {
    container: InjectableCss;
    logoWrapper: InjectableCss;
    searchMenuWrapper: InjectableCss;
    linkListHidden: HiddenProps;
}

export const logoLinksSearchStyles: LogoLinksSearchStyles = {
    container: {
        css: css`
            display: flex;
            justify-content: space-between;
        `,
    },
    logoWrapper: {
        css: css`
            text-align: left;
            padding: 20px 45px;
            margin: 0 24px;
            ${({ theme }) => {
                return breakpointMediaQueries(
                    theme,
                    [
                        null,
                        null,
                        css`
                            flex-grow: 1;
                        `,
                        null,
                        null,
                    ],
                    "max",
                );
            }}
            img {
                height: 78px;
                ${({ theme }) => {
                    return breakpointMediaQueries(
                        theme,
                        [
                            null,
                            null,
                            css`
                                height: 42px;
                                width: auto;
                                margin: 0;
                            `,
                            null,
                            null,
                        ],
                        "max",
                    );
                }}
            }
        `,
    },
    searchMenuWrapper: {
        css: css`
            text-align: right;
            padding: 20px 45px;
            ${({ theme }) => {
                return breakpointMediaQueries(
                    theme,
                    [
                        null,
                        css`
                            display: none;
                        `,
                        css`
                            flex-grow: 8;
                        `,
                        null,
                        null,
                    ],
                    "max",
                );
            }}
        `,
    },
    linkListHidden: {
        below: "lg",
    },
};

const LogoLinksSearch: React.FC<PageProps> = ({ id }) => (
    <StyledWrapper {...logoLinksSearchStyles.container}>
        <StyledWrapper {...logoLinksSearchStyles.logoWrapper}>
            <Zone contentId={id} zoneName="Logo" fixed />
        </StyledWrapper>
        <StyledWrapper {...logoLinksSearchStyles.searchMenuWrapper}>
            <Hidden {...logoLinksSearchStyles.linkListHidden}>
                <Zone contentId={id} zoneName="LinkList" fixed />
            </Hidden>
            <Zone contentId={id} zoneName="Search" fixed />
        </StyledWrapper>
    </StyledWrapper>
);

const logoLinksSearch: WidgetModule = {
    component: LogoLinksSearch,
    definition: {
        group: "Common",
        icon: "Filter",
    },
};

export default logoLinksSearch;
