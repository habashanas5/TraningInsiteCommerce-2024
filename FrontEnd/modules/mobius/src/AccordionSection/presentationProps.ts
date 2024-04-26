import { ComponentThemeProps } from "@insite/mobius/globals/baseTheme";

const AccordionPresentationPropsDefault: ComponentThemeProps["accordion"]["sectionDefaultProps"] = {
    titleTypographyProps: {
        variant: "body",
        forwardAs: "span",
        weight: "bold",
        color: "text.main",
    },
    toggleIconProps: {
        color: "text.main",
        src: "ChevronDown",
    },
};

export default AccordionPresentationPropsDefault;
