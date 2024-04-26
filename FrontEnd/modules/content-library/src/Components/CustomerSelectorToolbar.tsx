import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import translate from "@insite/client-framework/Translate";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import Search from "@insite/mobius/Icons/Search";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useState } from "react";
import styled, { css } from "styled-components";

interface OwnProps {
    searchText?: string;
    onSearchTextChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    allowCreateAddress?: boolean;
    onCreateNewAddressClick?: React.EventHandler<React.MouseEvent>;
    isSearchDisabled?: boolean;
    extendedStyles?: CustomerSelectorToolbarStyles;
}

export interface CustomerSelectorToolbarStyles {
    wrapper?: InjectableCss;
    searchTextField?: TextFieldProps;
    searchButton?: ButtonPresentationProps;
    wideHidden?: HiddenProps;
    wideCreateNewAddressButton?: ButtonPresentationProps;
    narrowHidden?: HiddenProps;
    overflowMenu?: OverflowMenuPresentationProps;
    narrowCreateNewAddressClickable?: ClickablePresentationProps;
}

export const customerSelectorToolbarStyles: CustomerSelectorToolbarStyles = {
    wrapper: {
        css: css`
            display: flex;
            border-bottom: 1px solid ${getColor("common.border")};
            padding-bottom: 10px;
        `,
    },
    searchTextField: {
        cssOverrides: {
            formField: css`
                flex-basis: 50%;
            `,
        },
    },
    searchButton: {
        variant: "primary",
        css: css`
            margin-left: auto;
        `,
    },
    wideHidden: { below: "md" },
    wideCreateNewAddressButton: {
        variant: "tertiary",
        css: css`
            margin-left: 10px;
        `,
    },
    narrowHidden: { above: "sm" },
    overflowMenu: {
        cssOverrides: {
            wrapper: css`
                margin-left: 10px;
            `,
        },
    },
};

const ToolbarStyled = styled.div<InjectableCss>`
    ${({ css }) => css}
`;

const CustomerSelectorToolbar: FC<OwnProps> = ({
    allowCreateAddress = false,
    onCreateNewAddressClick,
    extendedStyles,
    searchText,
    onSearchTextChanged,
    onSearch,
    isSearchDisabled,
}) => {
    const [styles] = useState(() => mergeToNew(customerSelectorToolbarStyles, extendedStyles));

    return (
        <ToolbarStyled {...styles.wrapper}>
            <TextField
                {...styles.searchTextField}
                placeholder="Search Addresses"
                value={searchText}
                iconProps={{ src: Search }}
                onChange={onSearchTextChanged}
                aria-label={translate("enter search term")}
            />
            <Button {...styles.searchButton} onClick={onSearch} disabled={isSearchDisabled}>
                {translate("Search")}
            </Button>
            {allowCreateAddress && onCreateNewAddressClick && (
                <>
                    <Hidden {...styles.wideHidden}>
                        <Button
                            {...styles.wideCreateNewAddressButton}
                            onClick={onCreateNewAddressClick}
                            data-test-selector="customerSelectorToolbar_createNewAddress"
                        >
                            {translate("Create New Address")}
                        </Button>
                    </Hidden>
                    <Hidden {...styles.narrowHidden}>
                        <OverflowMenu position="end" {...styles.overflowMenu}>
                            <Clickable {...styles.narrowCreateNewAddressClickable} onClick={onCreateNewAddressClick}>
                                {translate("Create New Address")}
                            </Clickable>
                        </OverflowMenu>
                    </Hidden>
                </>
            )}
        </ToolbarStyled>
    );
};

export default CustomerSelectorToolbar;
