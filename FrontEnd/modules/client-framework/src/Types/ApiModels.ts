// this file is auto generated and should not be modified by hand
export interface BaseModel {
    uri: string;
    properties: { [key: string]: string };
}

export interface PaginationModel {
    currentPage: number;
    page: number;
    pageSize: number;
    defaultPageSize: number;
    totalItemCount: number;
    numberOfPages: number;
    pageSizeOptions: number[];
    sortOptions: SortOptionModel[];
    sortType: string;
    nextPageUri: string;
    prevPageUri: string;
}

export interface SortOptionModel {
    displayName: string;
    sortType: string;
}
export interface AccountCollectionModel extends BaseModel {
    accounts: AccountModel[] | null;
    pagination: PaginationModel | null;
}

export interface AccountModel extends BaseModel {
    accessToken: string;
    activationStatus: string;
    approver: string;
    availableApprovers: string[] | null;
    availableRoles: string[] | null;
    billToId: string | null;
    canApproveOrders: boolean;
    canViewApprovalOrders: boolean;
    defaultCustomerId: string | null;
    defaultFulfillmentMethod: string;
    defaultWarehouse: WarehouseModel | null;
    defaultWarehouseId: string | null;
    email: string;
    firstName: string;
    id: string;
    isApproved: boolean | null;
    isGuest: boolean;
    isSubscribed: boolean | null;
    lastLoginOn: Date | null;
    lastName: string;
    password: string;
    requiresActivation: boolean | null;
    role: string;
    setDefaultCustomer: boolean;
    shipToId: string | null;
    userName: string;
    vmiRole: string;
}

export interface AccountPaymentProfileCollectionModel extends BaseModel {
    accountPaymentProfiles: AccountPaymentProfileModel[] | null;
    pagination: PaginationModel | null;
}

export interface AccountShipToCollectionModel extends BaseModel {
    costCodeCollection: CustomerCostCodeDto[] | null;
    pagination: PaginationModel | null;
    userShipToCollection: AccountShipToModel[] | null;
}

export interface AccountPaymentProfileModel extends BaseModel {
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    cardHolderName: string;
    cardIdentifier: string;
    cardType: string;
    city: string;
    country: string;
    description: string;
    expirationDate: string;
    id: string;
    isDefault: boolean;
    maskedCardNumber: string;
    postalCode: string;
    state: string;
    tokenScheme: string;
}

export interface PersonaModel extends BaseModel {
    description: string;
    id: string;
    isDefault: boolean;
    name: string;
}

export interface VmiUserModel extends BaseModel {
    removeVmiPermissions: boolean;
    role: string;
    userId: string;
    vmiLocationIds: string[] | null;
}

export interface AccountSettingsModel extends BaseModel {
    allowCreateAccount: boolean;
    allowGuestCheckout: boolean;
    allowSubscribeToNewsLetter: boolean;
    daysToRetainUser: number;
    enableWarehousePickup: boolean;
    passwordMinimumLength: number;
    passwordMinimumRequiredLength: number;
    passwordRequiresDigit: boolean;
    passwordRequiresLowercase: boolean;
    passwordRequiresSpecialCharacter: boolean;
    passwordRequiresUppercase: boolean;
    rememberMe: boolean;
    requireSelectCustomerOnSignIn: boolean;
    useEmailAsUserName: boolean;
}

export interface SessionModel extends BaseModel {
    activateAccount: boolean;
    billTo: BillToModel | null;
    cartReminderUnsubscribeEmail: string;
    cartReminderUnsubscribeToken: string;
    currency: CurrencyModel | null;
    customerWasUpdated: boolean;
    customLandingPage: string;
    dashboardIsHomepage: boolean | null;
    deviceType: string;
    displayChangeCustomerLink: boolean;
    displayMyAccountMenu: boolean;
    email: string;
    firstName: string;
    fulfillmentMethod: string;
    hasDefaultCustomer: boolean;
    hasRfqUpdates: boolean | null;
    isAuthenticated: boolean;
    isGuest: boolean;
    isRestrictedProductExistInCart: boolean;
    isRestrictedProductRemovedFromCart: boolean;
    isSalesPerson: boolean;
    language: LanguageModel | null;
    lastName: string;
    newPassword: string;
    password: string;
    persona: string;
    personas: PersonaModel[] | null;
    pickUpWarehouse: WarehouseModel | null;
    redirectToChangeCustomerPageOnSignIn: boolean;
    rememberMe: boolean;
    resetPassword: boolean;
    resetToken: string;
    shipTo: ShipToModel | null;
    userLabel: string;
    userName: string;
    userProfileId: string | null;
    userRoles: string;
}

export interface ShipToModel extends BaseModel {
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    attention: string;
    city: string;
    companyName: string;
    contactFullName: string;
    country: CountryModel | null;
    customerName: string;
    customerNumber: string;
    customerSequence: string;
    email: string;
    fax: string;
    firstName: string;
    fullAddress: string;
    id: string;
    isDefault: boolean;
    isNew: boolean;
    isVmiLocation: boolean;
    label: string;
    lastName: string;
    oneTimeAddress: boolean;
    phone: string;
    postalCode: string;
    state: StateModel | null;
    validation: CustomerValidationDto | null;
}

export interface CustomerValidationDto {
    address1: FieldValidationDto | null;
    address2: FieldValidationDto | null;
    address3: FieldValidationDto | null;
    address4: FieldValidationDto | null;
    attention: FieldValidationDto | null;
    city: FieldValidationDto | null;
    companyName: FieldValidationDto | null;
    country: FieldValidationDto | null;
    email: FieldValidationDto | null;
    fax: FieldValidationDto | null;
    firstName: FieldValidationDto | null;
    lastName: FieldValidationDto | null;
    phone: FieldValidationDto | null;
    postalCode: FieldValidationDto | null;
    state: FieldValidationDto | null;
}

export interface FieldValidationDto {
    isDisabled: boolean;
    isRequired: boolean;
    maxLength: number | null;
}

export interface StateModel extends BaseModel {
    abbreviation: string;
    id: string;
    name: string;
}

export interface CountryModel extends BaseModel {
    abbreviation: string;
    id: string;
    name: string;
    states: StateModel[] | null;
}

export interface LanguageModel extends BaseModel {
    cultureCode: string;
    description: string;
    id: string;
    imageFilePath: string;
    isDefault: boolean;
    isLive: boolean;
    languageCode: string;
}

export interface CurrencyModel extends BaseModel {
    currencyCode: string;
    currencySymbol: string;
    description: string;
    id: string;
    isDefault: boolean;
}

export interface BillToModel extends BaseModel {
    accountsReceivable?: AccountsReceivableDto | null;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    attention: string;
    budgetEnforcementLevel: string;
    city: string;
    companyName: string;
    contactFullName: string;
    costCodes?: CostCodeModel[] | null;
    costCodeTitle: string;
    country: CountryModel | null;
    customerCurrencySymbol: string;
    customerName: string;
    customerNumber: string;
    customerSequence: string;
    email: string;
    fax: string;
    firstName: string;
    fullAddress: string;
    id: string;
    isDefault: boolean;
    isGuest: boolean;
    label: string;
    lastName: string;
    phone: string;
    postalCode: string;
    shipTos?: ShipToModel[] | null;
    shipTosUri: string;
    state: StateModel | null;
    validation?: CustomerValidationDto | null;
}

export interface CostCodeModel {
    costCode: string;
    description: string;
    id: string;
    isActive: boolean | null;
}

export interface AccountsReceivableDto {
    agingBucketFuture: AgingBucketDto | null;
    agingBuckets: AgingBucketDto[] | null;
    agingBucketTotal: AgingBucketDto | null;
}

export interface AgingBucketDto {
    amount: number;
    amountDisplay: string;
    label: string;
}

export interface AccountShipToModel {
    address: string;
    assign: boolean;
    city: string;
    costCode: string;
    id: string | null;
    isDefaultShipTo: boolean;
    shipToNumber: string;
    state: string;
}

export interface CustomerCostCodeDto {
    costCode: string;
    customerCostCodeId: string;
    description: string;
    isActive: boolean;
}

export interface WarehouseModel extends BaseModel {
    address1: string;
    address2: string;
    allowPickup: boolean;
    alternateWarehouses: WarehouseModel[] | null;
    city: string;
    contactName: string;
    countryId: string | null;
    deactivateOn: Date | null;
    description: string;
    distance: number;
    hours: string;
    id: string;
    isDefault: boolean;
    latitude: number;
    longitude: number;
    name: string;
    phone: string;
    pickupShipViaId: string | null;
    postalCode: string;
    shipSite: string;
    state: string;
}

export interface BrandAlphabetModel extends BaseModel {
    alphabet: BrandAlphabetLetterModel[] | null;
}

export interface BrandCategoryCollectionModel extends BaseModel {
    brandCategories: BrandCategoryModel[] | null;
    pagination: PaginationModel | null;
}

export interface BrandCategoryModel extends BaseModel {
    brandId: string;
    categoryId: string;
    categoryName: string;
    categoryShortDescription: string;
    contentManagerId: string | null;
    featuredImageAltText: string;
    featuredImagePath: string;
    htmlContent: string;
    productListPagePath: string;
    subCategories: BrandCategoryModel[] | null;
}

export interface BrandCollectionModel extends BaseModel {
    brands: BrandModel[] | null;
    pagination: PaginationModel | null;
}

export interface BrandModel extends BaseModel {
    detailPagePath: string;
    externalUrl: string;
    featuredImageAltText: string;
    featuredImagePath: string;
    htmlContent: string;
    id: string;
    logoAltText: string;
    logoLargeImagePath: string;
    logoSmallImagePath: string;
    manufacturer: string;
    metaDescription: string;
    name: string;
    pageTitle: string;
    productListPagePath: string;
    topSellerProducts: ProductDto[] | null;
}

export interface BrandProductLineCollectionModel extends BaseModel {
    pagination: PaginationModel | null;
    productLines: BrandProductLineModel[] | null;
}

export interface BrandProductLineModel extends BaseModel {
    featuredImageAltText: string;
    featuredImagePath: string;
    id: string;
    isFeatured: boolean;
    isSponsored: boolean;
    name: string;
    productListPagePath: string;
    sortOrder: number;
}

