import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAddressFieldsDataView } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsSelector";
import { getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import updateBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/UpdateBillTo";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import translate from "@insite/client-framework/Translate";
import { BillToModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import AddressInfoDisplay from "@insite/content-library/Components/AddressInfoDisplay";
import CustomerAddressForm from "@insite/content-library/Components/CustomerAddressForm";
import { AddressesPageContext } from "@insite/content-library/Pages/AddressesPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => ({
    currentBillTo: getCurrentBillToState(state).value,
    countries: getCurrentCountries(state),
    billToAddressFields: getAddressFieldsDataView(state).value?.billToAddressFields,
});

const mapDispatchToProps = {
    updateBillTo,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CurrentBillingAddressStyles {
    gridContainer?: GridContainerProps;
    headingGridItem?: GridItemProps;
    headingText?: TypographyProps;
    editLinkGridItem?: GridItemProps;
    editLink?: LinkPresentationProps;
    addressFormModal?: ModalPresentationProps;
    addressInfoDisplayGridItem?: GridItemProps;
}

export const currentBillingAddressStyles: CurrentBillingAddressStyles = {
    gridContainer: { gap: 5 },
    headingGridItem: { width: 10 },
    headingText: { variant: "h5" },
    editLinkGridItem: { width: 2 },
    addressFormModal: { sizeVariant: "medium" },
    addressInfoDisplayGridItem: { width: 12 },
};

const styles = currentBillingAddressStyles;

const CurrentBillingAddress: React.FunctionComponent<Props> = (props: Props) => {
    const { currentBillTo } = props;

    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    if (!currentBillTo) {
        return null;
    }

    const modalCloseHandler = () => {
        setModalIsOpen(false);
    };
    const editClickHandler = () => {
        setModalIsOpen(true);
    };
    const formCancelHandler = (e: any) => {
        e.preventDefault();
        modalCloseHandler();
    };
    const formSubmitHandler = (_: React.FormEvent<HTMLFormElement>, address: BillToModel) => {
        if (!props.currentBillTo) {
            return;
        }
        props.updateBillTo({
            billTo: {
                ...props.currentBillTo,
                ...address,
            },
        });
        modalCloseHandler();
    };

    const { countries, billToAddressFields } = props;

    return (
        <GridContainer {...styles.gridContainer}>
            <GridItem {...styles.headingGridItem}>
                <Typography {...styles.headingText}>{translate("Billing Information")}</Typography>
            </GridItem>
            <GridItem {...styles.editLinkGridItem}>
                {countries && (
                    <Link {...styles.editLink} onClick={editClickHandler}>
                        {translate("Edit")}
                    </Link>
                )}
                {countries && billToAddressFields && (
                    <Modal
                        headline={translate("Edit Billing Information")}
                        {...styles.addressFormModal}
                        isOpen={modalIsOpen}
                        handleClose={modalCloseHandler}
                    >
                        <CustomerAddressForm
                            address={currentBillTo}
                            countries={countries}
                            addressFieldDisplayCollection={billToAddressFields}
                            onCancel={formCancelHandler}
                            onSubmit={formSubmitHandler}
                        />
                    </Modal>
                )}
            </GridItem>
            <GridItem {...styles.addressInfoDisplayGridItem}>
                <AddressInfoDisplay
                    firstName={currentBillTo.firstName}
                    lastName={currentBillTo.lastName}
                    companyName={currentBillTo.companyName}
                    attention={currentBillTo.attention}
                    address1={currentBillTo.address1}
                    address2={currentBillTo.address2}
                    address3={currentBillTo.address3}
                    address4={currentBillTo.address4}
                    city={currentBillTo.city}
                    state={currentBillTo.state ? currentBillTo.state.abbreviation : undefined}
                    postalCode={currentBillTo.postalCode}
                    country={currentBillTo.country ? currentBillTo.country.abbreviation : undefined}
                    phone={currentBillTo.phone}
                    fax={currentBillTo.fax}
                    email={currentBillTo.email}
                />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CurrentBillingAddress),
    definition: {
        group: "Addresses",
        allowedContexts: [AddressesPageContext],
    },
};

export default widgetModule;
