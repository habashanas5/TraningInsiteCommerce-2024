import isNumeric from "@insite/client-framework/Common/isNumeric";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAllBrandsDataView } from "@insite/client-framework/Store/Data/Brands/BrandsSelectors";
import translate from "@insite/client-framework/Translate";
import { BrandAlphabetLetterModel, BrandModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import VerticalColumnCell, { VerticalColumnCellProps } from "@insite/content-library/Components/VerticalColumnCell";
import VerticalColumnContainer, {
    VerticalColumnContainerProps,
} from "@insite/content-library/Components/VerticalColumnContainer";
import { BrandsPageContext } from "@insite/content-library/Pages/BrandsPage";
import BrandAlphabetNavigation, {
    BrandAlphabetNavigationStyles,
} from "@insite/content-library/Widgets/Brand/BrandAlphabetNavigation";
import Accordion, { AccordionProps } from "@insite/mobius/Accordion";
import AccordionSection, { AccordionSectionPresentationProps } from "@insite/mobius/AccordionSection";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => ({
    allBrandsDataView: getAllBrandsDataView(state),
    brandAlphabetState: state.pages.brands.brandAlphabetState,
});

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

type BrandLetterMap = {
    [letter: string]: BrandModel[];
};

export interface BrandListStyles {
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    container?: InjectableCss;
    brandAlphabetNavigation?: BrandAlphabetNavigationStyles;
    brandAccordion?: AccordionProps;
    brandAccordionSection?: AccordionSectionPresentationProps;
    verticalColumnContainer?: VerticalColumnContainerProps;
    verticalColumnCell?: VerticalColumnCellProps;
    brandLink?: LinkPresentationProps;
    actions?: InjectableCss;
    actionLinks?: LinkPresentationProps;
    actionLinksDisabled?: TypographyPresentationProps;
    buttons?: InjectableCss;
    backToTopButton?: ButtonPresentationProps;
}

export const listStyles: BrandListStyles = {
    centeringWrapper: {
        css: css`
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
    brandAccordionSection: {
        titleTypographyProps: {
            weight: "bold",
            css: css`
                text-transform: uppercase;
            `,
        },
    },
    backToTopButton: {
        variant: "secondary",
        sizeVariant: "small",
        css: css`
            margin: 10px;
        `,
    },
    brandLink: {
        css: css`
            width: 100%;
            display: flex;
            &:focus {
                outline-offset: -2px;
            }
        `,
    },
    verticalColumnContainer: {
        columnCounts: [2, 4, 4, 4, 4],
    },
    actions: {
        css: css`
            display: flex;
            justify-content: flex-end;
            padding: 5px;
        `,
    },
    actionLinks: {
        css: css`
            margin: 5px;
        `,
    },
    actionLinksDisabled: {
        css: css`
            margin: 5px;
        `,
        color: "text.disabled",
    },
    buttons: {
        css: css`
            display: flex;
            justify-content: flex-end;
        `,
    },
};

const styles = listStyles;

interface BrandListState {
    expanded: boolean | "mixed";
    brandLetterDetails: BrandAlphabetLetterModel[];
    brandSections: BrandSection[];
}

/**
 * This will display all Brands grouped by the first character.
 * Starting with numbers grouped into '#'.
 * @param props
 */
const BrandList: FC<Props> = (props: Props) => {
    const { allBrandsDataView, brandAlphabetState } = props;

    const brandList = allBrandsDataView.value || [];
    const brandAlphabet = brandAlphabetState.value || [];
    const { letters, brandLettersMap } = buildLettersAndMap(brandList);
    const { brandLetterDetails, brandSections } = buildBrandSections(letters, brandLettersMap, brandAlphabet, false);

    const [state, setState] = React.useState<BrandListState>({ expanded: false, brandLetterDetails, brandSections });

    React.useEffect(() => {
        setState({ ...state, brandLetterDetails, brandSections });
    }, [brandList?.length, brandAlphabetState, brandAlphabet]);

    if (allBrandsDataView.isLoading || brandAlphabetState.isLoading) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner} />
            </StyledWrapper>
        );
    }
    if (brandList.length === 0) {
        return null;
    }

    const onClickBrandSection = (section: BrandSection) => () => {
        setState(({ brandSections, expanded, brandLetterDetails }: BrandListState) => {
            const itemIndex = brandSections.findIndex(item => item.letter === section.letter);
            const nextSectionExpanded = !section.expanded;
            let nextExpanded = expanded;
            if (expanded !== "mixed" && expanded !== nextSectionExpanded) {
                nextExpanded = "mixed";
            } else if (expanded === "mixed") {
                const hasNonMatchingExpanded = brandSections.find(item => {
                    return item.letter !== section.letter && item.expanded !== nextSectionExpanded;
                });
                if (!hasNonMatchingExpanded) {
                    nextExpanded = nextSectionExpanded;
                }
            }
            const newSectionState = { ...section, expanded: nextSectionExpanded };
            const newBrandSections = [...brandSections];
            newBrandSections.splice(itemIndex, 1, newSectionState);
            return { brandSections: newBrandSections, expanded: nextExpanded, brandLetterDetails };
        });
    };

    const onCollapse = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (state.expanded === "mixed" || state.expanded) {
            const { letters, brandLettersMap } = buildLettersAndMap(brandList);
            const { brandLetterDetails, brandSections } = buildBrandSections(
                letters,
                brandLettersMap,
                brandAlphabet,
                false,
            );
            setState({ ...state, brandLetterDetails, brandSections, expanded: false });
        }
    };

    const onExpand = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (state.expanded === "mixed" || !state.expanded) {
            const { letters, brandLettersMap } = buildLettersAndMap(brandList);
            const { brandLetterDetails, brandSections } = buildBrandSections(
                letters,
                brandLettersMap,
                brandAlphabet,
                true,
            );
            setState({ ...state, brandLetterDetails, brandSections, expanded: true });
        }
    };

    const handleBackToTop = () => {
        window.scrollTo(0, 0);
        const elementToFocus = document.getElementById("collapseButton");
        if (elementToFocus) {
            elementToFocus.focus();
        } else {
            document.getElementById("expandButton")?.focus();
        }
    };

    const handleBrandLetterClick = (letter: string) => {
        const section = state.brandSections.find(item => item.letter === letter);
        section && onClickBrandSection(section)();
    };

    return (
        <StyledWrapper {...styles.container} data-test-selector="brandList">
            <BrandAlphabetNavigation
                letterDetails={brandLetterDetails}
                extendedStyles={styles.brandAlphabetNavigation}
                onBrandLetterClick={handleBrandLetterClick}
            />
            <StyledWrapper {...styles.actions}>
                {state.expanded === false ? (
                    <Typography {...styles.actionLinksDisabled}>{translate("Collapse All")}</Typography>
                ) : (
                    <Link
                        onClick={onCollapse}
                        {...styles.actionLinks}
                        id="collapseButton"
                        data-test-selector="brandListCollapseAllLink"
                    >
                        {translate("Collapse All")}
                    </Link>
                )}
                {state.expanded === true ? (
                    <Typography {...styles.actionLinksDisabled}>{translate("Expand All")}</Typography>
                ) : (
                    <Link
                        onClick={onExpand}
                        {...styles.actionLinks}
                        id="expandButton"
                        data-test-selector="brandListExpandAllLink"
                    >
                        {translate("Expand All")}
                    </Link>
                )}
            </StyledWrapper>
            <Accordion headingLevel={2}>
                {state.brandSections.map(brandDetails => (
                    <AccordionSection
                        key={brandDetails.letter}
                        {...styles.brandAccordionSection}
                        title={brandDetails.letter}
                        expanded={brandDetails.expanded}
                        onTogglePanel={onClickBrandSection(brandDetails)}
                    >
                        <VerticalColumnContainer
                            id={`letter-${brandDetails.letter}`}
                            {...styles.verticalColumnContainer}
                            data-test-selector="brandSection"
                        >
                            {brandDetails.brandMap.map(brand => (
                                <VerticalColumnCell key={brand.detailPagePath} {...styles.verticalColumnCell}>
                                    <Link
                                        {...styles.brandLink}
                                        href={brand.detailPagePath}
                                        typographyProps={{ ellipsis: true }}
                                        data-test-selector="brandLink"
                                    >
                                        {brand.name}
                                    </Link>
                                </VerticalColumnCell>
                            ))}
                        </VerticalColumnContainer>
                    </AccordionSection>
                ))}
            </Accordion>
            <StyledWrapper {...styles.buttons}>
                <Button {...styles.backToTopButton} onClick={handleBackToTop}>
                    {translate("Back to Top")}
                </Button>
            </StyledWrapper>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(BrandList),
    definition: {
        group: "Brands",
        icon: "List",
        allowedContexts: [BrandsPageContext],
    },
};

export default widgetModule;

interface BrandSection {
    letter: string;
    brandMap: BrandModel[];
    expanded: boolean;
}

/**
 * Takes in a brand list and sorts it into #, A-Z, Other characters.
 *
 * @param brandList The list of brands that should be sorted.
 */
const buildLettersAndMap = (brandList: BrandModel[]): { letters: string[]; brandLettersMap: BrandLetterMap } => {
    let letters: string[] = [];
    let letter: string;
    let newLetters: string[] = letters;
    const brandLettersMap: BrandLetterMap = {};
    for (let i = 0; i < brandList.length; i = i + 1) {
        const brand = brandList[i];
        letter = brand.name[0] ? brand.name[0].toLowerCase() : "";
        if (isNumeric(letter)) {
            letter = "#";
        }
        if (!brandLettersMap[letter]) {
            brandLettersMap[letter] = [];
        }
        brandLettersMap[letter].push(brand);
        newLetters = [...newLetters, letter];
    }
    letters = newLetters.filter((letter, index, array) => array.indexOf(letter) === index);
    if (brandLettersMap["#"]) {
        brandLettersMap["#"].sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10));
    }

    return { letters, brandLettersMap };
};

/**
 * Take in the props and create easier to work with state objects.
 *
 * @param letters List of letters and special characters.
 * @param brandLettersMap Brand list sorted into letter lists.
 * @param brandAlphabet Letter count list.
 * @param expanded The expanded value to use if not undefined.
 */
const buildBrandSections = (
    letters: string[],
    brandLettersMap: BrandLetterMap,
    brandAlphabet: BrandAlphabetLetterModel[],
    expanded: boolean | undefined,
): {
    brandLetterDetails: {
        count: number;
        letter: string;
        linkable: boolean;
    }[];
    brandSections: {
        letter: string;
        brandMap: BrandModel[];
        expanded: boolean;
    }[];
} => {
    const brandLetterDetails = brandAlphabet.map(alphabetItem => ({
        ...alphabetItem,
        linkable: alphabetItem.count > 0,
    }));
    const brandSections = letters.map(letter => ({
        letter,
        brandMap: brandLettersMap[letter],
        expanded: expanded || false,
    }));

    return { brandLetterDetails, brandSections };
};