export interface ProductDto {
    accessories: ProductDto[] | null;
    allowAnyGiftCardAmount: boolean;
    allowedAddToCart: boolean;
    allowZeroPricing: boolean;
    alsoPurchasedProducts: ProductDto[] | null;
    altText: string;
    attributeTypes: AttributeTypeDto[] | null;
    availability: AvailabilityDto | null;
    basicListPrice: number;
    basicSaleEndDate: Date | null;
    basicSalePrice: number;
    basicSaleStartDate: Date | null;
    brand: BrandDto | null;
    canAddToCart: boolean;
    canAddToWishlist: boolean;
    canBackOrder: boolean;
    canConfigure: boolean;
    canEnterQuantity: boolean;
    canShowPrice: boolean;
    canShowUnitOfMeasure: boolean;
    canViewDetails: boolean;
    configurationDto: LegacyConfigurationDto | null;
    crossSells: ProductDto[] | null;
    currencySymbol: string;
    customerName: string;
    customerUnitOfMeasure: string;
    documents: DocumentDto[] | null;
    erpDescription: string;
    erpNumber: string;
    handlingAmountOverride: number | null;
    hasMsds: boolean;
    htmlContent: string;
    id: string;
    isActive: boolean;
    isBeingCompared: boolean;
    isConfigured: boolean;
    isDiscontinued: boolean;
    isFixedConfiguration: boolean;
    isGiftCard: boolean;
    isHazardousGood: boolean;
    isSpecialOrder: boolean;
    isSponsored: boolean;
    isStyleProductParent: boolean;
    isSubscription: boolean;
    largeImagePath: string;
    manufacturerItem: string;
    mediumImagePath: string;
    metaDescription: string;
    metaKeywords: string;
    minimumOrderQty: number;
    modelNumber: string;
    multipleSaleQty: number;
    name: string;
    numberInCart: number;
    orderLineId: string | null;
    packDescription: string;
    pageTitle: string;
    priceCode: string;
    pricing: ProductPriceDto | null;
    productCode: string;
    productDetailUrl: string;
    productImages: ProductImageDto[] | null;
    productLine: ProductLineDto | null;
    productSubscription: ProductSubscriptionDto | null;
    productUnitOfMeasures: ProductUnitOfMeasureDto[] | null;
    qtyOnHand: number;
    qtyOrdered: number;
    qtyPerShippingPackage: number;
    quoteRequired: boolean;
    relatedProducts: RelatedProductDto[] | null;
    replacementProductId: string | null;
    requiresRealTimeInventory: boolean;
    roundingRule: string;
    salePriceLabel: string;
    score: number;
    scoreExplanation: ScoreExplanationDto | null;
    searchBoost: number;
    searchBoostDecimal: number;
    selectedUnitOfMeasure: string;
    selectedUnitOfMeasureDisplay: string;
    shippingAmountOverride: number | null;
    shippingClassification: string;
    shippingHeight: string;
    shippingLength: string;
    shippingWeight: string;
    shippingWidth: string;
    shortDescription: string;
    sku: string;
    smallImagePath: string;
    sortOrder: number;
    specifications: SpecificationDto[] | null;
    styledProducts: StyledProductDto[] | null;
    styleParentId: string | null;
    styleTraits: StyleTraitDto[] | null;
    taxCategory: string;
    taxCode1: string;
    taxCode2: string;
    trackInventory: boolean;
    unitOfMeasure: string;
    unitOfMeasureDescription: string;
    unitOfMeasureDisplay: string;
    unspsc: string;
    upcCode: string;
    urlSegment: string;
    vendorNumber: string;
    warehouses: WarehouseDto[] | null;
}

export interface WarehouseDto {
    description: string;
    message: string;
    messageType: AvailabilityMessageType | null;
    name: string;
    qty: number;
    requiresRealTimeInventory: boolean;
}

export enum AvailabilityMessageType {
    NoMessage = 0,
    Available = 1,
    OutOfStock = 2,
    LowStock = 3,
}

export interface StyleTraitDto {
    name: string;
    nameDisplay: string;
    sortOrder: number;
    styleTraitId: string;
    styleValues: StyleValueDto[] | null;
    unselectedValue: string;
}

export interface StyleValueDto {
    isDefault: boolean;
    sortOrder: number;
    styleTraitId: string;
    styleTraitName: string;
    styleTraitValueId: string;
    value: string;
    valueDisplay: string;
}

export interface StyledProductDto {
    allowZeroPricing: boolean;
    availability: AvailabilityDto | null;
    erpNumber: string;
    largeImagePath: string;
    manufacturerItem: string;
    mediumImagePath: string;
    minimumOrderQty: number;
    name: string;
    numberInCart: number;
    pricing: ProductPriceDto | null;
    productDetailUrl: string;
    productId: string;
    productImages: ProductImageDto[] | null;
    productUnitOfMeasures: ProductUnitOfMeasureDto[] | null;
    qtyOnHand: number;
    quoteRequired: boolean;
    shortDescription: string;
    sku: string;
    smallImagePath: string;
    styleValues: StyleValueDto[] | null;
    trackInventory: boolean;
    unitOfMeasure: string;
    upcCode: string;
    warehouses: WarehouseDto[] | null;
}

export interface SpecificationDto {
    description: string;
    htmlContent: string;
    isActive: boolean;
    name: string;
    nameDisplay: string;
    parentSpecification: SpecificationDto | null;
    sortOrder: number;
    specificationId: string;
    specifications: SpecificationDto[] | null;
    value: string;
}

export interface ScoreExplanationDto {
    aggregateFieldScores: FieldScoreDto[] | null;
    detailedFieldScores: FieldScoreDetailedDto[] | null;
    totalBoost: any;
}

export interface FieldScoreDetailedDto {
    boost: any;
    inverseDocumentFrequency: any;
    matchText: string;
    name: string;
    score: any;
    scoreUsed: boolean;
    termFrequencyNormalized: any;
}

export interface FieldScoreDto {
    name: string;
    score: any;
}

export interface RelatedProductDto {
    productDto: ProductDto | null;
    relatedProductType: string;
}

export interface ProductUnitOfMeasureDto {
    availability: AvailabilityDto | null;
    description: string;
    isDefault: boolean;
    productUnitOfMeasureId: string;
    qtyPerBaseUnitOfMeasure: number;
    roundingRule: string;
    unitOfMeasure: string;
    unitOfMeasureDisplay: string;
}

export interface ProductSubscriptionDto {
    subscriptionAddToInitialOrder: boolean;
    subscriptionAllMonths: boolean;
    subscriptionApril: boolean;
    subscriptionAugust: boolean;
    subscriptionCyclePeriod: string;
    subscriptionDecember: boolean;
    subscriptionFebruary: boolean;
    subscriptionFixedPrice: boolean;
    subscriptionJanuary: boolean;
    subscriptionJuly: boolean;
    subscriptionJune: boolean;
    subscriptionMarch: boolean;
    subscriptionMay: boolean;
    subscriptionNovember: boolean;
    subscriptionOctober: boolean;
    subscriptionPeriodsPerCycle: number;
    subscriptionSeptember: boolean;
    subscriptionShipViaId: string | null;
    subscriptionTotalCycles: number;
}

export interface ProductLineDto {
    id: string;
    name: string;
}

export interface ProductImageDto {
    altText: string;
    id: string;
    imageType: string;
    largeImagePath: string;
    mediumImagePath: string;
    name: string;
    smallImagePath: string;
    sortOrder: number;
}

export interface ProductPriceDto {
    actualBreakPrices: BreakPriceDto[] | null;
    actualPrice: number;
    actualPriceDisplay: string;
    additionalResults: { [key: string]: string } | null;
    extendedActualPrice: number;
    extendedActualPriceDisplay: string;
    extendedRegularPrice: number;
    extendedRegularPriceDisplay: string;
    extendedUnitListPrice: number;
    extendedUnitListPriceDisplay: string;
    extendedUnitListPriceWithVat: number;
    extendedUnitListPriceWithVatDisplay: string;
    extendedUnitNetPrice: number;
    extendedUnitNetPriceDisplay: string;
    extendedUnitRegularPrice: number;
    extendedUnitRegularPriceDisplay: string;
    extendedUnitRegularPriceWithVat: number;
    extendedUnitRegularPriceWithVatDisplay: string;
    isOnSale: boolean;
    productId: string;
    regularBreakPrices: BreakPriceDto[] | null;
    regularPrice: number;
    regularPriceDisplay: string;
    requiresRealTimePrice: boolean;
    unitCost: number;
    unitCostDisplay: string;
    unitListBreakPrices: BreakPriceDto[] | null;
    unitListPrice: number;
    unitListPriceDisplay: string;
    unitListPriceWithVat: number;
    unitListPriceWithVatDisplay: string;
    unitNetPrice: number;
    unitNetPriceDisplay: string;
    unitOfMeasure: string;
    unitRegularBreakPrices: BreakPriceDto[] | null;
    unitRegularPrice: number;
    unitRegularPriceDisplay: string;
    unitRegularPriceWithVat: number;
    unitRegularPriceWithVatDisplay: string;
    vatAmount: number;
    vatAmountDisplay: string;
    vatMinusExtendedUnitRegularPrice: number;
    vatRate: number;
}

export interface BreakPriceDto {
    breakPrice: number;
    breakPriceDisplay: string;
    breakPriceWithVat: number;
    breakPriceWithVatDisplay: string;
    breakQty: number;
    savingsMessage: string;
}

export interface DocumentDto {
    createdOn: Date;
    description: string;
    documentType: string;
    filePath: string;
    fileTypeString: string;
    fileUrl: string;
    id: string;
    languageId: string | null;
    name: string;
}

export interface LegacyConfigurationDto {
    hasDefaults: boolean;
    isKit: boolean;
    sections: ConfigSectionDto[] | null;
}

export interface ConfigSectionDto {
    options: ConfigSectionOptionDto[] | null;
    sectionName: string;
}

export interface ConfigSectionOptionDto {
    description: string;
    price: number;
    productId: string | null;
    productName: string;
    quantity: number;
    sectionName: string;
    sectionOptionId: string;
    selected: boolean;
    sortOrder: number;
    userProductPrice: boolean;
}

export interface BrandDto {
    detailPagePath: string;
    id: string;
    logoImageAltText: string;
    logoLargeImagePath: string;
    logoSmallImagePath: string;
    name: string;
    urlSegment: string;
}

export interface AvailabilityDto {
    message: string;
    messageType: AvailabilityMessageType | null;
    requiresRealTimeInventory: boolean;
}

