import AddressDrawerState from "@insite/client-framework/Store/Components/AddressDrawer/AddressDrawerState";
import AddressErrorModalState from "@insite/client-framework/Store/Components/AddressErrorModal/AddressErrorModalState";
import AddToListModalState from "@insite/client-framework/Store/Components/AddToListModal/AddToListModalState";
import BreadcrumbsState from "@insite/client-framework/Store/Components/Breadcrumbs/BreadcrumbsState";
import CompareProductsDrawerState from "@insite/client-framework/Store/Components/CompareProductsDrawer/CompareProductsDrawerState";
import ContactUsFormState from "@insite/client-framework/Store/Components/ContactUsForm/ContactUsFormState";
import FindLocationModalState from "@insite/client-framework/Store/Components/FindLocationModal/FindLocationModalState";
import ManageShareListModalState from "@insite/client-framework/Store/Components/ManageShareListModal/ManageShareListModalState";
import OrderUploadState from "@insite/client-framework/Store/Components/OrderUpload/OrderUploadState";
import ProductDeliveryScheduleState from "@insite/client-framework/Store/Components/ProductDeliverySchedule/ProductDeliveryScheduleState";
import ProductInfoListsState from "@insite/client-framework/Store/Components/ProductInfoList/ProductInfoListsState";
import ProductSelectorState from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorState";
import ReCaptchaState from "@insite/client-framework/Store/Components/ReCaptcha/ReCaptchaState";
import ShareListModalState from "@insite/client-framework/Store/Components/ShareListModal/ShareListModalState";

export default interface ComponentsState {
    readonly addressDrawer: AddressDrawerState;
    readonly addToListModal: AddToListModalState;
    readonly breadcrumbs: BreadcrumbsState;
    readonly compareProductsDrawer: CompareProductsDrawerState;
    readonly contactUsForm: ContactUsFormState;
    readonly findLocationModal: FindLocationModalState;
    readonly manageShareListModal: ManageShareListModalState;
    readonly orderUpload: OrderUploadState;
    readonly productDeliverySchedule: ProductDeliveryScheduleState;
    readonly productInfoLists: ProductInfoListsState;
    readonly productSelector: ProductSelectorState;
    readonly reCaptcha: ReCaptchaState;
    readonly shareListModal: ShareListModalState;
    readonly addressErrorModal: AddressErrorModalState;
}
