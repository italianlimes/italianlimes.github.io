/**
 * ITALIAN LIMES
 * geometry.js
 * https://github.com/italianlimes
 *
 */




/*
a--------------b
|           /  |
|         /    |
|       /      |
|     /        |
|   /          |
| /            |
d--------------c
*/


function linearInterpolation(a,b,c,d,tx,ty){
  var disa=Math.max(0,(1-distance(tx,ty,0.0,0.0)));
  var disb=Math.max(0,(1-distance(tx,ty,1.0,0.0)));
  var disc=Math.max(0,(1-distance(tx,ty,1.0,1.0)));
  var disd=Math.max(0,(1-distance(tx,ty,0.0,1.0)));
  return new THREE.Vector3(a.x*disa+b.x*disb+c.x*disc+d.x*disd,
                          a.y*disa+b.y*disb+c.y*disc+d.y*disd,
                          a.z*disa+b.z*disb+c.z*disc+d.z*disd);
}

function barycentricInterpolation(a,b,c,d,tx,ty){
  var sumt=0.5;
  var r2=Math.sqrt(2);
  var disa=distance(tx,ty,0.0,0.0);
  var disb=distance(tx,ty,1.0,0.0);
  var disc=distance(tx,ty,1.0,1.0);
  var disd=distance(tx,ty,0.0,1.0);

  var v=new THREE.Vector3();
  if((1-tx)>ty){
    var suma=eulerSum(r2,disd,disb)/sumt;
    var sumb=eulerSum(1,disa,disd)/sumt;
    var sumd=eulerSum(1,disa,disb)/sumt;
    v.x=a.x*suma + b.x*sumb + d.x*sumd;
    v.y=a.y*suma + b.y*sumb + d.y*sumd;
    v.z=a.z*suma + b.z*sumb + d.z*sumd;

  }else{
    var sumc=eulerSum(r2,disd,disb)/sumt;
    var sumb=eulerSum(1,disc,disd)/sumt;
    var sumd=eulerSum(1,disc,disb)/sumt;
    v.x=c.x*sumc + b.x*sumb + d.x*sumd;
    v.y=c.y*sumc + b.y*sumb + d.y*sumd;
    v.z=c.z*sumc + b.z*sumb + d.z*sumd;
  }
  return v;
}

/*function barycentricInterpolationIndexes(tx,ty){
  var sumt=0.5;
  var r2=Math.sqrt(2);
  var v={a:0,b:0,c:0,d:0};
  var disa=distance(tx,ty,0.0,0.0);
  var disb=distance(tx,ty,1.0,0.0);
  var disc=distance(tx,ty,1.0,1.0);
  var disd=distance(tx,ty,0.0,1.0);

  if((1-tx)>ty){
    v.a=eulerSum(r2,disd,disb)/sumt;
    v.b=eulerSum(1,disa,disd)/sumt;
    v.d=eulerSum(1,disa,disb)/sumt;
  }else{
    v.c=eulerSum(r2,disd,disb)/sumt;
    v.b=eulerSum(1,disc,disd)/sumt;
    v.d=eulerSum(1,disc,disb)/sumt;
  }
  return v;
}*/

function barycentricInterpolationIndexes(tx,ty){
  var v={a:0,b:0,c:0,d:0};

    v.a=(1-tx)*(1-ty);
    v.b=tx*(1-ty);
    v.c=tx*ty;
    v.d=(1-tx)*ty ;

  return v;
}


function distance(x1,y1,x2,y2){
  return Math.sqrt(Math.pow(x1-x2,2.0)+Math.pow(y1-y2,2.0));
}

function eulerSum(a,b,c){
  var t=(a+b+c)*(-a+b+c)*(a-b+c)*(a+b-c);
  if(t<0){
    t=0;
  }
  return Math.sqrt(t)/4.0;
}
