import { categoryDetailLinkListStyles } from "@insite/content-library/Widgets/Category/CategoryDetailLinkList";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { breakpointMediaQueries } from "@insite/mobius/utilities";
import { css } from "styled-components";

categoryDetailLinkListStyles.container = {
    css: css`
        ${({ theme }: { theme: BaseTheme }) =>
            breakpointMediaQueries(theme, [
                css`
                    display: none;
                `,
                css`
                    display: none;
                `,
                css``,
                css``,
                css``,
            ])}
    `,
};