export interface AttributeTypeDto {
    attributeValues: AttributeValueDto[] | null;
    id: string;
    includeOnProduct: boolean;
    isActive: boolean;
    isComparable: boolean;
    isFilter: boolean;
    isSearchable: boolean;
    label: string;
    name: string;
    sortOrder: number;
}

export interface AttributeValueDto {
    id: string;
    isActive: boolean;
    sortOrder: number;
    value: string;
    valueDisplay: string;
}

export interface BrandAlphabetLetterModel {
    count: number;
    letter: string;
}

export interface BudgetCalendarCollectionModel extends BaseModel {
    budgetCalendarCollection: BudgetCalendarModel[] | null;
}

export interface BudgetCalendarModel extends BaseModel {
    budgetPeriods: (Date | null)[] | null;
    fiscalYear: number;
    fiscalYearEndDate: Date | null;
}

export interface BudgetCollectionModel extends BaseModel {
    budgetCollection: BudgetModel[] | null;
}

export interface BudgetModel extends BaseModel {
    budgetLineCollection: BudgetLineModel[] | null;
    fiscalYear: number;
    fiscalYearEndDate: Date | null;
    shipToId: string;
    userProfileId: string;
}

export interface BudgetLineModel extends BaseModel {
    currentFiscalYearActual: number;
    currentFiscalYearActualDisplay: string;
    currentFiscalYearBudget?: number;
    currentFiscalYearBudgetDisplay: string;
    currentFiscalYearVariance: number;
    currentFiscalYearVarianceDisplay: string;
    lastFiscalYearActual: number;
    lastFiscalYearActualDisplay: string;
    lastFiscalYearBudget: number;
    lastFiscalYearBudgetDisplay: string;
    lastFiscalYearVariance: number;
    lastFiscalYearVarianceDisplay: string;
    period: number;
    startDate: Date;
}

export interface CartCollectionModel extends BaseModel {
    carts: CartModel[] | null;
    pagination: PaginationModel | null;
}

export interface CartLineCollectionModel extends BaseModel {
    cartLines: CartLineModel[] | null;
    notAllAddedToCart: boolean;
    pagination: PaginationModel | null;
}

export interface CartSettingsModel extends BaseModel {
    addToCartPopupTimeout: number;
    canEditCostCode: boolean;
    canRequestDeliveryDate: boolean;
    canRequisition: boolean;
    enableRequestPickUpDate: boolean;
    enableSavedCreditCards: boolean;
    maximumDeliveryPeriod: number;
    requiresPoNumber: boolean;
    showCostCode: boolean;
    showCreditCard: boolean;
    showLineNotes: boolean;
    showNewsletterSignup: boolean;
    showPayPal: boolean;
    showPoNumber: boolean;
    showTaxAndShipping: boolean;
}

export interface CartLineModel extends BaseModel {
    allowZeroPricing: boolean;
    altText: string;
    availability: AvailabilityDto | null;
    baseUnitOfMeasure: string;
    baseUnitOfMeasureDisplay: string;
    brand: BrandDto | null;
    breakPrices: BreakPriceDto[] | null;
    canAddToCart: boolean;
    canAddToWishlist: boolean;
    canBackOrder: boolean;
    costCode: string;
    customerName: string;
    erpNumber: string;
    hasInsufficientInventory: boolean;
    id: string;
    idx?: number;
    isActive: boolean;
    isConfigured: boolean;
    isDiscontinued: boolean;
    isDiscounted: boolean;
    isFixedConfiguration: boolean;
    isPromotionItem: boolean;
    isQtyAdjusted: boolean;
    isRestricted: boolean;
    isSubscription: boolean;
    line: number | null;
    manufacturerItem: string;
    notes: string;
    pricing: ProductPriceDto | null;
    productId: string | null;
    productName: string;
    productSubscription: ProductSubscriptionDto | null;
    productUri: string;
    qtyLeft: number;
    qtyOnHand: number;
    qtyOrdered: number | null;
    qtyPerBaseUnitOfMeasure: number;
    quoteRequired: boolean;
    requisitionId: string | null;
    salePriceLabel: string;
    sectionOptions: SectionOptionDto[] | null;
    shortDescription: string;
    smallImagePath: string;
    trackInventory: boolean;
    unitOfMeasure: string;
    unitOfMeasureDescription: string;
    unitOfMeasureDisplay: string;
}

export interface CartModel extends BaseModel {
    alsoPurchasedProducts: ProductDto[] | null;
    approverReason: string;
    billTo?: BillToModel | null;
    canBypassCheckoutAddress: boolean;
    canCheckOut: boolean;
    canEditCostCode: boolean;
    canModifyOrder: boolean;
    canRequestQuote: boolean;
    canRequisition: boolean;
    canSaveOrder: boolean;
    carrier: CarrierDto | null;
    carriers?: CarrierDto[] | null;
    cartLines?: CartLineModel[] | null;
    cartLinesUri: string;
    cartNotPriced: boolean;
    costCodeLabel: string;
    costCodes: CostCodeDto[] | null;
    creditCardBillingAddress: CreditCardBillingAddressDto | null;
    currencySymbol: string;
    customerOrderTaxes: CustomerOrderTaxDto[] | null;
    customerVatNumber: string;
    displayContinueShoppingLink: boolean;
    erpOrderNumber: string;
    failedToGetRealTimeInventory: boolean;
    fulfillmentMethod: string;
    hasApprover: boolean;
    hasInsufficientInventory: boolean;
    id: string;
    initiatedByUserName: string;
    isAuthenticated: boolean;
    isAwaitingApproval: boolean;
    isGuestOrder: boolean;
    isSalesperson: boolean;
    isSubscribed: boolean;
    lineCount: number;
    messages: string[] | null;
    notes: string;
    orderDate: Date | null;
    orderGrandTotal: number;
    orderGrandTotalDisplay: string;
    orderNumber: string;
    orderSubTotal: number;
    orderSubTotalDisplay: string;
    orderSubTotalWithOutProductDiscounts: number;
    orderSubTotalWithOutProductDiscountsDisplay: string;
    paymentMethod?: PaymentMethodDto | null;
    paymentOptions?: PaymentOptionsDto | null;
    poNumber: string;
    promotionCode: string;
    quoteRequiredCount: number;
    requestedDeliveryDate: string;
    requestedDeliveryDateDisplay: Date | null;
    requestedPickupDate: string;
    requestedPickupDateDisplay: Date | null;
    requiresApproval: boolean;
    requiresPoNumber: boolean;
    salespersonName: string;
    shippingAndHandling: number;
    shippingAndHandlingDisplay: string;
    shipTo?: ShipToModel | null;
    shipToLabel: string;
    shipVia: ShipViaDto | null;
    showCostCode: boolean;
    showCreditCard: boolean;
    showECheck: boolean;
    showLineNotes: boolean;
    showNewsletterSignup: boolean;
    showPayPal: boolean;
    showPoNumber: boolean;
    showTaxAndShipping: boolean;
    status: string;
    statusDisplay: string;
    taxFailureReason: string;
    totalCountDisplay: number;
    totalQtyOrdered: number;
    totalTax: number;
    totalTaxDisplay: string;
    type: string;
    typeDisplay: string;
    unassignCart: boolean;
    userLabel: string;
    userRoles: string;
    warehouses: WarehouseDto[] | null;
}

export interface WarehouseDto {
    address1: string;
    address2: string;
    city: string;
    countryId: string | null;
    description: string;
    id: string;
    isDefault: boolean;
    name: string;
    phone: string;
    postalCode: string;
    shipSite: string;
    state: string;
}

export interface ShipViaDto {
    description: string;
    id: string;
    isDefault: boolean;
}

export interface PaymentOptionsDto {
    canStorePaymentProfile: boolean;
    cardTypes: { key: string; value: string }[] | null;
    creditCard: CreditCardDto | null;
    eCheck: ECheckDto | null;
    expirationMonths: { key: string; value: number }[] | null;
    expirationYears: { key: number; value: number }[] | null;
    isPayPal: boolean;
    paymentMethods: PaymentMethodDto[] | null;
    payPalPayerId: string;
    payPalPaymentUrl: string;
    payPalToken: string;
    storePaymentProfile: boolean;
}

export interface ECheckDto {
    accountHolder: string;
    accountNumber: string;
    address1: string;
    city: string;
    country: string;
    countryAbbreviation: string;
    postalCode: string;
    routingNumber: string;
    state: string;
    stateAbbreviation: string;
    useBillingAddress: boolean;
}

export interface CreditCardDto {
    address1: string;
    cardHolderName: string;
    cardNumber: string;
    cardType: string;
    city: string;
    country: string;
    countryAbbreviation: string;
    expirationMonth: number;
    expirationYear: number;
    postalCode: string;
    securityCode: string;
    state: string;
    stateAbbreviation: string;
    useBillingAddress: boolean;
}

export interface PaymentMethodDto {
    billingAddress: string;
    cardType: string;
    description: string;
    isCreditCard: boolean;
    isECheck: boolean;
    isPaymentProfile: boolean;
    isPaymentProfileExpired: boolean;
    name: string;
    tokenScheme: string;
}

export interface CustomerOrderTaxDto {
    sortOrder: number;
    taxAmount: number;
    taxAmountDisplay: string;
    taxCode: string;
    taxDescription: string;
    taxRate: number;
}

export interface CreditCardBillingAddressDto {
    address1: string;
    address2: string;
    city: string;
    countryAbbreviation: string;
    postalCode: string;
    stateAbbreviation: string;
}

export interface CostCodeDto {
    costCode: string;
    description: string;
}

export interface CarrierDto {
    description: string;
    id: string | null;
    shipVias: ShipViaDto[] | null;
}

export interface SectionOptionDto {
    optionName: string;
    sectionName: string;
    sectionOptionId: string;
}

export interface BrandModel extends BaseModel {
    detailPagePath: string;
    id: string;
    logoImageAltText: string;
    logoLargeImagePath: string;
    logoSmallImagePath: string;
    name: string;
    urlSegment: string;
}

export interface ProductCollectionModel extends BaseModel {
    attributeTypeFacets: AttributeTypeFacetModel[] | null;
    brandFacets: FacetModel[] | null;
    categoryFacets: CategoryFacetModel[] | null;
    correctedQuery: string;
    didYouMeanSuggestions: SuggestionModel[] | null;
    exactMatch: boolean;
    notAllProductsAllowed: boolean;
    notAllProductsFound: boolean;
    originalQuery: string;
    pagination: PaginationModel | null;
    priceRange: PriceRangeModel | null;
    productLineFacets: FacetModel[] | null;
    products: ProductModel[] | null;
    searchTermRedirectUrl: string;
}

