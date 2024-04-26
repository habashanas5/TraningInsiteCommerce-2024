import {
    getGeoCodeFromAddress,
    getGeoCodeFromLatLng,
} from "@insite/client-framework/Common/Utilities/GoogleMaps/getGeoCodeFromAddress";
import { GetWarehousesApiParameter } from "@insite/client-framework/Services/WarehouseService";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import * as React from "react";

interface Props {
    defaultRadius: number;
    currentLocation?: google.maps.LatLng;
    setCurrentLocation: (currentLocation: google.maps.LatLng) => void;
    selectedWarehouse?: WarehouseModel;
    setSelectedWarehouse: (warehouse: WarehouseModel) => void;
    setShowSelectedWarehouse: (show: boolean) => void;
    setLocationKnown: (isKnown: boolean) => void;
    loadWarehouses: (parameters: GetWarehousesApiParameter) => void;
}

/**
 * This will track Search details for Warehouses, and search triggering.
 * @param props
 */
const useWarehouseFilterSearch = ({
    loadWarehouses,
    defaultRadius,
    currentLocation,
    setCurrentLocation,
    selectedWarehouse,
    setSelectedWarehouse,
    setShowSelectedWarehouse,
    setLocationKnown,
}: Props) => {
    const [filter, setFilter] = React.useState<GetWarehousesApiParameter | undefined>(undefined);
    const [warehouseSearchFilter, setWarehouseSearchFilter] = React.useState<string>("");
    const [page, setPage] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number | undefined>(undefined);

    // When the filter changes trigger loadWarehouses action.
    React.useEffect(() => {
        if (!filter) {
            return;
        }
        loadWarehouses(filter);
    }, [filter]);

    // Create a new filter when theses change
    React.useEffect(() => {
        if (!currentLocation) {
            return;
        }
        setFilter(createFilter(currentLocation));
    }, [currentLocation, page, pageSize]);

    // Re-evaluate the Selected Warehouse distance and show details.
    React.useEffect(() => {
        if (!filter || !selectedWarehouse) {
            return;
        }
        const distanceToSelectedWarehouse = getDistance(
            filter.latitude,
            filter.longitude,
            selectedWarehouse.latitude,
            selectedWarehouse.longitude,
        );
        const showSelectedWarehouse = distanceToSelectedWarehouse < defaultRadius;
        setShowSelectedWarehouse(showSelectedWarehouse);
        if (showSelectedWarehouse && distanceToSelectedWarehouse !== selectedWarehouse.distance) {
            setSelectedWarehouse({
                ...selectedWarehouse,
                distance: distanceToSelectedWarehouse,
            });
        }
    }, [filter, selectedWarehouse, defaultRadius]);

    // Fill the search filter text with the Current Location GeoLocation Address.
    React.useEffect(() => {
        if (!currentLocation) {
            return;
        }
        getGeoCodeFromLatLng(currentLocation.lat(), currentLocation.lng())
            .then(result => {
                setWarehouseSearchFilter(result[0].formatted_address);
            })
            .catch(error => {});
    }, [currentLocation]);

    const createFilter = (coords: google.maps.LatLng): GetWarehousesApiParameter => ({
        search: warehouseSearchFilter,
        latitude: coords?.lat() ? coords.lat() : selectedWarehouse!.latitude,
        longitude: coords?.lng() ? coords.lng() : selectedWarehouse!.longitude,
        onlyPickupWarehouses: true,
        sort: "Distance",
        excludeCurrentPickupWarehouse: true,
        page,
        pageSize,
    });

    // Search for known Location data
    const doSearch = (searchFilter: string) =>
        getGeoCodeFromAddress(searchFilter)
            .then(result => {
                setLocationKnown(true);

                const geocoderResult = result[0];
                if (geocoderResult.formatted_address) {
                    setWarehouseSearchFilter(geocoderResult.formatted_address);
                }

                setPage(1);
                setCurrentLocation(geocoderResult.geometry.location);
            })
            .catch(_ => {
                if (selectedWarehouse) {
                    const coords = new google.maps.LatLng(selectedWarehouse.latitude, selectedWarehouse.longitude);
                    setPage(1);
                    setCurrentLocation(coords);
                }
                setLocationKnown(false);
            });

    return {
        doSearch,
        warehouseSearchFilter,
        setWarehouseSearchFilter,
        setPage,
        setPageSize,
    };
};

const getDistance = (latitude1: number, longitude1: number, latitude2: number, longitude2: number) => {
    let distance =
        Math.cos(getRadians(latitude1)) *
            Math.cos(getRadians(latitude2)) *
            Math.cos(getRadians(longitude2) - getRadians(longitude1)) +
        Math.sin(getRadians(latitude1)) * Math.sin(getRadians(latitude2));
    if (distance > 1) {
        distance = 1;
    }

    distance = 3960 * Math.acos(distance);

    return distance;
};

const getRadians = (degrees: number) => {
    return degrees * (Math.PI / 180);
};

export default useWarehouseFilterSearch;
