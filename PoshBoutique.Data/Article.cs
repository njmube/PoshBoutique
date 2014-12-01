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
    
    public partial class Article
    {
        public Article()
        {
            this.ArticleImages = new HashSet<ArticleImage>();
            this.Stocks = new HashSet<Stock>();
            this.Categories = new HashSet<Category>();
            this.RelatedArticles = new HashSet<Article>();
            this.ParentRelatedArticles = new HashSet<Article>();
            this.OrderDetails = new HashSet<OrderDetail>();
        }
    
        public int Id { get; set; }
        public string UrlName { get; set; }
        public string Title { get; set; }
        public System.DateTime DateCreated { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public string MaterialDescription { get; set; }
        public string ThumbnailUrl { get; set; }
        public int SizeTypeId { get; set; }
        public bool Visible { get; set; }
        public Nullable<decimal> OriginalPrice { get; set; }
        public string DiscountDescription { get; set; }
        public int LikesCount { get; set; }
        public int OrdersCount { get; set; }
        public int CollectionId { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsRecommended { get; set; }
    
        public virtual ICollection<ArticleImage> ArticleImages { get; set; }
        public virtual SizeType SizeType { get; set; }
        public virtual ICollection<Stock> Stocks { get; set; }
        public virtual ICollection<Category> Categories { get; set; }
        public virtual ICollection<Article> RelatedArticles { get; set; }
        public virtual ICollection<Article> ParentRelatedArticles { get; set; }
        public virtual Collection Collection { get; set; }
        public virtual ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