export interface ProductLineModel extends BaseModel {
    id: string;
    name: string;
}

export interface ProductModel extends BaseModel {
    allowZeroPricing: boolean;
    attributeTypes?: AttributeTypeModel[];
    brand: BrandModel | null;
    canAddToCart: boolean;
    canAddToWishlist: boolean;
    canConfigure: boolean;
    canonicalUrl: string;
    canShowPrice: boolean;
    canShowUnitOfMeasure: boolean;
    childTraitValues?: ChildTraitValueModel[];
    configurationType: string;
    content?: ContentModel;
    customerProductNumber: string;
    detail?: DetailModel;
    documents?: DocumentModel[];
    id: string;
    imageAltText: string;
    images?: ImageModel[];
    isDiscontinued: boolean;
    isSponsored: boolean;
    isVariantParent: boolean;
    largeImagePath: string;
    manufacturerItem: string;
    mediumImagePath: string;
    minimumOrderQty: number;
    packDescription: string;
    priceFacet: number | null;
    productLine: ProductLineModel | null;
    productNumber: string;
    productTitle: string;
    quoteRequired: boolean;
    score: number;
    scoreExplanation?: ScoreExplanationModel;
    smallImagePath: string;
    specifications?: SpecificationModel[];
    trackInventory: boolean;
    unitListPrice: number;
    unitListPriceDisplay: string;
    unitOfMeasures: UnitOfMeasureModel[] | null;
    urlSegment: string;
    variantTraits?: VariantTraitModel[];
    variantTypeId: string | null;
    warehouses?: WarehouseModel[];
    salePriceLabel: string;
    cantBuy: boolean;
}

export interface ProductSubscriptionModel extends BaseModel {
    subscriptionAddToInitialOrder: boolean;
    subscriptionAllMonths: boolean;
    subscriptionApril: boolean;
    subscriptionAugust: boolean;
    subscriptionCyclePeriod: string;
    subscriptionDecember: boolean;
    subscriptionFebruary: boolean;
    subscriptionFixedPrice: boolean;
    subscriptionJanuary: boolean;
    subscriptionJuly: boolean;
    subscriptionJune: boolean;
    subscriptionMarch: boolean;
    subscriptionMay: boolean;
    subscriptionNovember: boolean;
    subscriptionOctober: boolean;
    subscriptionPeriodsPerCycle: number;
    subscriptionSeptember: boolean;
    subscriptionShipViaId: string | null;
    subscriptionTotalCycles: number;
}

export interface AutocompleteItemModel extends BaseModel {
    id: string | null;
    image: string;
    subtitle: string;
    displaySubtitle: JSX.Element;
    title: string;
    displayTitle: JSX.Element;
    url: string;
}

export interface AutocompleteModel extends BaseModel {
    brands: BrandAutocompleteModel[] | null;
    categories: AutocompleteItemModel[] | null;
    content: AutocompleteItemModel[] | null;
    products: ProductAutocompleteItemModel[] | null;
}

export interface BrandAutocompleteModel extends BaseModel {
    id: string | null;
    image: string;
    productLineId: string | null;
    productLineName: string;
    displayProductLineName: JSX.Element;
    subtitle: string;
    displaySubtitle: JSX.Element;
    title: string;
    displayTitle: JSX.Element;
    url: string;
}

export interface CatalogPageModel extends BaseModel {
    alternateLanguageUrls: { [key: string]: string } | null;
    brandId: string | null;
    breadCrumbs: BreadCrumbModel[] | null;
    canonicalPath: string;
    category: CategoryModel | null;
    isReplacementProduct: boolean;
    metaDescription: string;
    metaKeywords: string;
    needRedirect: boolean;
    obsoletePath: boolean;
    openGraphImage: string;
    openGraphTitle: string;
    openGraphUrl: string;
    primaryImagePath: string;
    productId: string | null;
    productLineId: string | null;
    productName: string;
    redirectUrl: string;
    title: string;
}

export interface CategoryCollectionModel extends BaseModel {
    categories: CategoryModel[] | null;
}

export interface ProductAutocompleteItemModel extends BaseModel {
    brandDetailPagePath: string;
    brandName: string;
    erpNumber: string;
    displayErpNumber: JSX.Element;
    id: string | null;
    image: string;
    isNameCustomerOverride: boolean;
    manufacturerItemNumber: string;
    name: string;
    styleParentId: string | null;
    subtitle: string;
    displaySubtitle: JSX.Element;
    title: string;
    displayTitle: JSX.Element;
    url: string;
}

export interface CategoryModel extends BaseModel {
    activateOn: Date;
    deactivateOn: Date | null;
    htmlContent: string;
    id: string;
    imageAltText: string;
    isDynamic: boolean;
    isFeatured: boolean;
    largeImagePath: string;
    metaDescription: string;
    metaKeywords: string;
    mobileBannerImageUrl: string;
    mobilePrimaryText: string;
    mobileSecondaryText: string;
    mobileTextColor: string;
    mobileTextJustification: string;
    name: string;
    path: string;
    shortDescription: string;
    smallImagePath: string;
    sortOrder: number;
    subCategories: CategoryModel[] | null;
    urlSegment: string;
}

export interface CrossSellCollectionModel extends BaseModel {
    products: ProductDto[] | null;
}

export interface AutocompleteProductCollectionModel extends BaseModel {
    products: AutocompleteProductModel[] | null;
}

export interface AutocompleteProductModel extends BaseModel {
    erpNumber: string;
    id: string;
    name: string;
    productDetailUrl: string;
    shortDescription: string;
    smallImagePath: string;
}

export interface ProductAvailabilityModel extends BaseModel {
    availability: AvailabilityDto | null;
}

export interface ProductPriceModel extends BaseModel {
    actualBreakPrices: BreakPriceDto[] | null;
    actualPrice: number;
    actualPriceDisplay: string;
    additionalResults: { [key: string]: string } | null;
    extendedActualPrice: number;
    extendedActualPriceDisplay: string;
    extendedRegularPrice: number;
    extendedRegularPriceDisplay: string;
    extendedUnitListPrice: number;
    extendedUnitListPriceDisplay: string;
    extendedUnitNetPrice: number;
    extendedUnitNetPriceDisplay: string;
    extendedUnitRegularPrice: number;
    extendedUnitRegularPriceDisplay: string;
    isOnSale: boolean;
    productId: string;
    quoteRequired: boolean;
    regularBreakPrices: BreakPriceDto[] | null;
    regularPrice: number;
    regularPriceDisplay: string;
    requiresRealTimePrice: boolean;
    unitCost: number;
    unitCostDisplay: string;
    unitListBreakPrices: BreakPriceDto[] | null;
    unitListPrice: number;
    unitListPriceDisplay: string;
    unitNetPrice: number;
    unitNetPriceDisplay: string;
    unitOfMeasure: string;
    unitRegularBreakPrices: BreakPriceDto[] | null;
    unitRegularPrice: number;
    unitRegularPriceDisplay: string;
    vatAmount: number;
    vatAmountDisplay: string;
    vatRate: number;
}

export interface ProductSettingsModel extends BaseModel {
    allowBackOrder: boolean;
    allowBackOrderForDelivery: boolean;
    allowBackOrderForPickup: boolean;
    alternateUnitsOfMeasure: boolean;
    attributesTabSortOrder: string;
    canAddToCart: boolean;
    canSeePrices: boolean;
    canSeeProducts: boolean;
    canShowPriceFilters: boolean;
    catalogUrlPath: string;
    defaultViewType: string;
    displayAttributesInTabs: boolean;
    displayDocumentsInTabs: boolean;
    displayFacetsForStockedItems: boolean;
    displayInventoryPerWarehouse: boolean;
    displayInventoryPerWarehouseOnlyOnProductDetail: boolean;
    documentsTabSortOrder: string;
    enableProductComparisons: boolean;
    enableVat: boolean;
    imageProvider: string;
    inventoryIncludedWithPricing: boolean;
    pricingService: string;
    realTimeInventory: boolean;
    realTimePricing: boolean;
    showAddToCartConfirmationDialog: boolean;
    showInventoryAvailability: boolean;
    showSavingsAmount: boolean;
    showSavingsPercent: boolean;
    storefrontAccess: string;
    thirdPartyReviews: string;
    vatPriceDisplay: string;
}

export interface ProductSubscriptionModel extends BaseModel {
    productSubscription: ProductSubscriptionDto | null;
}

export interface VmiNoteCollectionModel extends BaseModel {
    pagination: PaginationModel | null;
    vmiNotes: VmiNoteModel[] | null;
}

export interface VmiCountCollectionModel extends BaseModel {
    pagination: PaginationModel | null;
    vmiCounts: VmiCountModel[] | null;
}

export interface VmiBinCollectionModel extends BaseModel {
    pagination: PaginationModel | null;
    vmiBins: VmiBinModel[] | null;
}

export interface VmiNoteModel extends BaseModel {
    id: string;
    includeOnOrder: boolean;
    note: string;
    vmiBinId: string;
}

export interface VmiCountModel extends BaseModel {
    count: number;
    id: string;
    productId: string;
    vmiBinId: string;
}

export interface VmiBinModel extends BaseModel {
    binNumber: string;
    id: string;
    lastCountDate: Date | null;
    lastCountQty: number;
    lastCountUserName: string;
    lastOrderDate: Date | null;
    maximumQty: number;
    minimumQty: number;
    previousCountDate: Date | null;
    previousCountQty: number;
    previousCountUserName: string;
    productId: string;
    vmiLocationId: string;
    product: ProductDto;
}

export interface VmiLocationCollectionModel extends BaseModel {
    pagination: PaginationModel | null;
    vmiLocations: VmiLocationModel[] | null;
}

export interface VmiLocationModel extends BaseModel {
    billToId: string;
    id: string;
    isPrimaryLocation: boolean;
    name: string;
    customerLabel: string;
    shipToId: string | null;
    useBins: boolean;
    customer: BaseAddressModel;
}

export interface WarehouseCollectionModel extends BaseModel {
    defaultLatitude: number;
    defaultLongitude: number;
    defaultRadius: number;
    distanceUnitOfMeasure: string;
    pagination: PaginationModel | null;
    warehouses: WarehouseModel[] | null;
}

export interface BreadCrumbModel {
    categoryId: string;
    text: string;
    url: string;
}

export interface WarehouseModel {
    description: string;
    id: string;
    name: string;
    qtyAvailable: number;
}

