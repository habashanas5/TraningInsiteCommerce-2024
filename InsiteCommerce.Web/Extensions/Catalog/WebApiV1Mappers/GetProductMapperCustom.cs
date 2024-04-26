using Insite.Catalog.Services.Results;
using Insite.Catalog.WebApi.V1.ApiModels;
using Insite.Catalog.WebApi.V1.Mappers;
using Insite.Core.Context;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi.Interfaces;
using Insite.Data.Entities.Dtos.Interfaces;
using System;
using System.Net.Http;

namespace InsiteCommerce.Web.Extensions.Catalog.WebApiV1Mappers
{
    public class GetProductMapperCustom : GetProductMapper
    {
        private readonly Lazy<ICurrencyFormatProvider> currencyFormatProvider;

        public GetProductMapperCustom(IUrlHelper urlHelper, IObjectToObjectMapper objectToObjectMapper, Lazy<ICurrencyFormatProvider> currencyFormatProvider)
            : base(urlHelper, objectToObjectMapper)
        {
            this.currencyFormatProvider = currencyFormatProvider;
        }

        public override ProductModel MapResult
            (GetProductResult serviceResult,
             HttpRequestMessage request)
        {
            var productModel = base.MapResult(serviceResult, request);
            productModel.Product.Pricing.UnitNetPrice *= 10;
            productModel.Product.Pricing.UnitNetPriceDisplay = $"{this.currencyFormatProvider.Value.GetString(productModel.Product.Pricing.UnitNetPrice, (ICurrency)SiteContext.Current.CurrencyDto)}";
            return productModel;
        }
    }
}
