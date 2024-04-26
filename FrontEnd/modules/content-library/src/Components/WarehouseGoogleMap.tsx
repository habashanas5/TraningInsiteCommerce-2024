import {
    CurrentLocationInfoWindow,
    WarehouseGoogleMapsMarker,
    WarehouseInfoWindow,
} from "@insite/client-framework/Common/Hooks/useWarehouseGoogleMarkers";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { newGuid } from "@insite/client-framework/Common/StringHelpers";
import withDynamicGoogleMaps from "@insite/client-framework/Common/withDynamicGoogleMaps";
import translate from "@insite/client-framework/Translate";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoCondensedDisplay, {
    AddressInfoCondensedDisplayStyles,
} from "@insite/content-library/Components/AddressInfoCondensedDisplay";
import DistanceDisplay, { DistanceUnitOfMeasure } from "@insite/content-library/Components/DistanceDisplay";
import GoogleMapsDirectionLink from "@insite/content-library/Components/GoogleMapsDirectionLink";
import WarehouseHoursLink from "@insite/content-library/Components/WarehouseHoursLink";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";

import { GoogleMapProps, InfoWindowProps, MarkerProps } from "@react-google-maps/api";
import React, { Fragment } from "react";
import { css } from "styled-components";

interface Props {
    extendedStyles?: WarehouseGoogleMapStyles;
    currentLocation?: google.maps.LatLng;
    warehouseSearchFilter: string;
    distanceUnitOfMeasure: DistanceUnitOfMeasure;
    mapMarkerElements: WarehouseGoogleMapsMarker[];
    warehouseInfoWindow?: WarehouseInfoWindow;
    currentLocationInfoWindow?: CurrentLocationInfoWindow;
    handleOpenWarehouseHours: (warehouse: WarehouseModel) => void;
    setGoogleMap: (map: google.maps.Map | undefined) => void;
    updateLastFocusableElement: () => void;
    GoogleMap: React.ComponentType<GoogleMapProps>;
    InfoWindow: React.ComponentType<InfoWindowProps>;
    Marker: React.ComponentType<MarkerProps>;
}

export interface WarehouseGoogleMapStyles {
    googleMap?: GoogleMapProps;
    warehouseMarker?: MarkerProps;
    currentLocationMarker?: MarkerProps;
    selectedMarker?: MarkerProps;
    warehouseInfoWindow?: InfoWindowProps;
    currentLocationInfoWindow?: InfoWindowProps;
    infoWindowGridContainer?: GridContainerProps;
    infoWindowLeftGridItem?: GridItemProps;
    selectedLocationName?: TypographyPresentationProps;
    selectedLocationAddressDisplay?: AddressInfoCondensedDisplayStyles;
    infoWindowRightGridItem?: GridItemProps;
    infoWindowWarehouseHoursLink?: LinkPresentationProps;
    infoWindowGoogleMapsDirectionLink?: LinkPresentationProps;
    infoWindowDistanceDisplay?: TypographyPresentationProps;
    currentLocationInfoWindowGridContainer?: GridContainerProps;
    currentLocationInfoWindowHeaderGridItem?: GridItemProps;
    currentLocationInfoWindowHeaderText?: TypographyPresentationProps;
    currentLocationInfoWindowSearchFilterGridItem?: GridItemProps;
    currentLocationInfoWindowSearchFilterText?: TypographyPresentationProps;
}

export const warehouseGoogleMapStyles: WarehouseGoogleMapStyles = {
    googleMap: {
        zoom: 14,
        mapContainerStyle: {
            height: "400px",
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

const WarehouseGoogleMap: React.FC<Props> = ({
    extendedStyles,
    currentLocation,
    warehouseSearchFilter,
    distanceUnitOfMeasure,
    setGoogleMap,
    mapMarkerElements,
    warehouseInfoWindow,
    currentLocationInfoWindow,
    handleOpenWarehouseHours,
    GoogleMap,
    InfoWindow,
    Marker,
}) => {
    if (!currentLocation) {
        return null;
    }

    const [styles] = React.useState(() => mergeToNew(warehouseGoogleMapStyles, extendedStyles));

    const handleLoad = (map: google.maps.Map) => {
        setGoogleMap(map);
    };
    const handleUnmount = (_: google.maps.Map) => {
        setGoogleMap(undefined);
    };

    return (
        <GoogleMap
            id="GoogleMap"
            {...styles.googleMap}
            center={currentLocation}
            onLoad={handleLoad}
            onUnmount={handleUnmount}
        >
            {mapMarkerElements.map(marker => (
                <Fragment key={marker.key}>
                    {marker.type === "WAREHOUSE" && <Marker key={marker.key} {...marker} {...styles.warehouseMarker} />}
                    {marker.type === "CURRENT_LOCATION" && (
                        <Marker key={marker.key} {...marker} {...styles.currentLocationMarker} />
                    )}
                    {marker.type === "SELECTED" && <Marker key={marker.key} {...marker} {...styles.selectedMarker} />}
                </Fragment>
            ))}
            {warehouseInfoWindow && (
                <InfoWindow {...styles.warehouseInfoWindow} key={newGuid()} position={warehouseInfoWindow?.position}>
                    {warehouseInfoWindow && (
                        <GridContainer {...styles.infoWindowGridContainer}>
                            <GridItem {...styles.infoWindowLeftGridItem}>
                                <Typography {...styles.selectedLocationName}>
                                    {warehouseInfoWindow.warehouse.description || warehouseInfoWindow.warehouse.name}
                                </Typography>
                                <AddressInfoCondensedDisplay
                                    {...warehouseInfoWindow.warehouse}
                                    extendedStyles={styles.selectedLocationAddressDisplay}
                                />
                            </GridItem>
                            <GridItem {...styles.infoWindowRightGridItem}>
                                {warehouseInfoWindow.warehouse.hours && (
                                    <WarehouseHoursLink
                                        {...styles.infoWindowWarehouseHoursLink}
                                        warehouse={warehouseInfoWindow.warehouse}
                                        onOpenWarehouseHours={handleOpenWarehouseHours}
                                    />
                                )}
                                <GoogleMapsDirectionLink
                                    {...styles.infoWindowGoogleMapsDirectionLink}
                                    {...warehouseInfoWindow.warehouse}
                                />
                                {warehouseInfoWindow.warehouse.distance > 0.01 && (
                                    <DistanceDisplay
                                        {...styles.infoWindowDistanceDisplay}
                                        distance={warehouseInfoWindow.warehouse.distance}
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
                                {warehouseSearchFilter}
                            </Typography>
                        </GridItem>
                    </GridContainer>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default withDynamicGoogleMaps(WarehouseGoogleMap);
