import { LocationModel } from "@insite/client-framework/Common/Hooks/useLocationFilterSearch";
import {
    CurrentLocationInfoWindow,
    LocationGoogleMapMarkerType,
    LocationGoogleMapsMarker,
    LocationInfoWindow,
} from "@insite/client-framework/Common/Hooks/useLocationGoogleMarkers";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { newGuid } from "@insite/client-framework/Common/StringHelpers";
import withDynamicGoogleMaps from "@insite/client-framework/Common/withDynamicGoogleMaps";
import translate from "@insite/client-framework/Translate";
import AddressInfoCondensedDisplay, {
    AddressInfoCondensedDisplayStyles,
} from "@insite/content-library/Components/AddressInfoCondensedDisplay";
import DistanceDisplay, { DistanceUnitOfMeasure } from "@insite/content-library/Components/DistanceDisplay";
import GoogleMapsDirectionLink from "@insite/content-library/Components/GoogleMapsDirectionLink";
import LocationContentLink from "@insite/content-library/Components/LocationContentLink";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { GoogleMapProps, InfoWindowProps, MarkerProps } from "@react-google-maps/api";
import * as React from "react";
import { css } from "styled-components";

interface Props {
    extendedStyles?: LocationGoogleMapStyles;
    currentLocation?: google.maps.LatLng;
    locationSearchFilter: string;
    distanceUnitOfMeasure: DistanceUnitOfMeasure;
    mapMarkerElements: LocationGoogleMapsMarker[];
    locationInfoWindow?: LocationInfoWindow<LocationModel>;
    currentLocationInfoWindow?: CurrentLocationInfoWindow;
    handleOpenLocationContent: (location: LocationModel) => void;
    setGoogleMap: (map: google.maps.Map | undefined) => void;
    GoogleMap: React.ComponentType<GoogleMapProps>;
    InfoWindow: React.ComponentType<InfoWindowProps>;
    Marker: React.ComponentType<MarkerProps>;
}

export interface LocationGoogleMapStyles {
    googleMap?: GoogleMapProps;
    locationMarker?: MarkerProps;
    currentLocationMarker?: MarkerProps;
    selectedMarker?: MarkerProps;
    locationInfoWindow?: InfoWindowProps;
    currentLocationInfoWindow?: InfoWindowProps;
    infoWindowGridContainer?: GridContainerProps;
    infoWindowLeftGridItem?: GridItemProps;
    selectedLocationName?: TypographyPresentationProps;
    selectedLocationAddressDisplay?: AddressInfoCondensedDisplayStyles;
    infoWindowRightGridItem?: GridItemProps;
    infoWindowLocationContentLink?: LinkPresentationProps;
    infoWindowGoogleMapsDirectionLink?: LinkPresentationProps;
    infoWindowDistanceDisplay?: TypographyPresentationProps;
    currentLocationInfoWindowGridContainer?: GridContainerProps;
    currentLocationInfoWindowHeaderGridItem?: GridItemProps;
    currentLocationInfoWindowHeaderText?: TypographyPresentationProps;
    currentLocationInfoWindowSearchFilterGridItem?: GridItemProps;
    currentLocationInfoWindowSearchFilterText?: TypographyPresentationProps;
}

export const locationGoogleMapStyles: LocationGoogleMapStyles = {
    googleMap: {
        zoom: 14,
        mapContainerStyle: {
            height: "642px",
            width: "100%",
        },
    },
    infoWindowGridContainer: {
        gap: 0,
    },
    infoWindowLeftGridItem: {
        width: 8,
        css: css`
            flex-direction: column;
        `,
    },
    infoWindowRightGridItem: {
        width: 4,
        css: css`
            flex-direction: column;
        `,
    },
    selectedLocationName: {
        color: "primary",
        weight: "bold",
    },
    currentLocationInfoWindowGridContainer: {
        gap: 0,
    },
    currentLocationInfoWindowHeaderGridItem: {
        width: 12,
        css: css`
            justify-content: center;
        `,
    },
    currentLocationInfoWindowSearchFilterGridItem: {
        width: 12,
        css: css`
            justify-content: center;
        `,
    },
};

