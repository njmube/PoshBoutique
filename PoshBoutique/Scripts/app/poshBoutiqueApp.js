﻿var poshBoutiqueApp = angular.module('poshBoutiqueApp', ['ui.router', 'ui.router.router', 'ui.bootstrap', 'angularTree', 'ngProgressLite']);

poshBoutiqueApp.factory('$exceptionHandler', ["$log", function ($log) {
    return function (exception, cause) {
        debugger;
        $log.error.apply($log, arguments);

        logError(exception, cause);
    };
}]);

poshBoutiqueApp

    .provider('articleListParams', function () {
        var filterDefaults = { text: null };
        var orderDefaults = {
            options: [],
            by: null,
            asc: false
        };

        this.setFilterDefaults = function (filter) {
            angular.extend(filterDefaults, filter)
        };

        this.setOrderDefaults = function (order) {
            angular.extend(orderDefaults, order)
        };

        this.$get = function () {
            return {
                filter: filterDefaults,
                order: orderDefaults
            };
        };
    })

    .config(["$stateProvider", "$urlRouterProvider", "articleListParamsProvider", "$httpProvider", "$provide", function ($stateProvider, $urlRouterProvider, articleListParamsProvider, $httpProvider, $provide) {

        $urlRouterProvider.otherwise('/');
        //$urlRouterProvider.when(/(.*)\/view\/(.*)/i, ['$match', '$stateParams', '$state', 'articleUrlProvider', 'singleProductModal', '$location',
        //    function ($match, $stateParams, $state, articleUrlProvider, singleProductModal, $location) {
        //        debugger;
        //        var urlData = articleUrlProvider.getUrlSegments();
        //        if (!urlData.itemUrl) {
        //            return false;
        //        }

        //        //var stateData = detailsViewParentState.getStateData($match);
        //        //if (!stateData) {
        //        //    return false;
        //        //}

        //        //if ($state.$current.name != stateData.stateName || !equalForKeys(stateData.stateParams, $stateParams)) {
        //        //    $state.transitionTo(stateData.stateName, stateData.stateParams, { location: false });
        //        //}

        //        singleProductModal.open(urlData.itemUrl);

        //        return true;
        //    }]);

        $stateProvider
          .state('home', {
              url: "/",
              templateUrl: "partials/home.html",
              controller: 'homeController'
          })
          .state('catalogue', {
              abstract: true,
              url: "/catalogue",
              templateUrl: "partials/catalogue.html",
              controller: 'catalogueController',
              resolve: {
                  categoriesTree: ["categoriesDataService", function (categoriesDataService) {
                      return categoriesDataService.getTree();
                  }]
              }
          })
              .state('catalogue.category', {
                  url: "/:categoryUrl",
                  templateUrl: "partials/productsListPlaceholder.html",
                  controller: ["$scope", "listData", "categoriesDataService", "articleListParams", function ($scope, listData, categoriesDataService, articleListParams) {
                      console.log("2: HITTTTTTTTTTTTTTT!!!!!");
                      $scope.articleListParams = articleListParams;
                      $scope.listData = listData;
                      categoriesDataService.setSelectedCategory(listData.category.id);
                  }],
                  resolve: {
                      listData: ["articlesDataService", "$stateParams", function (articlesDataService, $stateParams/*, articleListParams, articleUrlProvider, singleProductModal*/) {
                          //return articlesDataService.getArticlesInCategory(
                          //    $stateParams.categoryUrl,
                          //    articleListParams.filter.text,
                          //    articleListParams.order.by.value,
                          //    articleListParams.order.asc ? 1 : 2);
                          //var urlData = articleUrlProvider.getUrlSegments($stateParams.categoryUrl);

                          //if (urlData.itemUrl) {
                          //    singleProductModal.open(urlData.itemUrl);
                          //}

                          return articlesDataService.getArticlesInCategory(
                              $stateParams.categoryUrl,
                              "",
                              "",
                              1);
                      }]
                  }
              })
                .state('catalogue.category.view', {
                    url: "/view/:itemUrl",
                    onEnter: ["$stateParams", "singleProductModal", function ($stateParams, singleProductModal) {
                        console.log("3: HITTTTTTTTTTTTTTT!!!!!");
                        singleProductModal.open($stateParams.itemUrl);
                    }],
                    data: {
                        isDetailsState: true
                    }
                })
        .state('autherror', {
            url: "/autherror",
            templateUrl: "partials/autherror.html",
            controller: 'autherrorController'
        })
        .state('login', {
            url: "/login?returnData",
            controller: ["$stateParams", "authenticateModal", function ($stateParams, authenticateModal) {
                authenticateModal.open($stateParams.returnData);
            }]
        })
        .state('cart', {
            abstract: true,
            url: "/cart",
            templateUrl: "partials/cart/cart.html",
            controller: 'cartController'
        })
            .state('cart.order', {
                url: "/order",
                templateUrl: "partials/cart/order.html",
                controller: 'cartOrderController',
                resolve: {
                    defaultCoupons: ["ordersDataService", "shoppingCart", function (ordersDataService, shoppingCart) {
                        return ordersDataService.getDefaultCoupons(shoppingCart.getSimpleItems());
                    }]
                }
            })
            .state('cart.address', {
                url: "/address",
                templateUrl: "partials/cart/address.html",
                controller: 'cartAddressController',
                data: {
                    authenticated: true
                },
                resolve: {
                    addressInfo: ["ordersDataService", function (ordersDataService) {
                        return ordersDataService.getAddressInfo();
                    }],
                    defaultCoupons: ["ordersDataService", "shoppingCart", function (ordersDataService, shoppingCart) {
                        return ordersDataService.getDefaultCoupons(shoppingCart.getSimpleItems());
                    }]
                }
            })
            .state('cart.delivery', {
                url: "/delivery",
                templateUrl: "partials/cart/delivery.html",
                controller: 'cartDeliveryController',
                data: {
                    authenticated: true
                },
                resolve: {
                    deliveryMethods: ["ordersDataService", "shoppingCart", function (ordersDataService, shoppingCart) {
                        return ordersDataService.getDeliveryMethods(shoppingCart.hasFreeShippingCoupon());
                    }]
                }
            })
            .state('cart.payment', {
                url: "/payment",
                templateUrl: "partials/cart/payment.html",
                controller: 'cartPaymentController',
                data: {
                    authenticated: true
                },
                resolve: {
                    paymentMethods: ["ordersDataService", "shoppingCart", function (ordersDataService, shoppingCart) {
                        return ordersDataService.getPaymentMethods(shoppingCart.hasFreeShippingCoupon());
                    }]
                }
            })
            .state('cart.confirmation', {
                url: "/confirmation",
                templateUrl: "partials/cart/confirmation.html",
                controller: 'cartConfirmationController',
                data: {
                    authenticated: true
                }
            })
        .state('order-accepted', {
            url: "/order-accepted",
            template: "<div class='view-content alert alert-success' role='alert'><p>Поръчката Ви е приета!</p><p>Можете да следите статуса ѝ в <a ui-sref='account.orders' class='alert-link'>профила</a> cи.</p></div>"
        })
        .state('contact-us', {
            url: "/contact-us",
            templateUrl: "partials/contactUs.html",
            controller: 'contactUsController'
        })
        .state('loyal-customer', {
            url: "/loyal-customer",
            templateUrl: "partials/loyalCustomer.html"
        })
        .state('new', {
            url: "/new",
            templateUrl: "partials/new.html",
            controller: ["$scope", "articlesDataService", function ($scope, articlesDataService) {
                $scope.onCollectionSelected = function (collection) {
                    articlesDataService.getArticlesInCollection(collection.id)
                        .success(function (articlesInCollection) {
                            $scope.productsInCollection = articlesInCollection;
                        })
                    .error(function () {
                        $scope.productsInCollection = null;
                    });
                }
            }]
        })
            .state('new.view', {
                url: "/view/:itemUrl",
                onEnter: ["$stateParams", "singleProductModal", function ($stateParams, singleProductModal) {
                    console.log("3: HITTTTTTTTTTTTTTT!!!!!");
                    singleProductModal.open($stateParams.itemUrl);
                }],
                data: {
                    isDetailsState: true
                }
            })
        .state('discount', {
            url: "/discount",
            templateUrl: "partials/discount.html",
            resolve: {
                discountedArticles: ["articlesDataService", function (articlesDataService) {
                    return articlesDataService.getDiscountedArticles();
                }]
            },
            controller: ["$scope", "discountedArticles", function ($scope, discountedArticles) {
                $scope.articles = discountedArticles;
            }]
        })
            .state('discount.view', {
                url: "/view/:itemUrl",
                onEnter: ["$stateParams", "singleProductModal", function ($stateParams, singleProductModal) {
                    console.log("3: HITTTTTTTTTTTTTTT!!!!!");
                    singleProductModal.open($stateParams.itemUrl);
                }],
                data: {
                    isDetailsState: true
                }
            })
        .state('featured', {
            url: "/featured",
            templateUrl: "partials/featured.html",
            resolve: {
                featuredArticles: ["articlesDataService", function (articlesDataService) {
                    return articlesDataService.getFeaturedArticles();
                }]
            },
            controller: ["$scope", "featuredArticles", function ($scope, featuredArticles) {
                $scope.articles = featuredArticles;
            }]
        })
            .state('featured.view', {
                url: "/view/:itemUrl",
                onEnter: ["$stateParams", "singleProductModal", function ($stateParams, singleProductModal) {
                    console.log("3: HITTTTTTTTTTTTTTT!!!!!");
                    singleProductModal.open($stateParams.itemUrl);
                }],
                data: {
                    isDetailsState: true
                }
            })
        .state('favourites', {
            url: "/favourites",
            templateUrl: "partials/favourites.html",
            resolve: {
                likedArticles: ["articlesDataService", function (articlesDataService) {
                    return articlesDataService.getLikedArticles();
                }]
            },
            controller: ["$scope", "likedArticles", "likesDataService", function ($scope, likedArticles, likesDataService) {
                $scope.likedArticles = likedArticles;

                $scope.articleUnlikedCallback = function (articleIndex, unlikedArticle) {
                    $scope.likedArticles.splice(articleIndex, 1);
                };
            }],
            data: {
                authenticated: true
            }
        })
        .state('search', {
            url: "/search?term",
            templateUrl: "partials/search.html",
            resolve: {
                foundArticles: ["articlesDataService", "$stateParams", function (articlesDataService, $stateParams) {
                    return articlesDataService.findArticles($stateParams.term);
                }]
            },
            controller: ["$scope", "$stateParams", "foundArticles", function ($scope, $stateParams, foundArticles) {
                $scope.searchTerm = $stateParams.term;
                $scope.foundArticles = foundArticles;
            }]
        })
        .state('authenticateExternalLogin', {
            url: "/access_token*tokenParams",
            template: "",
            controller: ["$stateParams", "authenticationStorage", "$window", "authenticationFlow", function ($stateParams, authenticationStorage, $window, authenticationFlow) {
                debugger;
                var token = parseQueryString('access_token' + $stateParams.tokenParams)["access_token"];
                if (token) {
                    authenticationStorage.setAccesToken(token, false);
                }

                var returnData = parseQueryString($window.location.search.substr(1))["rd"];
                if (returnData) {
                    authenticationFlow.goToState(returnData, true);
                    //$window.location.href = initialUrl;
                }
            }]
        })
        .state('account', {
            abstract: true,
            url: "/account",
            templateUrl: "partials/account/account.html",
            controller: 'accountController'
        })
            .state('account.edit', {
                url: "/edit",
                templateUrl: "partials/account/edit.html",
                controller: 'accountEditController',
                data: {
                    authenticated: true
                },
                resolve: {
                    manageInfo: ["accountDataService", "authenticationFlow", "$state", function (accountDataService, authenticationFlow, $state) {
                        debugger;
                        var returnData = authenticationFlow.getReturnData($state.get("account.edit"), null);

                        return accountDataService.getManageInfo(returnData, true);
                    }],
                    addressInfo: ["ordersDataService", function (ordersDataService) {
                        return ordersDataService.getAddressInfo();
                    }]
                }
            })
            .state('account.orders', {
                url: "/orders",
                templateUrl: "partials/account/orders.html",
                controller: 'accountOrdersController',
                data: {
                    authenticated: true
                },
                resolve: {
                    userOrders: ["ordersDataService", function (ordersDataService) {
                        return ordersDataService.my();
                    }]
                }
            })
        .state('manage', {
            abstract: true,
            url: "/manage",
            template: "<div ui-view></div>"
        })
            .state('manage.forgottenPassword', {
                url: "/forgotten-password",
                templateUrl: "partials/account/forgottenPassword.html",
                controller: "forgottenPasswordController"
            })
            .state('manage.reset', {
                url: "/reset-password/{email}?token",
                templateUrl: "partials/account/resetPassword.html",
                controller: "resetPasswordController"
            });

        var order = {
            options: [
                { title: "Дата", value: "dateCreated" },
                { title: "Име", value: "title" },
                { title: "Цена", value: "price" },
                { title: "Харесвания", value: "likesCount" },
                { title: "Поръчвания", value: "ordersCount" }
            ]
        };
        order.by = order.options[0];

        articleListParamsProvider.setOrderDefaults(order);

        $httpProvider.interceptors.push(["$q", "$window", "authenticationStorage", "$injector", function ($q, $window, authenticationStorage, $injector/*, authenticationFlow*/) {
            function onUnauthorized(config) {
                debugger;
                if (!config) {
                    return;
                }

                var requestUrl = config.url;
                var requestUrlSegments = requestUrl.split("/");
                if (requestUrlSegments.length == 0) {
                    return;
                }

                var $state = $injector.get("$state");
                var requestAction = requestUrlSegments[requestUrlSegments.length - 1];
                if (requestAction.toLowerCase() == 'userinfo') {
                    var currentUser = $injector.get("currentUser");
                    currentUser.logoutAndRedirect();

                    return;
                }

                var authenticationFlow = $injector.get("authenticationFlow");

                var returnData = authenticationFlow.getCurrentReturnData();
                $state.transitionTo("login", { returnData: returnData });
            };

            return {
                'request': function (config) {
                    var accessToken = authenticationStorage.getAccesToken();
                    if (accessToken) {
                        config.headers = config.headers || {};

                        config.headers.Authorization = 'Bearer ' + accessToken;
                    }

                    return config || $q.when(config);
                },
                'requestError': function (rejection) {
                    return $q.reject(rejection);
                },
                'response': function (response) {
                    if (response.status === 401) {
                        debugger;
                        onUnauthorized(response.config);
                    }

                    return response || $q.when(response);
                },
                'responseError': function (rejection) {
                    if (rejection.status === 401) {
                        debugger;
                        onUnauthorized(rejection.config);
                    }

                    return $q.reject(rejection);
                }
            };
        }]);

        $provide.decorator('$state', ["$delegate", "$stateParams", function ($delegate, $stateParams) {
            $delegate.forceReload = function () {
                return $delegate.transitionTo($delegate.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            };
            return $delegate;
        }]);

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function (data) {
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function (obj) {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;
                for (name in obj) {
                    value = obj[name];
                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }
                return query.length ? query.substr(0, query.length - 1) : query;
            };
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    }]).run([
  '$rootScope', '$modalStack', 'ngProgressLite', 'currentUser', 'authenticateModal', 'authenticationFlow',
    function ($rootScope, $modalStack, ngProgressLite, currentUser, authenticateModal, authenticationFlow) {
        debugger;
        currentUser.loadData();

        $rootScope.$on('$locationChangeStart', function () {
            var top = $modalStack.getTop();
            if (top) {
                $modalStack.dismiss(top.key);
            }
        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (toState.data) {
                var authenticate = toState.data.authenticated;
                if (authenticate && !currentUser.isAuthenticated) {
                    debugger;
                    event.preventDefault();

                    var returnData = authenticationFlow.getReturnData(toState, toParams);
                    authenticateModal.open(returnData);
                    return;
                }
            }
            
            ngProgressLite.start();
        });

        $rootScope.$on('$stateChangeSuccess', function () {
            ngProgressLite.done();
            ga('send', 'pageview', { 'page': location.pathname + location.search + location.hash});
        });

        $rootScope.$on('$stateChangeError', function () {
            ngProgressLite.done();
        });
    }]);

poshBoutiqueApp.filter('toLocalDate', function () {
    return function (utcDate) {
        return new Date(utcDate + 'Z').getTime();
    }
});