import Clickable from "@insite/mobius/Clickable";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import getColor from "@insite/mobius/utilities/getColor";
import safeColor from "@insite/mobius/utilities/safeColor";
import ClickOutside from "@insite/shell/Components/ClickOutside";
import X from "@insite/shell/Components/Icons/X";
import { TreeFilterModel } from "@insite/shell/Services/ContentAdminService";
import shellTheme, { ShellThemeProps } from "@insite/shell/ShellTheme";
import {
    addFilter,
    clearFilters,
    loadFiltersForQuery,
    removeFilter,
} from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

const mapStateToProps = (state: ShellState) => ({
    isLoadingFilters: state.pageTree.isLoadingFilters,
    potentialTreeFilters: state.pageTree.potentialTreeFilters,
    treeFiltersQuery: state.pageTree.treeFiltersQuery,
    appliedTreeFilters: state.pageTree.appliedTreeFilters,
    extraTreeFilterCount: state.pageTree.extraTreeFilterCount,
    mobileCmsModeActive: state.shellContext.mobileCmsModeActive,
});

const mapDispatchToProps = {
    loadFiltersForQuery,
    addFilter,
    removeFilter,
    clearFilters,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

interface State {
    queryBoxValue: string;
    potentialFiltersOpen: boolean;
    treeFilters: TreeFilterModel[];
    focusedTreeFilterIndex?: number;
}

const DOWN_KEY = 40;
const UP_KEY = 38;
const ENTER_KEY = 13;
const ESC_KEY = 27;
const backTreeFilter: TreeFilterModel = { value: "Back", key: "Back", type: "Back" };

class PageTreeFilters extends ClickOutside<Props, State> {
    private readonly queryBoxInput: React.RefObject<HTMLInputElement>;
    private timer?: number;

    constructor(props: Props) {
        super(props);

        this.state = {
            queryBoxValue: props.treeFiltersQuery,
            potentialFiltersOpen: false,
            treeFilters: this.getAllQuickFilters(),
        };

        this.queryBoxInput = React.createRef();
    }

    private dispatchFilterChange = () => {
        this.props.loadFiltersForQuery(this.state.queryBoxValue);
    };

    queryBoxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!this.state.queryBoxValue && !event.target.value.trim()) {
            return;
        }

        this.setState({
            queryBoxValue: event.target.value,
            potentialFiltersOpen: true,
        });
        window.clearTimeout(this.timer);
        this.timer = window.setTimeout(this.dispatchFilterChange, 100);
    };

    queryBoxInputFocus = () => {
        this.setState({
            potentialFiltersOpen: true,
        });
    };

    queryBoxInputClick = () => {
        this.setState({
            potentialFiltersOpen: true,
        });
    };

    onClickOutside(target: Node): void {
        if (target === this.queryBoxInput.current) {
            return;
        }

        this.setState({
            potentialFiltersOpen: false,
            focusedTreeFilterIndex: undefined,
        });
    }

    clickPotentialFilter = (treeFilter: TreeFilterModel) => {
        if (treeFilter.type === "QuickFilter") {
            this.setState({
                queryBoxValue: treeFilter.value,
            });
            window.setTimeout(() => this.dispatchFilterChange(), 1);
        } else if (treeFilter.type === "Back") {
            this.setState({
                queryBoxValue: "",
            });
            window.setTimeout(() => this.dispatchFilterChange(), 1);
        } else {
            this.props.addFilter(treeFilter);
            this.setState({
                queryBoxValue: "",
                potentialFiltersOpen: false,
            });
        }
    };

    clickAppliedFilter = (treeFilter: TreeFilterModel) => {
        this.props.removeFilter(treeFilter);
    };

    createQuickFilter = (value: string) => {
        const treeFilter: TreeFilterModel = {
            value,
            key: value,
            type: "QuickFilter",
        };

        return treeFilter;
    };

    getAllQuickFilters = () => {
        return ["Language", "Customer Segment", "Device Type", "Page Status", "Tag"].map(this.createQuickFilter);
    };

    queryBoxInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch (event.keyCode) {
            case DOWN_KEY:
                event.preventDefault();
                this.setState({
                    focusedTreeFilterIndex:
                        this.state.focusedTreeFilterIndex === undefined ||
                        this.state.focusedTreeFilterIndex === this.state.treeFilters.length - 1
                            ? 0
                            : this.state.focusedTreeFilterIndex + 1,
                });
                break;
            case UP_KEY:
                event.preventDefault();
                this.setState({
                    focusedTreeFilterIndex:
                        this.state.focusedTreeFilterIndex === undefined || this.state.focusedTreeFilterIndex === 0
                            ? this.state.treeFilters.length - 1
                            : this.state.focusedTreeFilterIndex - 1,
                });
                break;
            case ENTER_KEY:
                if (this.state.focusedTreeFilterIndex !== undefined) {
                    this.clickPotentialFilter(this.state.treeFilters[this.state.focusedTreeFilterIndex]);
                }
                break;
            case ESC_KEY:
                this.setState({
                    potentialFiltersOpen: false,
                    focusedTreeFilterIndex: undefined,
                });
                this.queryBoxInput.current?.blur();
                break;
            default:
                break;
        }
    };

    componentDidUpdate(prevProps: Props, prevState: State) {
        const { potentialTreeFilters } = this.props;
        const { queryBoxValue } = this.state;
        if (prevProps.potentialTreeFilters !== potentialTreeFilters || prevState.queryBoxValue !== queryBoxValue) {
            const treeFilters =
                queryBoxValue === ""
                    ? this.getAllQuickFilters()
                    : potentialTreeFilters.length > 0
                    ? potentialTreeFilters.concat([backTreeFilter])
                    : potentialTreeFilters;
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                treeFilters,
                focusedTreeFilterIndex: undefined,
            });
        }
    }

    render() {
        if (this.props.mobileCmsModeActive) {
            return null;
        }

        const { potentialTreeFilters, extraTreeFilterCount, appliedTreeFilters } = this.props;
        const { potentialFiltersOpen, queryBoxValue, treeFilters } = this.state;

        return (
            <PageTreeFiltersStyle>
                <QueryBox>
                    <QueryBoxWrapper>
                        <QueryBoxInput
                            ref={this.queryBoxInput}
                            data-test-selector="pageTreeFilters_queryBox"
                            potentialFiltersOpen={this.state.potentialFiltersOpen}
                            placeholder="Type or click to add filter"
                            onKeyDown={this.queryBoxInputKeyDown}
                            onChange={this.queryBoxInputChange}
                            onFocus={this.queryBoxInputFocus}
                            onClick={this.queryBoxInputClick}
                            value={this.state.queryBoxValue}
                        />
                        {this.props.isLoadingFilters && <LoadingSpinner {...loadingSpinnerProps} />}
                    </QueryBoxWrapper>
                    {potentialFiltersOpen && (
                        <QueryResults data-test-selector="pageTreeFilters_potentialFilters" ref={this.setWrapperRef}>
                            {treeFilters.map((o, index) => (
                                <QueryResultItem
                                    key={o.key}
                                    treeFilter={o}
                                    clickFilter={this.clickPotentialFilter}
                                    focused={index === this.state.focusedTreeFilterIndex}
                                />
                            ))}
                            {queryBoxValue !== "" && potentialTreeFilters.length === 0 && (
                                <li data-test-selector="pageTreeFilters_noResultsFound">No Results Found</li>
                            )}
                            {extraTreeFilterCount > 0 && (
                                <li data-test-selector="pageTreeFilters_moreResultsFound">
                                    +{extraTreeFilterCount} More Results
                                </li>
                            )}
                        </QueryResults>
                    )}
                </QueryBox>
                {appliedTreeFilters.length > 0 && (
                    <>
                        <AppliedFilters>
                            {appliedTreeFilters.map(o => (
                                <AppliedFilter key={o.key} treeFilter={o} clickFilter={this.clickAppliedFilter} />
                            ))}
                        </AppliedFilters>
                        <Clickable
                            css={clearFiltersCss}
                            data-test-selector="pageTreeFilters_clearFilters"
                            onClick={this.props.clearFilters}
                        >
                            Clear Filters
                        </Clickable>
                    </>
                )}
            </PageTreeFiltersStyle>
        );
    }
}

