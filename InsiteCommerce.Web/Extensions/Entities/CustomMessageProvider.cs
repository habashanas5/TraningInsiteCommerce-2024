using Insite.Core.Providers;

namespace InsiteCommerce.Web.Extensions.Entities
{
    public class CustomMessageProvider: MessageProvider
    {
        public string Feedback_ThankYouMessage => GetMessage(nameof(Feedback_ThankYouMessage), "Thank you for contacting us. We will answer your inquiries as soon as possible");
    }
}
