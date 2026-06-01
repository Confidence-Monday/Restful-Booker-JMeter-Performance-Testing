/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.76647501105705, "KoPercent": 2.2335249889429454};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8319327731092437, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8562664329535495, 500, 1500, "04 - Create Booking"], "isController": false}, {"data": [0.8280224929709465, 500, 1500, "07 - Partial Update"], "isController": false}, {"data": [0.8291479820627803, 500, 1500, "05 - Get Specific Booking"], "isController": false}, {"data": [0.8094804010938924, 500, 1500, "06 - Update Booking"], "isController": false}, {"data": [0.764946764946765, 500, 1500, "01 - Health Check"], "isController": false}, {"data": [0.872431506849315, 500, 1500, "03 - Get All Bookings"], "isController": false}, {"data": [0.8621848739495799, 500, 1500, "02 - Get Auth Token"], "isController": false}, {"data": [0.8344497607655502, 500, 1500, "08 - Delete Booking"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9044, 202, 2.2335249889429454, 783.2769792127381, 195, 23737, 255.0, 1420.0, 3346.0, 10323.399999999965, 30.188628860783155, 24.813305598949203, 10.790715240016956], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["04 - Create Booking", 1141, 0, 0.0, 654.5617879053459, 195, 17117, 253.0, 1290.7999999999997, 2546.3999999999924, 7025.959999999981, 4.068156779132246, 3.808614989383929, 2.20490919181484], "isController": false}, {"data": ["07 - Partial Update", 1067, 58, 5.435801312089972, 763.3767572633542, 197, 20001, 255.0, 1446.6000000000004, 3642.599999999994, 7981.679999999986, 3.9810313370967196, 3.607339624273844, 1.3827333026143473], "isController": false}, {"data": ["05 - Get Specific Booking", 1115, 27, 2.42152466367713, 779.0690582959643, 196, 18515, 255.0, 1441.8, 3289.0000000000027, 10477.079999999862, 4.024253798679035, 3.6357893819702602, 1.0727207925794926], "isController": false}, {"data": ["06 - Update Booking", 1097, 55, 5.013673655423883, 867.6216955332741, 197, 20648, 259.0, 1468.0000000000014, 3664.8999999999937, 12745.039999999994, 4.012274561008884, 3.5994952710845576, 2.1745643177761687], "isController": false}, {"data": ["01 - Health Check", 1221, 1, 0.0819000819000819, 1141.4963144963147, 196, 23737, 268.0, 1957.6, 4342.899999999985, 17482.879999999976, 4.099722991689751, 3.003946581465626, 1.0587829472005372], "isController": false}, {"data": ["03 - Get All Bookings", 1168, 0, 0.0, 621.4606164383554, 197, 16164, 252.0, 1104.2000000000016, 2306.949999999998, 8251.029999999999, 4.095558352940351, 2.978199391977895, 1.1838723363968202], "isController": false}, {"data": ["02 - Get Auth Token", 1190, 0, 0.0, 717.6117647058815, 197, 18264, 253.0, 1266.900000000001, 3393.6000000000004, 9561.799999999974, 4.0860894407208, 3.0793480369602237, 1.3673390651611086], "isController": false}, {"data": ["08 - Delete Booking", 1045, 61, 5.837320574162679, 697.1722488038264, 195, 20002, 249.0, 1304.9999999999998, 3025.4999999999977, 9013.279999999999, 3.9223340327223997, 2.8762047922852005, 1.1288879666920648], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["403/Forbidden", 172, 85.14851485148515, 1.9018133569217162], "isController": false}, {"data": ["404/Not Found", 27, 13.366336633663366, 0.29854046881910656], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 3, 1.4851485148514851, 0.033171163202122954], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9044, 202, "403/Forbidden", 172, "404/Not Found", 27, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 3, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["07 - Partial Update", 1067, 58, "403/Forbidden", 57, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["05 - Get Specific Booking", 1115, 27, "404/Not Found", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["06 - Update Booking", 1097, 55, "403/Forbidden", 55, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["01 - Health Check", 1221, 1, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["08 - Delete Booking", 1045, 61, "403/Forbidden", 60, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
