using Insite.Common.Helpers;
using Insite.Common.Providers;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Pricing;
using Insite.Core.Plugins.EntityUtilities;
using Insite.Core.Plugins.Pipelines;
using Insite.Core.Plugins.Pipelines.Pricing;
using Insite.Core.Plugins.Pipelines.Pricing.Parameters;
using Insite.Core.Plugins.Pipelines.Pricing.Results;
using Insite.Core.Plugins.Pricing;
using Insite.Core.Services;
using Insite.Core.SystemSetting.Groups.OrderManagement;
using Insite.Data.Entities;
using Insite.Data.Entities.Dtos.Interfaces;
using Insite.Integration.Connector.Ifs.V9.WebServices.Models.CreateCustomerOrder;
using System;
using System.Collections.Generic;
using System.Linq;

namespace InsiteCommerce.Web.Extensions.Plugins.Pipelines.GetCartPricnigPipes
{
    public sealed class UpdateCartPrice :
         IPipe<GetCartPricingParameter, GetCartPricingResult>,
         IMultiInstanceDependency,
         IDependency,
         IExtension
    {
        public UpdateCartPrice() {}

        public int Order => 101;

        public GetCartPricingResult Execute(
          IUnitOfWork unitOfWork,
          GetCartPricingParameter parameter,
          GetCartPricingResult result)
        {
            foreach (var orderLine in result.OrderLinesToPrice)
            {
                orderLine.UnitNetPrice *= 10;
            }
            return result;
        }
    }
}