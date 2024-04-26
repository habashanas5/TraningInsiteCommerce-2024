import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import {
    addSearchHistory,
    getSearchHistory,
    SearchHistoryItem,
} from "@insite/client-framework/Services/AutocompleteService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import getAutocompleteModel from "@insite/client-framework/Store/CommonHandlers/GetAutocompleteModel";
import sendSearchTracking from "@insite/client-framework/Store/CommonHandlers/SendSearchTracking";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import translate from "@insite/client-framework/Translate";
import { AutocompleteItemModel, AutocompleteModel } from "@insite/client-framework/Types/ApiModels";
import AutocompleteBrands, {
    AutocompleteBrandsStyles,
} from "@insite/content-library/Widgets/Header/AutocompleteBrands";
import AutocompleteCategories, {
    AutocompleteCategoriesStyles,
} from "@insite/content-library/Widgets/Header/AutocompleteCategories";
import AutocompleteContent, {
    AutocompleteContentStyles,
} from "@insite/content-library/Widgets/Header/AutocompleteContent";
import AutocompleteProducts, {
    AutocompleteProductsStyles,
} from "@insite/content-library/Widgets/Header/AutocompleteProducts";
import SearchHistory, { SearchHistoryStyles } from "@insite/content-library/Widgets/Header/SearchHistory";
import { FormFieldSizeVariant } from "@insite/mobius/FormField";
import { sizeVariantValues } from "@insite/mobius/FormField/formStyles";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Search from "@insite/mobius/Icons/Search";
import Popover, {
    ContentBodyProps,
    OverflowWrapperProps,
    PopoverPresentationProps,
    PositionStyle,
} from "@insite/mobius/Popover";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css, ThemeProps, withTheme } from "styled-components";

interface OwnProps {
    /** A unique identifier to assist with id-generation for `aria-controls`. */
    readonly id: string;
    inputRef?: React.Ref<HTMLInputElement>;
    autocompletePositionFunction?: (element: React.RefObject<HTMLUListElement>) => PositionStyle;
    onBeforeGoToUrl?: () => void;
    extendedStyles?: SearchInputStyles;
}

const mapStateToProps = (state: ApplicationState) => {
    const {
        searchSettings: { autocompleteEnabled, searchHistoryEnabled, searchHistoryLimit, searchPath },
    } = getSettingsCollection(state);
    return {
        autocompleteEnabled,
        searchHistoryEnabled,
        searchHistoryLimit,
        location: getLocation(state),
        searchPath,
    };
};

const mapDispatchToProps = {
    getAutocompleteModel,
    sendSearchTracking,
};

type Props = OwnProps &
    ThemeProps<BaseTheme> &
    HasHistory &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps>;

interface State {
    query: string;
    focusableAutocompleteItems: AutocompleteItemModel[];
    focusedAutocompleteItem?: AutocompleteItemModel;
    focusedSearchHistoryQuery?: string;
    autoCompleteModel?: AutocompleteModel;
    isLoading: boolean;
}

const DOWN_KEY = 40;
const UP_KEY = 38;
const ENTER_KEY = 13;

export interface SearchInputStyles {
    input?: TextFieldPresentationProps;
    popover?: PopoverPresentationProps;
    popoverWrapper?: OverflowWrapperProps;
    popoverContentBody?: ContentBodyProps;
    autocompleteWrapper?: InjectableCss;
    autocompleteColumnWrapper?: InjectableCss;
    searchHistoryStyles?: SearchHistoryStyles;
    autocompleteCategoriesStyles?: AutocompleteCategoriesStyles;
    autocompleteBrandsStyles?: AutocompleteBrandsStyles;
    autocompleteContentStyles?: AutocompleteContentStyles;
    autocompleteProductsStyles?: AutocompleteProductsStyles;
}

export const searchInputStyles: SearchInputStyles = {
    input: {
        sizeVariant: "default",
        iconProps: { src: Search },
        border: "underline",
        cssOverrides: {
            formField: css`
                width: 250px;
            `,
        },
    },
    popover: {
        transitionDuration: "short",
        toggle: false,
    },
    popoverWrapper: {
        as: "div",
        _height: "auto",
        css: css`
            display: inline-flex;
            justify-content: flex-end;
        `,
    },
    popoverContentBody: {
        as: "div",
        _height: "100%",
    },
    autocompleteWrapper: {
        css: css`
            display: flex;
            flex-direction: row;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        null,
                        css`
                            flex-direction: column-reverse;
                        `,
                    ],
                    "max",
                )}
        `,
    },
    autocompleteColumnWrapper: {
        css: css`
            display: flex;
            flex-direction: column;
            width: 375px;
            padding: 0 20px 15px 20px;
        `,
    },
};

const styles = searchInputStyles;

class SearchInput extends React.Component<Props, State> {
    private readonly styles: SearchInputStyles;

    constructor(props: Props) {
        super(props);

        this.styles = mergeToNew(styles, props.extendedStyles);

        this.state = {
            query: "",
            focusableAutocompleteItems: [],
            isLoading: false,
        };
    }

