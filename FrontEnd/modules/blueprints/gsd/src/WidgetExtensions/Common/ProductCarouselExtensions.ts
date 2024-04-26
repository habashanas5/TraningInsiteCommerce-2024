import { productCarouselStyles } from "@insite/content-library/Widgets/Common/ProductCarousel";
import { css } from "styled-components";

productCarouselStyles.carouselContainer = {
    css: css`
            overflow: hidden;
            margin-bottom 50px;  // add some white space below the carousel
        `,
};
productCarouselStyles.titleText!.weight = "bolder";

productCarouselStyles.titleText = {
    variant: "h2",
    css: css`
        margin-top: 50px;
        text-align: center;
        margin-bottom: 10px;
    `,
};