export interface VariantTraitModel {
    id: string;
    name: string;
    nameDisplay: string;
    sortOrder: number;
    traitValues: TraitValueModel[] | null;
    unselectedValue: string;
}

export interface TraitValueModel {
    id: string;
    isDefault: boolean;
    sortOrder: number;
    value: string;
    valueDisplay: string;
}

export interface UnitOfMeasureModel {
    description: string;
    id: string;
    isDefault: boolean;
    qtyPerBaseUnitOfMeasure: number;
    roundingRule: string;
    unitOfMeasure: string;
    unitOfMeasureDisplay: string;
}

export interface SpecificationModel {
    description: string;
    htmlContent: string;
    id: string;
    name: string;
    nameDisplay: string;
    sortOrder: number;
    value: string;
}

export interface ScoreExplanationModel {
    aggregateFieldScores: FieldScoreModel[] | null;
    detailedFieldScores: FieldScoreDetailedModel[] | null;
    totalBoost: any;
}

export interface FieldScoreDetailedModel {
    boost: any;
    inverseDocumentFrequency: any;
    matchText: string;
    name: string;
    score: any;
    scoreUsed: boolean;
    termFrequencyNormalized: any;
}

export interface FieldScoreModel {
    name: string;
    score: any;
}

export interface ImageModel {
    id: string;
    imageAltText: string;
    imageType: string;
    largeImagePath: string;
    mediumImagePath: string;
    name: string;
    smallImagePath: string;
    sortOrder: number;
}

export interface DocumentModel {
    description: string;
    documentType: string;
    filePath: string;
    id: string;
    name: string;
}

export interface DetailModel {
    allowAnyGiftCardAmount: boolean;
    canBackOrder: boolean;
    configuration: ConfigurationModel | null;
    hasMsds: boolean;
    isGiftCard: boolean;
    isHazardousGood: boolean;
    isSpecialOrder: boolean;
    isSubscription: boolean;
    modelNumber: string;
    multipleSaleQty: number;
    name: string;
    priceCode: string;
    productCode: string;
    replacementProductId: string | null;
    roundingRule: string;
    shippingClassification: string;
    shippingHeight: number;
    shippingLength: number;
    shippingWeight: number;
    shippingWidth: number;
    sku: string;
    sortOrder: number;
    subscription: ProductSubscriptionModel | null;
    taxCategory: string;
    taxCode1: string;
    taxCode2: string;
    unspsc: string;
    upcCode: string;
    vatCodeId: string | null;
}

export interface ConfigurationModel {
    configSections: ConfigSectionModel[] | null;
    hasDefaults: boolean;
    isKit: boolean;
}

export interface ConfigSectionModel {
    id: string;
    label: string;
    sectionName: string;
    sectionOptions: SectionOptionModel[] | null;
    sortOrder: number;
}

export interface SectionOptionModel {
    description: string;
    id: string;
    name: string;
    price: number;
    productId: string | null;
    quantity: number;
    selected: boolean;
    sortOrder: number;
}

export interface ContentModel {
    htmlContent: string;
    metaDescription: string;
    metaKeywords: string;
    openGraphImage: string;
    openGraphTitle: string;
    openGraphUrl: string;
    pageTitle: string;
}

export interface ChildTraitValueModel {
    id: string;
    styleTraitId: string;
    value: string;
    valueDisplay: string;
}

export interface AttributeTypeModel {
    attributeValues: AttributeValueModel[] | null;
    id: string;
    includeOnProduct: boolean;
    isComparable: boolean;
    isFilter: boolean;
    isSearchable: boolean;
    label: string;
    name: string;
    sortOrder: number;
}

export interface AttributeValueModel {
    id: string;
    sortOrder: number;
    value: string;
    valueDisplay: string;
}

export interface PriceRangeModel {
    count: number;
    maximumPrice: number;
    minimumPrice: number;
    priceFacets: PriceFacetModel[] | null;
}

export interface PriceFacetModel {
    count: number;
    maximumPrice: number;
    minimumPrice: number;
    selected: boolean;
}

export interface SuggestionModel {
    highlightedSuggestion: string;
    score: number;
    suggestion: string;
}

export interface CategoryFacetModel {
    categoryId: string;
    count: number;
    selected: boolean;
    shortDescription: string;
    subCategoryFacets: CategoryFacetModel[] | null;
}

export interface FacetModel {
    count: number;
    id: string;
    name: string;
    selected: boolean;
}

export interface AttributeTypeFacetModel {
    attributeTypeId: string;
    attributeValueFacets: AttributeValueFacetModel[] | null;
    name: string;
    nameDisplay: string;
    sortOrder: number;
}

export interface AttributeValueFacetModel {
    attributeValueId: string;
    count: number;
    selected: boolean;
    sortOrder: number;
    value: string;
    valueDisplay: string;
}

export interface BaseAddressModel extends BaseModel {
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    attention: string;
    city: string;
    companyName: string;
    contactFullName: string;
    country: CountryModel | null;
    customerName: string;
    customerNumber: string;
    customerSequence: string;
    email: string;
    fax: string;
    firstName: string;
    fullAddress: string;
    id: string;
    lastName: string;
    phone: string;
    postalCode: string;
    state: StateModel | null;
}

export interface BillToCollectionModel extends BaseModel {
    billTos: BillToModel[] | null;
    pagination: PaginationModel | null;
}

export interface CustomerSettingsModel extends BaseModel {
    allowBillToAddressEdit: boolean;
    allowCreateNewShipToAddress: boolean;
    allowOneTimeAddresses: boolean;
    allowShipToAddressEdit: boolean;
    billToCompanyRequired: boolean;
    billToFirstNameRequired: boolean;
    billToLastNameRequired: boolean;
    billToStateRequired: boolean;
    budgetsFromOnlineOnly: boolean;
    displayAccountsReceivableBalances: boolean;
    shipToCompanyRequired: boolean;
    shipToFirstNameRequired: boolean;
    shipToLastNameRequired: boolean;
    shipToStateRequired: boolean;
}

export interface ShipToCollectionModel extends BaseModel {
    pagination: PaginationModel | null;
    shipTos: ShipToModel[] | null;
}

export interface DashboardPanelCollectionModel extends BaseModel {
    dashboardPanels: DashboardPanelModel[] | null;
}

export interface DashboardPanelModel {
    count: number;
    isPanel: boolean;
    isQuickLink: boolean;
    openInNewTab: boolean;
    order: number;
    panelType: string;
    quickLinkOrder: number;
    quickLinkText: string;
    text: string;
    url: string;
}

export interface DealerCollectionModel extends BaseModel {
    dealers: DealerModel[] | null;
    defaultLatitude: number;
    defaultLongitude: number;
    defaultRadius: number;
    distanceUnitOfMeasure: string;
    formattedAddress: string;
    pagination: PaginationModel | null;
    startDealerNumber: number;
}

export interface DealerModel extends BaseModel {
    address1: string;
    address2: string;
    city: string;
    countryId: string | null;
    distance: number;
    distanceUnitOfMeasure: string;
    htmlContent: string;
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    phone: string;
    postalCode: string;
    state: string;
    webSiteUrl: string;
}

export interface ShareEntityModel extends BaseModel {
    emailFrom: string;
    emailTo: string;
    entityId: string;
    entityName: string;
    message: string;
    subject: string;
}

export interface ContactUsModel extends BaseModel {
    emailAddress: string;
    emailTo: string;
    firstName: string;
    lastName: string;
    message: string;
    phoneNumber: string;
    topic: string;
}

export interface TellAFriendModel extends BaseModel {
    altText: string;
    friendsEmailAddress: string;
    friendsName: string;
    productId: string;
    productImage: string;
    productShortDescription: string;
    productUrl: string;
    yourEmailAddress: string;
    yourMessage: string;
    yourName: string;
}

export interface InvoiceCollectionModel extends BaseModel {
    invoices: InvoiceModel[] | null;
    pagination: PaginationModel | null;
    showErpOrderNumber: boolean;
}

export interface InvoiceModel extends BaseModel {
    billToCity: string;
    billToPostalCode: string;
    billToState: string;
    btAddress1: string;
    btAddress2: string;
    btCompanyName: string;
    btCountry: string;
    currencyCode: string;
    currentBalance: number;
    currentBalanceDisplay: string;
    customerNumber: string;
    customerPO: string;
    customerSequence: string;
    customerVatNumber: string;
    discountAmount: number;
    discountAmountDisplay: string;
    dueDate: Date;
    id: string;
    invoiceDate: Date;
    invoiceHistoryTaxes: InvoiceHistoryTaxDto[] | null;
    invoiceLines: InvoiceLineModel[] | null;
    invoiceNumber: string;
    invoiceTotal: number;
    invoiceTotalDisplay: string;
    invoiceType: string;
    isOpen: boolean;
    notes: string;
    orderTotalDisplay: string;
    otherCharges: number;
    otherChargesDisplay: string;
    productTotal: number;
    productTotalDisplay: string;
    salesperson: string;
    shipCode: string;
    shippingAndHandling: number;
    shippingAndHandlingDisplay: string;
    shipToCity: string;
    shipToPostalCode: string;
    shipToState: string;
    shipViaDescription: string;
    stAddress1: string;
    stAddress2: string;
    status: string;
    stCompanyName: string;
    stCountry: string;
    taxAmount: number;
    taxAmountDisplay: string;
    terms: string;
}

export interface InvoiceLineModel extends BaseModel {
    altText: string;
    brand: BrandDto | null;
    customerName: string;
    customerProductNumber: string;
    description: string;
    discountAmount: number;
    discountAmountDisplay: string;
    discountPercent: number;
    erpOrderNumber: string;
    id: string;
    lineNumber: string;
    linePOReference: string;
    lineTotal: number;
    lineTotalDisplay: string;
    lineType: string;
    manufacturerItem: string;
    mediumImagePath: string;
    netPriceWithVat: number;
    netPriceWithVatDisplay: string;
    notes: string;
    productERPNumber: string;
    productName: string;
    productUri: string;
    qtyInvoiced: number;
    releaseNumber: number;
    shipmentNumber: string;
    shortDescription: string;
    taxAmount: number;
    taxRate: number;
    unitOfMeasure: string;
    unitPrice: number;
    unitPriceDisplay: string;
    unitPriceWithVat: number;
    unitPriceWithVatDisplay: string;
    warehouse: string;
}

export interface InvoiceSettingsModel extends BaseModel {
    lookBackDays: number;
    showInvoices: boolean;
}

