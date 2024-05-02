namespace InsiteCommerce.Web.Extensions.Entities
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using Insite.Core.Interfaces.Data;
    using Insite.Data.Entities;

    [Table("ProductExtension", Schema = "Extensions")]
    public class ProductExtension : EntityBase
    {
        [Required]
        [StringLength(50)]
        public string ERPNumber { get; set; } = string.Empty;

        [Required(AllowEmptyStrings = true)]
        [StringLength(50)]
        [NaturalKeyField]
        public string AltNumber { get; set; } = string.Empty;

        [Required(AllowEmptyStrings = true)]
        [StringLength(50)]
        public string Description2 { get; set; } = string.Empty;

        [Required]
        public bool IsSpecialProduct { get; set; } = false;

        [Required]
        public bool HasExtraFeesMessage { get; set; } = false;
    }
}
