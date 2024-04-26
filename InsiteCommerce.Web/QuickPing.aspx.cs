using System;
using System.Web.UI;
using Insite.Common.Dependencies;
using Insite.Core.HealthCheck;

public partial class QuickPing : Page
{
    protected HealthCheckResults HealthCheckResults { get; set; }

    protected void Page_Load(object sender, EventArgs e)
    {
        this.RegisterAsyncTask(
            new PageAsyncTask(
                async () =>
                {
                    var healthCheckManager =
                        DependencyLocator.Current.GetInstance<IHealthCheckManager>();
                    this.HealthCheckResults = await healthCheckManager.CheckHealth();
                }
            )
        );
    }
}