export interface InvoiceHistoryTaxDto {
    sortOrder: number;
    taxAmount: number;
    taxAmountDisplay: string;
    taxCode: string;
    taxDescription: string;
    taxRate: number;
}

export interface JobQuoteLineModel extends BaseModel {
    allowZeroPricing: boolean;
    altText: string;
    availability: AvailabilityDto | null;
    baseUnitOfMeasure: string;
    baseUnitOfMeasureDisplay: string;
    brand: BrandDto | null;
    breakPrices: BreakPriceDto[] | null;
    canAddToCart: boolean;
    canAddToWishlist: boolean;
    canBackOrder: boolean;
    costCode: string;
    customerName: string;
    erpNumber: string;
    hasInsufficientInventory: boolean;
    id: string;
    isActive: boolean;
    isConfigured: boolean;
    isDiscontinued: boolean;
    isDiscounted: boolean;
    isFixedConfiguration: boolean;
    isPromotionItem: boolean;
    isQtyAdjusted: boolean;
    isRestricted: boolean;
    isSubscription: boolean;
    line: number | null;
    manufacturerItem: string;
    maxQty: number;
    notes: string;
    pricing: ProductPriceDto | null;
    pricingRfq: PricingRfqModel | null;
    productId: string | null;
    productName: string;
    productSubscription: ProductSubscriptionDto | null;
    productUri: string;
    qtyLeft: number;
    qtyOnHand: number;
    qtyOrdered: number | null;
    qtyPerBaseUnitOfMeasure: number;
    qtyRequested: number;
    qtySold: number;
    quoteRequired: boolean;
    requisitionId: string | null;
    salePriceLabel: string;
    sectionOptions: SectionOptionDto[] | null;
    shortDescription: string;
    smallImagePath: string;
    trackInventory: boolean;
    unitOfMeasure: string;
    unitOfMeasureDescription: string;
    unitOfMeasureDisplay: string;
}

export interface JobQuoteModel extends BaseModel {
    alsoPurchasedProducts: ProductDto[] | null;
    approverReason: string;
    billTo?: BillToModel | null;
    canBypassCheckoutAddress: boolean;
    canCheckOut: boolean;
    canEditCostCode: boolean;
    canModifyOrder: boolean;
    canRequestQuote: boolean;
    canRequisition: boolean;
    canSaveOrder: boolean;
    carrier: CarrierDto | null;
    carriers?: CarrierDto[] | null;
    cartLines?: CartLineModel[] | null;
    cartLinesUri: string;
    cartNotPriced: boolean;
    costCodeLabel: string;
    costCodes: CostCodeDto[] | null;
    creditCardBillingAddress: CreditCardBillingAddressDto | null;
    currencySymbol: string;
    customerName: string;
    customerOrderTaxes: CustomerOrderTaxDto[] | null;
    customerVatNumber: string;
    displayContinueShoppingLink: boolean;
    erpOrderNumber: string;
    expirationDate: Date;
    failedToGetRealTimeInventory: boolean;
    fulfillmentMethod: string;
    hasApprover: boolean;
    hasInsufficientInventory: boolean;
    id: string;
    initiatedByUserName: string;
    isAuthenticated: boolean;
    isAwaitingApproval: boolean;
    isEditable: boolean;
    isGuestOrder: boolean;
    isSalesperson: boolean;
    isSubscribed: boolean;
    jobName: string;
    jobQuoteId: string;
    jobQuoteLineCollection: JobQuoteLineModel[] | null;
    lineCount: number;
    messages: string[] | null;
    notes: string;
    orderDate: Date | null;
    orderGrandTotal: number;
    orderGrandTotalDisplay: string;
    orderNumber: string;
    orderSubTotal: number;
    orderSubTotalDisplay: string;
    orderSubTotalWithOutProductDiscounts: number;
    orderSubTotalWithOutProductDiscountsDisplay: string;
    orderTotal: number;
    orderTotalDisplay: string;
    paymentMethod?: PaymentMethodDto | null;
    paymentOptions?: PaymentOptionsDto | null;
    poNumber: string;
    promotionCode: string;
    quoteRequiredCount: number;
    requestedDeliveryDate: string;
    requestedDeliveryDateDisplay: Date | null;
    requestedPickupDate: string;
    requestedPickupDateDisplay: Date | null;
    requiresApproval: boolean;
    requiresPoNumber: boolean;
    salespersonName: string;
    shippingAndHandling: number;
    shippingAndHandlingDisplay: string;
    shipTo?: ShipToModel | null;
    shipToFullAddress: string;
    shipToLabel: string;
    shipVia: ShipViaDto | null;
    showCostCode: boolean;
    showCreditCard: boolean;
    showECheck: boolean;
    showLineNotes: boolean;
    showNewsletterSignup: boolean;
    showPayPal: boolean;
    showPoNumber: boolean;
    showTaxAndShipping: boolean;
    status: string;
    statusDisplay: string;
    taxFailureReason: string;
    totalCountDisplay: number;
    totalQtyOrdered: number;
    totalTax: number;
    totalTaxDisplay: string;
    type: string;
    typeDisplay: string;
    unassignCart: boolean;
    userLabel: string;
    userRoles: string;
    warehouses: WarehouseDto[] | null;
}

export interface JobQuoteCollectionModel extends BaseModel {
    jobQuotes: JobQuoteModel[] | null;
    pagination: PaginationModel | null;
}

export interface PricingRfqModel extends BaseModel {
    calculationMethods: CalculationMethod[] | null;
    customerPrice: number;
    customerPriceDisplay: string;
    listPrice: number;
    listPriceDisplay: string;
    maxDiscountPct: number;
    minimumPriceAllowed: number;
    minimumPriceAllowedDisplay: string;
    minMarginAllowed: number;
    priceBreaks: BreakPriceRfqModel[] | null;
    showCustomerPrice: boolean;
    showListPrice: boolean;
    showUnitCost: boolean;
    unitCost: number;
    unitCostDisplay: string;
    validationMessages: { key: string; value: string }[] | null;
}

export interface BreakPriceRfqModel {
    calculationMethod: string;
    endQty: number;
    endQtyDisplay: string;
    percent: number | null;
    price: number;
    priceDispaly: string;
    startQty: number;
    startQtyDisplay: string;
}

export interface CalculationMethod {
    displayName: string;
    maximumDiscount: string;
    minimumMargin: string;
    name: string;
    value: string;
}

export interface MessageCollectionModel extends BaseModel {
    messages: MessageModel[] | null;
}

export interface MessageModel extends BaseModel {
    body: string;
    dateToDisplay: Date;
    displayName: string;
    id: string;
    isRead: boolean;
    subject: string;
}

export interface MobileAppSettingsModel extends BaseModel {
    checkoutUrl: string;
    hasCheckout: boolean;
    overrideCheckoutNavigation: boolean;
    startingCategoryForBrowsing: string;
}

export interface MobileContentModel extends BaseModel {
    page: MobilePageDto | null;
    widgets: MobileWidgetDto[] | null;
}

export interface MobileWidgetDto {
    childWidgets: MobileWidgetDto[] | null;
    class: string;
    contentKey: number;
    currentContentItemFields: { [key: string]: any } | null;
}

export interface MobilePageDto {
    currentContentItemFields: { [key: string]: any } | null;
}

export interface OrderCollectionModel extends BaseModel {
    orders: OrderModel[] | null;
    pagination: PaginationModel | null;
    showErpOrderNumber: boolean;
}

export interface OrderPromotionModel extends BaseModel {
    amount: number | null;
    amountDisplay: string;
    id: string;
    name: string;
    orderHistoryLineId: string | null;
    promotionResultType: string;
}

export interface OrderModel extends BaseModel {
    billToCity: string;
    billToPostalCode: string;
    billToState: string;
    btAddress1: string;
    btAddress2: string;
    btAddress3: string;
    btAddress4: string;
    btCompanyName: string;
    btCountry: string;
    canAddAllToCart: boolean;
    canAddToCart: boolean;
    currencyCode: string;
    currencySymbol: string;
    customerNumber: string;
    customerPO: string;
    customerSequence: string;
    customerVatNumber: string;
    discountAmount: number;
    discountAmountDisplay: string;
    erpOrderNumber: string;
    fulfillmentMethod: string;
    handlingCharges: number;
    handlingChargesDisplay: string;
    id: string;
    modifyDate: Date;
    notes: string;
    orderDate: Date;
    orderDiscountAmount: number;
    orderDiscountAmountDisplay: string;
    orderGrandTotalDisplay: string;
    orderHistoryTaxes: OrderHistoryTaxDto[] | null;
    orderLines?: OrderLineModel[] | null;
    orderPromotions: OrderPromotionModel[] | null;
    orderSubTotal: number;
    orderSubTotalDisplay: string;
    orderTotal: number;
    orderTotalDisplay: string;
    otherCharges: number;
    otherChargesDisplay: string;
    productDiscountAmount: number;
    productDiscountAmountDisplay: string;
    productTotal: number;
    productTotalDisplay: string;
    requestedDeliveryDateDisplay: Date | null;
    returnReasons: string[] | null;
    salesperson: string;
    shipCode: string;
    shipmentPackages: ShipmentPackageDto[] | null;
    shippingAndHandling: number;
    shippingAndHandlingDisplay: string;
    shippingCharges: number;
    shippingChargesDisplay: string;
    shipToCity: string;
    shipToPostalCode: string;
    shipToState: string;
    shipViaDescription: string;
    showTaxAndShipping: boolean;
    stAddress1: string;
    stAddress2: string;
    stAddress3: string;
    stAddress4: string;
    status: string;
    statusDisplay: string;
    stCompanyName: string;
    stCountry: string;
    taxAmount: number;
    taxAmountDisplay: string;
    terms: string;
    totalTaxDisplay: string;
    webOrderNumber: string;
}

