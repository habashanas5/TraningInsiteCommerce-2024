import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import useGoogleMaps from "@insite/client-framework/Common/Hooks/useGoogleMaps";
import useWarehouseFilterSearch from "@insite/client-framework/Common/Hooks/useWarehouseFilterSearch";
import useWarehouseGoogleMarkers from "@insite/client-framework/Common/Hooks/useWarehouseGoogleMarkers";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import { getGeoCodeFromLatLng } from "@insite/client-framework/Common/Utilities/GoogleMaps/getGeoCodeFromAddress";
import withDynamicGoogleMaps from "@insite/client-framework/Common/withDynamicGoogleMaps";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadWarehouses from "@insite/client-framework/Store/Components/FindLocationModal/Handlers/LoadWarehouses";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getWarehousesDataView } from "@insite/client-framework/Store/Data/Warehouses/WarehousesSelectors";
import translate from "@insite/client-framework/Translate";
import { PaginationModel, WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoCondensedDisplay, {
    AddressInfoCondensedDisplayStyles,
} from "@insite/content-library/Components/AddressInfoCondensedDisplay";
import DistanceDisplay, { DistanceUnitOfMeasure } from "@insite/content-library/Components/DistanceDisplay";
import GoogleMapsDirectionLink from "@insite/content-library/Components/GoogleMapsDirectionLink";
import WarehouseFindLocationPagination from "@insite/content-library/Components/WarehouseFindLocationPagination";
import WarehouseGoogleMap, { WarehouseGoogleMapStyles } from "@insite/content-library/Components/WarehouseGoogleMap";
import WarehouseHoursLink from "@insite/content-library/Components/WarehouseHoursLink";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { IconMemo, IconPresentationProps } from "@insite/mobius/Icon";
import MapPin from "@insite/mobius/Icons/MapPin";
import Phone from "@insite/mobius/Icons/Phone";
import Search from "@insite/mobius/Icons/Search";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import { PaginationPresentationProps } from "@insite/mobius/Pagination";
import Radio, { RadioComponentProps } from "@insite/mobius/Radio";
import RadioGroup, { RadioGroupProps } from "@insite/mobius/RadioGroup";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    modalIsOpen: boolean;
    onWarehouseSelected: (warehouse: WarehouseModel) => void;
    onModalClose: () => void;
    extendedStyles?: FindLocationModalStyles;
    useLoadScript: ({ googleMapsApiKey }: { googleMapsApiKey: any }) => { isLoaded: boolean };
}

const mapStateToProps = (state: ApplicationState) => ({
    warehousesDataView: getWarehousesDataView(state, state.components.findLocationModal.getWarehousesParameter),
    session: state.context.session,
    settings: getSettingsCollection(state),
});

