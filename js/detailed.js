/**
 * ITALIAN LIMES
 * data.js
 * https://github.com/italianlimes
 *
 */

 var dataUrl="http://italianlimes-angeloseme.rhcloud.com/api/detailed";
 var start=0;
 var count=10;
 var processing=false;
update();


//var dataUrl="http://italianlimes-angeloseme.rhcloud.com/api/logs";
function update(){
var url=dataUrl+"?start="+start+"&limit="+count;
console.log(url);
$.get(url, function( sensor_data ) {
  data=sensor_data.sensor_data;

  for(var d=0;d<data.length;d++){
    //  console.log(key);
    $('#container').append($("<h3>").text(data[d].date));
    var table=$('<table style="display:none;">');
    var items =data[d].data;
    var lastItemY=0;
    var keys=new Array();
    $.each(items, function(i, item) {
      var row = $("<tr />")
      table.prepend(row);
      keys=new Array();
      for (var k in item){
        keys.push(k);
        row.append($("<td>" + item[k] + "</td>"));
      }
    });
    var header="<tr>";
    for (var k in keys){
      header+="<th>"+keys[k]+"</th>"
    }
    header+="</tr>";
    table.prepend(header);
    $('#container').append(table);
  //  table.hide();
    table.fadeIn();
  }
  if(data.length<count)
    $('.spinner').fadeOut();
  else{
    processing=false;
    start+=count;
  }
});
}
$('#container').fadeIn();
$(window).scroll(function() {
  if($(window).scrollTop() + $(window).height() > $(document).height()-400) {
    if(!processing){
      processing=true;
      update();
   }
   }
});
