import useAppSelector from "@insite/client-framework/Common/Hooks/useAppSelector";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { getPageLinkByNodeId } from "@insite/client-framework/Store/Links/LinksSelectors";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Link from "@insite/mobius/Link";
import Pagination from "@insite/mobius/Pagination";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useEffect, useState } from "react";
import { css } from "styled-components";

const enum fields {
    nodeId = "nodeId",
    overrideTitle = "overrideTitle",
    defaultPageSize = "defaultPageSize",
}

export interface Props extends WidgetProps {
    fields: {
        [fields.overrideTitle]: string;
        [fields.nodeId]: LinkFieldValue;
        [fields.defaultPageSize]: number;
    };
}

export interface ItemListStyles {
    itemListWrapper?: InjectableCss;
    titleWrapper?: InjectableCss;
    title?: TypographyPresentationProps;
    linkWrapper?: InjectableCss;
}

export const itemListStyles: ItemListStyles = {
    itemListWrapper: {
        css: css`
            text-align: right;
            text-transform: uppercase;
            padding: 10px 0;
        `,
    },
    titleWrapper: {
        css: css`
            font-weight: bold;
        `,
    },
    linkWrapper: {
        css: css`
            padding: 1px 18px 0 0;
        `,
    },
};

export const ItemList = ({ fields: { overrideTitle, nodeId, defaultPageSize } }: Props) => {
    const rootPageLink = useAppSelector(state => getPageLinkByNodeId(state, nodeId?.value));

    const styles = useMergeStyles("itemList", itemListStyles);

    const [currentPage, setCurrentPage] = useState(1);
    const startingPageSize = defaultPageSize ?? 5;
    const [currentPageSize, setCurrentPageSize] = useState(startingPageSize);
    useEffect(() => {
        setCurrentPage(1);
        setCurrentPageSize(defaultPageSize ?? 5);
    }, [defaultPageSize]);

    const pageSizes = [startingPageSize, startingPageSize * 2, startingPageSize * 3, startingPageSize * 4];

    const filteredPages = rootPageLink?.children?.filter(o => !o.excludeFromNavigation);

    if (!rootPageLink || !filteredPages || filteredPages.length === 0) {
        return null;
    }

    return (
        <StyledWrapper css={styles.itemListWrapper}>
            <StyledWrapper {...styles.titleWrapper}>
                <Typography as="h3" {...styles.title}>
                    {overrideTitle || rootPageLink.title}
                </Typography>
            </StyledWrapper>
            {filteredPages.map((link, index) => {
                if (index < (currentPage - 1) * currentPageSize || index >= currentPage * currentPageSize) {
                    return;
                }

                return (
                    <StyledWrapper key={link.url} css={styles.linkWrapper}>
                        {link.url && <Link href={link.url}>{link.title}</Link>}
                    </StyledWrapper>
                );
            })}
            <Pagination
                {...styles.pagination}
                resultsCount={filteredPages.length}
                currentPage={currentPage}
                resultsPerPage={currentPageSize}
                resultsPerPageOptions={pageSizes}
                onChangePage={setCurrentPage}
                onChangeResultsPerPage={(event, pageSize) => setCurrentPageSize(pageSize)}
            />
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: ItemList,
    definition: {
        group: "Basic",
        icon: "NavigationList",
        fieldDefinitions: [
            {
                name: fields.overrideTitle,
                editorTemplate: "TextField",
                defaultValue: "",
                fieldType: "Translatable",
            },
            {
                name: fields.defaultPageSize,
                editorTemplate: "IntegerField",
                defaultValue: 5,
                fieldType: "General",
            },
            {
                name: fields.nodeId,
                displayName: "Page",
                editorTemplate: "LinkField",
                defaultValue: {
                    value: "",
                    type: "Page",
                },
                isRequired: true,
                fieldType: "General",
                allowUrls: () => false,
                allowCategories: () => false,
            },
        ],
    },
};

export default widgetModule;
