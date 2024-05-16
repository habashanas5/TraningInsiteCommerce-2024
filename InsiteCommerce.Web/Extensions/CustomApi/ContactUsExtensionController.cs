using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Plugins.Emails;
using Insite.Core.Localization;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using InsiteCommerce.Web.Extensions.Entities;
using System.Linq;
using System.Web.Http;

namespace InsiteCommerce.Web.Extensions.CustomApi
{
    [RoutePrefix("api/v1/ContactUsExtension")]
    public class ContactUsExtensionController : BaseApiController
    {
        private readonly IUnitOfWorkFactory unitOfWorkFactory;
        private readonly ICookieManager cookieManager;
        public IUnitOfWork unitOfWork;
        private readonly CustomMessageProvider customMessageProvider;
      
        public ContactUsExtensionController
          (
           ICookieManager cookieManager,
           IUnitOfWorkFactory unitOfWorkFactory,
           IEmailService emailService,
            IEntityTranslationService entityTranslationService
          )
          : base((cookieManager))
        {
            this.unitOfWorkFactory = unitOfWorkFactory;
            unitOfWork = unitOfWorkFactory.GetUnitOfWork();
            this.customMessageProvider = new CustomMessageProvider();
        }

        [HttpGet]
        [Route("GetContactUsExtensionsList")]
        public IHttpActionResult GetContactUsExtensionsList()
        {
            var contactUsExtensionsRepository = unitOfWork.GetRepository<ContactUsExtension>().GetTableAsNoTracking();
            var contactUsExtensionsList = contactUsExtensionsRepository.Select(contactUs => new
            {
                contactUs.Id,
                contactUs.Subject,
                contactUs.FirstName,
                contactUs.LastName,
                contactUs.Email,
                contactUs.Phone,
                contactUs.Address,
                contactUs.Message,
                contactUs.Country,
                contactUs.ZipCode
            }).ToList();

            if (contactUsExtensionsList.Any())
            {
                return Ok(contactUsExtensionsList);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Route("AddContactUsExtensionsList")]
        public IHttpActionResult AddContactUsExtension()
        {
            var contactUsExtensionsRepository = unitOfWork.GetRepository<ContactUsExtension>();

            var initialContactUsExtension = new ContactUsExtension
            {
                Subject = "ContactUs",
                FirstName = "John",
                LastName = "Doe",
                Email =  "johndoe@example.com",
                Phone =  "123456789",
                Address = "123 Main St",
                Message = "message",
                Country = "Japan",
                ZipCode = "12345"
            };

            var contactUsExtension = new ContactUsExtension
            {
                Subject = initialContactUsExtension.Subject,
                FirstName = initialContactUsExtension.FirstName,
                LastName = initialContactUsExtension.LastName,
                Email = initialContactUsExtension.Email,
                Phone = initialContactUsExtension.Phone,
                Address = initialContactUsExtension.Address,
                Message = initialContactUsExtension.Message,
                Country = initialContactUsExtension.Country,
                ZipCode = initialContactUsExtension.ZipCode
            };
            contactUsExtensionsRepository.Insert(contactUsExtension);
            unitOfWork.Save();

            return Ok(customMessageProvider.Feedback_ThankYouMessage);
        }
    }
}
