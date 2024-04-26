import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import { GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadShipTos from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTos";
import { getShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import addVmiLocation from "@insite/client-framework/Store/Data/VmiLocations/Handlers/AddVmiLocation";
import editVmiLocation from "@insite/client-framework/Store/Data/VmiLocations/Handlers/EditVmiLocation";
import loadVmiLocation from "@insite/client-framework/Store/Data/VmiLocations/Handlers/LoadVmiLocation";
import { getVmiLocationState } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import translate from "@insite/client-framework/Translate";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoDisplay from "@insite/content-library/Components/AddressInfoDisplay";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import DynamicDropdown, { DynamicDropdownPresentationProps, OptionObject } from "@insite/mobius/DynamicDropdown";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    isOpen?: boolean;
    editLocationId?: string;
    onSuccess: () => void;
    onClose: () => void;
    shipTosParameter: GetShipTosApiParameter;
    setShipTosParameter: (parameter: GetShipTosApiParameter) => void;
}

const mapStateToProps = (state: ApplicationState, props: OwnProps) => {
    return {
        shipTosDataView: props.isOpen && getShipTosDataView(state, props.shipTosParameter),
        vmiLocationState: props.editLocationId ? getVmiLocationState(state, props.editLocationId) : null,
    };
};

const mapDispatchToProps = {
    loadShipTos,
    addVmiLocation,
    loadVmiLocation,
    editVmiLocation,
};

type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext;

export interface AddVmiLocationModalStyles {
    modal?: ModalPresentationProps;
    form?: InjectableCss;
    container?: GridContainerProps;
    commonContainer?: GridContainerProps;
    inputsContainer?: GridContainerProps;
    addressDisplayContainer?: GridContainerProps;
    commonGridItem?: GridItemProps;
    leftGridItem?: GridItemProps;
    rightGridItem?: GridItemProps;
    customerGridItem?: GridItemProps;
    shipToSelectorDynamicDropdown?: DynamicDropdownPresentationProps;
    addressInfoDisplayGridItem?: GridItemProps;
    locationNameGridItem?: GridItemProps;
    locationNameTextField?: TextFieldPresentationProps;
    addressInfoHeadingGridItem?: GridItemProps;
    addressInfoHeadingText?: TypographyPresentationProps;
    buttonsGridItem?: GridItemProps;
    importLink?: LinkPresentationProps;
    cancelButton?: ButtonPresentationProps;
    submitButton?: ButtonPresentationProps;
}

export const addVmiLocationModalStyles: AddVmiLocationModalStyles = {
    container: { gap: 15 },
    commonGridItem: { width: 12 },
    leftGridItem: { width: [12, 12, 6, 6, 6] },
    rightGridItem: { width: [12, 12, 6, 6, 6] },
    customerGridItem: { width: 12 },
    locationNameGridItem: { width: 12 },
    addressInfoDisplayGridItem: {
        width: 12,
        css: css`
            padding-top: 0;
        `,
    },
    addressInfoHeadingGridItem: {
        width: 12,
        css: css`
            padding-bottom: 4px;
        `,
    },
    addressInfoHeadingText: { weight: "bold" },
    buttonsGridItem: {
        css: css`
            justify-content: flex-end;
        `,
        width: 12,
    },
    importLink: {
        css: css`
            margin: 9px 20px;
            white-space: nowrap;
        `,
    },
    cancelButton: {
        variant: "secondary",
        css: css`
            word-break: keep-all;
        `,
    },
    submitButton: {
        css: css`
            margin-left: 1rem;
        `,
    },
};

const styles = addVmiLocationModalStyles;

const StyledForm = getStyledWrapper("form");

const AddVmiLocationModal = ({
    isOpen,
    editLocationId,
    vmiLocationState,
    onClose,
    onSuccess,
    shipTosDataView,
    shipTosParameter,
    setShipTosParameter,
    loadShipTos,
    addVmiLocation,
    editVmiLocation,
    loadVmiLocation,
    toaster,
}: Props) => {
    const [shipToSearchText, setShipToSearchText] = useState("");
    const [locationName, setLocationName] = useState("");
    const [shipTo, setShipTo] = useState<ShipToModel>();
    const [options, setOptions] = useState<OptionObject[]>([]);
    const [customerErrorMessage, setCustomerErrorMessage] = useState("");
    const [locationNameErrorMessage, setLocationNameErrorMessage] = useState("");
    const [showFormErrors, setShowFormErrors] = useState(false);

    useEffect(() => {
        if (!isOpen || !editLocationId) {
            return;
        }

        if (vmiLocationState?.value?.customer) {
            setLocationName(vmiLocationState.value.name);
            setOptions([
                {
                    optionText: vmiLocationState.value.customerLabel,
                    optionValue:
                        vmiLocationState.value.customer.id === vmiLocationState.value.shipToId
                            ? vmiLocationState.value.shipToId
                            : vmiLocationState.value.billToId,
                },
            ]);
            setShipTo(vmiLocationState.value.customer as ShipToModel);
        } else if (vmiLocationState && !vmiLocationState.isLoading && !vmiLocationState.value?.customer) {
            loadVmiLocation({ id: editLocationId });
        }
    }, [isOpen, vmiLocationState]);

    useEffect(() => {
        if (isOpen && !editLocationId && shipTosDataView && !shipTosDataView.value && !shipTosDataView.isLoading) {
            loadShipTos(shipTosParameter);
        }
    }, [shipTosParameter, isOpen]);

    useEffect(() => {
        if (shipTosDataView && shipTosDataView.value) {
            const options: OptionObject[] = shipTosDataView.value.map(c => ({
                optionText: c.label,
                optionValue: c.id,
            }));
            setOptions(options);
            if (!shipTo && shipTosDataView.value.length === 1) {
                setShipTo(shipTosDataView.value[0]);
            }
        }
    }, [shipTosDataView]);

    const locationNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocationName(event.target.value);
        if (showFormErrors) {
            validateForm();
        }
    };

    const validateForm = () => {
        setCustomerErrorMessage(shipTo ? "" : siteMessage("Field_Required", translate("Address")).toString());
        setLocationNameErrorMessage(
            locationName ? "" : siteMessage("Field_Required", translate("Location Name")).toString(),
        );
        return shipTo && locationName;
    };

    const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            setShowFormErrors(true);
            return false;
        }

        if (editLocationId) {
            if (!shipTo?.id) {
                return;
            }

            editVmiLocation({
                vmiLocation: {
                    name: locationName,
                    id: vmiLocationState?.value?.id,
                },
                onComplete: result => {
                    if (result.apiResult?.successful) {
                        toaster.addToast({
                            body: translate("Vmi location saved successfully"),
                            messageType: "success",
                        });

                        onSuccess();
                        resetState();
                    } else if (result.apiResult?.errorMessage) {
                        toaster.addToast({ body: result.apiResult?.errorMessage, messageType: "danger" });
                    }
                },
            });
        } else {
            addVmiLocation({
                vmiLocation: {
                    billToId: shipTosParameter.billToId,
                    shipToId: shipTo?.id,
                    name: locationName,
                },
                onComplete: result => {
                    if (result.apiResult?.successful) {
                        toaster.addToast({
                            body: translate("Vmi location added successfully"),
                            messageType: "success",
                        });

                        onSuccess();
                        resetState();
                    } else if (result.apiResult?.errorMessage) {
                        toaster.addToast({ body: result.apiResult?.errorMessage, messageType: "danger" });
                    }
                },
            });
        }
    };

    const resetState = () => {
        setShipToSearchText("");
        setLocationName("");
        setShipTo(undefined);
        setCustomerErrorMessage("");
        setLocationNameErrorMessage("");
        setShowFormErrors(false);
    };

    const selectCustomerHandler = (shipToId?: string) => {
        if (shipTosDataView && shipTosDataView.value && shipToId) {
            const shipTo = shipTosDataView.value.filter(shipTo => shipTo.id === shipToId)[0];
            if (shipTo) {
                setShipTo(shipTo);
                setCustomerErrorMessage("");
            }
        } else if (showFormErrors) {
            validateForm();
        }
    };

    const searchTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShipToSearchText(event.currentTarget.value);
        setLoadShipTosParameter();
    };

    const setLoadShipTosParameter = () => {
        const apiParameter: GetShipTosApiParameter = {
            ...shipTosParameter,
            filter: shipToSearchText || undefined,
        };
        setShipTosParameter(apiParameter);
    };

    const closeModalHandler = () => {
        onClose();
        resetState();
    };

    return (
        <Modal
            {...styles.modal}
            handleClose={closeModalHandler}
            headline={editLocationId ? translate("Edit Ship To Address") : translate("Add Ship To Address")}
            isOpen={isOpen}
            size={700}
        >
            <StyledForm {...styles.form} noValidate onSubmit={formSubmitHandler}>
                <GridContainer {...styles.container}>
                    <GridItem {...styles.commonGridItem}>
                        <GridContainer {...styles.commonContainer}>
                            <GridItem {...styles.leftGridItem}>
                                <GridContainer {...styles.inputsContainer}>
                                    <GridItem {...styles.customerGridItem}>
                                        <DynamicDropdown
                                            {...styles.shipToSelectorDynamicDropdown}
                                            error={showFormErrors && customerErrorMessage}
                                            label={translate("Select an Existing Address")}
                                            onSelectionChange={selectCustomerHandler}
                                            onInputChange={searchTextChanged}
                                            selected={shipTo?.id}
                                            placeholder={translate("Search or Select Ship To")}
                                            isLoading={shipTosDataView && shipTosDataView.isLoading}
                                            options={options}
                                            disabled={!!editLocationId}
                                            required
                                        />
                                    </GridItem>
                                    <GridItem {...styles.locationNameGridItem}>
                                        <TextField
                                            {...styles.locationNameTextField}
                                            error={showFormErrors && locationNameErrorMessage}
                                            label={translate("Location Name")}
                                            onChange={locationNameChangeHandler}
                                            value={locationName}
                                            maxLength={255}
                                            required
                                        />
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                            <GridItem {...styles.rightGridItem}>
                                <GridContainer {...styles.addressDisplayContainer}>
                                    <GridItem {...styles.addressInfoHeadingGridItem}>
                                        {shipTo && (
                                            <Typography {...styles.addressInfoHeadingText}>
                                                {translate("Address")}
                                            </Typography>
                                        )}
                                    </GridItem>
                                    <GridItem {...styles.addressInfoDisplayGridItem}>
                                        {shipTo && (
                                            <AddressInfoDisplay
                                                firstName={shipTo.firstName}
                                                lastName={shipTo.lastName}
                                                companyName={shipTo.companyName}
                                                attention={shipTo.attention}
                                                address1={shipTo.address1}
                                                address2={shipTo.address2}
                                                address3={shipTo.address3}
                                                address4={shipTo.address4}
                                                city={shipTo.city}
                                                state={shipTo.state ? shipTo.state.abbreviation : undefined}
                                                postalCode={shipTo.postalCode}
                                                country={shipTo.country ? shipTo.country.abbreviation : undefined}
                                                phone={shipTo.phone}
                                                fax={shipTo.fax}
                                                email={shipTo.email}
                                            />
                                        )}
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.buttonsGridItem}>
                        {!editLocationId && <Link {...styles.importLink}>{translate("Import CSV")}</Link>}
                        <Button {...styles.cancelButton} onClick={closeModalHandler} type="button">
                            {translate("Cancel")}
                        </Button>
                        <Button {...styles.submitButton} type="submit">
                            {editLocationId ? translate("Edit Ship To Address") : translate("Add Ship To Address")}
                        </Button>
                    </GridItem>
                </GridContainer>
            </StyledForm>
        </Modal>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withToaster(AddVmiLocationModal));
