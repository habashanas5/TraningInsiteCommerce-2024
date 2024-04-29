using Insite.Catalog.Services.Dtos;
using Insite.Catalog.Services.Parameters;
using Insite.Catalog.Services.Pipelines;
using Insite.Catalog.Services.Pipelines.Parameters;
using Insite.Catalog.Services.Pipelines.Results;
using Insite.Catalog.Services.Results;
using Insite.Catalog.Services.V2.Dtos.Product;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using System;
using System.Collections.Generic;

using System.Linq;


namespace InsiteCommerce.Web.Extensions.Catalog.Handler.GetProductCollectionHandler
{
    [DependencyName("UpdateProductsPrice")]
    public class UpdateProductsPrice :
            HandlerBase<GetProductCollectionParameter, GetProductCollectionResult>
    {

        public UpdateProductsPrice() { }
    public override int Order => 1099;

        public override GetProductCollectionResult Execute(
          IUnitOfWork unitOfWork,
          GetProductCollectionParameter parameter,
          GetProductCollectionResult result)
        {
               var products = result.Products;
            foreach (var product in products)
            {
                product.BasicListPrice *= 10;
                product.BasicSalePrice *= 10;
            }            
            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}