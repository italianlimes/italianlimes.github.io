/**
* ITALIAN LIMES
* data.js
* https://github.com/italianlimes
*
*/
var dataUrl="http://italianlimes-angeloseme.rhcloud.com/api/data/";
d3.json(dataUrl, function(data) {
    for(var i=0;i<data.sensor_data.length;i++){
    var sensor_id=data.sensor_data[i]._id;
    var sensor_data = MG.convert.date(data.sensor_data[i].data, 'date',"%Y-%m-%dT%H:%M:%S.%LZ");
    //var data = MG.convert.date(scope.rates.data, 'date', '%Y-%m-%d');


    $('#container').append("<div class='chart' id='"+sensor_id+"'></div>");
    MG.data_graphic({
      title: sensor_id,
      data: data.sensor_data[i].data,
      //missing_is_hidden: true,
      area:true,
      utc_date:true,
      yax_count:4,
      min_y:50,
      full_width:true,
      height: 200,
      target: document.getElementById(sensor_id),
      x_accessor: 'date',
      y_accessor: 'altitude'
    });
  }
});