class QueryResultItem extends React.Component<{
    treeFilter: TreeFilterModel;
    clickFilter: (treeFilter: TreeFilterModel) => void;
    focused: boolean;
}> {
    onClick = () => {
        this.props.clickFilter(this.props.treeFilter);
    };

    render() {
        const { key, value, type } = this.props.treeFilter;

        const displayType = type
            .replace("Persona", "Customer Segment")
            .replace("DeviceType", "Device Type")
            .replace("PageStatus", "Page Status");

        return (
            <li
                key={key}
                className={this.props.focused ? "focused" : ""}
                data-test-selector={`pageTreeFilters_potentialFilters_${value}`}
                onClick={this.onClick}
            >
                {type === "QuickFilter" || type === "Back" ? "" : `${displayType}:`} {value}
            </li>
        );
    }
}

class AppliedFilter extends React.Component<{
    treeFilter: TreeFilterModel;
    clickFilter: (treeFilter: TreeFilterModel) => void;
}> {
    onClick = () => {
        this.props.clickFilter(this.props.treeFilter);
    };

    render() {
        const { key, value } = this.props.treeFilter;

        return (
            <AppliedFilterStyle
                key={key}
                data-test-selector={`pageTreeFilters_appliedFilter_${value}`}
                onClick={this.onClick}
            >
                {value} <X color1={shellTheme.colors.secondary.contrast} size={10} />
            </AppliedFilterStyle>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageTreeFilters);

const PageTreeFiltersStyle = styled.div`
    margin: 20px 0;
    padding: 0 35px;
`;

const QueryBox = styled.div`
    position: relative;
    margin-bottom: 6px;
`;

const QueryBoxWrapper = styled.div`
    position: relative;
`;

const loadingSpinnerProps: LoadingSpinnerProps = {
    size: 20,
    css: css`
        position: absolute;
        right: 6px;
        top: 5px;
    `,
};

const clearFiltersCss = css`
    font-weight: 700;
    margin-top: 10px;
    &:hover {
        text-decoration: underline;
    }
`;

const queryBoxRadius = "4px";

const QueryBoxInput = styled.input<{ potentialFiltersOpen: boolean }>`
    font-size: 14px;
    padding: 4px 16px;
    height: 30px;
    border-radius: ${queryBoxRadius};
    background-color: ${(props: ShellThemeProps) => props.theme.colors.common.background};
    border: 1px solid ${(props: ShellThemeProps) => props.theme.colors.common.border};
    width: 100%;
    ${props => (props.potentialFiltersOpen ? potentialFiltersOpenStyles : "")}
    &:focus {
        outline: none;
    }
    &::placeholder {
        color: #9b9b9b;
    }
`;

const potentialFiltersOpenStyles = css`
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom: none;
`;

const QueryResults = styled.ul`
    position: absolute;
    z-index: 1;
    top: 30px;
    background: ${getColor("secondary.contrast")};
    width: 100%;
    border: 1px solid ${(props: ShellThemeProps) => props.theme.colors.common.border};
    border-radius: 0 0 ${queryBoxRadius} ${queryBoxRadius};
    & li {
        font-size: 14px;
        padding: 5px 18px;
    }
    & li:hover,
    & li.focused {
        cursor: pointer;
        color: ${getColor("secondary.contrast")};
        background-color: ${(props: ShellThemeProps) => props.theme.colors.text.main};
    }

    & li:last-child {
        border-radius: 0 0 ${queryBoxRadius} ${queryBoxRadius};
    }
`;

const AppliedFilters = styled.div`
    display: flex;
    max-width: 100%;
    flex-wrap: wrap;
`;

const AppliedFilterStyle = styled.div`
    background-color: ${getColor("text.main")};
    color: ${getColor("secondary.contrast")};
    padding: 4px 8px;
    border-radius: 4px;
    margin-right: 10px;
    margin-top: 5px;
    white-space: nowrap;
    font-size: 13px;
    display: flex;
    align-items: center;
    :hover {
        cursor: pointer;
        background-color: ${safeColor(getColor("text.main"))["lighten"](0.3).string()};
    }
    svg {
        margin-left: 4px;
    }
`;
