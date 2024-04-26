// Decompiled with JetBrains decompiler
// Type: Insite.Account.Services.Handlers.AddAccountHandler.AddAccount
// Assembly: Insite.Account, Version=5.1.0.178, Culture=neutral, PublicKeyToken=null
// MVID: C3F1245C-603D-450B-886F-855F188C86DB
// Assembly location: C:\Projects\InsiteCommerce-5.1.0\InsiteCommerce.Web\bin\Insite.Account.dll

using Insite.Account.Services.Parameters;
using Insite.Account.Services.Results;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Core.Providers;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Data.Entities;
using Insite.Data.Repositories.Interfaces;

namespace Extensions.Handler
{
    [DependencyName("AddAccount")]
    public sealed class AddAccount : HandlerBase<AddAccountParameter, AddAccountResult>
    {
        private readonly IAuthenticationService authenticationService;

        public AddAccount(IAuthenticationService authenticationService)
        {
            this.authenticationService = authenticationService;
        }

        public override int Order => 1100;

        public override AddAccountResult Execute(
          IUnitOfWork unitOfWork,
          AddAccountParameter parameter,
          AddAccountResult result)
        {
            IUserProfileRepository typedRepository = unitOfWork.GetTypedRepository<IUserProfileRepository>();
            UserProfile inserted = typedRepository.Create();
            inserted.UserName = parameter.UserName;
            inserted.Email = parameter.Email;
            inserted.IsGuest = parameter.IsGuest;
            inserted.FirstName = parameter.FirstName ?? string.Empty;
            inserted.LastName = parameter.LastName ?? string.Empty;
            inserted.DefaultFulfillmentMethod = parameter.DefaultFulfillmentMethod ?? string.Empty;
            inserted.DefaultWarehouseId = parameter.DefaultWarehouseId;
            if (parameter.DefaultWarehouseId.HasValue)
            {
                Warehouse warehouse = unitOfWork.GetRepository<Warehouse>().Get(parameter.DefaultWarehouseId.Value);
                if (warehouse == null)
                    return this.CreateErrorServiceResult<AddAccountResult>(result, SubCode.NotFound, string.Format(MessageProvider.Current.Not_Found, (object)"Default Warehouse"));
                inserted.DefaultWarehouse = warehouse;
            }
            this.authenticationService.CreateUser(inserted.UserName, inserted.Email, parameter.Password);
            typedRepository.Insert(inserted);
            result.UserProfile = inserted;
            result.Password = parameter.Password;
            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
