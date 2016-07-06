(function() {
    var app = angular.module('graph-app', ['ngMaterial', 'ngResource', 'ui.bootstrap']);


    // app.directive('autoComplete', function($timeout) {
    //     return function(scope, iElement, iAttrs) {
    //             iElement.autocomplete({
    //                 source: scope[iAttrs.uiItems],
    //                 select: function() {
    //                     $timeout(function() {
    //                       iElement.trigger('input');
    //                     }, 0);
    //                 }
    //             });
    //     };
    // });






    // app.factory("States", function() {
    //     var states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

    //     return states;

    // });

    app.service('graphService', ['$resource', function($resource) {
        this.getResource = function(url) {
            return $resource(url);
        }
        this.init = function() {

            var url = 'http://suprabha.me/js/stock_min.json';
            gResource = this.getResource(url);

            // // This is how do you search track given its title name
            var entry = gResource.query(function() {
                console.log("JSON Responce is =====>" + entry);
                // x.getAvg();
                // x.getMark();


            });
            return entry;
        }
        this.val = this.init();

        this.returnJSON = function() {
            return this.val;
        }

        this.getAvg = function() {
            console.log('het');
            data = this.returnJSON();
            console.log(data);
            var secAvg = {};
            angular.forEach(data, function(val) {
                if (val.Sector in secAvg) {
                    // yes => add total & increase counter
                    sectorVal = secAvg[val.Sector];
                    if ('Profit Margin' in val) {
                        sectorVal["Total Profit Margin"] = sectorVal["Total Profit Margin"] + val["Profit Margin"];
                    }
                    sectorVal["count"] = sectorVal["count"] + 1;
                    console.log("Sector is => " + val.Sector);
                    console.log("Profit Margin=>" + sectorVal["Total Profit Margin"]);

                } else {
                    var sectorVal = {};
                    sectorVal["count"] = 1;
                    sectorVal["Total Profit Margin"] = val["Profit Margin"];
                    console.log("Sector is => " + val.Sector);
                    console.log("Profit Margin =>" + val["Profit Margin"]);
                    secAvg[val.Sector] = sectorVal;
                    // no => add new key value pair make counter 1
                }

            });
            console.log("This is what have you doooonnnneneeeeee ===>" + JSON.stringify(secAvg));
            var r = {};
            var result = []
            for (var sec in secAvg) {
                r = {};
                console.log("Sector = > " + sec);
                console.log("For Loop => " + JSON.stringify(secAvg[sec]));
                r["avg"] = secAvg[sec]["Total Profit Margin"] / secAvg[sec]["count"];
                r["sec"] = sec;
                // r[sec]= secAvg[sec]["Total Profit Margin"] / secAvg[sec]["count"];
                result.push(r);

                // secAvg[sec]
                // var value = myDictionary[key];
                // Use `key` and `value`
            }
            console.log("result ===>" + JSON.stringify(result));
            return result;

        }

        // for the pie chart
        this.getRandomColor = function() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        this.getMark = function() {
            console.log('mark');
            data = this.returnJSON();
            console.log(data);
            var indMark = {};
            angular.forEach(data, function(val) {
                if (val.Industry in indMark) {
                    console.log("under if");
                    // yes => add total & increase counter
                    industryVal = indMark[val.Industry];
                    if ('Market Cap' in val) {
                        industryVal["Total Market Cap"] = industryVal["Total Market Cap"] + val["Market Cap"];
                    }
                    // sectorVal["count"] = sectorVal["count"] + 1;
                    console.log("industry is => " + val.Industry);
                    console.log("market cap=>" + industryVal["Total Market Cap"]);

                } else {
                    console.log("under else");
                    var industryVal = {};
                    // sectorVal["count"] = 1;
                    industryVal["Total Market Cap"] = val["Market Cap"];
                    indMark[val.Industry] = industryVal;
                    console.log("industryy is => " + val.Industry);
                    console.log("market capp =>" + val["Market Cap"]);
                    // secAvg[val.Sector] = sectorVal;
                    // no => add new key value pair make counter 1
                }

            });
            console.log("This is what have you doooone ===>" + JSON.stringify(indMark));
            var r1 = {};
            var result1 = []
            for (var ind in indMark) {
                r1 = {};
                // console.log("Industry = > " + ind);
                // console.log("Market Cap => " + JSON.stringify(indMark[ind]));
                r1["title"] = ind;
                r1["value"] = indMark[ind]["Total Market Cap"];
                r1["color"] = this.getRandomColor();
                // r[sec]= secAvg[sec]["Total Profit Margin"] / secAvg[sec]["count"];
                result1.push(r1);

                // secAvg[sec]
                // var value = myDictionary[key];
                // Use `key` and `value`
            }
            console.log("result ===>" + JSON.stringify(result1));
            // console.log("result ===>" + result1);
            return result1;
        }

    }]);
    app.controller('graphController', ['$resource', 'graphService', function($resource, graphService, States) {
        var gc = this;
        gc.width = 600;
        gc.height = 350;
        gc.yAxis = 'Avg Profit Margin';
        gc.xAxis = 'Sector';
        gc.details = false;
        // gc.selected = undefined;

        // gc.states = States;
gc.selected = undefined;
gc.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois'];

        
        // gc.piedata = JSON.stringify(graphService.getMark());
        // gc.piedata = [{ "title": "Medical Laboratories & Research", "value": 17356.8, "color": "#B67A1B" }, { "title": "Aluminum", "value": 14358.279999999999, "color": "#C02617" }, { "title": "Exchange Traded Fund", "value": null, "color": "#A6129B" }, { "title": "Asset Management", "value": 7593.410000000001, "color": "#DC32FB" }, { "title": "Life Insurance", "value": 85.92, "color": "#D2A3B0" }, { "title": "Rental & Leasing Services", "value": 2319.04, "color": "#83EC60" }, { "title": "Semiconductor - Integrated Circuits", "value": 381.69, "color": "#461225" }, { "title": "General Building Materials", "value": 1495.92, "color": "#08CE60" }, { "title": "Auto Parts Stores", "value": 7251.42, "color": "#69003E" }, { "title": "Electronic Equipment", "value": 470732.83, "color": "#B31B38" }, { "title": "REIT - Office", "value": 1274.14, "color": "#FAAF62" }, { "title": "Gold", "value": 18193.16, "color": "#415F22" }, { "title": "Oil & Gas Drilling & Exploration", "value": 649.96, "color": "#47A862" }, { "title": "Air Services, Other", "value": 950.69, "color": "#7AF6FD" }, { "title": "Diagnostic Substances", "value": 792.8900000000001, "color": "#3562D8" }, { "title": "Industrial Equipment & Components", "value": 57631.73, "color": "#B5D3A6" }, { "title": "Drug Manufacturers - Major", "value": 76799.25, "color": "#B38F6F" }, { "title": "Drugs Wholesale", "value": 15785.44, "color": "#1EA3B9" }, { "title": "Regional - Mid-Atlantic Banks", "value": 462.48, "color": "#96A0F3" }, { "title": "Education & Training Services", "value": 63.46, "color": "#FA8CAB" }, { "title": "Business Services", "value": 15833.41, "color": "#A4F17B" }, { "title": "Trucking", "value": 814.5, "color": "#F509E6" }, { "title": "Auto Dealerships", "value": 1554.96, "color": "#514FF0" }, { "title": "Biotechnology", "value": 3850.59, "color": "#12B3AA" }, { "title": "Medical Appliances & Equipment", "value": 60547.6, "color": "#10BB4E" }, { "title": "REIT - Diversified", "value": 425.91999999999996, "color": "#6C39DF" }, { "title": "Internet Information Providers", "value": 95.92, "color": "#CB0B2A" }, { "title": "Beverages - Brewers", "value": 116372.76, "color": "#74C9F5" }, { "title": "Recreational Vehicles", "value": 733.84, "color": "#80B5A0" }, { "title": "REIT - Residential", "value": 3500.73, "color": "#1E0104" }, { "title": "Application Software", "value": 32224, "color": "#2651CB" }, { "title": "Office Supplies", "value": 660.02, "color": "#9955BA" }, { "title": "Property & Casualty Insurance", "value": 41137.619999999995, "color": "#FAD083" }, { "title": "Chemicals - Major Diversified", "value": 540.15, "color": "#C70DAA" }, { "title": "Regional - Southeast Banks", "value": 8.39, "color": "#EE7675" }, { "title": "Aerospace/Defense Products & Services", "value": 60.24, "color": "#648718" }, { "title": "Closed-End Fund - Debt", "value": 1697.95, "color": "#5005C0" }, { "title": "Specialized Health Services", "value": 2224.78, "color": "#572B91" }, { "title": "Industrial Metals & Minerals", "value": 1932.58, "color": "#C4119B" }, { "title": "Technical & System Software", "value": 12135.61, "color": "#56845D" }, { "title": "Semiconductor Equipment & Materials", "value": 254.14, "color": "#F3772B" }, { "title": "Technical Services", "value": 2873.49, "color": "#F1F0EA" }, { "title": "Oil & Gas Refining & Marketing", "value": 9101.15, "color": "#8042EB" }, { "title": "Information Technology Services", "value": 52159.979999999996, "color": "#542384" }, { "title": "Regional - Southwest  Banks", "value": 106.24, "color": "#307A81" }, { "title": "Diversified Machinery", "value": 158.20000000000002, "color": "#455D5C" }, { "title": "Drugs - Generic", "value": 21581.6, "color": "#BD6556" }, { "title": "Research Services", "value": 689.85, "color": "#D6DFF7" }, { "title": "Semiconductor - Specialized", "value": 174.52, "color": "#91D163" }, { "title": "Housewares & Accessories", "value": 46.75, "color": "#E7107E" }, { "title": "Drug Delivery", "value": 78.78, "color": "#444C0B" }, { "title": "Trucks & Other Vehicles", "value": 156.56, "color": "#31D7AE" }, { "title": "Healthcare Information Services", "value": 40.57, "color": "#948562" }, { "title": "Property Management", "value": 406.92, "color": "#D86781" }, { "title": "Pollution & Treatment Controls", "value": 503.7, "color": "#0A26B6" }, { "title": "Electric Utilities", "value": 90.43, "color": "#D6EC90" }, { "title": "Printed Circuit Boards", "value": 15564.04, "color": "#902040" }, { "title": "Long-Term Care Facilities", "value": 58.93, "color": "#42F0A9" }, { "title": "Farm Products", "value": 27509.52, "color": "#804C5A" }, { "title": "Business Software & Services", "value": 36703.64, "color": "#2EB68D" }, { "title": "Security & Protection Services", "value": 9274.58, "color": "#881A4B" }, { "title": "Communication Equipment", "value": 1391.31, "color": "#BD401C" }, { "title": "Home Health Care", "value": 271.67, "color": "#CF22DB" }, { "title": "Closed-End Fund - Equity", "value": 1212.35, "color": "#14FC7F" }];
        gc.data = graphService.returnJSON();
        this.barGraph = function() {
            gc.avgProfit = graphService.getAvg();

            gc.max = 0;
            console.log("!!!! => " + gc.avgProfit);
            for (var i = 0; i < gc.avgProfit.length; i++) {
                if (gc.avgProfit[i].avg > gc.max) {
                    gc.max = gc.avgProfit[i].avg;
                }
            }
            console.log("GC Max =>" + gc.max)
        }
        gc.first = true;
        this.pieChart = function() {
            if (gc.first) {
                gc.first = false;
                gc.pieChartval = graphService.getMark();
                gc.piedata = jQuery.parseJSON(JSON.stringify(gc.pieChartval));
                // console.log("piedata => "+ piedata);
                // console.log("TYPE>>>>",jQuery.type(gc.piedata));
                jQuery("#pieChart").drawPieChart(gc.piedata);
            }
        }

        // this.dummy = function() {
        //     console.log("dummmy is working");
        // }
        this.search = function() {
                console.log("under search");
                console.log(gc.states);
                // gc.details = true;
                console.log("Keyword is => " + gc.searchKeyword);
                angular.forEach(gc.data, function(val) {
                    if (gc.searchKeyword == val.Company) {
                        gc.result = val;
                        gc.details = true;
                    }

                });
            }
            //   gc.selected = undefined;
            // gc.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois'];


    }]); //closing controller



    app.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
        $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
        $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
        $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
    });
})();
