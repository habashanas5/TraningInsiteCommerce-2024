using IdentityModel;
using Insite.Account.Emails;
using Insite.Account.Services.Parameters;
using Insite.Account.Services.Results;
using Insite.Common.Extensions;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.EnumTypes;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Core.Services.Handlers;
using Insite.Data.Entities;
using Insite.Data.Entities.Dtos.Interfaces;
using Insite.Data.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
namespace InsiteCommerce.Web.Extensions.Account.Handler.AddAcountHandler
{
    [DependencyName("SendActivationEmail")]
    public class SendActivationEmail : HandlerBase<AddAccountParameter, AddAccountResult>
    {
        private readonly AccountActivationEmail activationEmailSender;
        public SendActivationEmail(AccountActivationEmail activationEmailSender)
        {
            this.activationEmailSender = activationEmailSender;
        }
        public override int Order => 1401;
        public override AddAccountResult Execute(
            IUnitOfWork unitOfWork,
            AddAccountParameter parameter,
            AddAccountResult result)
        {
            string baseUrl = HttpContext.Current.Request.ActualUrl().GetLeftPart(UriPartial.Authority);
            var inserted = result.UserProfile;
            // Send activation email
            activationEmailSender.Send(inserted, baseUrl, SiteContext.Current.WebsiteDto.Id);              
                return NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}