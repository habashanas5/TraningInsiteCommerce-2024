import AccordionSection from "@insite/mobius/AccordionSection";
import { AccordionSectionHeaderProps } from "@insite/mobius/AccordionSection/AccordionSectionHeader";
import AccordionSectionPanel from "@insite/mobius/AccordionSection/AccordionSectionPanel";
import * as React from "react";
import { css } from "styled-components";

const SideBarAccordionSection: React.FunctionComponent<{ title: string; inPopover?: boolean }> = ({
    title,
    children,
    inPopover,
}) => {
    const paddingValue = inPopover ? 30 : 35;
    return (
        <AccordionSection
            title={title}
            titleTypographyProps={{
                variant: "h6",
                css: css`
                    margin-bottom: 0;
                    margin-top: 0;
                `,
            }}
            headerProps={{
                css: css<AccordionSectionHeaderProps>`
                    background-color: transparent;
                    margin: ${inPopover ? "30px" : 0} -${inPopover ? paddingValue : 0}px 0;
                    &:hover {
                        background-color: #d4e0fd;
                        button {
                            span {
                                ${({ expanded, theme }) => !expanded && `color: ${theme.colors.primary.main};`}
                            }
                        }
                    }
                    button {
                        padding: 7px ${paddingValue}px;
                        border: 0;
                        background-color: transparent;
                        > span {
                            color: ${({ expanded, theme }) =>
                                expanded ? theme.colors.common.accentContrast : theme.colors.text.main};
                            font-weight: 400;
                        }
                        &:focus {
                            border: 0;
                            background-color: transparent;
                            padding: 7px ${paddingValue}px;
                            > span {
                                color: ${({ expanded, theme }) =>
                                    expanded ? theme.colors.primary.main : theme.colors.text.main};
                            }
                        }
                    }
                    ${/* sc-selector */ AccordionSectionPanel} + & button {
                        &:focus {
                            border: 0;
                            padding: 7px ${paddingValue}px;
                        }
                    }
                `,
            }}
            panelProps={{
                css: css`
                    border: 0;
                    padding: 0 ${paddingValue}px 0;
                    background-color: transparent;
                    margin: 0;
                    label {
                        white-space: normal;
                    }
                `,
            }}
        >
            {children}
        </AccordionSection>
    );
};

export default SideBarAccordionSection;