const LocationGoogleMap: React.FC<Props> = ({
    extendedStyles,
    currentLocation,
    locationSearchFilter,
    distanceUnitOfMeasure,
    setGoogleMap,
    mapMarkerElements,
    locationInfoWindow,
    currentLocationInfoWindow,
    handleOpenLocationContent,
    GoogleMap,
    InfoWindow,
    Marker,
}) => {
    const [styles] = React.useState(() => mergeToNew(locationGoogleMapStyles, extendedStyles));

    const handleLoad = (map: google.maps.Map) => {
        setGoogleMap(map);
    };
    const handleUnmount = (_: google.maps.Map) => {
        setGoogleMap(undefined);
    };

    const getMarkerStyles = (markerType: LocationGoogleMapMarkerType) => {
        if (markerType === "CURRENT_LOCATION") {
            return styles.currentLocationMarker;
        }
        if (markerType === "SELECTED") {
            return styles.selectedMarker;
        }
        return styles.locationMarker;
    };

    return (
        <GoogleMap {...styles.googleMap} center={currentLocation} onLoad={handleLoad} onUnmount={handleUnmount}>
            {mapMarkerElements.map(marker => (
                <Marker key={marker.key} {...marker} {...getMarkerStyles(marker.type)} />
            ))}
            {locationInfoWindow && (
                <InfoWindow {...styles.locationInfoWindow} key={newGuid()} position={locationInfoWindow?.position}>
                    {locationInfoWindow && (
                        <GridContainer {...styles.infoWindowGridContainer}>
                            <GridItem {...styles.infoWindowLeftGridItem}>
                                <Typography {...styles.selectedLocationName}>
                                    {locationInfoWindow.location.name}
                                </Typography>
                                <AddressInfoCondensedDisplay
                                    {...locationInfoWindow.location}
                                    extendedStyles={styles.selectedLocationAddressDisplay}
                                />
                            </GridItem>
                            <GridItem {...styles.infoWindowRightGridItem}>
                                {locationInfoWindow.location.htmlContent && (
                                    <LocationContentLink
                                        {...styles.infoWindowLocationContentLink}
                                        location={locationInfoWindow.location}
                                        onOpenLocationContent={handleOpenLocationContent}
                                    />
                                )}
                                <GoogleMapsDirectionLink
                                    {...styles.infoWindowGoogleMapsDirectionLink}
                                    {...locationInfoWindow.location}
                                />
                                {locationInfoWindow.location.distance > 0.01 && (
                                    <DistanceDisplay
                                        {...styles.infoWindowDistanceDisplay}
                                        distance={locationInfoWindow.location.distance}
                                        unitOfMeasure={distanceUnitOfMeasure}
                                    />
                                )}
                            </GridItem>
                        </GridContainer>
                    )}
                </InfoWindow>
            )}
            {currentLocationInfoWindow && (
                <InfoWindow
                    {...styles.currentLocationInfoWindow}
                    key={newGuid()}
                    position={currentLocationInfoWindow.position}
                >
                    <GridContainer {...styles.currentLocationInfoWindowGridContainer}>
                        <GridItem {...styles.currentLocationInfoWindowHeaderGridItem}>
                            <Typography {...styles.currentLocationInfoWindowHeaderText}>
                                {translate("Current Location")}
                            </Typography>
                        </GridItem>
                        <GridItem {...styles.currentLocationInfoWindowSearchFilterGridItem}>
                            <Typography {...styles.currentLocationInfoWindowSearchFilterText}>
                                {locationSearchFilter}
                            </Typography>
                        </GridItem>
                    </GridContainer>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default withDynamicGoogleMaps(LocationGoogleMap);
