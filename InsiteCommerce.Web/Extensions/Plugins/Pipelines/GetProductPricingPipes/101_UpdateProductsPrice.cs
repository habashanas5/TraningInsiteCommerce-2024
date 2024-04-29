using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Localization;
using Insite.Core.Interfaces.Plugins.Pricing;
using Insite.Core.Plugins.Pipelines;
using Insite.Core.Plugins.Pipelines.Pricing.Parameters;
using Insite.Core.Plugins.Pipelines.Pricing.Results;
using Insite.Core.Plugins.Pricing;
using Insite.Core.Plugins.Utilities;
using Insite.CurrencyConversion.WebserviceX.CurrencyConverterService;
using Insite.Data.Entities.Dtos.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;


namespace InsiteCommerce.Web.Extensions.Plugins.Pipelines.GetProductPricingPies
{
    public sealed class UpdateProductsPrice :
     IPipe<GetProductPricingParameter, GetProductPricingResult>,
     IMultiInstanceDependency,
     IDependency,
     IExtension
    {
        private readonly Lazy<ICurrencyFormatProvider> currencyFormatProvider;

        public UpdateProductsPrice(Lazy<ICurrencyFormatProvider> currencyFormatProvider) { this.currencyFormatProvider = currencyFormatProvider; }
        public int Order => 101;

        public GetProductPricingResult Execute(
          IUnitOfWork unitOfWork,
          GetProductPricingParameter parameter,
          GetProductPricingResult result)
        {
                foreach (var item in result.ProductPriceDtos.Values) 
            {
                
                item.UnitNetPrice *= 10;
                item.UnitNetPriceDisplay = $"{this.currencyFormatProvider.Value.GetString(item.UnitNetPrice, (ICurrency)SiteContext.Current.CurrencyDto)}";
            }

            return result;  
        }
    }
}