    list = React.createRef<HTMLUListElement>();
    popover = React.createRef<HTMLUListElement>();
    showAutocomplete = true;

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            // clear the search box on navigate away from search
            if (!this.props.location.pathname.toLowerCase().startsWith(`/${this.props.searchPath.toLowerCase()}`)) {
                // TODO ISC-12679 - Redesign so that this can be moved to a field of the class rather than state.
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState({ query: "" });
            } else {
                this.closeAutocomplete();
            }
        }
        if (
            this.state.autoCompleteModel &&
            prevState.autoCompleteModel &&
            this.state.autoCompleteModel !== prevState.autoCompleteModel
        ) {
            this.updateFocusableItems();
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize, true);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize = () => {
        this.updateFocusableItems();
    };

    updateFocusableItems = () => {
        if (this.state.isLoading || !this.state.autoCompleteModel) {
            return;
        }

        const { categories, brands, content, products } = this.state.autoCompleteModel;
        const isProductsOnTop = window.innerWidth < this.props.theme.breakpoints.values[3];
        const newFocusableOptions = isProductsOnTop
            ? (products || ([] as AutocompleteItemModel[]))
                  .concat(categories || [])
                  .concat(brands || [])
                  .concat(content || [])
            : (categories || [])
                  .concat(brands || [])
                  .concat(content || [])
                  .concat(products || []);
        this.setState({
            focusableAutocompleteItems: newFocusableOptions,
            focusedAutocompleteItem: undefined,
            focusedSearchHistoryQuery: undefined,
        });
    };

    doSearch = () => {
        if (this.state.query.trim() === "") {
            return;
        }

        this.showAutocomplete = false;
        if (this.state.autoCompleteModel?.products?.length === 1) {
            this.goToUrl(this.state.autoCompleteModel?.products[0].url);
        } else {
            this.goToUrl(`/${this.props.searchPath}?query=${this.state.query}`, false);
        }
        if (this.props.searchHistoryEnabled) {
            addSearchHistory(this.state.query, this.props.searchHistoryLimit);
        }
    };

    loadAutocomplete = debounce((query: string) => {
        this.props.getAutocompleteModel({
            query,
            onSuccess: result => {
                if (this.showAutocomplete) {
                    this.setState({
                        autoCompleteModel: result,
                    });
                    this.openAutocomplete();
                }
            },
            onComplete(resultProps) {
                if (resultProps.apiResult) {
                    this.onSuccess?.(resultProps.apiResult);
                }
            },
        });
    }, 200);

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.showAutocomplete = true;
        const newQuery = event.target.value;
        this.setState({ query: newQuery });
        this.loadAutocomplete(newQuery);
    };

    openAutocomplete = () => {
        this.popover.current && (this.popover.current! as any).openPopover();
    };

    closeAutocomplete = () => {
        this.popover.current && (this.popover.current! as any).closePopover();
    };

    getPopoverPosition = (element: React.RefObject<HTMLUListElement>) => {
        if (this.props.autocompletePositionFunction) {
            return this.props.autocompletePositionFunction(element);
        }

        const positionStyle: PositionStyle = {
            position: "fixed",
        };

        if (element.current) {
            const rect = element.current.getBoundingClientRect();
            positionStyle.top =
                rect.top +
                (rect.height > 100
                    ? sizeVariantValues[this.styles?.input?.sizeVariant || ("default" as FormFieldSizeVariant)].height
                    : rect.height);
            positionStyle.right = document.documentElement.clientWidth - rect.right;
        }

        return positionStyle;
    };

    moveFocus = throttle((direction: "prev" | "next") => {
        if (this.state.query) {
            this.setState(({ focusedAutocompleteItem, focusableAutocompleteItems }) => {
                const focusableQueue =
                    direction === "prev" ? focusableAutocompleteItems.slice().reverse() : focusableAutocompleteItems;
                const focusedIndex = focusableQueue.indexOf(focusedAutocompleteItem as AutocompleteItemModel);
                const newFocusedOption = focusableQueue.find((_, index) => index > focusedIndex);
                return { focusedAutocompleteItem: newFocusedOption };
            });
        } else {
            this.setState(({ focusedSearchHistoryQuery }) => {
                const searchHistoryItems = getSearchHistory();
                const focusableQueue = direction === "prev" ? searchHistoryItems.slice().reverse() : searchHistoryItems;
                const focusedSearchHistoryItem = focusableQueue.find(o => o.query === focusedSearchHistoryQuery);
                const focusedIndex = focusableQueue.indexOf(focusedSearchHistoryItem as SearchHistoryItem);
                const newFocusedOption = focusableQueue.find((_, index) => index > focusedIndex);
                return { focusedSearchHistoryQuery: newFocusedOption?.query };
            });
        }
    }, 100);

    handlePopoverKeyDown = (event: KeyboardEvent) => {
        switch (event.keyCode) {
            case DOWN_KEY:
                this.moveFocus("next");
                break;
            case UP_KEY:
                this.moveFocus("prev");
                break;
            case ENTER_KEY:
                if (this.state.focusedAutocompleteItem) {
                    this.goToUrl(this.state.focusedAutocompleteItem.url);
                } else if (this.state.focusedSearchHistoryQuery) {
                    this.setState({ query: this.state.focusedSearchHistoryQuery }, () => {
                        this.doSearch();
                    });
                } else {
                    this.doSearch();
                }
                break;
            default:
                break;
        }
    };

    handlePopoverClose = () => {
        this.setState({
            focusedAutocompleteItem: undefined,
            focusedSearchHistoryQuery: undefined,
        });
    };

    trackAutcompleteSearchResults = () => {
        // Make sure only to trigger for autocomplete results
        if (!this.state.query || !this.props.autocompleteEnabled || !this.state.autoCompleteModel) {
            return;
        }

        const { categories, brands, content, products } = this.state.autoCompleteModel;
        const resultCount =
            (products?.length ?? 0) + (categories?.length || 0) + (content?.length || 0) + (brands?.length || 0);
        if (resultCount > 0) {
            // Track an autocomplete of 1+ items
            this.props.sendSearchTracking({
                searchEvent: "autocompleteSearchResults",
                searchTerm: this.state.query,
                resultCount,
                productCount: products?.length,
                categoryCount: categories?.length,
                contentCount: content?.length,
                brandCount: brands?.length,
            });
            return;
        }

        // Track zero resultCount search results and triggers from this.doSearch
        this.props.sendSearchTracking({
            searchEvent: "searchResults",
            searchTerm: this.state.query,
            resultCount,
        });
    };

    goToUrl = (url: string, track = true) => {
        this.props.onBeforeGoToUrl && this.props.onBeforeGoToUrl();
        if (track) {
            this.trackAutcompleteSearchResults();
        }
        this.closeAutocomplete();
        this.setState({
            // don't use stale results on next search and go to wrong PDP
            autoCompleteModel: undefined,
        });
        this.props.history.push(url);
    };

    renderAutocomplete = () => {
        if (!this.props.autocompleteEnabled) {
            return null;
        }

        if (!this.state.autoCompleteModel) {
            return null;
        }

        const { categories, brands, content, products } = this.state.autoCompleteModel;

        return (
            <StyledWrapper {...this.styles.autocompleteWrapper}>
                {((categories && categories.length > 0) ||
                    (brands && brands.length > 0) ||
                    (content && content.length > 0)) && (
                    <StyledWrapper {...this.styles.autocompleteColumnWrapper}>
                        <AutocompleteCategories
                            categories={categories}
                            focusedItem={this.state.focusedAutocompleteItem}
                            goToUrl={this.goToUrl}
                            extendedStyles={this.styles.autocompleteCategoriesStyles}
                        />
                        <AutocompleteBrands
                            brands={brands}
                            focusedItem={this.state.focusedAutocompleteItem}
                            goToUrl={this.goToUrl}
                            extendedStyles={this.styles.autocompleteBrandsStyles}
                        />
                        <AutocompleteContent
                            content={content}
                            focusedItem={this.state.focusedAutocompleteItem}
                            goToUrl={this.goToUrl}
                            extendedStyles={this.styles.autocompleteContentStyles}
                        />
                    </StyledWrapper>
                )}
                {products && products.length > 0 && (
                    <StyledWrapper {...this.styles.autocompleteColumnWrapper}>
                        <AutocompleteProducts
                            products={products}
                            focusedItem={this.state.focusedAutocompleteItem}
                            goToUrl={this.goToUrl}
                            extendedStyles={this.styles.autocompleteProductsStyles}
                        />
                    </StyledWrapper>
                )}
            </StyledWrapper>
        );
    };

    render() {
        const styles = this.styles;
        const searchId = `headerSearch-${this.props.id}`;
        const searchInput = (
            <TextField
                {...styles.input}
                ref={this.props.inputRef}
                iconClickableProps={{ onClick: this.doSearch }}
                value={this.state.query}
                onChange={this.handleInputChange}
                placeholder={translate("Search")}
                autoComplete="off"
                clickableText={translate("submit search")}
                id={searchId}
                data-test-selector="headerSearchInputTextField"
            />
        );

        return (
            <>
                <VisuallyHidden as="label" htmlFor={searchId} id={`${searchId}-label`}>
                    {translate("Site Search")}
                </VisuallyHidden>
                <Popover
                    {...styles.popover}
                    controlsId={`${searchId}-popover`}
                    ref={this.popover}
                    insideRefs={[this.list]}
                    popoverTrigger={searchInput}
                    positionFunction={this.getPopoverPosition}
                    wrapperProps={styles.popoverWrapper}
                    contentBodyProps={
                        {
                            ref: this.list,
                            ...styles.popoverContentBody,
                        } as any
                    }
                    handleKeyDown={this.handlePopoverKeyDown}
                    onClose={this.handlePopoverClose}
                >
                    {!this.state.query && this.showAutocomplete && (
                        <SearchHistory
                            focusedQuery={this.state.focusedSearchHistoryQuery}
                            goToUrl={this.goToUrl}
                            extendedStyles={styles.searchHistoryStyles}
                        />
                    )}
                    {this.state.query && this.renderAutocomplete()}
                </Popover>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withHistory(withTheme(SearchInput)));
