import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import wrapInContainerStyles from "@insite/client-framework/Common/wrapInContainerStyles";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import getRealTimeWarehouseInventory from "@insite/client-framework/Store/Data/RealTimeInventory/Handlers/GetRealTimeWarehouseInventory";
import translate from "@insite/client-framework/Translate";
import {
    AvailabilityDto,
    AvailabilityMessageType,
    ProductSettingsModel,
    WarehouseDto,
} from "@insite/client-framework/Types/ApiModels";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";
import { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconWrapper } from "@insite/mobius/Icon";
import AlertTriangle from "@insite/mobius/Icons/AlertTriangle";
import Check from "@insite/mobius/Icons/Check";
import X from "@insite/mobius/Icons/X";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import safeColor from "@insite/mobius/utilities/safeColor";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

interface OwnProps {
    productId: string;
    availability?: AvailabilityDto;
    unitOfMeasure: string;
    trackInventory: boolean;
    isProductDetailsPage?: boolean;
    failedToLoadInventory?: boolean;
    extendedStyles?: ProductAvailabilityStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
});

const mapDispatchToProps = {
    getRealTimeWarehouseInventory,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface ProductAvailabilityStyles {
    container?: GridContainerProps;
    messageGridItem?: GridItemProps;
    availabilityByWarehouseLinkGridItem?: GridItemProps;
    inventoryMessage?: InjectableCss;
    messageText?: TypographyPresentationProps;
    realTimeText?: TypographyPresentationProps;
    errorWrapper?: InjectableCss;
    errorText?: TypographyPresentationProps;
    availabilityByWarehouseLink?: LinkPresentationProps;
    availabilityByWarehouseModal?: ModalPresentationProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    availabilityByWarehouseTable?: DataTableProps;
    availabilityByWarehouseTableHead?: DataTableHeadProps;
    availabilityByWarehouseTableHeader?: DataTableHeaderProps;
    availabilityByWarehouseTableBody?: DataTableBodyProps;
    availabilityByWarehouseTableRow?: DataTableRowProps;
    availabilityByWarehouseTableCell?: DataTableCellBaseProps;
}

export const productAvailabilityStyles: ProductAvailabilityStyles = {
    container: {
        gap: 0,
        css: css`
            flex-grow: 0;
        `,
    },
    messageGridItem: { width: 12 },
    availabilityByWarehouseLinkGridItem: { width: 12 },
    availabilityByWarehouseModal: {
        size: 400,
        cssOverrides: {
            modalContent: css`
                padding: 0;
            `,
            modalTitle: css`
                padding: 10px 10px 10px 20px;
            `,
            headlineTypography: css`
                font-size: 20px;
                margin-bottom: 0;
            `,
        },
    },
    centeringWrapper: {
        css: css`
            height: 100px;
            width: 100%;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css`
            margin: 0 auto;
        `,
    },
    messageText: {
        css: css`
            width: 100%;
            ${wrapInContainerStyles}
        `,
    },
    realTimeText: {
        weight: "bold",
        css: css`
            display: inline-block;
            text-align: left;
            min-width: 25px;

            &::after {
                overflow: hidden;
                display: inline-block;
                vertical-align: bottom;
                animation: ellipsis steps(4, end) 900ms infinite 1s;
                content: "\\2026";
                width: 0;
            }

            @keyframes ellipsis {
                to {
                    width: 1.25em;
                }
            }
        `,
    },
    errorText: {
        weight: "bold",
    },
};

const InventoryMessage = styled.div<{ color: string }>`
    display: flex;
    align-items: center;
    padding: 5px;
    border-radius: 5px;
    background-color: ${props => safeColor(resolveColor(props.color, props.theme)).rgb().alpha(0.2).string()};
    ${IconWrapper} {
        margin-right: 10px;
    }
`;

const getAvailabilityColor = (productSettings: ProductSettingsModel, availability?: AvailabilityDto) => {
    if (!productSettings.showInventoryAvailability) {
        return "common";
    }

    const availabilityType = availability?.messageType;
    if (availabilityType === AvailabilityMessageType.OutOfStock) {
        return "danger";
    }

    if (availabilityType === AvailabilityMessageType.LowStock) {
        return "warning";
    }

    return "success";
};

const getAvailabilityIcon = (productSettings: ProductSettingsModel, availability?: AvailabilityDto) => {
    if (!productSettings.showInventoryAvailability) {
        return undefined;
    }

    const availabilityType = availability?.messageType;
    if (availabilityType === AvailabilityMessageType.OutOfStock) {
        return X;
    }

    if (availabilityType === AvailabilityMessageType.LowStock) {
        return AlertTriangle;
    }

    return Check;
};

const showLink = (
    availability: AvailabilityDto | undefined,
    trackInventory: boolean,
    productSettings: ProductSettingsModel,
    isProductDetailsPage?: boolean,
): boolean => {
    if (
        !availability ||
        availability.messageType === AvailabilityMessageType.NoMessage ||
        !trackInventory ||
        !productSettings.showInventoryAvailability ||
        !productSettings.displayInventoryPerWarehouse
    ) {
        return false;
    }

    if (!productSettings.displayInventoryPerWarehouseOnlyOnProductDetail) {
        return true;
    }

    return !!isProductDetailsPage;
};

const ProductAvailability = ({
    productId,
    availability,
    unitOfMeasure,
    trackInventory,
    productSettings,
    isProductDetailsPage,
    getRealTimeWarehouseInventory,
    failedToLoadInventory,
    extendedStyles,
}: Props) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [warehouses, setWarehouses] = useState<WarehouseDto[] | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const modalCloseHandler = () => {
        setModalIsOpen(false);
    };
    const viewAvailabilityByWarehouseClickHandler = () => {
        setIsLoading(true);
        setModalIsOpen(true);
        getRealTimeWarehouseInventory({
            productId,
            unitOfMeasure,
            expand: ["warehouses"],
            onComplete: result => {
                setWarehouses(result.warehouses);
                setErrorMessage(result.errorMessage);
                setIsLoading(false);
            },
        });
    };

    const color = getAvailabilityColor(productSettings, availability);
    const iconSrc = getAvailabilityIcon(productSettings, availability);

    const [styles] = useState(() => mergeToNew(productAvailabilityStyles, extendedStyles));

    if (failedToLoadInventory) {
        return (
            <StyledWrapper {...styles.errorWrapper}>
                <Typography {...styles.errorText}>{siteMessage("RealTimeInventory_InventoryLoadFailed")}</Typography>
            </StyledWrapper>
        );
    }

    let inventoryTextComponent = <Typography {...styles.realTimeText} />;
    if (availability?.messageType !== AvailabilityMessageType.NoMessage && availability?.message?.length) {
        inventoryTextComponent = (
            <InventoryMessage color={color} {...styles.inventoryMessage}>
                <Icon color={color} src={iconSrc} />
                <Typography {...styles.messageText} data-test-selector="availabilityMessage">
                    {availability.message}
                </Typography>
            </InventoryMessage>
        );
    } else if (availability) {
        inventoryTextComponent = <></>;
    }

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.messageGridItem}>{inventoryTextComponent}</GridItem>
            {showLink(availability, trackInventory, productSettings, isProductDetailsPage) && (
                <GridItem {...styles.availabilityByWarehouseLinkGridItem}>
                    <Link
                        {...styles.availabilityByWarehouseLink}
                        onClick={viewAvailabilityByWarehouseClickHandler}
                        data-test-selector="availabilityByWarehouseLink"
                    >
                        {translate("View Availability by Warehouse")}
                    </Link>
                    <Modal
                        {...styles.availabilityByWarehouseModal}
                        headline={translate("Warehouse Inventory")}
                        isOpen={modalIsOpen}
                        handleClose={modalCloseHandler}
                    >
                        {isLoading && (
                            <StyledWrapper {...styles.centeringWrapper}>
                                <LoadingSpinner {...styles.spinner} />
                            </StyledWrapper>
                        )}
                        {!isLoading && (
                            <>
                                {errorMessage ? (
                                    <div>{errorMessage}</div>
                                ) : (
                                    <DataTable
                                        {...styles.availabilityByWarehouseTable}
                                        data-test-selector="availabilityByWarehouseModal"
                                    >
                                        <DataTableHead {...styles.availabilityByWarehouseTableHead}>
                                            <DataTableHeader {...styles.availabilityByWarehouseTableHeader}>
                                                {translate("Warehouse")}
                                            </DataTableHeader>
                                            <DataTableHeader {...styles.availabilityByWarehouseTableHeader}>
                                                {translate("QTY")}
                                            </DataTableHeader>
                                        </DataTableHead>
                                        <DataTableBody {...styles.availabilityByWarehouseTableBody}>
                                            {warehouses?.map(warehouse => (
                                                <DataTableRow
                                                    {...styles.availabilityByWarehouseTableRow}
                                                    key={warehouse.name}
                                                >
                                                    <DataTableCell {...styles.availabilityByWarehouseTableCell}>
                                                        {warehouse.description || warehouse.name}
                                                    </DataTableCell>
                                                    <DataTableCell {...styles.availabilityByWarehouseTableCell}>
                                                        {warehouse.qty}
                                                    </DataTableCell>
                                                </DataTableRow>
                                            ))}
                                        </DataTableBody>
                                    </DataTable>
                                )}
                            </>
                        )}
                    </Modal>
                </GridItem>
            )}
        </GridContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductAvailability);
