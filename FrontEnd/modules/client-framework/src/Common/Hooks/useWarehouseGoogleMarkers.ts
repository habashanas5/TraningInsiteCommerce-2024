import { PaginationModel, WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import React from "react";

interface Props {
    warehouses: WarehouseModel[];
    warehouseSearchFilter: string;
    warehousesPagination?: PaginationModel;
    currentLocation?: google.maps.LatLng;
    selectedWarehouse?: WarehouseModel;
    showSelectedWarehouse: boolean;
}

export interface WarehouseInfoWindow {
    position: google.maps.LatLng;
    warehouse: WarehouseModel;
}
export interface CurrentLocationInfoWindow {
    position: google.maps.LatLng;
}
export interface WarehouseGoogleMapsMarker {
    key: string;
    warehouseId?: string;
    position: google.maps.LatLng;
    type: "WAREHOUSE" | "SELECTED" | "CURRENT_LOCATION";
    icon: string;
    onClick: () => void;
}

/**
 * Manages the Google Markers for the passed in warehouses and InfoWindows for a Google Map.
 * @param props
 */
const useWarehouseGoogleMarkers = ({
    warehouses,
    warehouseSearchFilter,
    warehousesPagination,
    currentLocation,
    selectedWarehouse,
    showSelectedWarehouse,
}: Props) => {
    const [mapMarkersElements, setMapMarkersElements] = React.useState<WarehouseGoogleMapsMarker[]>([]);
    const [warehouseInfoWindow, setWarehouseInfoWindow] = React.useState<WarehouseInfoWindow | undefined>(undefined);
    const [currentLocationInfoWindow, setCurrentLocationInfoWindow] = React.useState<
        CurrentLocationInfoWindow | undefined
    >(undefined);

    const createMarkerClickHandler = (warehouse: WarehouseModel) => {
        return () => {
            setCurrentLocationInfoWindow(undefined);
            setWarehouseInfoWindow({
                position: new google.maps.LatLng(warehouse.latitude, warehouse.longitude),
                warehouse,
            });
        };
    };

    const createCurrentLocationMarkerClickHandler = () => {
        if (currentLocation) {
            setCurrentLocationInfoWindow({ position: currentLocation });
        }
        setWarehouseInfoWindow(undefined);
    };

    const getWarehouseNumber = (index: number): number => {
        const pageSize = warehousesPagination!.pageSize;
        const page = warehousesPagination!.page;
        return index + 1 + pageSize * (page - 1);
    };

    const clearWarehouseGoogleMarkers = () => {
        setMapMarkersElements([]);
        closeInfoWindows();
    };

    const closeInfoWindows = () => {
        setWarehouseInfoWindow(undefined);
        setCurrentLocationInfoWindow(undefined);
    };

    // From warehouses create Google Markers that can be shown on Google Map.
    React.useEffect(() => {
        const markers: WarehouseGoogleMapsMarker[] = warehouses.map((warehouse, index) => ({
            key: warehouse.id,
            warehouseId: warehouse.id,
            position: new google.maps.LatLng(warehouse.latitude, warehouse.longitude),
            type: "WAREHOUSE",
            icon: `https://mt.google.com/vt/icon/text=${getWarehouseNumber(
                index,
            )}&psize=16&color=ff330000&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=1`,
            onClick: createMarkerClickHandler(warehouse),
        }));
        // Add Selected Warehouse Marker
        if (showSelectedWarehouse && selectedWarehouse) {
            markers.push({
                key: "selected",
                position: new google.maps.LatLng(selectedWarehouse.latitude, selectedWarehouse.longitude),
                type: "SELECTED",
                icon: "https://mt.google.com/vt/icon?name=icons/spotlight/spotlight-waypoint-blue.png",
                onClick: createMarkerClickHandler(selectedWarehouse),
            });
        }
        // Add Current/Search Location Marker
        if (currentLocation && warehouseSearchFilter) {
            markers.push({
                key: "current-location",
                position: currentLocation,
                type: "CURRENT_LOCATION",
                icon: "https://www.gstatic.com/images/icons/material/system_gm/2x/place_gm_blue_24dp.png",
                onClick: createCurrentLocationMarkerClickHandler,
            });
        }
        setMapMarkersElements(markers);
    }, [
        warehouses,
        currentLocation,
        warehouseSearchFilter,
        warehousesPagination,
        selectedWarehouse,
        showSelectedWarehouse,
    ]);

    return {
        mapMarkersElements,
        warehouseInfoWindow,
        currentLocationInfoWindow,
        clearWarehouseGoogleMarkers,
        closeInfoWindows,
        getWarehouseNumber,
    };
};

export default useWarehouseGoogleMarkers;
