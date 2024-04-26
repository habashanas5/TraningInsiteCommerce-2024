import AccountSettingsReducer from "@insite/client-framework/Store/Pages/AccountSettings/AccountSettingsReducer";
import AddressesReducer from "@insite/client-framework/Store/Pages/Addresses/AddressesReducer";
import BrandsReducer from "@insite/client-framework/Store/Pages/Brands/BrandsReducer";
import BudgetManagementReducer from "@insite/client-framework/Store/Pages/BudgetManagement/BudgetManagementReducer";
import CartReducer from "@insite/client-framework/Store/Pages/Cart/CartReducer";
import CartReminderUnsubscribeReducer from "@insite/client-framework/Store/Pages/CartReminderUnsubscribe/CartReminderUnsubscribeReducer";
import CheckoutReviewAndSubmitReducer from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/CheckoutReviewAndSubmitReducer";
import CheckoutShippingReducer from "@insite/client-framework/Store/Pages/CheckoutShipping/CheckoutShippingReducer";
import DealerDetailsReducer from "@insite/client-framework/Store/Pages/DealerDetails/DealerDetailsReducer";
import InvoiceDetailsReducer from "@insite/client-framework/Store/Pages/InvoiceDetails/InvoiceDetailsReducer";
import InvoiceHistoryReducer from "@insite/client-framework/Store/Pages/InvoiceHistory/InvoiceHistoryReducer";
import LocationFinderReducer from "@insite/client-framework/Store/Pages/LocationFinder/LocationFinderReducer";
import MyListDetailsReducer from "@insite/client-framework/Store/Pages/MyListDetails/MyListDetailsReducer";
import MyListsReducer from "@insite/client-framework/Store/Pages/MyLists/MyListsReducer";
import NewsListReducer from "@insite/client-framework/Store/Pages/NewsList/NewsListReducer";
import OrderApprovalDetailsReducer from "@insite/client-framework/Store/Pages/OrderApprovalDetails/OrderApprovalDetailsReducer";
import OrderApprovalListReducer from "@insite/client-framework/Store/Pages/OrderApprovalList/OrderApprovalListReducer";
import OrderConfirmationReducer from "@insite/client-framework/Store/Pages/OrderConfirmation/OrderConfirmationReducer";
import OrderDetailsReducer from "@insite/client-framework/Store/Pages/OrderDetails/OrderDetailsReducer";
import OrderHistoryReducer from "@insite/client-framework/Store/Pages/OrderHistory/OrderHistoryReducer";
import OrderStatusReducer from "@insite/client-framework/Store/Pages/OrderStatus/OrderStatusReducer";
import OrderUploadReducer from "@insite/client-framework/Store/Pages/OrderUpload/OrderUploadReducer";
import ProductDetailsReducer from "@insite/client-framework/Store/Pages/ProductDetails/ProductDetailsReducer";
import ProductListReducer from "@insite/client-framework/Store/Pages/ProductList/ProductListReducer";
import QuickOrderReducer from "@insite/client-framework/Store/Pages/QuickOrder/QuickOrderReducer";
import RequestRmaReducer from "@insite/client-framework/Store/Pages/RequestRma/RequestRmaReducer";
import RequisitionConfirmationReducer from "@insite/client-framework/Store/Pages/RequisitionConfirmation/RequisitionConfirmationReducer";
import RequisitionsReducer from "@insite/client-framework/Store/Pages/Requisitions/RequisitionsReducer";
import RfqConfirmationReducer from "@insite/client-framework/Store/Pages/RfqConfirmation/RfqConfirmationReducer";
import RfqJobQuoteDetailsReducer from "@insite/client-framework/Store/Pages/RfqJobQuoteDetails/RfqJobQuoteDetailsReducer";
import RfqJobQuotesReducer from "@insite/client-framework/Store/Pages/RfqJobQuotes/RfqJobQuotesReducer";
import RfqMyQuotesReducer from "@insite/client-framework/Store/Pages/RfqMyQuotes/RfqMyQuotesReducer";
import RfqQuoteDetailsReducer from "@insite/client-framework/Store/Pages/RfqQuoteDetails/RfqQuoteDetailsReducer";
import RfqRequestQuoteReducer from "@insite/client-framework/Store/Pages/RfqRequestQuote/RfqRequestQuoteReducer";
import SavedOrderDetailsReducer from "@insite/client-framework/Store/Pages/SavedOrderDetails/SavedOrderDetailsReducer";
import SavedOrderListReducer from "@insite/client-framework/Store/Pages/SavedOrderList/SavedOrderListReducer";
import SavedPaymentsReducer from "@insite/client-framework/Store/Pages/SavedPayments/SavedPaymentsReducer";
import SignInReducer from "@insite/client-framework/Store/Pages/SignIn/SignInReducer";
import StaticListReducer from "@insite/client-framework/Store/Pages/StaticList/StaticListReducer";
import UserListReducer from "@insite/client-framework/Store/Pages/UserList/UserListReducer";
import UserSetupReducer from "@insite/client-framework/Store/Pages/UserSetup/UserSetupReducer";
import VmiLocationDetailsReducer from "@insite/client-framework/Store/Pages/VmiLocationDetails/VmiLocationDetailsReducer";
import VmiLocationsReducer from "@insite/client-framework/Store/Pages/VmiLocations/VmiLocationsReducer";
import VmiUsersReducer from "@insite/client-framework/Store/Pages/VmiUsers/VmiUsersReducer";
import { combineReducers } from "redux";

