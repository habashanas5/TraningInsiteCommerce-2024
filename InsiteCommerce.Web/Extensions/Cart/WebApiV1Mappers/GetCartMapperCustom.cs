using Insite.Cart.WebApi.V1.Mappers;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi.Interfaces;
using Insite.Data.Entities.Dtos.Interfaces;
using System;
using System.Net.Http;
using Insite.Cart.Services.Dtos;
using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Cart.WebApi.V1.ApiModels;
using Insite.Cart.WebApi.V1.Mappers.Interfaces;
using Insite.Core.Extensions;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Localization;
using Insite.Core.Plugins.Utilities;
using Insite.Core.Services;
using Insite.Core.WebApi.Interfaces;
using Insite.Customers.WebApi.V1.Mappers.Interfaces;
using Insite.Data.Entities;
using Insite.Data.Entities.Dtos.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Insite.Plugins.Utilities;
using Insite.Customers.WebApi.V1.Mappers;
using Insite.Core.Context;

namespace InsiteCommerce.Web.Extensions.Cart.WebApiV1Mappers
{
    public class GetCartMapperCustom : GetCartMapper
    {
        private readonly Lazy<ICurrencyFormatProvider> currencyFormatProvider;

        public GetCartMapperCustom(
              ICurrencyFormatProvider currencyFormatProvider,
              IGetBillToMapper getBillToMapper,
              IGetShipToMapper getShipToMapper,
              IGetCartLineCollectionMapper getCartLineCollectionMapper,
              IObjectToObjectMapper objectToObjectMapper,
              IUrlHelper urlHelper,
              IRouteDataProvider routeDataProvider,
              ITranslationLocalizer translationLocalizer)
            : base(currencyFormatProvider, getBillToMapper, getShipToMapper, getCartLineCollectionMapper, objectToObjectMapper, urlHelper, routeDataProvider, translationLocalizer) {}

        public override CartModel MapResult(GetCartResult serviceResult, HttpRequestMessage request)
        {
            var destination = base.MapResult(serviceResult, request);
            destination.OrderSubTotal = serviceResult.OrderSubTotal;
            destination.OrderSubTotal *= 10;
            destination.OrderSubTotalDisplay = this.CurrencyFormatProvider.GetString(destination.OrderSubTotal, (ICurrency)SiteContext.Current.CurrencyDto);
            foreach (var item in destination.CartLines)
            {
                item.Pricing.UnitNetPrice *= 10;
                item.Pricing.UnitNetPriceDisplay = $"{this.CurrencyFormatProvider.GetString(item.Pricing.UnitNetPrice, (ICurrency)SiteContext.Current.CurrencyDto)}";
                item.Pricing.ExtendedUnitNetPrice *= 10;
                item.Pricing.ExtendedUnitNetPriceDisplay = $"{this.CurrencyFormatProvider.GetString(item.Pricing.ExtendedUnitNetPrice, (ICurrency)SiteContext.Current.CurrencyDto)}";
            }
            return destination;
        }
    }
}