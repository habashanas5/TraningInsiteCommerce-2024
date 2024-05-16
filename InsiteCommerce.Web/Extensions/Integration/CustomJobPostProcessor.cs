using Insite.Core.Interfaces.Dependency;
using Insite.Integration.WebService.PlugIns.Postprocessor.FieldMap;
using System;
using System.Data;
using Insite.Data.Entities;
using Insite.Integration.WebService.Interfaces;
using System.Threading;
using Microsoft.AspNet.SignalR.Infrastructure;
using System.Web.UI.MobileControls.Adapters;
using static System.Net.Mime.MediaTypeNames;
using Insite.Plugins.Data;
using Insite.Core.Interfaces.Data;
using System.Linq;
namespace InsiteCommerce.Web.Extensions.Integration

{
    [DependencyName("CustomJobPostProcessor")]
    public class CustomJobPostProcessor : IJobPostprocessor
    {
        private readonly JobPostprocessorFieldMap jobPostprocessorFieldMap;

        public CustomJobPostProcessor(JobPostprocessorFieldMap jobPostprocessorFieldMap)
        {
            this.jobPostprocessorFieldMap = jobPostprocessorFieldMap;
        }

        public IJobLogger JobLogger { get; set; }

        public IntegrationJob IntegrationJob { get; set; }

        public void Cancel()
        {
            throw new NotImplementedException();
        }

         public void Execute(DataSet dataSet, CancellationToken cancellationToken)
         {
             DataTable productsTable = dataSet.Tables["1Product"];
             if (productsTable != null)
             {
                 DataColumn shortDescriptionColumn = productsTable.Columns["ShortDescription"];
                 if (shortDescriptionColumn != null)
                 {
                     foreach (DataRow row in productsTable.Rows)
                     {
                         if (row["ShortDescription"] != DBNull.Value)
                         {
                             string currentValue = row["ShortDescription"].ToString();
                             string upadteValue = currentValue + " test";
                             row["ShortDescription"] = upadteValue;
                         }
                     }
                 }

                 this.jobPostprocessorFieldMap.IntegrationJob = this.IntegrationJob;
                 this.jobPostprocessorFieldMap.JobLogger = this.JobLogger;
                 this.jobPostprocessorFieldMap.Execute(dataSet, cancellationToken);
             }
         }
    }
}