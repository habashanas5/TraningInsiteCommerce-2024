using Insite.Account.Services.Parameters;
using Insite.Account.Services.Results;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Core.Services.Handlers;
using Insite.Data.Entities;
using Insite.Data.Repositories.Interfaces;
using InsiteCommerce.Web.Extensions.Account.Handler.AddCustomProperty;
using System.Data.Entity;


namespace InsiteCommerce.Web.Extensions.Account.Handler.AddCustomProperty
{
    [DependencyName("AddUserRole")]
    public class AddUserRole: HandlerBase<AddAccountParameter, AddAccountResult>
    {
        public AddUserRole() { }
        public override int Order => 1101;
        public override AddAccountResult Execute(
          IUnitOfWork unitOfWork,
          AddAccountParameter parameter,
          AddAccountResult result)
        {
            result.UserProfile.SetProperty("userRole", "Buyer2");
            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
