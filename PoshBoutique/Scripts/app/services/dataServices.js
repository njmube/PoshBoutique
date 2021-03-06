﻿poshBoutiqueApp.factory("categoriesDataService", ["$http", function ($http) {
    var cachedCategoriesTree = null;
    var initialCategoryId = null;

    var selectCategory = function (categoryId, categories) {
        if (!categories) {
            return false;
        }

        var result = false;
        for (var categoryIndex in categories) {
            var category = categories[categoryIndex];
            if (category.id == categoryId) {
                category.isSelected = true;
                category.isExpanded = true;

                result = true;
            }
            else {
                category.isSelected = false;    
            }

            var isChildSelected = selectCategory(categoryId, category.childCategories);
            if (!category.isExpanded && isChildSelected) {
                category.isExpanded = true;
            }
        }

        return result;
    };

    return {
        setSelectedCategory: function (categoryId) {            
            if (cachedCategoriesTree) {
                initialCategorySet = true;
                selectCategory(categoryId, cachedCategoriesTree);
            }
            else {
                initialCategoryId = categoryId;
            }
        },
        getTree: function () {
            if (cachedCategoriesTree) {
                return cachedCategoriesTree;
            }

            return $http({ method: 'GET', url: '/api/categories/tree' })
                .then(function (response) {
                    var categoriesTree = response.data;
                    //for (category in categoriesTree) {
                    //    if (category.childCategories && childCategories.length > 0) {
                    //        category.isExpanded = true;
                    //    }
                    //}
                    
                    cachedCategoriesTree = categoriesTree;
                    if (initialCategoryId) {
                        selectCategory(initialCategoryId, cachedCategoriesTree);
                        initialCategoryId = null;
                    }

                    return categoriesTree;
                });
        }
    };
}]);

poshBoutiqueApp.factory("articlesDataService", ["$http", function ($http) {
    return {
        getArticlesInCategory: function (categoryUrl, filter, orderBy, sortDirection) {
            return $http({
                method: 'GET',
                url: '/api/articles',
                params: {
                    categoryUrl: categoryUrl,
                    filter: filter,
                    orderBy: orderBy,
                    sortDirection: sortDirection
                }
            }).then(function (response) {
                    var listData = response.data;

                    return listData;
                });
        },
        getArticleByUrlName: function (articleUrlName) {
            return $http({
                method: 'GET',
                url: '/api/articles',
                params: {
                    urlName: articleUrlName
                }
            }).then(function (response) {
                var listData = response.data;

                return listData;
            });
        },
        getRelatedArticles: function (articleId) {
            return $http({
                method: 'GET',
                url: '/api/relatedarticles/' + articleId
            });
        },
        getArticlesInCollection: function (collectionId) {
            return $http({
                method: 'GET',
                url: '/api/articles',
                params: {
                    collectionId: collectionId
                }
            });
        },
        getDiscountedArticles: function () {
            return $http({
                method: 'GET',
                url: '/api/articles/discounts'
            }).then(function (response) {
                var discountedItems = response.data;

                return discountedItems;
            });
        },
        getFeaturedArticles: function () {
            return $http({
                method: 'GET',
                url: '/api/articles/featured'
            }).then(function (response) {
                var featuredItems = response.data;

                return featuredItems;
            });
        },
        getLikedArticles: function () {
            return $http({
                method: 'GET',
                url: '/api/articles/liked'
            }).then(function (response) {
                var likedItems = response.data;

                return likedItems;
            });
        },
        findArticles: function (searchTerm) {
            return $http({
                method: 'GET',
                url: '/api/articles/find',
                params: {
                    q: searchTerm
                }
            }).then(function (response) {
                var foundArticles = response.data;

                return foundArticles;
            });
        },
        getRecommendedArticles: function () {
            return $http({
                method: 'GET',
                url: '/api/articles/recommended',
                cache: true
            });
        }
    };
}]);

poshBoutiqueApp.factory("likesDataService", ["$http", "$rootScope", function ($http, $rootScope) {
    return {
        likeArticle: function (articleId) {
            $rootScope.$emit('toggleLike', articleId, true);

            return $http({
                method: 'PUT',
                url: '/api/likes/' + articleId
            });
        },
        unlikeArticle: function (articleId) {
            $rootScope.$emit('toggleLike', articleId, false);

            return $http({
                method: 'DELETE',
                url: '/api/likes/' + articleId
            });
        }
    };
}]);

poshBoutiqueApp.factory("subscriptionsService", ["$http", function ($http) {
    return {
        subscribe: function (email) {
            return $http({
                method: 'POST',
                url: '/api/subscriptions',
                data: { email: email }
            });
        }
    };
}]);

poshBoutiqueApp.factory("feedbackService", ["$http", function ($http) {
    return {
        submit: function (feedbackData) {
            return $http({
                method: 'POST',
                url: '/api/feedback',
                data: feedbackData
            });
        }
    };
}]);

poshBoutiqueApp.factory("collectionsDataService", ["$http", function ($http) {
    return {
        getAll: function () {
            return $http({
                method: 'GET',
                url: '/api/collections'
            });
        }
    };
}]);

poshBoutiqueApp.factory("ordersDataService", ["$http", function ($http) {
    return {
        validateOrder: function (orderedItems) {
            return $http({
                method: 'POST',
                url: '/api/orders/validate',
                data: { items: orderedItems }
            });
        },
        getAddressInfo: function () {
            return $http({
                method: 'GET',
                url: '/api/orders/getaddressinfo'
            }).then(function (response) {
                var addressInfo = response.data;

                return addressInfo;
            });
        },
        setAddressInfo: function (addressInfo) {
            return $http({
                method: 'POST',
                url: '/api/orders/setaddressinfo',
                data: addressInfo
            });
        },
        getDeliveryMethods: function (freeShipping) {
            return $http({
                method: 'GET',
                url: '/api/orders/deliverymethods?freeShipping=' + freeShipping
            }).then(function (response) {
                var deliveryMethods = response.data;

                return deliveryMethods;
            });
        },
        getPaymentMethods: function (freeShipping) {
            return $http({
                method: 'GET',
                url: '/api/orders/paymentmethods?freeShipping=' + freeShipping
            }).then(function (response) {
                var paymentMethods = response.data;

                return paymentMethods;
            });
        },
        validateAndSaveOrder: function (simpleOrder) {
            return $http({
                method: 'POST',
                url: '/api/orders/validateandsaveorder',
                data: simpleOrder
            });
        },
        my: function () {
            return $http({
                method: 'GET',
                url: '/api/orders/my'
            })
            .then(function (response) {
                var userOrders = response.data;

                return userOrders;
            });
        },
        orderItems: function (orderId) {
            return $http({
                method: 'GET',
                url: '/api/orders/' + orderId + '/items'
            });
        },
        orderHistory: function (orderId) {
            return $http({
                method: 'GET',
                url: '/api/orders/' + orderId + '/history'
            });
        },
        getDefaultCoupons: function (orderedItems) {
            return $http({
                method: 'POST',
                url: '/api/orders/defaultcoupons',
                data: { items: orderedItems }
            })
            .then(function (response) {
                var defaultCoupons = response.data;

                return defaultCoupons;
            });
        },
    };
}]);