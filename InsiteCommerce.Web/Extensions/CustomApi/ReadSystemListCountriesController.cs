using Insite.Core.WebApi;
using Insite.Core.Interfaces.Data;
using Insite.Core.Plugins.Utilities;
using System.Linq;
using System.Web.Http;
using Insite.Data.Entities;

namespace InsiteCommerce.Web.Extensions.CustomApi
{
    [RoutePrefix("api/v1/SystemList")]
    public class ReadSystemListCountriesController : BaseApiController
    {
        private readonly IUnitOfWorkFactory unitOfWorkFactory;
        private readonly ICookieManager cookieManager;
        public IUnitOfWork unitOfWork;

        public ReadSystemListCountriesController(
             ICookieManager cookieManager,
             IUnitOfWorkFactory unitOfWorkFactory
            )
        : base((cookieManager))
        {
            this.unitOfWorkFactory = unitOfWorkFactory;
            unitOfWork = unitOfWorkFactory.GetUnitOfWork();
        }

        [HttpGet]
        [Route("CheckInSystemList/{List}")]
        public IHttpActionResult CheckInSystemList(string List)
        {
            if (string.IsNullOrEmpty(List))
            {
                return BadRequest("List parameter is empty or null.");
            }
            var systemListItem = unitOfWork.GetRepository<SystemList>().GetTableAsNoTracking()
                 .Select(item => new
                 {
                     item.Id,
                     item.Name,
                     item.Description,
                     item.AdditionalInfo,
                     item.DeactivateOn
                 })
                   .FirstOrDefault(item => item.Name == List);

            if (systemListItem == null)
            {
                return NotFound();
            }

            var systemListId = systemListItem.Id;

            var systemListValues = unitOfWork.GetRepository<SystemListValue>().GetTableAsNoTracking()
            .Where(value => value.SystemListId == systemListId)
            .Select(value => new
            {
                value.Name,
                value.Description,
                value.AdditionalInfo,
                value.DeactivateOn
            }).ToList();


            return Ok(new
            {
                SystemList = systemListItem,
                SystemListValues = systemListValues
            });
        }
    }
}
