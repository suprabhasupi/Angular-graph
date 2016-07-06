(function() {
    var app = angular.module('graph-app', ['ngMaterial', 'ngResource', 'ui.bootstrap']);


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

        this.search = function() {
                console.log("under search");
                console.log(gc.data);
                // gc.details = true;
                console.log("Keyword is => " + gc.searchKeyword);
                angular.forEach(gc.data, function(val) {
                    if (gc.searchKeyword == val.Company) {
                        gc.result = val;
                        gc.details = true;
                    }

                });
            }
           

    }]); //closing controller



    app.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
        $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
        $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
        $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
    });
})();
