import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { setMainNavigation } from "@insite/client-framework/Components/ShellHoleConnect";
import Logger from "@insite/client-framework/Logger";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import {
    getCategoriesDataView,
    getCategoryDepthLoaded,
    getCategoryState,
    getSubCategoryIds,
} from "@insite/client-framework/Store/Data/Categories/CategoriesSelectors";
import loadCategories from "@insite/client-framework/Store/Data/Categories/Handlers/LoadCategories";
import loadCategory from "@insite/client-framework/Store/Data/Categories/Handlers/LoadCategory";
import { getPageLinkByNodeId, getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { StylesContext } from "@insite/content-library/additionalStyles";
import MainNavigationItem from "@insite/content-library/Components/MainNavigationItem";
import NavigationDrawer from "@insite/content-library/Components/NavigationDrawer";
import SearchInput, { SearchInputStyles } from "@insite/content-library/Widgets/Header/SearchInput";
import Button, { ButtonIcon, ButtonPresentationProps } from "@insite/mobius/Button";
import { GridContainerProps } from "@insite/mobius/GridContainer";
import { GridItemProps } from "@insite/mobius/GridItem";
import Hidden from "@insite/mobius/Hidden";
import { IconProps } from "@insite/mobius/Icon";
import Search from "@insite/mobius/Icons/Search";
import X from "@insite/mobius/Icons/X";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import { MenuPresentationProps } from "@insite/mobius/Menu";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import { PopoverPresentationProps, PositionStyle } from "@insite/mobius/Popover";
import { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    links = "links",
    showQuickOrder = "showQuickOrder",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.links]: LinkModel[];
        [fields.showQuickOrder]: boolean;
    };
}

interface LinkModel {
    fields: {
        openInNewWindow: boolean;
        destination: LinkFieldValue;
        linkType: "Link" | "MegaMenu" | "CascadingMenu";
        overrideTitle: string;
        title: string;
        numberOfColumns: number;
        maxDepth: number;
    };
}

