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
    
    public partial class Color
    {
        public Color()
        {
            this.Stocks = new HashSet<Stock>();
        }
    
        public int Id { get; set; }
        public string Title { get; set; }
    
        public virtual ICollection<Stock> Stocks { get; set; }
    }
}
