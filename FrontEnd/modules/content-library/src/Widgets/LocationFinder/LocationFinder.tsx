import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import useGoogleMaps from "@insite/client-framework/Common/Hooks/useGoogleMaps";
import useLocationFilterSearch, { LocationModel } from "@insite/client-framework/Common/Hooks/useLocationFilterSearch";
import useLocationGoogleMarkers, {
    CurrentLocationInfoWindow,
    LocationInfoWindow,
} from "@insite/client-framework/Common/Hooks/useLocationGoogleMarkers";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import {
    getGeoCodeFromAddress,
    getGeoCodeFromLatLng,
} from "@insite/client-framework/Common/Utilities/GoogleMaps/getGeoCodeFromAddress";
import withDynamicGoogleMaps from "@insite/client-framework/Common/withDynamicGoogleMaps";
import { GetDealersApiParameter } from "@insite/client-framework/Services/DealerService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import {
    getDealersDataView,
    getDealersDefaultLocation,
} from "@insite/client-framework/Store/Data/Dealers/DealersSelectors";
import loadDealers from "@insite/client-framework/Store/Data/Dealers/Handlers/LoadDealers";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import setParameter from "@insite/client-framework/Store/Pages/LocationFinder/Handlers/SetParameter";
import translate from "@insite/client-framework/Translate";
import { DealerModel, PaginationModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { DistanceUnitOfMeasure } from "@insite/content-library/Components/DistanceDisplay";
import LocationGoogleMap, { LocationGoogleMapStyles } from "@insite/content-library/Components/LocationGoogleMap";
import LocationSearchForm, { LocationSearchFormStyles } from "@insite/content-library/Components/LocationSearchForm";
import { CreateAccountPageContext } from "@insite/content-library/Pages/CreateAccountPage";
import LocationFinderDealerDisplay, {
    LocationFinderDealerDisplayPresentationProps,
} from "@insite/content-library/Widgets/LocationFinder/LocationFinderDealerDisplay";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import ChevronLeft from "@insite/mobius/Icons/ChevronLeft";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import parse from "html-react-parser";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {
    useLoadScript: ({ googleMapsApiKey }: { googleMapsApiKey: any }) => { isLoaded: boolean };
}

const mapDispatchToProps = {
    loadDealers,
    setParameter,
};

const mapStateToProps = (state: ApplicationState) => ({
    session: state.context.session,
    settings: getSettingsCollection(state),
    getDealersParameter: state.pages.locationFinder.getDealersParameter,
    dealersDataView: getDealersDataView(state, state.pages.locationFinder.getDealersParameter),
    dealersDefaultLocation: getDealersDefaultLocation(state),
    dealerDetailsUrl: getPageLinkByPageType(state, "DealerDetailsPage")?.url,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

export interface LocationFinderStyles {
    container?: GridContainerProps;
    leftColumnGridItem?: GridItemProps;
    selectedDealerDisplayContainer?: GridContainerProps;
    selectedDealerDisplayBackToResultsGridItem?: GridItemProps;
    selectedDealerDisplayBackToResultsLink?: LinkPresentationProps;
    selectedDealerDisplayGridItem?: GridItemProps;
    selectedDealerDisplay?: LocationFinderDealerDisplayPresentationProps;
    locationSearchForm?: LocationSearchFormStyles;
    rightColumnGridItem?: GridItemProps;
    locationContentModal?: ModalPresentationProps;
    contentContainer?: InjectableCss;
    locationGoogleMap?: LocationGoogleMapStyles;
}

export const locationFinderStyles: LocationFinderStyles = {
    container: {
        gap: 30,
    },
    leftColumnGridItem: {
        width: [12, 12, 12, 6, 6],
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        order: 2;
                    `,
                    css`
                        order: 2;
                    `,
                    css`
                        order: 2;
                    `,
                    null,
                    null,
                ])}
        `,
    },
    selectedDealerDisplayBackToResultsGridItem: {
        width: 12,
    },
    selectedDealerDisplayBackToResultsLink: {
        icon: {
            iconProps: {
                src: ChevronLeft,
            },
            position: "left",
        },
    },
    selectedDealerDisplayGridItem: {
        width: 12,
    },
    rightColumnGridItem: {
        width: [12, 12, 12, 6, 6],
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        order: 1;
                    `,
                    css`
                        order: 1;
                    `,
                    css`
                        order: 1;
                    `,
                    null,
                    null,
                ])}
        `,
    },
    locationContentModal: {
        sizeVariant: "small",
        cssOverrides: {
            modalTitle: css`
                padding: 10px 20px;
            `,
            modalContent: css`
                padding: 20px;
            `,
        },
    },
    contentContainer: {
        css: css``,
    },
};

const styles = locationFinderStyles;

const LocationFinder: FC<Props> = ({
    settings,
    dealersDataView,
    dealersDefaultLocation,
    getDealersParameter,
    loadDealers,
    setParameter,
    history,
    dealerDetailsUrl,
    useLoadScript,
}) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [distanceUnitOfMeasure, setDistanceUnitOfMeasure] = React.useState<DistanceUnitOfMeasure>("Imperial");

    // Manage Location Houses Modal
    const [locationContentToDisplayModalOpen, setLocationContentToDisplayModalOpen] = React.useState<boolean>(false);
    const [locationContentToDisplay, setLocationContentToDisplay] = React.useState<LocationModel | undefined>(
        undefined,
    );
    const handleOpenContentModal = (dealer: LocationModel) => {
        setLocationContentToDisplayModalOpen(!!dealer.htmlContent);
        setLocationContentToDisplay(dealer);
    };
    const handleContentModalClose = () => {
        setLocationContentToDisplayModalOpen(false);
        setLocationContentToDisplay(undefined);
    };

    const handleLoadLocations = (parameter: GetDealersApiParameter) => {
        setParameter(parameter);
    };

    React.useEffect(() => {
        if (getDealersParameter) {
            loadDealers(getDealersParameter);
        }
    }, [getDealersParameter]);

    // Manage Google Maps State
    const { googleMapsApiKey } = settings.websiteSettings;
    const { isLoaded } = useLoadScript({ googleMapsApiKey });
    const {
        googleMap,
        setGoogleMap,
        currentLocation,
        setCurrentLocation,
        isGoogleMapsScriptsLoaded,
        setBounds,
        setMapCenter,
        locationKnown,
    } = useGoogleMaps({
        isShown: true,
        isLoaded,
    });

    // Manage Selected Dealer
    const [selectedDealer, setSelectedDealer] = React.useState<DealerModel | undefined>(undefined);
    const [showSelectedDealer, setShowSelectedDealer] = React.useState<boolean>(false);
    const [defaultRadius, setDefaultRadius] = React.useState<number>(0);

    // Manage Local Dealers
    const [dealers, setDealers] = React.useState<DealerModel[]>([]);
    const [resultCount, setResultCount] = React.useState<number>(0);
    const [locationsPagination, setLocationsPagination] = React.useState<PaginationModel | undefined>();

    // Manage Loading Dealers on State Changes
    const onSearch = (searchFilter: string) => {
        setLocationSearchFilter(searchFilter);
    };

    const createFilter = (coords: google.maps.LatLng | undefined, searchFilter: string): GetDealersApiParameter => {
        // Default center Point
        let centerPoint = { latitude: 0, longitude: 0 };
        // Passed in coords
        if (coords && coords.lat() !== 0 && coords.lng() !== 0) {
            centerPoint = {
                latitude: coords.lat(),
                longitude: coords.lng(),
            };
        }
        //  Selected Dealer
        if (centerPoint.latitude === 0 && centerPoint.longitude === 0 && selectedDealer) {
            centerPoint = {
                ...selectedDealer,
            };
        }
        // default Location
        if (
            centerPoint.latitude === 0 &&
            centerPoint.longitude === 0 &&
            dealersDefaultLocation.latitude !== 0 &&
            dealersDefaultLocation.latitude !== 0
        ) {
            centerPoint = dealersDefaultLocation;
        }

        return {
            name: searchFilter,
            latitude: centerPoint.latitude,
            longitude: centerPoint.longitude,
            page,
            pageSize,
        };
    };

    const { doSearch, locationSearchFilter, setLocationSearchFilter, page, setPage, pageSize, setPageSize } =
        useLocationFilterSearch<DealerModel, GetDealersApiParameter>({
            onSearch,
            loadLocations: handleLoadLocations,
            currentLocation,
            defaultRadius,
            selectedLocation: selectedDealer,
            setSelectedLocation: location => setSelectedDealer(location),
            setShowSelectedLocation: setShowSelectedDealer,
            createFilter,
        });
    React.useEffect(() => {
        if (!isGoogleMapsScriptsLoaded) {
            return;
        }
        if (dealersDataView.value && !dealersDataView.isLoading) {
            const { pagination, value: dealers, defaultRadius, defaultLatitude, defaultLongitude } = dealersDataView;
            // Find default location
            setLocationSearchFilter(locationSearchFilter);
            setLocationsPagination(pagination || undefined);
            setResultCount(pagination?.totalItemCount || 0);
            setDefaultRadius(defaultRadius);
            setMapCenter(new google.maps.LatLng(defaultLatitude, defaultLongitude));
            setDealers(dealers || []);
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [dealersDataView, isGoogleMapsScriptsLoaded]);

    // Manage Bounds of Map
    React.useEffect(() => {
        const bounds = [];
        closeInfoWindows();
        dealers.forEach(dealer => {
            bounds.push({ lat: dealer.latitude, lng: dealer.longitude });
        });
        if (showSelectedDealer && selectedDealer) {
            bounds.push({ lat: selectedDealer.latitude, lng: selectedDealer.longitude });
        }
        if (currentLocation && currentLocation.lat() !== 0 && currentLocation.lng() !== 0) {
            bounds.push({ lat: currentLocation.lat(), lng: currentLocation.lng() });
        }
        setBounds(bounds);
    }, [googleMap, dealers, selectedDealer, showSelectedDealer, currentLocation]);

    const [currentLocationInfoWindow, setCurrentLocationInfoWindow] = React.useState<
        CurrentLocationInfoWindow | undefined
    >(undefined);
    const [locationInfoWindow, setLocationInfoWindow] = React.useState<LocationInfoWindow<DealerModel> | undefined>(
        undefined,
    );
    const setLocationOfInfoWindow = (location: DealerModel | undefined) => {
        if (!location) {
            setLocationInfoWindow(undefined);
            return;
        }
        setLocationInfoWindow({
            position: new google.maps.LatLng(location.latitude, location.longitude),
            location,
        });
    };
    // Manage Map Markers
    const { mapMarkersElements, closeInfoWindows, getLocationNumber } = useLocationGoogleMarkers({
        locations: dealers,
        locationSearchFilter,
        locationsPagination,
        currentLocation,
        selectedLocation: selectedDealer,
        showSelectedLocation: showSelectedDealer,
        setLocationOfInfoWindow,
        setCurrentLocationInfoWindow,
    });

    const handleLocationSelected = (dealer: LocationModel) => {
        history.push(`${dealerDetailsUrl!}?id=${dealer.id}`);
    };
    const handleBackToResults = () => {
        setSelectedDealer(undefined);
    };

    const [geoLocationSearchText, setGeoLocationSearchText] = React.useState("");
    const [showGeoLocationErrorMessage, setShowGeoLocationErrorMessage] = React.useState(false);

    const handleGeoLocationSearch = (geoLocationSearch: string) => {
        setShowGeoLocationErrorMessage(false);
        setGeoLocationSearchText(geoLocationSearchText);
        // Lookup and set currentLocation to this search text
        getGeoCodeFromAddress(geoLocationSearch)
            .then(result => {
                const geocoderResult = result[0];
                if (geocoderResult.formatted_address) {
                    setGeoLocationSearchText(geocoderResult.formatted_address);
                }

                setPage(1);
                setCurrentLocation(geocoderResult.geometry.location);
            })
            .catch(() => {
                setShowGeoLocationErrorMessage(true);
            });
    };

    const handleSearch = (geoLocationSearch: string, locationSearch: string) => {
        if (!geoLocationSearch) {
            setShowGeoLocationErrorMessage(true);
            return;
        }
        setShowGeoLocationErrorMessage(false);
        if (geoLocationSearchText !== geoLocationSearch) {
            setLocationSearchFilter(locationSearch);
            handleGeoLocationSearch(geoLocationSearch);
            return;
        }
        doSearch(locationSearch);
    };

    // Set the GeoLocation Search Text
    React.useEffect(() => {
        if (!currentLocation) {
            return;
        }
        getGeoCodeFromLatLng(currentLocation.lat(), currentLocation.lng()).then(result => {
            setGeoLocationSearchText(result[0].formatted_address);
        });
    }, [currentLocation]);

    return (
        <GridContainer {...styles.container} data-test-selector="locationFinder">
            <GridItem {...styles.leftColumnGridItem}>
                {selectedDealer && (
                    <GridContainer {...styles.selectedDealerDisplayContainer}>
                        <GridItem {...styles.selectedDealerDisplayBackToResultsGridItem}>
                            <Link onClick={handleBackToResults} {...styles.selectedDealerDisplayBackToResultsLink}>
                                {translate("Back to Results")}
                            </Link>
                        </GridItem>
                        <GridItem {...styles.selectedDealerDisplayGridItem}>
                            <LocationFinderDealerDisplay
                                {...styles.selectedDealerDisplay}
                                dealer={selectedDealer}
                                distanceUnitOfMeasure={distanceUnitOfMeasure}
                            />
                        </GridItem>
                    </GridContainer>
                )}
                {!selectedDealer && (
                    <LocationSearchForm
                        extendedStyles={styles.locationSearchForm}
                        isLoading={isLoading}
                        onSearch={handleSearch}
                        onLocationSelected={handleLocationSelected}
                        locationKnown={locationKnown}
                        showSelectedLocation={showSelectedDealer}
                        getLocationNumberFromPagination={getLocationNumber}
                        openLocationContentDisplay={handleOpenContentModal}
                        resultCount={resultCount}
                        locationSearchFilter={locationSearchFilter}
                        geoLocationSearchText={geoLocationSearchText}
                        showGeoLocationErrorMessage={showGeoLocationErrorMessage}
                        geoLocationErrorMessage={siteMessage("DealerLocator_GeocodeErrorMessage")}
                        distanceUnitOfMeasure={distanceUnitOfMeasure}
                        setDistanceUnitOfMeasure={setDistanceUnitOfMeasure}
                        locations={dealers}
                        locationsPagination={locationsPagination}
                        setPage={setPage}
                        setPageSize={setPageSize}
                        siteMessageResultsErrorMessage={siteMessage("DealerLocator_NoResultsMessage")}
                    />
                )}
            </GridItem>

            <GridItem {...styles.rightColumnGridItem}>
                {isGoogleMapsScriptsLoaded && (
                    <LocationGoogleMap
                        extendedStyles={styles.locationGoogleMap}
                        currentLocation={currentLocation}
                        locationSearchFilter={locationSearchFilter}
                        distanceUnitOfMeasure={distanceUnitOfMeasure}
                        setGoogleMap={setGoogleMap}
                        mapMarkerElements={mapMarkersElements}
                        locationInfoWindow={locationInfoWindow}
                        currentLocationInfoWindow={currentLocationInfoWindow}
                        handleOpenLocationContent={handleOpenContentModal}
                    />
                )}
            </GridItem>
            <Modal
                {...styles.locationContentModal}
                headline={translate("Hours")}
                isOpen={locationContentToDisplayModalOpen}
                handleClose={handleContentModalClose}
            >
                <StyledWrapper {...styles.contentContainer}>
                    {parse(locationContentToDisplay?.htmlContent || "", parserOptions)}
                </StyledWrapper>
            </Modal>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(withDynamicGoogleMaps(LocationFinder))),
    definition: {
        allowedContexts: [CreateAccountPageContext],
        group: "Location Finder",
    },
};

export default widgetModule;