export interface OrderLineModel extends BaseModel {
    altText: string;
    availability: AvailabilityDto | null;
    brand: BrandDto | null;
    canAddToCart: boolean;
    canAddToWishlist: boolean;
    costCode: string;
    customerName: string;
    customerNumber: string;
    customerProductNumber: string;
    customerSequence: string;
    description: string;
    discountAmount: number;
    discountAmountDisplay: string;
    discountPercent: number;
    extendedUnitNetPrice: number;
    extendedUnitNetPriceDisplay: string;
    id: string;
    inventoryQtyOrdered: number;
    inventoryQtyShipped: number;
    isActiveProduct: boolean;
    lastShipDate: Date | null;
    lineNumber: number;
    linePOReference: string;
    lineTotal: number;
    lineTotalDisplay: string;
    lineType: string;
    manufacturerItem: string;
    mediumImagePath: string;
    netPriceWithVat: number;
    netPriceWithVatDisplay: string;
    notes: string;
    orderLineOtherCharges: number;
    orderLineOtherChargesDisplay: string;
    productErpNumber: string;
    productId: string;
    productName: string;
    productUri: string;
    promotionAmountApplied: number;
    promotionAmountAppliedDisplay: string;
    qtyOrdered: number;
    qtyShipped: number;
    releaseNumber: number;
    requiredDate: Date | null;
    returnReason: string;
    rmaQtyReceived: number;
    rmaQtyRequested: number;
    salePriceLabel: string;
    sectionOptions: SectionOptionDto[] | null;
    shortDescription: string;
    status: string;
    taxAmount: number;
    taxRate: number;
    totalDiscountAmount: number;
    totalDiscountAmountDisplay: string;
    totalRegularPrice: number;
    totalRegularPriceDisplay: string;
    unitCost: number;
    unitCostDisplay: string;
    unitDiscountAmount: number;
    unitDiscountAmountDisplay: string;
    unitListPrice: number;
    unitListPriceDisplay: string;
    unitNetPrice: number;
    unitNetPriceDisplay: string;
    unitOfMeasure: string;
    unitOfMeasureDescription: string;
    unitOfMeasureDisplay: string;
    unitPrice: number;
    unitPriceDisplay: string;
    unitPriceWithVat: number;
    unitPriceWithVatDisplay: string;
    unitRegularPrice: number;
    unitRegularPriceDisplay: string;
    warehouse: string;
}

export interface OrderSettingsModel extends BaseModel {
    allowCancellationRequest: boolean;
    allowQuickOrder: boolean;
    allowRma: boolean;
    canOrderUpload: boolean;
    canReorderItems: boolean;
    lookBackDays: number;
    showCostCode: boolean;
    showErpOrderNumber: boolean;
    showOrders: boolean;
    showOrderStatus: boolean;
    showPoNumber: boolean;
    showTermsCode: boolean;
    showWebOrderNumber: boolean;
    vmiEnabled: boolean;
}

export interface OrderStatusMappingCollectionModel extends BaseModel {
    orderStatusMappings: OrderStatusMappingModel[] | null;
}

export interface OrderStatusMappingModel extends BaseModel {
    allowCancellation: boolean;
    allowRma: boolean;
    displayName: string;
    erpOrderStatus: string;
    id: string;
    isDefault: boolean;
}

export interface RmaModel extends BaseModel {
    message: string;
    notes: string;
    orderNumber: string;
    rmaLines: RmaLineDto[] | null;
}

export interface ShareOrderModel extends BaseModel {
    emailFrom: string;
    emailTo: string;
    entityId: string;
    entityName: string;
    message: string;
    stEmail: string;
    stPostalCode: string;
    subject: string;
}

export interface RmaLineDto {
    line: number;
    rmaQtyRequested: number;
    rmaReasonCode: string;
}

export interface SectionOptionDto {
    optionName: string;
    sectionName: string;
    sectionOptionId: string;
}

export interface ShipmentPackageDto {
    carrier: string;
    id: string;
    packageNumber: string;
    packSlip: string;
    shipmentDate: Date;
    shipmentPackageLineDtos: ShipmentPackageLineDto[] | null;
    shipVia: string;
    trackingNumber: string;
    trackingUrl: string;
}

export interface ShipmentPackageLineDto {
    id: string;
    orderLineId: string | null;
    price: number;
    productCode: string;
    productDescription: string;
    productName: string;
    qtyOrdered: number;
    qtyShipped: number;
}

export interface OrderHistoryTaxDto {
    sortOrder: number;
    taxAmount: number;
    taxAmountDisplay: string;
    taxCode: string;
    taxDescription: string;
    taxRate: number;
}

export interface OrderApprovalCollectionModel extends BaseModel {
    cartCollection: CartModel[] | null;
    pagination: PaginationModel | null;
}

export interface PromotionCollectionModel extends BaseModel {
    promotions: PromotionModel[] | null;
}

export interface PromotionModel extends BaseModel {
    amount: number;
    amountDisplay: string;
    id: string;
    message: string;
    name: string;
    orderLineId: string | null;
    promotionApplied: boolean;
    promotionCode: string;
    promotionResultType: string;
}

export interface OrderRequestModel extends BaseModel {
    xml: string;
}

export interface PoRequisitionModel extends BaseModel {
    html: string;
}

export interface ProfileTransactionRequestModel extends BaseModel {
    xml: string;
}

export interface SetupRequestModel extends BaseModel {
    xml: string;
}

export interface SessionRequestModel extends BaseModel {
    redirectUrl: string;
}

export interface RealTimeInventoryModel extends BaseModel {
    realTimeInventoryResults: ProductInventoryDto[] | null;
}

export interface ProductInventoryDto {
    additionalResults: { [key: string]: string } | null;
    inventoryAvailabilityDtos: InventoryAvailabilityDto[] | null;
    inventoryWarehousesDtos: InventoryWarehousesDto[] | null;
    productId: string;
    qtyOnHand: number;
}

export interface InventoryWarehousesDto {
    unitOfMeasure: string;
    warehouseDtos: WarehouseDto[] | null;
}

export interface InventoryAvailabilityDto {
    availability: AvailabilityDto | null;
    unitOfMeasure: string;
}

export interface RealTimePricingModel extends BaseModel {
    realTimePricingResults: ProductPriceDto[] | null;
}

export interface RequisitionLineCollectionModel extends BaseModel {
    pagination: PaginationModel | null;
    requisitionLines: RequisitionLineModel[] | null;
}

export interface RequisitionLineModel extends BaseModel {
    brand: BrandDto | null;
    costCode: string;
    firstName: string;
    id: string;
    lastName: string;
    orderDate: Date;
    qtyOrdered: number;
    userName: string;
}

export interface RequisitionModel extends BaseModel {
    allowZeroPricing: boolean;
    altText: string;
    availability: AvailabilityDto | null;
    baseUnitOfMeasure: string;
    baseUnitOfMeasureDisplay: string;
    brand: BrandDto | null;
    breakPrices: BreakPriceDto[] | null;
    canAddToCart: boolean;
    canAddToWishlist: boolean;
    canBackOrder: boolean;
    costCode: string;
    customerName: string;
    erpNumber: string;
    hasInsufficientInventory: boolean;
    id: string;
    isActive: boolean;
    isApproved: boolean;
    isConfigured: boolean;
    isDiscontinued: boolean;
    isDiscounted: boolean;
    isFixedConfiguration: boolean;
    isPromotionItem: boolean;
    isQtyAdjusted: boolean;
    isRestricted: boolean;
    isSubscription: boolean;
    line: number | null;
    manufacturerItem: string;
    notes: string;
    pricing: ProductPriceDto | null;
    productId: string | null;
    productName: string;
    productSubscription: ProductSubscriptionDto | null;
    productUri: string;
    qtyLeft: number;
    qtyOnHand: number;
    qtyOrdered: number | null;
    qtyPerBaseUnitOfMeasure: number;
    quoteRequired: boolean;
    requisitionId: string | null;
    requisitionLineCollection: RequisitionLineCollectionModel | null;
    requisitionLinesUri: string;
    salePriceLabel: string;
    sectionOptions: SectionOptionDto[] | null;
    shortDescription: string;
    smallImagePath: string;
    trackInventory: boolean;
    unitOfMeasure: string;
    unitOfMeasureDescription: string;
    unitOfMeasureDisplay: string;
}

export interface RequisitionCollectionModel extends BaseModel {
    pagination: PaginationModel | null;
    requisitions: RequisitionModel[] | null;
}

export interface MessageModel extends BaseModel {
    body: string;
    createdDate: Date;
    displayName: string;
    message: string;
    quoteId: string;
}

export interface QuoteCollectionModel extends BaseModel {
    pagination: PaginationModel | null;
    quotes: QuoteModel[] | null;
    salespersonList: SalespersonModel[] | null;
}

export interface QuoteLineModel extends BaseModel {
    allowZeroPricing: boolean;
    altText: string;
    availability: AvailabilityDto | null;
    baseUnitOfMeasure: string;
    baseUnitOfMeasureDisplay: string;
    brand: BrandDto | null;
    breakPrices: BreakPriceDto[] | null;
    canAddToCart: boolean;
    canAddToWishlist: boolean;
    canBackOrder: boolean;
    costCode: string;
    customerName: string;
    erpNumber: string;
    hasInsufficientInventory: boolean;
    id: string;
    isActive: boolean;
    isConfigured: boolean;
    isDiscontinued: boolean;
    isDiscounted: boolean;
    isFixedConfiguration: boolean;
    isPromotionItem: boolean;
    isQtyAdjusted: boolean;
    isRestricted: boolean;
    isSubscription: boolean;
    line: number | null;
    manufacturerItem: string;
    maxQty: number;
    notes: string;
    pricing: ProductPriceDto | null;
    pricingRfq: PricingRfqModel | null;
    productId: string | null;
    productName: string;
    productSubscription: ProductSubscriptionDto | null;
    productUri: string;
    qtyLeft: number;
    qtyOnHand: number;
    qtyOrdered: number | null;
    qtyPerBaseUnitOfMeasure: number;
    quoteRequired: boolean;
    requisitionId: string | null;
    salePriceLabel: string;
    sectionOptions: SectionOptionDto[] | null;
    shortDescription: string;
    smallImagePath: string;
    trackInventory: boolean;
    unitOfMeasure: string;
    unitOfMeasureDescription: string;
    unitOfMeasureDisplay: string;
}

