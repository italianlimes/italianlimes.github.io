/**
 * ITALIAN LIMES
 * data.js
 * https://github.com/italianlimes
 *
 */


var dataUrl="http://italianlimes-angeloseme.rhcloud.com/api/logs";
$.get(dataUrl, function( sensor_data ) {
  data=sensor_data.sensor_data;
  for(var d=0;d<data.length;d++){
    //  console.log(key);
    $('#container').append($("<h3>").text(data[d].date));
    var table=$('<table>');
    var items =data[d].data;
    var lastItemY=0;
    $.each(items, function(i, item) {
      var row = $("<tr />")
      table.prepend(row);
      row.append($("<td>" + item.sensor_id + "</td>"));
      row.append($("<td>" +new Date(item.date).toLocaleTimeString() + "</td>"));
      row.append($("<td>" + item.altitude + "</td>"));
      /*if (i==0)
        lastItemY=item.altitude;
      var variance=item.altitude-lastItemY;
      if(variance>0)variance="+"+variance;
      row.append($("<td>" + variance + "</td>"));
      lastItemY=item.altitude;
      */
      row.append($("<td>" + item.message + "</td>"));
    });
    table.prepend("<tr><th>From</th><th>Time</th><th>Altitude</th><th>Raw Message</th></tr>");//<th>Variance</th>
  //  new Tablesort(table.get(0));
    $('#container').append(table);
  }
});
