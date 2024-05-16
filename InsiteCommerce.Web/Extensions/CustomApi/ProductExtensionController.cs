using Insite.Cart.Services;
using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Cart.WebApi.V1.ApiModels;
using Insite.Cart.WebApi.V1.Mappers.Interfaces;
using Insite.Core.Extensions;
using Insite.Core.Interfaces.Data;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using Insite.Plugins.Data;
using InsiteCommerce.Web.Extensions.Entities;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using static System.Net.Mime.MediaTypeNames;

namespace InsiteCommerce.Web.Extensions.CustomApi
{
    [RoutePrefix("api/v1/ProductExtension")]
    public class ProductExtensionController : BaseApiController
    {
        private readonly IUnitOfWorkFactory unitOfWorkFactory;
        private readonly ICookieManager cookieManager;
        public IUnitOfWork unitOfWork;
        public ProductExtensionController
            (
             ICookieManager cookieManager,
             IUnitOfWorkFactory unitOfWorkFactory
            ) 
            : base((cookieManager))
        {
            this.unitOfWorkFactory = unitOfWorkFactory;
            unitOfWork = unitOfWorkFactory.GetUnitOfWork();
        }

        [HttpGet]
        [Route("GetProductExtension")]
        public IHttpActionResult GetProductExtension()
        {
            var productExtensionsRepository = unitOfWork.GetRepository<ProductExtension>().GetTableAsNoTracking();
            var productExtensionsList = productExtensionsRepository.ToList();

            if (productExtensionsList.Any())
            {
                return Ok(productExtensionsList);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Route("AddProductExtension")]
        public IHttpActionResult AddProductExtension()
        {
            var productExtensionsRepository = unitOfWork.GetRepository<ProductExtension>();

            var initialProductExtension = new ProductExtension
            {
                ERPNumber = "P1101",
                AltNumber = "A002",
                Description2 = "Test Description",
                IsSpecialProduct = true,
                HasExtraFeesMessage = false,
                CreatedOn = DateTimeOffset.UtcNow,
                CreatedBy = "Admin",
                ModifiedOn = DateTimeOffset.UtcNow,
                ModifiedBy = "Admin"
            };

            var productExtension = new ProductExtension
            {
                ERPNumber = initialProductExtension.ERPNumber,
                AltNumber = initialProductExtension.AltNumber,
                Description2 = initialProductExtension.Description2,
                IsSpecialProduct = initialProductExtension.IsSpecialProduct,
                HasExtraFeesMessage = initialProductExtension.HasExtraFeesMessage,
                CreatedOn = initialProductExtension.CreatedOn,
                CreatedBy = initialProductExtension.CreatedBy,
                ModifiedOn = initialProductExtension.ModifiedOn,
                ModifiedBy = initialProductExtension.ModifiedBy
            };

            Random rnd = new Random();
            int randomNumber = rnd.Next(0, 10000);

            productExtension.ERPNumber += randomNumber.ToString();
            productExtension.AltNumber += randomNumber.ToString();

            productExtensionsRepository.Insert(productExtension);
            unitOfWork.Save();

            return Ok("Product extension added successfully");
        }

    }
}
