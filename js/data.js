/**
 * ITALIAN LIMES
 * data.js
 * https://github.com/italianlimes
 *
 */
var dataUrl="http://italianlimes-angeloseme.rhcloud.com/api/data";
$.get( "http://italianlimes-angeloseme.rhcloud.com/api/data", function( data ) {
  //console.log(data);
  for(var key in data){
  //  console.log(key);
    $('#container').append($("<h3>").text(key));
    var div = document.createElement('div');
    div.id = key;
    div.className = 'sensorVis';
    var items =data[key];
    //console.log(items);
    var dataset = new vis.DataSet(items);
    var options = {
      start: '2016-02-22',
      end: new Date(),
      height:'150px',
      min:'2016-01-01',
      max:'2016-12-31',
    //  showCustomTime:true
    dataAxis: {
        left: {
            range: {min:355000, max:365000}
        }
    }
    };
    var graph2d = new vis.Graph2d(div, dataset, options);
    document.getElementById('container').appendChild(div);
  }
});
