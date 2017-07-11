$(document).ready(function() {
  'use strict';
      //alert('Hamit Taylan Yuce Test');
   var mainURL = "https://rata.digitraffic.fi/api/v1/live-trains?station=SLO";
   var trainNumbers; // shows the train numbers such as 965, 1002


    // train numbers are fetched here
    $.getJSON( mainURL,function( data ) {

        var len = data.length;
        trainNumbers = new Array(len);

        for(var i = 0 ; i < len ; i++)
        {
           trainNumbers[i] = data[i].trainNumber;

        }
         showInfos();
    });


    // this function returns the current date
    function currentDate()
    {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        }

        if(mm<10) {
            mm = '0'+mm
        }
        today = yyyy + '-' + mm + '-' + dd;

         return today;
     }

   // this function fetches the data regarding the specific train number
     function fetchDailyData(trainNumber)
     {
         var date = currentDate();
         var URL = "https://rata.digitraffic.fi/api/v1/compositions/"+trainNumber+"?departure_date="+date;

         $.getJSON( URL, function( data ) {

            var trainType = data.trainType;
            var departureDate = data.departureDate;

            var journeySections = data.journeySections;
            var len = journeySections.length;

            for(var i = 0; i < len ; i++)
            {

                var dep = journeySections[i].beginTimeTableRow.stationShortCode;
                var depDate = journeySections[i].beginTimeTableRow.scheduledTime;
                var depTime = depDate.substring(11,19);
                var end = journeySections[i].endTimeTableRow.stationShortCode;
                var endDate = journeySections[i].endTimeTableRow.scheduledTime;
                var endTime = endDate.substring(11,19);
                var locoType = journeySections[i].locomotives[0].locomotiveType+" "+journeySections[i].locomotives[0].powerType;

                var wagons = journeySections[0].wagons;
                var wagonsLen = wagons.length;
                var wagonNames = wagons[0].wagonType;

                for(var k = 1; k < wagonsLen ; k++)
                {
                      wagonNames +=   ", "+ wagons[k].wagonType ;
                }

                var totalLength = journeySections[i].totalLength;
                var maximumSpeed = journeySections[i].maximumSpeed;
             }
             var str = '<div class="col-lg-4 col-md-6  col-sm-12">	<div class="thumbnail">'+
                             trainType +" "+ trainNumber+ '<br>'+
                             '<span style="color:red;">'+dep+'</span>'+">"+'<span style="color:green;">'+end+'</span>'+'<br>'+
                             "Locomotive: " +  locoType+ '<br>'+
                             "Wagons: "+   wagonNames + " (" +  totalLength + " meters)"+'<br>'+
                             "Max speed: "+  maximumSpeed + "KM/h"+'<br>'+
                             '<span style="color:red;">'+depTime+'</span>'+">"+'<span style="color:green;">'+endTime+'</span>'+'<br>'+
                             departureDate+'<br>'+
                        '</div></div>';
                $(".row").append(str);

         });
      }

    // this function shows all the data
    function showInfos()
    {
        var len = trainNumbers.length;
        for(var i = 0 ; i < len ; i++)
        {
          fetchDailyData(trainNumbers[i]);
        }

    }


});
