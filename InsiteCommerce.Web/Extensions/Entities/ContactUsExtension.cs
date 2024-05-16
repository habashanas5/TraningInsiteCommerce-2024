namespace InsiteCommerce.Web.Extensions.Entities
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using Insite.Core.Interfaces.Data;
    using Insite.Data.Entities;

    [Table("ContactUsExtension", Schema = "Extensions")]
    public class ContactUsExtension : EntityBase
    {
     
        [Required]
        [StringLength(100)]
        public string Subject { get; set; }

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50)]
        public string LastName { get; set; }

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }

        [StringLength(200)]
        public string Address { get; set; }

        [Required]
        [StringLength(500)]
        public string Message { get; set; }

        [Required]
        [StringLength(100)]
        public string Country { get; set; }

        [StringLength(20)]
        public string ZipCode { get; set; }
    }
}