export interface MappedLink {
    title: string;
    url: string;
    type?: string;
    excludeFromNavigation?: boolean;
    openInNewWindow?: boolean;
    numberOfColumns?: number;
    maxDepth?: number;
    childrenType?: "MegaMenu" | "CascadingMenu";
    children?: MappedLink[];
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => {
    const {
        fields: { links },
    } = ownProps;
    const mappedLinks = [];
    const categoryIdsToLoad: Dictionary<number> = {};

    for (const link of links) {
        const {
            fields: { linkType, destination, openInNewWindow, overrideTitle, numberOfColumns, maxDepth, title },
        } = link;
        const { type, value } = destination;

        const depthToLoad = linkType === "MegaMenu" ? 2 : maxDepth;

        let mappedLink: MappedLink | undefined;

        if (type === "Url") {
            mappedLink = {
                url: value,
                title,
            };
        } else if (type === "Page") {
            const readonlyPageLink = getPageLinkByNodeId(state, value);
            if (readonlyPageLink) {
                mappedLink = { ...readonlyPageLink };
                if (overrideTitle) {
                    mappedLink.title = overrideTitle;
                }
            }
        } else if (type === "Category") {
            mappedLink = setupCategoryLink(state, value, categoryIdsToLoad, depthToLoad, overrideTitle);
        }

        if (!mappedLink) {
            continue;
        }

        mappedLink.openInNewWindow = openInNewWindow;
        mappedLink.numberOfColumns = numberOfColumns;
        mappedLink.maxDepth = maxDepth;

        if (linkType === "MegaMenu" || linkType === "CascadingMenu") {
            mappedLink.childrenType = linkType;
        }

        mappedLinks.push(mappedLink);
    }

    return {
        links: mappedLinks,
        quickOrderLink: getPageLinkByPageType(state, "QuickOrderPage"),
        categoryIdsToLoad,
        allowQuickOrder: getSettingsCollection(state).orderSettings.allowQuickOrder,
        categoryErrorStatusCodeById: state.data.categories.errorStatusCodeById,
        displayChangeCustomerLink: state.context?.session?.displayChangeCustomerLink,
    };
};

const getParameter = (categoryId: string, maxDepth: number) => ({
    maxDepth,
    startCategoryId: categoryId === emptyGuid ? undefined : categoryId,
    includeStartCategory: categoryId !== emptyGuid,
});

const setupCategoryLink = (
    state: ApplicationState,
    value: string,
    categoryIdsToLoad: Dictionary<number>,
    maxDepth: number,
    overrideTitle: string,
) => {
    let mappedLink: MappedLink | undefined;

    if (!value) {
        return;
    }

    const depthLoaded = getCategoryDepthLoaded(state, value);
    const subCategoryIds = getSubCategoryIds(state, value);
    if (
        (depthLoaded < maxDepth || !subCategoryIds) &&
        !getCategoriesDataView(state, getParameter(value, maxDepth)).isLoading
    ) {
        categoryIdsToLoad[value] = maxDepth;
    } else {
        if (value === emptyGuid) {
            mappedLink = {
                url: "",
                title: overrideTitle || translate("Products"),
            };
        } else {
            const categoryState = getCategoryState(state, value);
            if (!categoryState.value) {
                if (
                    !categoryState.isLoading &&
                    !getCategoriesDataView(state, getParameter(value, maxDepth)).isLoading
                ) {
                    categoryIdsToLoad[value] = maxDepth;
                }
                return;
            }
            mappedLink = {
                url: categoryState.value.path,
                title: overrideTitle || categoryState.value.shortDescription,
            };
        }

        loadSubCategories(mappedLink, subCategoryIds, 1, maxDepth, state);
    }

    return mappedLink;
};

const loadSubCategories = (
    mappedLink: MappedLink,
    subCategoryIds: readonly string[] | undefined,
    currentDepth: number,
    maxDepth: number,
    state: ApplicationState,
) => {
    if (currentDepth > maxDepth) {
        return;
    }
    mappedLink.children = [];
    if (!subCategoryIds) {
        return;
    }
    for (const subCategoryId of subCategoryIds) {
        const subCategory = getCategoryState(state, subCategoryId).value;
        if (!subCategory) {
            Logger.error(`Category ${subCategoryId} was not found in data state, excluding from navigation.`);
            continue;
        }
        const childLink: MappedLink = {
            url: subCategory.path,
            title: subCategory.shortDescription,
            children: [],
        };
        mappedLink.children.push(childLink);

        loadSubCategories(childLink, subCategory.subCategoryIds, currentDepth + 1, maxDepth, state);
    }
};

const mapDispatchToProps = {
    loadCategories,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

interface State {
    selectedLinkIndex?: number;
    mobileSearchModalIsOpen: boolean;
}

export interface MainNavigationStyles {
    menuHeight: number;
    container?: InjectableCss;
    itemWrapper?: InjectableCss;
    quickOrderItemWrapper?: InjectableCss;
    menuItem?: InjectableCss;
    menuItemIcon?: IconProps;
    menuItemTypography?: TypographyPresentationProps;
    cascadingMenu?: MenuPresentationProps;
    megaMenu?: PopoverPresentationProps;
    megaMenuGridContainer?: GridContainerProps;
    megaMenuGridItem?: GridItemProps;
    megaMenuHeading?: LinkPresentationProps;
    megaMenuLink?: LinkPresentationProps;
    mobileWrapper?: InjectableCss;
    mobileMenuWrapper?: InjectableCss;
    mobileSearchButton?: ButtonPresentationProps;
    mobileSearchWrapper?: InjectableCss;
    mobileSearchModal?: ModalPresentationProps;
    mobileSearchInputWrapper?: InjectableCss;
    mobileSearchInputStyles?: SearchInputStyles;
    mobileSearchModalCloseIcon?: IconProps;
}

export const mainNavigationStyles: MainNavigationStyles = {
    menuHeight: 50,
    container: {
        css: css`
            color: ${getColor("common.background")};
            padding: 0 16px 0 45px;
            display: flex;
            justify-content: left;
        `,
    },
    itemWrapper: {
        css: css`
            position: relative;
            overflow: visible;
            display: flex;
            &:hover span + div {
                display: block;
            }
            &:first-child {
                margin-left: -10px;
            }
        `,
    },
    quickOrderItemWrapper: {
        css: css`
            margin-left: auto;
            margin-right: 0;
        `,
    },
    megaMenuGridItem: {
        css: css`
            display: block;
        `,
    },
    megaMenuHeading: {
        css: css`
            font-weight: bold;
            margin-bottom: 8px;
        `,
    },
    menuItem: {
        css: css`
            display: flex;
            align-items: center;
            height: 50px;
            padding: 0 10px;
        `,
    },
    menuItemIcon: {
        css: css`
            margin: -3px 0 0 10px;
        `,
        size: 18,
        color: "secondary.contrast",
    },
    menuItemTypography: {
        variant: "headerSecondary",
        color: "secondary.contrast",
        css: css`
            font-weight: 800;
        `,
    },
    megaMenu: {
        transitionDuration: "short",
        contentBodyProps: {
            _height: "1200px",
            css: css`
                padding: 20px 30px;
            `,
        },
    },
    mobileSearchButton: {
        size: 48,
        buttonType: "solid",
        color: "secondary",
        css: css`
            padding: 0 10px;
        `,
    },
    mobileWrapper: {
        css: css`
            display: flex;
            justify-content: space-between;
        `,
    },
    mobileSearchWrapper: {
        css: css`
            text-align: right;
        `,
    },
    mobileMenuWrapper: {
        css: css`
            text-align: right;
        `,
    },
    mobileSearchInputWrapper: {
        css: css`
            display: flex;
            align-items: center;
        `,
    },
    mobileSearchInputStyles: {
        input: {
            cssOverrides: {
                formField: css`
                    width: 100%;
                `,
            },
        },
        popover: {
            wrapperProps: {
                css: css`
                    width: calc(100% - 45px);
                `,
            },
        },
        popoverContentBody: {
            as: "div",
            _height: "100%",
            css: css`
                box-shadow: none;
            `,
        },
        autocompleteWrapper: {
            css: css`
                display: flex;
                flex-direction: column;
            `,
        },
        autocompleteColumnWrapper: {
            css: css`
                display: flex;
                flex-direction: column;
                width: 100%;
                padding: 0 50px 0 30px;
            `,
        },
        searchHistoryStyles: {
            wrapper: {
                css: css`
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    padding: 0 50px 15px 30px;
                `,
            },
        },
        autocompleteProductsStyles: {
            titleLink: {
                css: css`
                    width: 100%;
                `,
            },
            erpNumberText: {
                css: css`
                    width: 100%;
                    text-align: left;
                    margin: 5px 0 0 0;
                `,
            },
        },
    },
    mobileSearchModalCloseIcon: {
        src: X,
        size: 18,
        css: css`
            margin-left: 10px;
        `,
    },
};

export class MainNavigation extends React.Component<Props, State> {
    container = React.createRef<HTMLDivElement>();
    mobileSearchInput = React.createRef<HTMLInputElement>();

    constructor(props: Props) {
        super(props);

        this.state = {
            mobileSearchModalIsOpen: false,
        };
    }

    UNSAFE_componentWillMount(): void {
        this.loadCategoriesIfNeeded();

        setMainNavigation({
            close: () => {
                this.setState({
                    selectedLinkIndex: undefined,
                });
            },
            openMenu: (index: number) => {
                this.setState({
                    selectedLinkIndex: index,
                });
            },
        });
    }

    componentDidUpdate(prevProps: Readonly<Props>): void {
        this.loadCategoriesIfNeeded();
    }

    loadCategoriesIfNeeded() {
        const { categoryIdsToLoad } = this.props;
        for (const categoryId of Object.keys(categoryIdsToLoad)) {
            if (!this.props.categoryErrorStatusCodeById?.[categoryId]) {
                const maxDepth = categoryIdsToLoad[categoryId];
                this.props.loadCategories(getParameter(categoryId, maxDepth));
            }
        }
    }

    getMobileSearchAutocompletePosition = (element: React.RefObject<HTMLUListElement>) => {
        const positionStyle: PositionStyle = {
            position: "fixed",
        };

        if (element.current) {
            const rect = element.current.getBoundingClientRect();
            positionStyle.top = rect.top + rect.height;
            positionStyle.left = 0;
            positionStyle.width = `${document.documentElement.clientWidth}px`;
            positionStyle.height = `${document.documentElement.clientHeight - positionStyle.top}px`;
        }

        return positionStyle;
    };

    mobileSearchButtonClickHandler = () => {
        this.setState({ mobileSearchModalIsOpen: true }, () => {
            setTimeout(() => {
                if (this.mobileSearchInput?.current) {
                    this.mobileSearchInput.current.focus();
                    this.mobileSearchInput.current.click();
                }
            }, 250);
        });
    };

    mobileSearchModalCloseHandler = () => {
        this.setState({ mobileSearchModalIsOpen: false });
    };

    render() {
        const {
            links,
            quickOrderLink,
            fields: { showQuickOrder },
            id,
            allowQuickOrder,
        } = this.props;
        const { selectedLinkIndex } = this.state;

        const showQuickOrderLink = showQuickOrder && allowQuickOrder;
        const mainNavContextStyles = this?.context?.styles?.mainNavigation ?? {};
        const styles = mergeToNew(mainNavigationStyles, mainNavContextStyles);

        return (
            <>
                <StyledWrapper {...styles.mobileWrapper}>
                    <Hidden above="md" {...styles.mobileMenuWrapper}>
                        <NavigationDrawer
                            links={links}
                            showQuickOrder={showQuickOrderLink}
                            quickOrderLink={quickOrderLink}
                        />
                    </Hidden>
                    <Hidden above="sm" {...styles.mobileSearchWrapper}>
                        <Button {...styles.mobileSearchButton} onClick={this.mobileSearchButtonClickHandler}>
                            <ButtonIcon src={Search} />
                            <VisuallyHidden>{translate("Search")}</VisuallyHidden>
                        </Button>
                    </Hidden>
                </StyledWrapper>
                <Hidden below="lg">
                    <StyledWrapper {...styles.container} ref={this.container}>
                        {links.map((link, index) => {
                            return (
                                // eslint-disable-next-line react/no-array-index-key
                                <StyledWrapper {...styles.itemWrapper} key={index}>
                                    <MainNavigationItem
                                        index={index}
                                        link={link}
                                        styles={styles}
                                        container={this.container}
                                        isOpen={index === selectedLinkIndex}
                                        displayChangeCustomerLink={this.props.displayChangeCustomerLink}
                                    />
                                </StyledWrapper>
                            );
                        })}
                        {showQuickOrderLink && quickOrderLink && (
                            <StyledWrapper {...styles.itemWrapper}>
                                <StyledWrapper {...styles.quickOrderItemWrapper}>
                                    <Link
                                        typographyProps={styles.menuItemTypography}
                                        color={styles.menuItemTypography?.color}
                                        {...styles.menuItem}
                                        id="quickOrder"
                                        href={quickOrderLink.url}
                                    >
                                        {quickOrderLink.title}
                                    </Link>
                                </StyledWrapper>
                            </StyledWrapper>
                        )}
                    </StyledWrapper>
                </Hidden>
                <Modal
                    {...styles.mobileSearchModal}
                    isOpen={this.state.mobileSearchModalIsOpen}
                    closeOnEsc={true}
                    handleClose={this.mobileSearchModalCloseHandler}
                    headline={
                        <SearchInput
                            id={id}
                            inputRef={this.mobileSearchInput}
                            autocompletePositionFunction={this.getMobileSearchAutocompletePosition}
                            onBeforeGoToUrl={this.mobileSearchModalCloseHandler}
                            extendedStyles={styles.mobileSearchInputStyles}
                        />
                    }
                />
            </>
        );
    }
}

MainNavigation.contextType = StylesContext;

const mainNavigation: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MainNavigation),
    definition: {
        group: "Header",
        allowedContexts: ["Header"],
        fieldDefinitions: [
            {
                name: fields.links,
                editorTemplate: "ListField",
                onEditRow: (index: number, dispatch) => {
                    dispatch({
                        type: "SendToSite/OpenMainNavigation",
                        index,
                    });
                },
                onDoneEditingRow: dispatch => {
                    dispatch({
                        type: "SendToSite/CloseMainNavigation",
                    });
                },
                onLoad: dispatch => {
                    dispatch({
                        type: "SendToSite/CloseMainNavigation",
                    });
                },
                getDisplay: (item: HasFields, state) => {
                    const { type, value } = item.fields.destination;
                    const { overrideTitle, title } = item.fields;
                    if (type === "Page") {
                        const link = getPageLinkByNodeId(state, value);
                        return overrideTitle || link?.title;
                    }
                    if (type === "Category") {
                        if (overrideTitle) {
                            return overrideTitle;
                        }
                        if (value === emptyGuid) {
                            return "Products";
                        }
                        const categoryState = getCategoryState(state, value);
                        if (!categoryState.value) {
                            if (!categoryState.isLoading && value) {
                                return dispatch => {
                                    dispatch(
                                        loadCategory({
                                            id: value,
                                        }),
                                    );
                                };
                            }
                            return "";
                        }
                        return categoryState.value.shortDescription;
                    }
                    if (type === "Url") {
                        return title ?? value;
                    }
                    return value;
                },
                defaultValue: [],
                fieldType: "Translatable",
                fieldDefinitions: [
                    {
                        name: "linkType",
                        editorTemplate: "RadioButtonsField",
                        defaultValue: "Link",
                        isRequired: true,
                        options: [
                            {
                                displayName: "Link",
                                value: "Link",
                            },
                            {
                                displayName: "Mega Menu",
                                value: "MegaMenu",
                            },
                            {
                                displayName: "Cascading Menu",
                                value: "CascadingMenu",
                            },
                        ],
                    },
                    {
                        name: "destination",
                        editorTemplate: "LinkField",
                        defaultValue: {
                            value: "",
                            type: "Page",
                        },
                        isRequired: true,
                        allowUrls: item => item.fields.linkType === "Link",
                        showCategoryRoot: item => true,
                    },
                    {
                        name: "overrideTitle",
                        editorTemplate: "TextField",
                        defaultValue: "",
                        isVisible: item => item.fields.destination.type !== "Url",
                    },
                    {
                        name: "title",
                        editorTemplate: "TextField",
                        defaultValue: "",
                        isRequired: true,
                        isVisible: item => item.fields.destination.type === "Url",
                    },
                    {
                        name: "numberOfColumns",
                        editorTemplate: "DropDownField",
                        defaultValue: 6,
                        options: [{ value: 2 }, { value: 3 }, { value: 4 }, { value: 6 }],
                        isRequired: true,
                        isVisible: (item: HasFields) => item.fields.linkType === "MegaMenu",
                    },
                    {
                        name: "maxDepth",
                        editorTemplate: "DropDownField",
                        defaultValue: 3,
                        options: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }],
                        isRequired: true,
                        isVisible: (item: HasFields) => item.fields.linkType === "CascadingMenu",
                    },
                    {
                        name: "openInNewWindow",
                        editorTemplate: "CheckboxField",
                        defaultValue: false,
                        isVisible: (item: HasFields) => item.fields.linkType === "Link",
                    },
                ],
            },
            {
                name: fields.showQuickOrder,
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
            },
        ],
    },
};

export default mainNavigation;
