/**
* ITALIAN LIMES
* data.js
* https://github.com/italianlimes
*
*/
var dataUrl="http://italianlimes-angeloseme.rhcloud.com/api/altitude?from=2016-04-01";
d3.json(dataUrl, function(data) {


    for(var i=0;i<data.sensor_data.length;i++){
    var sensor_id=data.sensor_data[i]._id;
    var sensor_data = MG.convert.date(data.sensor_data[i].data, 'date',"%Y-%m-%dT%H:%M:%S.%LZ");
    //var data = MG.convert.date(scope.rates.data, 'date', '%Y-%m-%d');
    var now=new Date();
    $('#container').append("<div class='chart' id='"+sensor_id+"'></div>");
    var now=new Date();
    MG.data_graphic({
      title: "sensor "+sensor_id,
      data: data.sensor_data[i].data,
      //missing_is_hidden: true,
      title_y_position:40,
      area:true,
      utc_date:true,
      yax_count:4,
      min_y:3150,
      max_y:3400,
      min_x:new Date("2016-04-01T06:00:00.000Z"),
      max_x:now,
      interpolate:false,
      full_width:true,
      height: 200,
      target: document.getElementById(sensor_id),
      x_accessor: 'date',
      y_accessor: 'altitude'
    });

  }
  $(".spinner").fadeOut(function (){
    $("#container").fadeIn();
  });
});
