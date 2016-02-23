/**
 * ITALIAN LIMES
 * data.js
 * https://github.com/italianlimes
 *
 */
var dataUrl="http://italianlimes-angeloseme.rhcloud.com/api/data";
$.get( "http://italianlimes-angeloseme.rhcloud.com/api/data", function( data ) {
  for(var key in data){
    //  console.log(key);
    $('#container').append($("<h3>").text(key));
    var table=$('<table>');
    var items =data[key];
    var lastItemY=0;
    $.each(items, function(i, item) {
      var row = $("<tr />")
      table.prepend(row); 
      row.append($("<td>" + item.from + "</td>"));
      row.append($("<td>" + new Date(item.x).toUTCString() + "</td>"));
      row.append($("<td>" + item.y + "</td>"));
      if (i==0)lastItemY=item.y;
      var variance=item.y-lastItemY;
      if(variance>0)variance="+"+variance;
      row.append($("<td>" + variance + "</td>"));
      lastItemY=item.y;
    });
    table.prepend("<tr><th>From</th><th>Time</th><th>Altitude</th><th>Variance</th></tr>");
    $('#container').append(table);
  }
});
