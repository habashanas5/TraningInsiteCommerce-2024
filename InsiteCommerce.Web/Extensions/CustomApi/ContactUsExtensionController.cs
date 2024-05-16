using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Plugins.Emails;
using Insite.Core.Localization;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using InsiteCommerce.Web.Extensions.Entities;
using Microsoft.AspNet.SignalR.Messaging;
using Microsoft.Graph;
using System.Linq;
using System.Net.Mail;
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
        private readonly ContactUsSettings contactUsSettings;
        protected readonly IEmailService EmailService;

        public ContactUsExtensionController
          (
           ICookieManager cookieManager,
           IUnitOfWorkFactory unitOfWorkFactory,
           IEmailService emailService,
           IEntityTranslationService entityTranslationService,
           ContactUsSettings contactUsSettings

          )
          : base((cookieManager))
        {
            this.unitOfWorkFactory = unitOfWorkFactory;
            unitOfWork = unitOfWorkFactory.GetUnitOfWork();
            this.customMessageProvider = new CustomMessageProvider();
            this.EmailService = emailService;
            this.contactUsSettings = contactUsSettings;
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
        public IHttpActionResult AddContactUsExtension([FromBody] ContactUsData contactUsData)
        {
            if (contactUsData == null)
            {
                return BadRequest("ContactUsData is null");
            }

            var contactUsExtensionsRepository = unitOfWork.GetRepository<ContactUsExtension>();
            string emailTo = contactUsSettings?.ContactUsEmailAddress;

            if (string.IsNullOrEmpty(emailTo))
            {
                return BadRequest("Email address not found in SystemSetting table.");
            }
            var contactUsExtension = new ContactUsExtension
            {
                Subject = contactUsData.Subject,
                FirstName = contactUsData.FirstName,
                LastName = contactUsData.LastName,
                Email = contactUsData.Email,
                Phone = contactUsData.Phone,
                Address = contactUsData.Address,
                Message = contactUsData.Message,
                Country = contactUsData.Country,
                ZipCode = contactUsData.ZipCode,
            };
            string adminSubject = "New Contact Us Submission";
            string adminMessage = $"You have received a new contact us submission:\n\nFirst Name: {contactUsData.FirstName}\nLast Name: {contactUsData.LastName}\nEmail: {contactUsData.Email}\nMessage: {contactUsData.Message}\nTopic: {contactUsData.Subject}";
        
            var sendEmailParameter = new SendEmailParameter
            {
                    ToAddresses = new[] { emailTo },
                    Subject = adminSubject,
                    FromAddress = contactUsData.Email,
                    Body = adminMessage
            };

            this.EmailService.SendEmail(sendEmailParameter, unitOfWork);
            contactUsExtensionsRepository.Insert(contactUsExtension);
            unitOfWork.Save();

            return Ok(customMessageProvider.Feedback_ThankYouMessage);
        }
    }
}
