import { LocationModel } from "@insite/client-framework/Common/Hooks/useLocationFilterSearch";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import { PaginationModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoCondensedDisplay, {
    AddressInfoCondensedDisplayStyles,
} from "@insite/content-library/Components/AddressInfoCondensedDisplay";
import DistanceDisplay, { DistanceUnitOfMeasure } from "@insite/content-library/Components/DistanceDisplay";
import GoogleMapsDirectionLink from "@insite/content-library/Components/GoogleMapsDirectionLink";
import LocationContentLink from "@insite/content-library/Components/LocationContentLink";
import LocationPagination from "@insite/content-library/Components/LocationPagination";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import { PaginationPresentationProps } from "@insite/mobius/Pagination";
import Radio, { RadioComponentProps } from "@insite/mobius/Radio";
import RadioGroup, { RadioGroupProps } from "@insite/mobius/RadioGroup";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    extendedStyles?: LocationSearchFormStyles;
    onSearch: (searchGeoLocationFilter: string, searchLocationFilter: string) => void;
    onLocationSelected: (location: LocationModel) => void;
    locationKnown: boolean;
    showSelectedLocation: boolean;
    getLocationNumberFromPagination: (locationIndex: number) => number;
    openLocationContentDisplay: (location: LocationModel) => void;
    resultCount: number;
    locationSearchFilter: string;
    geoLocationSearchText: string;
    showGeoLocationErrorMessage: boolean;
    geoLocationErrorMessage: React.ReactNode;
    isLoading: boolean;
    distanceUnitOfMeasure: DistanceUnitOfMeasure;
    setDistanceUnitOfMeasure: (uom: DistanceUnitOfMeasure) => void;
    locations: LocationModel[];
    locationsPagination: PaginationModel | undefined;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    siteMessageResultsErrorMessage: React.ReactNode;
}

const mapStateToProps = (state: ApplicationState) => ({
    session: state.context.session,
    settings: getSettingsCollection(state),
});

const mapDispatchToProps = {};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface LocationSearchFormStyles {
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    form?: InjectableCss;
    searchContainer?: InjectableCss;
    searchInputRow?: InjectableCss;
    searchInputGridContainer: GridContainerProps;
    searchGeoLocationGridItem?: GridItemProps;
    searchGeoLocationText?: TextFieldPresentationProps;
    searchLocationsGridItem?: GridItemProps;
    searchLocationsText?: TextFieldPresentationProps;
    searchButtonGridItem?: GridItemProps;
    searchButton?: ButtonPresentationProps;
    searchResultsTextGridItem?: GridItemProps;
    searchResultsText?: TypographyPresentationProps;
    distanceUnitOfMeasureGridItem?: GridItemProps;
    distanceUnitOfMeasureRadioGroup?: RadioGroupProps;
    distanceUnitOfMeasureImperialRadio?: RadioComponentProps;
    distanceUnitOfMeasureMetricRadio?: RadioComponentProps;
    siteMessageGridItem?: GridItemProps;
    siteMessageGeocodeErrorText?: TypographyPresentationProps;
    siteMessageResultsErrorText?: TypographyPresentationProps;
    searchResultGridItem?: GridItemProps;
    searchResultRow?: InjectableCss;
    searchResultGridContainer?: GridContainerProps;
    searchResultLocationDetailsGridContainer?: GridContainerProps;
    searchResultDisplayNumberGridItem?: GridItemProps;
    locationDisplayNumberText?: TypographyPresentationProps;
    searchResultLocationGridItem?: GridItemProps;
    locationNameText?: TypographyPresentationProps;
    locationNameLink?: LinkPresentationProps;
    searchResultAddressInfoOffsetGridItem?: GridItemProps;
    searchResultAddressInfoGridItem?: GridItemProps;
    locationAddressInfoCondensed?: AddressInfoCondensedDisplayStyles;
    searchResultLinksAndDistanceContainer?: GridContainerProps;
    searchResultPhoneOffsetGridItem?: GridItemProps;
    searchResultPhoneGridItem?: GridItemProps;
    searchResultPhoneLink?: LinkPresentationProps;
    searchResultLinksOffsetGridItem?: GridItemProps;
    searchResultContentGridItem?: GridItemProps;
    locationContentLink?: LinkPresentationProps;
    searchResultGoogleMapsDirectionLinkGridItem?: GridItemProps;
    locationGoogleMapsDirectionLink?: LinkPresentationProps;
    searchResultDistanceGridItem?: GridItemProps;
    locationDistanceDisplayText?: TypographyPresentationProps;
    searchResultDividerGridItem?: GridItemProps;
    searchResultDivider?: InjectableCss;
    paginationRow?: GridItemProps;
    pagination?: PaginationPresentationProps;
}

