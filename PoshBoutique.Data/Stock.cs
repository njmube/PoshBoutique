//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PoshBoutique.Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class Stock
    {
        public int ArticleId { get; set; }
        public int SizeId { get; set; }
        public int ColorId { get; set; }
        public int Quantity { get; set; }
    
        public virtual Article Article { get; set; }
        public virtual Color Color { get; set; }
        public virtual Size Size { get; set; }
    }
}