const mapDispatchToProps = {
    loadWarehouses,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface FindLocationModalStyles {
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    modal?: ModalPresentationProps;
    modalContent?: GridContainerProps;
    leftColumnGridItem?: GridItemProps;
    form?: InjectableCss;
    searchGridContainer?: GridContainerProps;
    searchTextFieldGridItem?: GridItemProps;
    searchTextField?: TextFieldPresentationProps;
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
    searchResultGridContainer?: GridContainerProps;
    searchResultLeftGridItem?: GridItemProps;
    searchResultWarehouseDetailsGridContainer?: GridContainerProps;
    searchResultDisplayNumberGridItem?: GridItemProps;
    warehouseDisplayNumberText?: TypographyPresentationProps;
    searchResultWarehouseGridItem?: GridItemProps;
    warehouseNameText?: TypographyPresentationProps;
    searchResultAddressInfoOffsetGridItem?: GridItemProps;
    searchResultAddressInfoIcon?: IconPresentationProps;
    searchResultAddressInfoGridItem?: GridItemProps;
    warehouseAddressInfoCondensed?: AddressInfoCondensedDisplayStyles;
    searchResultLinksAndDistanceContainer?: GridContainerProps;
    searchResultPhoneOffsetGridItem?: GridItemProps;
    searchResultPhoneIcon?: IconPresentationProps;
    searchResultPhoneGridItem?: GridItemProps;
    searchResultPhoneLink?: LinkPresentationProps;
    searchResultSelectGridItem?: GridItemProps;
    searchResultSelectButton?: ButtonPresentationProps;
    searchResultLinksOffsetGridItem?: GridItemProps;
    searchResultHoursGridItem?: GridItemProps;
    warehouseHoursLink?: LinkPresentationProps;
    searchResultGoogleMapsDirectionLinkGridItem?: GridItemProps;
    warehouseGoogleMapsDirectionLink?: LinkPresentationProps;
    searchResultDistanceGridItem?: GridItemProps;
    warehouseDistanceDisplayText?: TypographyPresentationProps;
    searchResultDividerGridItem?: GridItemProps;
    searchResultDivider?: InjectableCss;
    paginationGridItem?: GridItemProps;
    pagination?: PaginationPresentationProps;

    rightColumnGridItem?: GridItemProps;
    currentlySelectedGridContainer?: GridContainerProps;
    currentlySelectedHeaderGridItem?: GridItemProps;
    currentlySelectedHeaderText?: TypographyPresentationProps;
    currentlySelectedDetailsGridItem?: GridItemProps;
    selectedWarehouseGridContainer?: GridContainerProps;
    selectedWarehouseDetailsGridItem?: GridItemProps;
    selectedWarehouseNameText?: TypographyPresentationProps;
    selectedWarehouseAddressDisplay?: AddressInfoCondensedDisplayStyles;
    selectedWarehousePhoneLink?: LinkPresentationProps;
    selectedWarehouseLinksGridItem?: GridItemProps;
    selectedWarehouseLink?: LinkPresentationProps;
    selectedWarehouseGoogleMapsDirectionLink?: LinkPresentationProps;
    selectedWarehouseDistanceText?: TypographyPresentationProps;
    warehouseGoogleMapGridItem?: GridItemProps;
    warehouseGoogleMap?: WarehouseGoogleMapStyles;
    warehouseHoursModal?: ModalPresentationProps;
    hoursContainer?: InjectableCss;
}

export const findLocationModalStyles: FindLocationModalStyles = {
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
    modal: {
        sizeVariant: "large",
        cssOverrides: {
            modalTitle: css`
                padding: 10px 20px;
            `,
            modalContent: css`
                padding: 20px;
            `,
        },
    },
    modalContent: {
        gap: 30,
    },
    leftColumnGridItem: {
        width: [12, 12, 12, 6, 5],
    },
    form: {
        css: css`
            width: 100%;
        `,
    },
    searchGridContainer: {
        gap: 0,
    },
    searchTextFieldGridItem: {
        width: 12,
    },
    searchResultsTextGridItem: {
        width: 4,
        align: "middle",
    },
    searchResultsText: {
        css: css`
            margin-top: 10px;
        `,
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
        css: css`
            padding-top: 30px;
        `,
    },
    searchResultGridContainer: {
        gap: 10,
    },
    searchResultLeftGridItem: {
        width: 9,
    },
    searchResultWarehouseDetailsGridContainer: {
        gap: 10,
    },
    searchResultDisplayNumberGridItem: {
        width: 2,
        css: css`
            justify-content: center;
        `,
    },
    warehouseDisplayNumberText: {
        color: "primary",
        weight: "bold",
    },
    searchResultWarehouseGridItem: {
        width: 10,
    },
    warehouseNameText: {
        color: "primary",
        weight: "bold",
        ellipsis: true,
    },
    searchResultAddressInfoOffsetGridItem: {
        width: 2,
        css: css`
            justify-content: center;
        `,
    },
    searchResultAddressInfoIcon: {
        color: "primary",
    },
    searchResultAddressInfoGridItem: {
        width: 10,
    },
    searchResultPhoneOffsetGridItem: {
        width: 2,
        css: css`
            justify-content: center;
        `,
    },
    searchResultPhoneIcon: {
        color: "primary",
    },
    searchResultPhoneGridItem: {
        width: 10,
    },
    searchResultSelectGridItem: {
        width: 3,
    },
    searchResultSelectButton: {
        variant: "tertiary",
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
        width: 2,
    },
    searchResultHoursGridItem: {
        width: 3,
    },
    searchResultGoogleMapsDirectionLinkGridItem: {
        width: 3,
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
    paginationGridItem: {
        width: 12,
        css: css`
            justify-content: center;
        `,
    },
    pagination: {
        cssOverrides: {
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
    rightColumnGridItem: {
        width: [12, 12, 12, 6, 7],
    },
    currentlySelectedHeaderGridItem: {
        width: 12,
    },
    currentlySelectedHeaderText: {
        weight: "bold",
    },
    currentlySelectedDetailsGridItem: {
        width: 12,
    },
    selectedWarehouseDetailsGridItem: {
        width: 6,
        css: css`
            flex-direction: column;
        `,
    },
    selectedWarehouseNameText: {
        color: "primary",
        weight: "bold",
    },
    selectedWarehouseLinksGridItem: {
        width: 6,
        css: css`
            flex-direction: column;
        `,
    },
    warehouseGoogleMapGridItem: {
        width: 12,
    },
    warehouseHoursModal: {
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
    hoursContainer: {
        css: css`
            white-space: pre-wrap;
        `,
    },
};

const StyledForm = getStyledWrapper("form");
const StyledHr = getStyledWrapper("hr");

let lastFocusableElement: any = null;

const FindLocationModal = ({
    session,
    settings,
    warehousesDataView,
    modalIsOpen,
    onWarehouseSelected,
    onModalClose,
    extendedStyles,
    loadWarehouses,
    useLoadScript,
}: Props) => {
    const [styles] = useState(() => mergeToNew(findLocationModalStyles, extendedStyles));
    const [distanceUnitOfMeasure, setDistanceUnitOfMeasure] = useState<DistanceUnitOfMeasure>("Imperial");
    const [warehouseHoursToDisplay, setWarehouseHoursToDisplay] = useState<WarehouseModel | undefined>(undefined);
    const [warehouseHoursToDisplayModalOpen, setWarehouseHoursToDisplayModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
        setLocationKnown,
    } = useGoogleMaps({
        isLoaded,
        isShown: modalIsOpen,
    });

    // Manage Selected Warehouse
    const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseModel | undefined>(undefined);
    const [showSelectedWarehouse, setShowSelectedWarehouse] = useState<boolean>(false);
    const [defaultRadius, setDefaultRadius] = useState<number>(0);
    useEffect(() => {
        setSelectedWarehouse(session.pickUpWarehouse || undefined);
    }, [session]);

    // Manage Local Warehouses
    const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
    const [resultCount, setResultCount] = useState<number>(0);
    const [warehousesPagination, setWarehousesPagination] = useState<PaginationModel | undefined>();

    // Manage Loading Warehouses on State Changes
    const { doSearch, warehouseSearchFilter, setWarehouseSearchFilter, setPage, setPageSize } =
        useWarehouseFilterSearch({
            loadWarehouses,
            currentLocation,
            setCurrentLocation,
            setLocationKnown,
            defaultRadius,
            selectedWarehouse,
            setSelectedWarehouse,
            setShowSelectedWarehouse,
        });

    // Manage Bounds of Map
    useEffect(() => {
        const bounds = [];
        closeInfoWindows();
        warehouses.forEach(warehouse => {
            bounds.push({ lat: warehouse.latitude, lng: warehouse.longitude });
        });
        if (showSelectedWarehouse && selectedWarehouse) {
            bounds.push({ lat: selectedWarehouse.latitude, lng: selectedWarehouse.longitude });
        }
        setBounds(bounds);
    }, [googleMap, warehouses, selectedWarehouse, showSelectedWarehouse, currentLocation]);

    // Manage Map Markers
    const { mapMarkersElements, currentLocationInfoWindow, warehouseInfoWindow, closeInfoWindows, getWarehouseNumber } =
        useWarehouseGoogleMarkers({
            warehouses,
            warehouseSearchFilter,
            warehousesPagination,
            currentLocation,
            selectedWarehouse,
            showSelectedWarehouse,
        });

    useEffect(() => {
        if (!isGoogleMapsScriptsLoaded) {
            return;
        }
        if (warehousesDataView.value && !warehousesDataView.isLoading) {
            const {
                pagination,
                value: warehouses,
                defaultRadius,
                defaultLatitude,
                defaultLongitude,
            } = warehousesDataView;
            // Find default location
            getGeoCodeFromLatLng(defaultLatitude, defaultLongitude).then(result => {
                setWarehouseSearchFilter(result[0].formatted_address);
                setWarehousesPagination(pagination || undefined);
                setResultCount(pagination?.totalItemCount || 0);
                setDefaultRadius(defaultRadius);
                setMapCenter(new google.maps.LatLng(defaultLatitude, defaultLongitude));
                setWarehouses(warehouses || []);
                setIsLoading(false);
            });
        } else {
            setIsLoading(true);
        }
    }, [warehousesDataView, isGoogleMapsScriptsLoaded]);

    // Manage modal focus when tabbing through the map insert
    const keysPressed = {
        shift: false,
        tab: false,
    };

    let focusableElementInterval: any = null;

    const updateLastFocusableElement = () => {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusableElements.length > 0) {
            lastFocusableElement = focusableElements[focusableElements.length - 1];
        }
    };

    const handleKeydownTabInModal = (event: KeyboardEvent) => {
        // collect what keys are being pressed in the case that the user is trying to shift+tab while on the close modal button
        if (event.key === "Tab") {
            keysPressed.tab = true;
        } else if (event.key === "Shift") {
            keysPressed.shift = true;
        }
        // if straight tab and on the final focusable element (the terms of use html page link) refocus onto the close modal button
        if (event.key === "Tab" && !keysPressed.shift) {
            const currentElement = document.activeElement;
            // using the .html here as it is the only link on the page to an html page. Cannot rely on checking "terms of use" is the inner HTML since that will not always be in English

            if (currentElement === lastFocusableElement) {
                event.preventDefault();
                document.getElementById("CloseModalButton")?.focus();
            }
        } else if ((event.key === "Tab" && keysPressed.shift) || (event.key === "Shift" && keysPressed.tab)) {
            // if pressing shift+tab and the focus is on the close modal button, send the focus to the terms of use element which is the last anchor tag on the google map
            if (document.activeElement?.id === "CloseModalButton" && lastFocusableElement) {
                event.preventDefault();
                lastFocusableElement.focus();
            }
        }
    };

    const handleKeyupTabInModal = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
            keysPressed.tab = false;
        } else if (event.key === "Shift") {
            keysPressed.shift = false;
        }
    };

    useEffect(() => {
        if (modalIsOpen && !warehouseHoursToDisplayModalOpen) {
            window.addEventListener("keydown", handleKeydownTabInModal);
            window.addEventListener("keyup", handleKeyupTabInModal);
            focusableElementInterval = setInterval(updateLastFocusableElement, 1000);
        }
        return () => {
            window.removeEventListener("keydown", handleKeydownTabInModal);
            window.removeEventListener("keyup", handleKeyupTabInModal);
            clearInterval(focusableElementInterval);
        };
    }, [modalIsOpen, warehouseHoursToDisplayModalOpen]);

    const modalCloseHandler = () => {
        onModalClose();
    };

    const handleDistanceUnitOfMeasureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as DistanceUnitOfMeasure;
        setDistanceUnitOfMeasure(value);
    };

    const handleOpenHoursModal = (warehouse: WarehouseModel) => {
        setWarehouseHoursToDisplayModalOpen(!!warehouse.hours);
        setWarehouseHoursToDisplay(warehouse);
    };

    const handleHoursModalClose = () => {
        setWarehouseHoursToDisplayModalOpen(false);
        setWarehouseHoursToDisplay(undefined);
    };

    const generateOpenWarehouseHoursFor = (warehouse: WarehouseModel) => {
        return () => handleOpenHoursModal(warehouse);
    };

    const generateWarehouseSelectClickHandler = (warehouse: WarehouseModel) => {
        return () => onWarehouseSelected(warehouse);
    };

    const isNotFinalResult = (resultIndex: number) => {
        if (!warehousesPagination) {
            return false;
        }
        return warehousesPagination.pageSize > resultIndex + 1;
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const textFieldSearch = (filter: string) => {
        doSearch(filter);
    };

    return (
        <Modal
            {...styles.modal}
            headline={translate("Select Pick Up Location")}
            isOpen={modalIsOpen}
            handleClose={modalCloseHandler}
        >
            <GridContainer {...styles.modalContent} data-test-selector="findLocationModal">
                <GridItem {...styles.leftColumnGridItem}>
                    <StyledForm {...styles.form} onSubmit={handleSubmit}>
                        <GridContainer {...styles.searchGridContainer}>
                            <GridItem {...styles.searchTextFieldGridItem}>
                                <SearchLocationsTextField
                                    styles={styles.searchTextField}
                                    doSearch={textFieldSearch}
                                    warehouseSearchFilter={warehouseSearchFilter}
                                />
                            </GridItem>
                            <GridItem {...styles.searchResultsTextGridItem}>
                                <Typography {...styles.searchResultsText}>
                                    {translate("{0} Results").replace("{0}", `${resultCount}`)}
                                </Typography>
                            </GridItem>
                            <GridItem {...styles.distanceUnitOfMeasureGridItem}>
                                <RadioGroup
                                    {...styles.distanceUnitOfMeasureRadioGroup}
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
                                {!isLoading && !locationKnown && (
                                    <Typography {...styles.siteMessageGeocodeErrorText}>
                                        {siteMessage("PickUpLocation_GeocodeErrorMessage")}
                                    </Typography>
                                )}
                                {!isLoading && locationKnown && warehouses.length === 0 && (
                                    <Typography
                                        data-test-selector="findLocationModal_noresult"
                                        {...styles.siteMessageResultsErrorText}
                                    >
                                        {showSelectedWarehouse
                                            ? siteMessage("PickUpLocation_SelectedLocationIsOnlyResult")
                                            : siteMessage("PickUpLocation_NoResultsMessage")}
                                    </Typography>
                                )}
                            </GridItem>
                            {(!warehousesDataView || !warehousesDataView.value) && (
                                <GridItem {...styles.searchResultGridItem}>
                                    <StyledWrapper {...styles.centeringWrapper}>
                                        <LoadingSpinner {...styles.spinner} />
                                    </StyledWrapper>
                                </GridItem>
                            )}
                            {warehousesDataView &&
                                warehousesDataView.value &&
                                warehouses.map((warehouse, index) => (
                                    <GridItem key={warehouse.id} {...styles.searchResultGridItem}>
                                        <GridContainer
                                            {...styles.searchResultGridContainer}
                                            data-test-selector="findLocationModal_warehouse"
                                            data-test-key={`${warehouse.id}`}
                                        >
                                            <GridItem {...styles.searchResultLeftGridItem}>
                                                <GridContainer {...styles.searchResultWarehouseDetailsGridContainer}>
                                                    <GridItem {...styles.searchResultDisplayNumberGridItem}>
                                                        <Typography {...styles.warehouseDisplayNumberText}>
                                                            {getWarehouseNumber(index)}
                                                        </Typography>
                                                    </GridItem>
                                                    <GridItem {...styles.searchResultWarehouseGridItem}>
                                                        <Typography {...styles.warehouseNameText}>
                                                            {warehouse.description || warehouse.name}
                                                        </Typography>
                                                    </GridItem>
                                                    <GridItem {...styles.searchResultAddressInfoOffsetGridItem}>
                                                        <IconMemo
                                                            {...styles.searchResultAddressInfoIcon}
                                                            src={MapPin}
                                                        />
                                                    </GridItem>
                                                    <GridItem {...styles.searchResultAddressInfoGridItem}>
                                                        <AddressInfoCondensedDisplay
                                                            {...styles.warehouseAddressInfoCondensed}
                                                            {...warehouse}
                                                        />
                                                    </GridItem>
                                                    {warehouse.phone && (
                                                        <>
                                                            <GridItem {...styles.searchResultPhoneOffsetGridItem}>
                                                                <IconMemo
                                                                    src={Phone}
                                                                    {...styles.searchResultPhoneIcon}
                                                                />
                                                            </GridItem>
                                                            <GridItem {...styles.searchResultPhoneGridItem}>
                                                                <Link
                                                                    href={`tel:${warehouse.phone}`}
                                                                    {...styles.searchResultPhoneLink}
                                                                    target="_blank"
                                                                >
                                                                    {warehouse.phone}
                                                                </Link>
                                                            </GridItem>
                                                        </>
                                                    )}
                                                </GridContainer>
                                            </GridItem>
                                            <GridItem {...styles.searchResultSelectGridItem}>
                                                <Button
                                                    {...styles.searchResultSelectButton}
                                                    type="button"
                                                    onClick={generateWarehouseSelectClickHandler(warehouse)}
                                                    data-test-selector="findLocationModal_warehouseSelect"
                                                >
                                                    {translate("Select")}
                                                </Button>
                                            </GridItem>
                                            <GridContainer {...styles.searchResultLinksAndDistanceContainer}>
                                                <GridItem {...styles.searchResultLinksOffsetGridItem}>
                                                    {/* This is here to give the grid an indentation */}
                                                </GridItem>
                                                {warehouse.hours && (
                                                    <GridItem {...styles.searchResultHoursGridItem}>
                                                        <WarehouseHoursLink
                                                            {...styles.warehouseHoursLink}
                                                            warehouse={warehouse}
                                                            onOpenWarehouseHours={generateOpenWarehouseHoursFor(
                                                                warehouse,
                                                            )}
                                                        />
                                                    </GridItem>
                                                )}
                                                <GridItem {...styles.searchResultGoogleMapsDirectionLinkGridItem}>
                                                    <GoogleMapsDirectionLink
                                                        {...styles.warehouseGoogleMapsDirectionLink}
                                                        {...warehouse}
                                                    />
                                                </GridItem>
                                                <GridItem {...styles.searchResultDistanceGridItem}>
                                                    <DistanceDisplay
                                                        {...styles.warehouseDistanceDisplayText}
                                                        distance={warehouse.distance}
                                                        unitOfMeasure={distanceUnitOfMeasure}
                                                    />
                                                </GridItem>
                                                {isNotFinalResult(index) && (
                                                    <GridItem {...styles.searchResultDividerGridItem}>
                                                        <StyledHr {...styles.searchResultDivider} />
                                                    </GridItem>
                                                )}
                                            </GridContainer>
                                        </GridContainer>
                                    </GridItem>
                                ))}
                            <GridItem {...styles.paginationGridItem}>
                                <WarehouseFindLocationPagination
                                    {...styles.pagination}
                                    warehouses={warehouses}
                                    warehousesPagination={warehousesPagination}
                                    setPage={setPage}
                                    setPageSize={setPageSize}
                                />
                            </GridItem>
                        </GridContainer>
                    </StyledForm>
                </GridItem>

                <GridItem {...styles.rightColumnGridItem}>
                    <GridContainer {...styles.currentlySelectedGridContainer}>
                        <GridItem {...styles.currentlySelectedHeaderGridItem}>
                            <Typography {...styles.currentlySelectedHeaderText}>
                                {translate("Currently Selected Location")}
                            </Typography>
                        </GridItem>
                        {selectedWarehouse && (
                            <GridItem {...styles.currentlySelectedDetailsGridItem}>
                                <GridContainer {...styles.selectedWarehouseGridContainer}>
                                    <GridItem {...styles.selectedWarehouseDetailsGridItem}>
                                        <Typography
                                            {...styles.selectedWarehouseNameText}
                                            data-test-selector="pickupLocationModal_selectedWarehouseName"
                                        >
                                            {selectedWarehouse.description || selectedWarehouse.name}
                                        </Typography>
                                        <AddressInfoCondensedDisplay
                                            {...selectedWarehouse}
                                            extendedStyles={styles.selectedWarehouseAddressDisplay}
                                        />
                                        {selectedWarehouse.phone && (
                                            <>
                                                <Link
                                                    href={`tel:${selectedWarehouse.phone}`}
                                                    {...styles.selectedWarehousePhoneLink}
                                                    target="_blank"
                                                >
                                                    {selectedWarehouse.phone}
                                                </Link>
                                            </>
                                        )}
                                    </GridItem>
                                    <GridItem {...styles.selectedWarehouseLinksGridItem}>
                                        {selectedWarehouse.hours && (
                                            <WarehouseHoursLink
                                                {...styles.selectedWarehouseLink}
                                                warehouse={selectedWarehouse}
                                                onOpenWarehouseHours={handleOpenHoursModal}
                                            />
                                        )}
                                        <GoogleMapsDirectionLink
                                            {...styles.selectedWarehouseGoogleMapsDirectionLink}
                                            {...selectedWarehouse}
                                        />
                                        {selectedWarehouse.distance > 0.01 && (
                                            <DistanceDisplay
                                                {...styles.selectedWarehouseDistanceText}
                                                distance={selectedWarehouse.distance}
                                                unitOfMeasure={distanceUnitOfMeasure}
                                            />
                                        )}
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                        )}
                        <GridItem {...styles.warehouseGoogleMapGridItem}>
                            <WarehouseGoogleMap
                                extendedStyles={styles.warehouseGoogleMap}
                                currentLocation={currentLocation}
                                warehouseSearchFilter={warehouseSearchFilter}
                                distanceUnitOfMeasure={distanceUnitOfMeasure}
                                setGoogleMap={setGoogleMap}
                                mapMarkerElements={mapMarkersElements}
                                warehouseInfoWindow={warehouseInfoWindow}
                                currentLocationInfoWindow={currentLocationInfoWindow}
                                handleOpenWarehouseHours={handleOpenHoursModal}
                                updateLastFocusableElement={updateLastFocusableElement}
                            />
                        </GridItem>
                    </GridContainer>
                </GridItem>
            </GridContainer>
            <Modal
                {...styles.warehouseHoursModal}
                headline={translate("Hours")}
                isOpen={warehouseHoursToDisplayModalOpen}
                handleClose={handleHoursModalClose}
            >
                <StyledWrapper {...styles.hoursContainer}>
                    {parse(warehouseHoursToDisplay?.hours || "", parserOptions)}
                </StyledWrapper>
            </Modal>
        </Modal>
    );
};

interface SearchLocationsTextFieldProps {
    styles?: TextFieldPresentationProps;
    doSearch: (filter: string) => void;
    warehouseSearchFilter: string;
}

const SearchLocationsTextField = ({ styles, doSearch, warehouseSearchFilter }: SearchLocationsTextFieldProps) => {
    const [searchLocationFilter, setSearchLocationFilter] = useState(warehouseSearchFilter);

    const iconOnClick = (event: React.MouseEvent) => {
        event.preventDefault();
        doSearch(searchLocationFilter);
    };
    const handleSearchLocationsChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchLocationFilter(event.target.value);
    };
    useEffect(() => {
        setSearchLocationFilter(warehouseSearchFilter);
    }, [warehouseSearchFilter]);

    return (
        <TextField
            {...styles}
            label={translate("Search Locations")}
            iconProps={{ src: Search }}
            iconClickableProps={{ onClick: iconOnClick }}
            value={searchLocationFilter}
            onChange={handleSearchLocationsChanged}
            placeholder={translate("Search by location name, city, state, or zip")}
            data-test-selector="findLocationModal_locationSearch"
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withDynamicGoogleMaps(FindLocationModal));