const reducers = {
    accountSettings: AccountSettingsReducer,
    addresses: AddressesReducer,
    brands: BrandsReducer,
    budgetManagement: BudgetManagementReducer,
    cart: CartReducer,
    cartReminderUnsubscribe: CartReminderUnsubscribeReducer,
    checkoutReviewAndSubmit: CheckoutReviewAndSubmitReducer,
    checkoutShipping: CheckoutShippingReducer,
    dealerDetails: DealerDetailsReducer,
    invoiceDetails: InvoiceDetailsReducer,
    invoiceHistory: InvoiceHistoryReducer,
    locationFinder: LocationFinderReducer,
    myLists: MyListsReducer,
    myListDetails: MyListDetailsReducer,
    newsList: NewsListReducer,
    orderApprovalList: OrderApprovalListReducer,
    orderApprovalDetails: OrderApprovalDetailsReducer,
    orderDetails: OrderDetailsReducer,
    orderHistory: OrderHistoryReducer,
    orderConfirmation: OrderConfirmationReducer,
    orderStatus: OrderStatusReducer,
    orderUpload: OrderUploadReducer,
    productList: ProductListReducer,
    productDetails: ProductDetailsReducer,
    quickOrder: QuickOrderReducer,
    requestRma: RequestRmaReducer,
    requisitionConfirmation: RequisitionConfirmationReducer,
    requisitions: RequisitionsReducer,
    rfqConfirmation: RfqConfirmationReducer,
    rfqJobQuotes: RfqJobQuotesReducer,
    rfqJobQuoteDetails: RfqJobQuoteDetailsReducer,
    rfqMyQuotes: RfqMyQuotesReducer,
    rfqQuoteDetails: RfqQuoteDetailsReducer,
    rfqRequestQuote: RfqRequestQuoteReducer,
    savedOrderDetails: SavedOrderDetailsReducer,
    savedOrderList: SavedOrderListReducer,
    savedPayments: SavedPaymentsReducer,
    signIn: SignInReducer,
    staticList: StaticListReducer,
    userList: UserListReducer,
    userSetup: UserSetupReducer,
    vmiLocationDetails: VmiLocationDetailsReducer,
    vmiLocations: VmiLocationsReducer,
    vmiUsers: VmiUsersReducer,
};

export type PagesReducers = typeof reducers;

const pagesReducer = combineReducers(reducers as any);

export default pagesReducer;
