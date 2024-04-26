using System.Net.Http;
using Insite.Catalog.Services.Parameters;
using Insite.Catalog.Services.Results;
using Insite.Catalog.WebApi.V1.ApiModels;
using Insite.Core.WebApi.Interfaces;
using Insite.Core.WebApi;
using System.Linq;
using Insite.Core.Plugins.Utilities;
using Insite.Catalog.WebApi.V1.Mappers;
using Insite.Catalog.WebApi.V1.Mappers.Interfaces;
using System;
using Insite.Core.Context;
using Insite.Data.Entities.Dtos.Interfaces;

namespace InsiteCommerce.Web.Extensions.Catalog.WebApiV1Mappers
{
    public class GetProductCollectionMapperCustom : GetProductCollectionMapper
    {
        private readonly Lazy<ICurrencyFormatProvider> currencyFormatProvider;
        public GetProductCollectionMapperCustom(IUrlHelper urlHelper, IObjectToObjectMapper objectToObjectMapper , Lazy<ICurrencyFormatProvider> currencyFormatProvider)
            : base(urlHelper, objectToObjectMapper)
        {
            this.currencyFormatProvider = currencyFormatProvider;
        }
        
        public override ProductCollectionModel MapResult(GetProductCollectionResult getProductCollectionResult, HttpRequestMessage request)
        {
            var productCollectionModel = base.MapResult(getProductCollectionResult, request);

            if (productCollectionModel.Products != null)
            {
                productCollectionModel.Products.ForEach(productDto =>
                {
                    if (productDto.Pricing != null)
                    {
                        productDto.Pricing.UnitNetPrice *= 10;
                        productDto.Pricing.UnitNetPriceDisplay = $"{this.currencyFormatProvider.Value.GetString(productDto.Pricing.UnitNetPrice, (ICurrency)SiteContext.Current.CurrencyDto)}";
                    }
                });
            }
            return productCollectionModel;
        }
    }
}
