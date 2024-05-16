using Insite.Core.Interfaces.Plugins.Emails;
using Insite.Core.Localization;
using Insite.Email.WebApi.V1.ApiModels;
using Insite.WebFramework.Mvc;
using System.Dynamic;
using System.Web.Http;
using Insite.Core.Interfaces.Data;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using InsiteCommerce.Web.Extensions.Entities;
using System.Linq;
using Microsoft.AspNet.SignalR.Messaging;
using Microsoft.Graph;
using Insite.Plugins.Data;
using Insite.Plugins.Emails;
using System;
using Insite.Data.Entities;


namespace InsiteCommerce.Web.Extensions.CustomApi
{
    [RoutePrefix("api/v1/EmailContactUsExtensionController")]
    public class EmailContactUsExtensionController : BaseApiController
    {

        private readonly IUnitOfWorkFactory unitOfWorkFactory;
        private readonly ICookieManager cookieManager;
        public IUnitOfWork unitOfWork;
        protected readonly IEmailService EmailService;
        private readonly ContactUsSettings contactUsSettings;

        public EmailContactUsExtensionController(
             ICookieManager cookieManager,
             IUnitOfWorkFactory unitOfWorkFactory,
             IEmailService emailService,
             ContactUsSettings contactUsSettings

            )
        : base((cookieManager))
        {
            this.unitOfWorkFactory = unitOfWorkFactory;
            unitOfWork = unitOfWorkFactory.GetUnitOfWork();
            this.EmailService = emailService;
            this.contactUsSettings = contactUsSettings;
        }

        [HttpPost]
        [Route("SendEmail")]
        public IHttpActionResult SendEmail()
        {
            try
            {
                string emailTo = contactUsSettings?.ContactUsEmailAddress;
                if (string.IsNullOrEmpty(emailTo))
                {
                    return BadRequest("Email address not found in SystemSetting table.");
                }

                string firstName = "Anas";
                string lastName = "Habash";
                string message = "Message";
                string topic = "topic";
                string emailAddress = "habashanas716@gmail.com";
                string adminSubject = "New Contact Us Submission";
                string adminMessage = $"You have received a new contact us submission:\n\nFirst Name: {firstName}\nLast Name: {lastName}\nEmail: {emailAddress}\nMessage: {message}\nTopic: {topic}";

                var sendEmailParameter = new SendEmailParameter
                {
                    ToAddresses = new[] { emailTo },
                    Subject = adminSubject,
                    FromAddress = emailAddress,
                    Body = adminMessage
                };

                this.EmailService.SendEmail(sendEmailParameter, unitOfWork);
                return Ok(new { Success = true });
            }
            catch(Exception ex) {return BadRequest(ex.Message); }
        }
    }
}