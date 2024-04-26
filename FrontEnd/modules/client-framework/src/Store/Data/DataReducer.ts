import AccountsReducer from "@insite/client-framework/Store/Data/Accounts/AccountsReducer";
import AccountShipTosReducer from "@insite/client-framework/Store/Data/AccountShipTos/AccountShipTosReducer";
import AddressFieldsReducer from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsReducer";
import BillTosReducer from "@insite/client-framework/Store/Data/BillTos/BillTosReducer";
import BrandsReducer from "@insite/client-framework/Store/Data/Brands/BrandsReducer";
import BudgetCalendarsReducer from "@insite/client-framework/Store/Data/BudgetCalendars/BudgetCalendarsReducer";
import BudgetsReducer from "@insite/client-framework/Store/Data/Budgets/BudgetsReducer";
import CartsReducer from "@insite/client-framework/Store/Data/Carts/CartsReducer";
import CatalogPagesReducer from "@insite/client-framework/Store/Data/CatalogPages/CatalogPagesReducer";
import CategoriesReducer from "@insite/client-framework/Store/Data/Categories/CategoriesReducer";
import CountriesReducer from "@insite/client-framework/Store/Data/Countries/CountriesReducer";
import DealersReducer from "@insite/client-framework/Store/Data/Dealers/DealersReducer";
import InvoicesReducer from "@insite/client-framework/Store/Data/Invoices/InvoicesReducer";
import JobQuotesReducer from "@insite/client-framework/Store/Data/JobQuotes/JobQuotesReducer";
import MessagesReducer from "@insite/client-framework/Store/Data/Messages/MessagesReducer";
import OrderApprovalsReducer from "@insite/client-framework/Store/Data/OrderApprovals/OrderApprovalsReducer";
import OrdersReducer from "@insite/client-framework/Store/Data/Orders/OrdersReducer";
import OrderStatusMappingReducer from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsReducer";
import PagesReducer from "@insite/client-framework/Store/Data/Pages/PagesReducer";
import PaymentProfilesReducer from "@insite/client-framework/Store/Data/PaymentProfiles/PaymentProfilesReducer";
import ProductsReducer from "@insite/client-framework/Store/Data/Products/ProductsReducer";
import PromotionsReducer from "@insite/client-framework/Store/Data/Promotions/PromotionsReducer";
import QuotesReducer from "@insite/client-framework/Store/Data/Quotes/QuotesReducer";
import RequisitionsReducer from "@insite/client-framework/Store/Data/Requisitions/RequisitionsReducer";
import ShipTosReducer from "@insite/client-framework/Store/Data/ShipTos/ShipTosReducer";
import VmiBinsReducer from "@insite/client-framework/Store/Data/VmiBins/VmiBinsReducer";
import VmiLocationsReducer from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsReducer";
import WarehousesReducer from "@insite/client-framework/Store/Data/Warehouses/WarehousesReducer";
import WishListLinesReducer from "@insite/client-framework/Store/Data/WishListLines/WishListLinesReducer";
import WishListsReducer from "@insite/client-framework/Store/Data/WishLists/WishListsReducer";
import { combineReducers } from "redux";

const dataReducers = {
    accounts: AccountsReducer,
    accountShipTos: AccountShipTosReducer,
    addressFields: AddressFieldsReducer,
    billTos: BillTosReducer,
    brands: BrandsReducer,
    budgets: BudgetsReducer,
    budgetCalendars: BudgetCalendarsReducer,
    carts: CartsReducer,
    catalogPages: CatalogPagesReducer,
    categories: CategoriesReducer,
    countries: CountriesReducer,
    dealers: DealersReducer,
    invoices: InvoicesReducer,
    jobQuotes: JobQuotesReducer,
    messages: MessagesReducer,
    orderApprovals: OrderApprovalsReducer,
    orders: OrdersReducer,
    orderStatusMappings: OrderStatusMappingReducer,
    pages: PagesReducer,
    paymentProfiles: PaymentProfilesReducer,
    products: ProductsReducer,
    promotions: PromotionsReducer,
    quotes: QuotesReducer,
    requisitions: RequisitionsReducer,
    shipTos: ShipTosReducer,
    vmiBins: VmiBinsReducer,
    vmiLocations: VmiLocationsReducer,
    warehouses: WarehousesReducer,
    wishLists: WishListsReducer,
    wishListLines: WishListLinesReducer,
};

export type DataReducers = typeof dataReducers;

const dataReducer = combineReducers(dataReducers as any);

export default dataReducer;