export const locationSearchFormStyles: LocationSearchFormStyles = {
    centeringWrapper: {
        css: css`
            width: 100%;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
    form: {
        css: css`
            width: 100%;
        `,
    },
    searchContainer: {
        css: css`
            display: grid;
            height: 642px;
        `,
    },
    searchInputGridContainer: {
        gap: 10,
    },
    searchGeoLocationGridItem: {
        width: [12, 12, 12, 12, 8],
    },
    searchLocationsGridItem: {
        width: [12, 12, 12, 12, 4],
    },
    searchButtonGridItem: {
        width: 12,
        css: css`
            padding-top: 10px;
            display: inline-block;
            width: 100%;
            flex-direction: row;
            text-align: right;
            & > div {
                display: inline-flex;
            }
        `,
    },
    searchResultsText: {
        css: css`
            margin-top: 10px;
        `,
    },
    searchResultsTextGridItem: {
        width: 4,
    },
    distanceUnitOfMeasureGridItem: {
        width: 8,
        align: "middle",
    },
    distanceUnitOfMeasureRadioGroup: {
        css: css`
            display: inline-block;
            width: 100%;
            flex-direction: row;
            text-align: right;
            & > div {
                display: inline-flex;
            }
        `,
    },
    siteMessageGridItem: {
        width: 12,
    },
    siteMessageGeocodeErrorText: {
        color: "danger",
        weight: "bold",
    },
    siteMessageResultsErrorText: {
        color: "danger",
        weight: "bold",
    },
    searchResultGridItem: {
        width: 12,
    },
    searchResultRow: {
        css: css`
            overflow-y: auto;
            overflow-x: hidden;
        `,
    },
    searchResultGridContainer: {
        gap: 10,
    },
    searchResultLocationDetailsGridContainer: {
        gap: 10,
    },
    searchResultDisplayNumberGridItem: {
        width: 1,
        css: css`
            justify-content: center;
        `,
    },
    locationDisplayNumberText: {
        color: "primary",
        weight: "bold",
    },
    searchResultLocationGridItem: {
        width: 11,
    },
    locationNameText: {
        color: "primary",
        weight: "bold",
        ellipsis: true,
    },
    locationNameLink: {
        color: "primary",
        typographyProps: {
            weight: "bold",
            ellipsis: true,
        },
    },
    searchResultAddressInfoOffsetGridItem: {
        width: 1,
        css: css`
            justify-content: center;
        `,
    },
    searchResultAddressInfoGridItem: {
        width: 11,
    },
    searchResultPhoneOffsetGridItem: {
        width: 1,
    },
    searchResultPhoneGridItem: {
        width: [11, 11, 11, 11, 3],
    },
    searchResultLinksAndDistanceContainer: {
        gap: 0,
        css: css`
            width: 100%;
            padding: 0;
            margin: 0;
        `,
    },
    searchResultLinksOffsetGridItem: {
        width: [1, 1, 1, 1, 0],
    },
    searchResultContentGridItem: {
        width: 2,
    },
    searchResultGoogleMapsDirectionLinkGridItem: {
        width: 2,
    },
    searchResultDistanceGridItem: {
        width: 4,
    },
    searchResultDividerGridItem: {
        width: 12,
    },
    searchResultDivider: {
        css: css`
            margin: 24px 0;
            border: 1px solid rgba(74, 74, 74, 0.2);
            width: 100%;
        `,
    },
    pagination: {
        cssOverrides: {
            pagination: css`
                justify-content: center;
            `,
            perPageSelect: css`
                ${({ theme }) =>
                    breakpointMediaQueries(
                        theme,
                        [
                            css`
                                display: none;
                            `,
                            null,
                            null,
                            null,
                            null,
                        ],
                        "min",
                    )}
            `,
        },
    },
};

const StyledForm = getStyledWrapper("form");
const StyledHr = getStyledWrapper("hr");

const Container = StyledWrapper;
const ContainerCell = StyledWrapper;

const LocationSearchForm: React.FC<Props> = ({
    extendedStyles,
    onSearch,
    onLocationSelected,
    locationKnown,
    getLocationNumberFromPagination,
    openLocationContentDisplay,
    resultCount,
    locationSearchFilter,
    geoLocationSearchText,
    showGeoLocationErrorMessage,
    geoLocationErrorMessage,
    isLoading,
    distanceUnitOfMeasure,
    setDistanceUnitOfMeasure,
    locations,
    locationsPagination,
    setPage,
    setPageSize,
    siteMessageResultsErrorMessage,
}) => {
    const [styles] = React.useState(() => mergeToNew(locationSearchFormStyles, extendedStyles));
    const [searchLocationFilter, setSearchLocationFilter] = React.useState(locationSearchFilter);
    const [searchGeoLocationFilter, setSearchGeoLocationFilter] = React.useState(geoLocationSearchText);
    React.useEffect(() => {
        setSearchLocationFilter(locationSearchFilter);
    }, [locationSearchFilter]);
    React.useEffect(() => {
        setSearchGeoLocationFilter(geoLocationSearchText);
    }, [geoLocationSearchText]);

    const handleDistanceUnitOfMeasureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as DistanceUnitOfMeasure;
        setDistanceUnitOfMeasure(value);
    };

    const generateOpenLocationContentFor = (location: LocationModel) => {
        return () => openLocationContentDisplay(location);
    };

    const generateLocationSelectClickHandler = (location: LocationModel) => {
        return () => onLocationSelected(location);
    };

    const isNotFinalResult = (resultIndex: number) => {
        if (!locationsPagination) {
            return false;
        }
        return locationsPagination.pageSize > resultIndex + 1;
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isLoading) {
            onSearch(searchGeoLocationFilter, searchLocationFilter);
        }
    };
    const handleSearchGeoLocationChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchGeoLocationFilter(event.target.value);
    };
    const handleSearchLocationsChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchLocationFilter(event.target.value);
    };

    return (
        <StyledForm {...styles.form} onSubmit={handleSubmit} noValidate>
            <Container {...styles.searchContainer}>
                <ContainerCell {...styles.searchInputRow}>
                    <GridContainer {...styles.searchInputGridContainer}>
                        <GridItem {...styles.searchGeoLocationGridItem}>
                            <TextField
                                id="searchGeoLocation"
                                {...styles.searchGeoLocationText}
                                label={translate("Search by Postal Code, Province or Country")}
                                required={true}
                                value={searchGeoLocationFilter}
                                onChange={handleSearchGeoLocationChanged}
                                placeholder={translate("Search by Postal Code, Province or Country")}
                                data-test-selector="locationSearchForm_searchGeoLocation"
                                error={showGeoLocationErrorMessage ? geoLocationErrorMessage : undefined}
                            />
                        </GridItem>
                        <GridItem {...styles.searchLocationsGridItem}>
                            <TextField
                                id="searchLocations"
                                {...styles.searchLocationsText}
                                label={translate("Search for Location")}
                                value={searchLocationFilter}
                                onChange={handleSearchLocationsChanged}
                                placeholder={translate("Search for Location")}
                                data-test-selector="locationSearchForm_searchLocations"
                            />
                        </GridItem>
                        <GridItem {...styles.searchButtonGridItem}>
                            <Button
                                {...styles.searchButton}
                                type="submit"
                                data-test-selector="locationSearchForm_searchButton"
                            >
                                {translate("Search")}
                            </Button>
                        </GridItem>
                        <GridItem {...styles.searchResultsTextGridItem}>
                            <Typography {...styles.searchResultsText}>
                                {translate("{0} Results").replace("{0}", `${resultCount}`)}
                            </Typography>
                        </GridItem>
                        <GridItem {...styles.distanceUnitOfMeasureGridItem}>
                            <RadioGroup
                                {...styles.distanceUnitOfMeasureRadioGroup}
                                id="distanceUoM"
                                name="distanceUoM"
                                value={distanceUnitOfMeasure}
                                onChangeHandler={handleDistanceUnitOfMeasureChange}
                            >
                                <Radio {...styles.distanceUnitOfMeasureImperialRadio} value="Imperial">
                                    {translate("Miles")}
                                </Radio>
                                <Radio {...styles.distanceUnitOfMeasureMetricRadio} value="Metric">
                                    {translate("Kilometers")}
                                </Radio>
                            </RadioGroup>
                        </GridItem>
                        <GridItem {...styles.siteMessageGridItem}>
                            {!isLoading && !locationKnown && geoLocationSearchText.length > 0 && (
                                <Typography {...styles.siteMessageGeocodeErrorText}>
                                    {siteMessage("PickUpLocation_GeocodeErrorMessage")}
                                </Typography>
                            )}
                            {!isLoading && locationKnown && locations.length === 0 && siteMessageResultsErrorMessage && (
                                <Typography
                                    {...styles.siteMessageResultsErrorText}
                                    data-test-selector="locationSearchForm_siteErrorMessage"
                                >
                                    {siteMessageResultsErrorMessage}
                                </Typography>
                            )}
                        </GridItem>
                    </GridContainer>
                </ContainerCell>

                <ContainerCell {...styles.searchResultRow}>
                    <GridContainer {...styles.searchResultGridContainer}>
                        {isLoading && locations.length === 0 && (
                            <GridItem {...styles.searchResultGridItem}>
                                <StyledWrapper {...styles.centeringWrapper}>
                                    <LoadingSpinner {...styles.spinner} />
                                </StyledWrapper>
                            </GridItem>
                        )}
                        {locations.map((location, index) => (
                            <GridItem key={location.id} {...styles.searchResultGridItem}>
                                <GridContainer
                                    {...styles.searchResultGridContainer}
                                    data-test-selector="locationSearchForm_location"
                                    data-test-key={`${location.id}`}
                                >
                                    <GridItem {...styles.searchResultDisplayNumberGridItem}>
                                        <Typography {...styles.locationDisplayNumberText}>
                                            {getLocationNumberFromPagination(index)}
                                        </Typography>
                                    </GridItem>
                                    <GridItem {...styles.searchResultLocationGridItem}>
                                        <Link
                                            {...styles.locationNameLink}
                                            onClick={generateLocationSelectClickHandler(location)}
                                            data-test-selector="findLocationModal_locationSelect"
                                        >
                                            {location.name}
                                        </Link>
                                    </GridItem>
                                    <GridItem {...styles.searchResultAddressInfoOffsetGridItem}>
                                        {/* Layout Indentation */}
                                    </GridItem>
                                    <GridItem {...styles.searchResultAddressInfoGridItem}>
                                        <AddressInfoCondensedDisplay
                                            {...styles.locationAddressInfoCondensed}
                                            {...location}
                                        />
                                    </GridItem>
                                    <GridItem {...styles.searchResultPhoneOffsetGridItem}>
                                        {/* Layout Indentation */}
                                    </GridItem>
                                    {location.phone && (
                                        <>
                                            <GridItem {...styles.searchResultPhoneGridItem}>
                                                <Link
                                                    href={`tel:${location.phone}`}
                                                    {...styles.searchResultPhoneLink}
                                                    target="_blank"
                                                >
                                                    {location.phone}
                                                </Link>
                                            </GridItem>
                                            <GridItem {...styles.searchResultLinksOffsetGridItem}>
                                                {/* Layout Indentation */}
                                            </GridItem>
                                        </>
                                    )}
                                    {location.htmlContent && (
                                        <GridItem {...styles.searchResultContentGridItem}>
                                            <LocationContentLink
                                                {...styles.locationContentLink}
                                                location={location}
                                                onOpenLocationContent={generateOpenLocationContentFor(location)}
                                            />
                                        </GridItem>
                                    )}
                                    <GridItem {...styles.searchResultGoogleMapsDirectionLinkGridItem}>
                                        <GoogleMapsDirectionLink
                                            {...styles.locationGoogleMapsDirectionLink}
                                            {...location}
                                        />
                                    </GridItem>
                                    <GridItem {...styles.searchResultDistanceGridItem}>
                                        <DistanceDisplay
                                            {...styles.locationDistanceDisplayText}
                                            distance={location.distance}
                                            unitOfMeasure={distanceUnitOfMeasure}
                                        />
                                    </GridItem>
                                    {isNotFinalResult(index) && (
                                        <GridItem {...styles.searchResultDividerGridItem}>
                                            <StyledHr {...styles.searchResultDivider} />
                                        </GridItem>
                                    )}
                                </GridContainer>
                            </GridItem>
                        ))}
                    </GridContainer>
                </ContainerCell>
                <ContainerCell {...styles.paginationRow}>
                    <LocationPagination
                        {...styles.pagination}
                        locations={locations}
                        locationsPagination={locationsPagination}
                        setPage={setPage}
                        setPageSize={setPageSize}
                    />
                </ContainerCell>
            </Container>
        </StyledForm>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationSearchForm);
