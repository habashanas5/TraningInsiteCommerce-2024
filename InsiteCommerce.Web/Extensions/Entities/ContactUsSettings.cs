using Insite.Core.SystemSetting;
using Insite.Core.SystemSetting.Groups;
using System;

namespace InsiteCommerce.Web.Extensions.Entities
{
    [SettingsGroup(PrimaryGroupName = "CustomSettings", Label = "ContactUs", Description = "", SortOrder = 7)]
    public class ContactUsSettings: BaseSettingsGroup
    {
        [SettingsField(DisplayName = "Enable Contact Us Form", Description = "If Yes, enable the contact us form feature.", IsGlobal = false)]
        public virtual bool EnableContactUsForm
        {
            get => this.GetValue<bool>(true, nameof(EnableContactUsForm));
        }

        [SettingsField(DisplayName = "Contact Us Email", Description = "The email address where contact us submissions will be sent.", IsGlobal = false)]
        public virtual string ContactUsEmailAddress
        {
            get => this.GetValue<string>("example@example.com", nameof(ContactUsEmailAddress));
        }
    }
}
