﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using PoshBoutique.Data;

namespace PoshBoutique.Areas.Admin.Controllers
{
    public class OrdersController : AdminControllerBase
    {
        private PoshBoutiqueData db = new PoshBoutiqueData();

        // GET: /Admin/Orders/
        public ActionResult Index()
        {
            var orders = db.Orders.Include(o => o.OrderStatus);
            return View(orders.ToList());
        }

        // GET: /Admin/Orders/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Order order = db.Orders.Find(id);
            if (order == null)
            {
                return HttpNotFound();
            }
            return View(order);
        }

        // GET: /Admin/Orders/Create
        public ActionResult Create()
        {
            ViewBag.StatusId = new SelectList(db.OrderStatuses, "Id", "Name");
            return View();
        }

        // POST: /Admin/Orders/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,DeliveryMerchant,DeliveryPrice,HasCommission,CommissionPercents,ShippingPrice,ItemsPrice,TotalPrice,UserId,StatusId,DateCreated,PaymentMethodId")] Order order)
        {
            if (ModelState.IsValid)
            {
                db.Orders.Add(order);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.StatusId = new SelectList(db.OrderStatuses, "Id", "Name", order.StatusId);
            return View(order);
        }

        // GET: /Admin/Orders/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Order order = db.Orders.Find(id);
            if (order == null)
            {
                return HttpNotFound();
            }
            ViewBag.StatusId = new SelectList(db.OrderStatuses, "Id", "Name", order.StatusId);
            return View(order);
        }

        // POST: /Admin/Orders/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,DeliveryMerchant,DeliveryPrice,HasCommission,CommissionPercents,ShippingPrice,ItemsPrice,TotalPrice,UserId,StatusId,DateCreated,PaymentMethodId")] Order order)
        {
            if (ModelState.IsValid)
            {
                Order dbOrder = db.Orders.Find(order.Id);
                dbOrder.DeliveryMerchant = order.DeliveryMerchant;
                dbOrder.DeliveryPrice = order.DeliveryPrice;
                dbOrder.HasCommission = order.HasCommission;
                dbOrder.CommissionPercents = order.CommissionPercents;
                dbOrder.ShippingPrice = order.ShippingPrice;
                dbOrder.ItemsPrice = order.ItemsPrice;
                dbOrder.TotalPrice = order.TotalPrice;
                dbOrder.UserId = order.UserId;
                dbOrder.StatusId = order.StatusId;
                dbOrder.DateCreated = order.DateCreated;
                dbOrder.PaymentMethodId = order.PaymentMethodId;

                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.StatusId = new SelectList(db.OrderStatuses, "Id", "Name", order.StatusId);
            return View(order);
        }

        // GET: /Admin/Orders/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Order order = db.Orders.Find(id);
            if (order == null)
            {
                return HttpNotFound();
            }
            return View(order);
        }

        // POST: /Admin/Orders/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Order order = db.Orders.Find(id);
            db.Orders.Remove(order);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
