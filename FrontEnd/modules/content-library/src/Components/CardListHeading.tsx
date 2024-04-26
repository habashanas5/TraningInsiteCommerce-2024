/* eslint-disable spire/export-styles */
import translate from "@insite/client-framework/Translate";
import GridContainer from "@insite/mobius/GridContainer";
import GridItem from "@insite/mobius/GridItem";
import ChevronRight from "@insite/mobius/Icons/ChevronRight";
import Link from "@insite/mobius/Link";
import Typography from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import * as React from "react";
import { css } from "styled-components";

interface OwnProps {
    heading: string;
    viewAllUrl?: string;
}

const CardListHeading: React.FunctionComponent<OwnProps> = ({ heading, viewAllUrl }) => {
    return (
        <GridItem width={12}>
            <GridContainer
                offsetCss={css`
                    border-bottom: 1px solid ${getColor("common.border")};
                    padding-top: 40px;
                    &&& {
                        width: 100%;
                    }
                `}
            >
                <GridItem width={8}>
                    <Typography variant="h5">{heading}</Typography>
                </GridItem>
                {viewAllUrl && (
                    <GridItem width={4}>
                        <Link
                            href={viewAllUrl}
                            icon={{ iconProps: { src: ChevronRight } }}
                            typographyProps={{ size: 15 }}
                            css={css`
                                margin-left: auto;
                                margin-top: 5px;
                            `}
                            data-test-selector="cardListHeadingViewAllLink"
                        >
                            {translate("View All")}
                        </Link>
                    </GridItem>
                )}
            </GridContainer>
        </GridItem>
    );
};

export default CardListHeading;