export interface QuoteModel extends BaseModel {
    alsoPurchasedProducts: ProductDto[] | null;
    approverReason: string;
    billTo?: BillToModel | null;
    calculationMethods: CalculationMethod[] | null;
    canBypassCheckoutAddress: boolean;
    canCheckOut: boolean;
    canEditCostCode: boolean;
    canModifyOrder: boolean;
    canRequestQuote: boolean;
    canRequisition: boolean;
    canSaveOrder: boolean;
    carrier: CarrierDto | null;
    carriers?: CarrierDto[] | null;
    cartLines?: CartLineModel[] | null;
    cartLinesUri: string;
    cartNotPriced: boolean;
    costCodeLabel: string;
    costCodes: CostCodeDto[] | null;
    creditCardBillingAddress: CreditCardBillingAddressDto | null;
    currencySymbol: string;
    customerName: string;
    customerNumber: string;
    customerOrderTaxes: CustomerOrderTaxDto[] | null;
    customerVatNumber: string;
    displayContinueShoppingLink: boolean;
    erpOrderNumber: string;
    expirationDate: Date | null;
    failedToGetRealTimeInventory: boolean;
    fulfillmentMethod: string;
    hasApprover: boolean;
    hasInsufficientInventory: boolean;
    id: string;
    initiatedByUserName: string;
    isAuthenticated: boolean;
    isAwaitingApproval: boolean;
    isEditable: boolean;
    isGuestOrder: boolean;
    isJobQuote: boolean;
    isSalesperson: boolean;
    isSubscribed: boolean;
    jobName: string;
    lineCount: number;
    messageCollection: MessageModel[] | null;
    messages: string[] | null;
    notes: string;
    orderDate: Date | null;
    orderGrandTotal: number;
    orderGrandTotalDisplay: string;
    orderNumber: string;
    orderSubTotal: number;
    orderSubTotalDisplay: string;
    orderSubTotalWithOutProductDiscounts: number;
    orderSubTotalWithOutProductDiscountsDisplay: string;
    paymentMethod?: PaymentMethodDto | null;
    paymentOptions?: PaymentOptionsDto | null;
    poNumber: string;
    promotionCode: string;
    quoteLineCollection: QuoteLineModel[] | null;
    quoteLinesUri: string;
    quoteNumber: string;
    quoteRequiredCount: number;
    requestedDeliveryDate: string;
    requestedDeliveryDateDisplay: Date | null;
    requestedPickupDate: string;
    requestedPickupDateDisplay: Date | null;
    requiresApproval: boolean;
    requiresPoNumber: boolean;
    salespersonName: string;
    shippingAndHandling: number;
    shippingAndHandlingDisplay: string;
    shipTo?: ShipToModel | null;
    shipToFullAddress: string;
    shipToLabel: string;
    shipVia: ShipViaDto | null;
    showCostCode: boolean;
    showCreditCard: boolean;
    showECheck: boolean;
    showLineNotes: boolean;
    showNewsletterSignup: boolean;
    showPayPal: boolean;
    showPoNumber: boolean;
    showTaxAndShipping: boolean;
    status: string;
    statusDisplay: string;
    taxFailureReason: string;
    totalCountDisplay: number;
    totalQtyOrdered: number;
    totalTax: number;
    totalTaxDisplay: string;
    type: string;
    typeDisplay: string;
    unassignCart: boolean;
    userLabel: string;
    userName: string;
    userRoles: string;
    warehouses: WarehouseDto[] | null;
}

export interface QuoteSettingsModel extends BaseModel {
    jobQuoteEnabled: boolean;
    quoteExpireDays: number;
}

export interface SalespersonModel extends BaseModel {
    name: string;
    salespersonNumber: string;
}

export interface AddressFieldCollectionModel extends BaseModel {
    billToAddressFields: AddressFieldDisplayCollectionModel | null;
    shipToAddressFields: AddressFieldDisplayCollectionModel | null;
}

export interface AddressFieldDisplayCollectionModel extends BaseModel {
    address1: AddressFieldDisplayModel | null;
    address2: AddressFieldDisplayModel | null;
    address3: AddressFieldDisplayModel | null;
    address4: AddressFieldDisplayModel | null;
    attention: AddressFieldDisplayModel | null;
    city: AddressFieldDisplayModel | null;
    companyName: AddressFieldDisplayModel | null;
    contactFullName: AddressFieldDisplayModel | null;
    country: AddressFieldDisplayModel | null;
    email: AddressFieldDisplayModel | null;
    fax: AddressFieldDisplayModel | null;
    firstName: AddressFieldDisplayModel | null;
    lastName: AddressFieldDisplayModel | null;
    phone: AddressFieldDisplayModel | null;
    postalCode: AddressFieldDisplayModel | null;
    state: AddressFieldDisplayModel | null;
}

export interface AddressFieldDisplayModel extends BaseModel {
    displayName: string;
    isVisible: boolean;
}

export interface SiteMessageCollectionModel extends BaseModel {
    pagination: PaginationModel | null;
    siteMessages: SiteMessageModel[] | null;
}

export interface CountryCollectionModel extends BaseModel {
    countries: CountryModel[] | null;
}

export interface CurrencyCollectionModel extends BaseModel {
    currencies: CurrencyModel[] | null;
}

export interface LanguageCollectionModel extends BaseModel {
    languages: LanguageModel[] | null;
}

export interface SettingsCollectionModel extends BaseModel {
    settingsCollection: { [key: string]: any } | null;
}

export interface StateCollectionModel extends BaseModel {
    states: StateModel[] | null;
}

export interface TranslationDictionaryCollectionModel extends BaseModel {
    pagination: PaginationModel | null;
    translationDictionaries: TranslationDictionaryModel[] | null;
}

export interface WebsiteModel extends BaseModel {
    countries: CountryCollectionModel | null;
    countriesUri: string;
    currencies: CurrencyCollectionModel | null;
    currenciesUri: string;
    description: string;
    id: string;
    isActive: boolean;
    isRestricted: boolean;
    languages: LanguageCollectionModel | null;
    languagesUri: string;
    mobilePrimaryColor: string;
    mobilePrivacyPolicyUrl: string;
    mobileTermsOfUseUrl: string;
    name: string;
    states: StateCollectionModel | null;
    statesUri: string;
    websiteFavicon: string;
}

export interface WebsiteSettingsModel extends BaseModel {
    advancedSpireCmsFeatures: boolean;
    cmsType: "Classic" | "Spire" | null;
    defaultPageSize: number;
    enableCookiePrivacyPolicyPopup: boolean;
    enableDynamicRecommendations: boolean;
    googleMapsApiKey: string;
    googleTrackingAccountId: string;
    googleTrackingTypeComputed: string;
    includeSiteNameInPageTitle: boolean;
    mobileAppEnabled: boolean;
    pageTitleDelimiter: string;
    previewLoginEnabled: boolean;
    reCaptchaEnabledForContactUs: boolean;
    reCaptchaEnabledForCreateAccount: boolean;
    reCaptchaEnabledForForgotPassword: boolean;
    reCaptchaEnabledForShareProduct: boolean;
    reCaptchaSiteKey: string;
    siteNameAfterTitle: boolean;
    tokenExTestMode: boolean;
    useECheckTokenExGateway: boolean;
    usePaymetricGateway: boolean;
    useTokenExGateway: boolean;
}

export interface TranslationDictionaryModel {
    keyword: string;
    languageCode: string;
    languageId: string | null;
    source: string;
    translation: string;
}

export interface SiteMessageModel {
    languageCode: string;
    message: string;
    name: string;
}

export interface WishListCollectionModel extends BaseModel {
    pagination: PaginationModel | null;
    wishListCollection: WishListModel[] | null;
}

export interface WishListEmailScheduleModel extends BaseModel {
    endDate: Date | null;
    lastDateSent: Date | null;
    message: string;
    repeatInterval: number;
    repeatPeriod: string;
    sendDayOfMonth: number;
    sendDayOfWeek: string;
    startDate: Date;
}

export interface UpdateWishListLineCollectionModel extends BaseModel {
    changedSharedListLinesQuantities: { [key: string]: number } | null;
    includeListLines: boolean;
    wishListId: string;
}

export interface WishListLineCollectionModel extends BaseModel {
    changedListLineQuantities: { [key: string]: number } | null;
    pagination: PaginationModel | null;
    wishListLines: WishListLineModel[] | null;
}

export interface WishListSettingsModel extends BaseModel {
    allowEditingOfWishLists: boolean;
    allowListSharing: boolean;
    allowMultipleWishLists: boolean;
    allowWishListsByCustomer: boolean;
    enableWishListReminders: boolean;
    productsPerPage: number;
}

export interface WishListShareModel extends BaseModel {
    displayName: string;
    id: string;
}

export interface WishListLineModel extends BaseModel {
    allowZeroPricing: boolean;
    altText: string;
    availability: AvailabilityDto | null;
    baseUnitOfMeasure: string;
    baseUnitOfMeasureDisplay: string;
    brand: BrandDto | null;
    breakPrices: BreakPriceDto[] | null;
    canAddToCart: boolean;
    canBackOrder: boolean;
    canEnterQuantity: boolean;
    canShowPrice: boolean;
    canShowUnitOfMeasure: boolean;
    createdByDisplayName: string;
    createdOn: Date;
    customerName: string;
    erpNumber: string;
    id: string;
    isActive: boolean;
    isDiscontinued: boolean;
    isQtyAdjusted: boolean;
    isSharedLine: boolean;
    isVisible: boolean;
    manufacturerItem: string;
    notes: string;
    packDescription: string;
    pricing: ProductPriceDto | null;
    productId: string;
    productName: string;
    productUnitOfMeasures: ProductUnitOfMeasureDto[] | null;
    productUri: string;
    qtyOnHand: number;
    qtyOrdered: number;
    qtyPerBaseUnitOfMeasure: number;
    quoteRequired: boolean;
    selectedUnitOfMeasure: string;
    shortDescription: string;
    smallImagePath: string;
    sortOrder: number;
    trackInventory: boolean;
    unitOfMeasure: string;
    unitOfMeasureDescription: string;
    unitOfMeasureDisplay: string;
}

export interface WishListModel extends BaseModel {
    allowEdit: boolean;
    canAddAllToCart: boolean;
    canAddToCart: boolean;
    description: string;
    hasAnyLines: boolean;
    id: string;
    isGlobal: boolean;
    isSharedList: boolean;
    message: string;
    name: string;
    pagination: PaginationModel | null;
    recipientEmailAddress: string;
    schedule: WishListEmailScheduleModel | null;
    sendDayOfMonthPossibleValues: { key: number; value: string }[] | null;
    sendDayOfWeekPossibleValues: { key: string; value: string }[] | null;
    sendEmail: boolean;
    senderName: string;
    sharedByDisplayName: string;
    sharedUsers: WishListShareModel[] | null;
    shareOption: string;
    updatedByDisplayName: string;
    updatedOn: Date;
    wishListLineCollection: WishListLineModel[] | null;
    wishListLinesCount: number;
    wishListLinesUri: string;
    wishListSharesCount: number;
}
