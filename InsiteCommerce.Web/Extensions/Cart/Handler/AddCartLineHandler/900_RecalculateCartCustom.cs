/*
using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Caching;
using Insite.Core.Plugins.Pipelines.Pricing;
using Insite.Core.Plugins.Pipelines.Pricing.Parameters;
using Insite.Core.Plugins.Pipelines.Pricing.Results;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using System;

namespace InsiteCommerce.Web.Extensions.Cart.Handler.AddCartLineHandler
{
    [DependencyName("RecalculateCart")]
    public sealed class RecalculateCart : HandlerBase<AddCartLineParameter, AddCartLineResult>
    {
        private readonly IPricingPipeline pricingPipeline;
        private readonly IPerRequestCacheManager perRequestCacheManager;

        public RecalculateCart(
          IPricingPipeline pricingPipeline,
          IPerRequestCacheManager perRequestCacheManager)
        {
            this.pricingPipeline = pricingPipeline;
            this.perRequestCacheManager = perRequestCacheManager;
        }

        public override int Order => 900;

        public override AddCartLineResult Execute(
          IUnitOfWork unitOfWork,
          AddCartLineParameter parameter,
          AddCartLineResult result)
        {
            if (parameter.SkipRecalculateCart)
                return NextHandler.Execute(unitOfWork, parameter, result);
            perRequestCacheManager.Remove("PriceMatrixList");
            GetCartPricingResult cartPricing = pricingPipeline.GetCartPricing(new GetCartPricingParameter(result.OrderLine.CustomerOrder)
            {
                OrderLineId = new Guid?(result.OrderLine.Id)
            });
            if (cartPricing.ResultCode == ResultCode.Error)
            {
                result.GetCartResult.CanCheckOut = false;
                result.GetCartResult.CartNotPriced = true;
                cartPricing.Cart.LastPricingOn = new DateTimeOffset?();
                CopyMessages(cartPricing, result);
            }
            result.GetCartResult.Cart = cartPricing.Cart;
            
              foreach (var item in result.GetCartResult.Cart.OrderLines)
            {
                item.UnitNetPrice *= 10;
            }
            
            return NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
*/