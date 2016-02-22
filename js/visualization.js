/**
 * ITALIAN LIMES
 * visualization.js
 * https://github.com/italianlimes
 *
 */

var imgResolution=Math.max(32,Math.min(512,Math.pow(2, Math.floor(Math.log2(window.innerWidth/6)))));
var borderGeometry=new THREE.BufferGeometry();
var meshShift=new THREE.Vector3(-imgResolution*0.096,-imgResolution*0.25,imgResolution*0.096);
var clock = new THREE.Clock();
var raycaster = new THREE.Raycaster();
var sensors,renderer,scene,camera,zRatio,sphereMesh,similaunGeometry,data,control,orbit,data,borderVertexes,borderPoints,similaunTexture,borderMesh;
var worldWidth=imgResolution,worldHeight=imgResolution;
var startx=Math.floor(worldWidth*0.486);
var starty=Math.floor(worldHeight*0.320);
var gridW=Math.round(worldWidth*0.030);;
var gridH=Math.round(worldHeight*0.030);
var pts,displacements;

//CONTROLS
var parameters = new function () {
  this.ambientLight = true;
  this.ambientLightColor = "#ffffff";
  this.directionalLight = false;
  this.fog=1.0;
  this.fogNear=1.0;
  this.fogFar=3.0*imgResolution;
  this.rotSpeed = 0.000;
  this.noise=imgResolution/100;
  this.meshColor="#ffffff";
  this.useTexture=true;
  this.wireframe=true;
  this.topColor="#4499ff";
  this.bottomColor="#120101";
  this.fogColor=this.bottomColor;
  this.animate=true;
  this.autorotate=true;
  this.sensorsColor="#ffffff";
  this.borderColor="#ff4444";
  this.lineWidth=1;
};

function init() {
  console.log("Started at resolution: "+imgResolution);
  scene = new THREE.Scene();

  //RENDERER
  renderer = new THREE.WebGLRenderer();//{antialias:true});
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  //CAMERA
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000000000);
  camera.position.x = 0;
  camera.position.y = 0.4*imgResolution;
  camera.position.z = 0;
  orbit = new THREE.OrbitControls(camera);
  orbit.zoomSpeed=0.04;
  orbit.minDistance = 10;
  orbit.maxDistance = 150;
  orbit.rotationSpeed=0.1;
  orbit.rotateUp(-1.3);
  orbit.rotateLeft(1);
  orbit.maxPolarAngle = 0.9 * Math.PI / 2;
  orbit.enableZoom = true;//false;
  orbit.update();

  //STATS
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  document.body.appendChild( stats.domElement );

  addControls(parameters);
  addLights(scene);
  addSimilaunModel(function(){
    addSensors(function(){
      addBorder(function(){
        window.addEventListener( 'mousemove', onMouseMove, false );
        render();
      });
    });
  });
}

function addControls(controlObject) {
  var gui = new dat.GUI();
  gui.add(controlObject, 'ambientLight').onChange(function (e) {
    scene.getObjectByName('ambientLight').visible = e
  });
  gui.addColor(controlObject,'ambientLightColor').onChange(function (e) {
    scene.remove(scene.getObjectByName('ambientLight'));
    var ambientLight = new THREE.AmbientLight(e);//aaaaaa);//0x555555);//dddddd);
    ambientLight.name = 'ambientLight';
    scene.add(ambientLight);
  });
  gui.add(controlObject, 'directionalLight').onChange(function (e) {
    scene.getObjectByName('dirLight').visible = e;
  });
  gui.addColor(controlObject, 'fogColor').onChange(function (e) {
    console.log(scene.fog.color)
    scene.fog.color=new THREE.Color(e);
  });
  gui.add(controlObject, 'fogNear',1,1000).onChange(function (e) {
    scene.fog.near = e;
    scene.needsUpdate=true;
  });
  gui.add(controlObject, 'fogFar',1,2000).onChange(function (e) {
    scene.fog.far = e;
    scene.needsUpdate=true;
  });
  gui.add(controlObject, 'wireframe').onChange(function (e) {
    scene.getObjectByName('similaunMesh').material.wireframe = e;
  });
  gui.add(controlObject, 'lineWidth',0.5,4).onChange(function (e){
    scene.getObjectByName('similaunMesh').material.wireframeLineWidth=Math.round(e);
  });
  gui.addColor(controlObject, 'meshColor').onChange(function (e) {
    scene.getObjectByName('similaunMesh').material.color =new THREE.Color(e);
  });
  gui.add(controlObject, 'useTexture').onChange(function (e) {
    if(!e)scene.getObjectByName('similaunMesh').material.map = null;
    else scene.getObjectByName('similaunMesh').material.map = similaunTexture;
    scene.getObjectByName('similaunMesh').material.needsUpdate=true;
  });

  gui.addColor(controlObject, 'topColor').onChange(function (e) {
    scene.getObjectByName('sky').material.uniforms.topColor.value=new THREE.Color( parameters.topColor );
    scene.getObjectByName('sky').material.needsUpdate=true;
  });
  gui.addColor(controlObject, 'bottomColor').onChange(function (e) {
    scene.getObjectByName('sky').material.uniforms.bottomColor.value=new THREE.Color( parameters.bottomColor );
    scene.getObjectByName('sky').material.needsUpdate=true;
  });
  gui.addColor(controlObject,'sensorsColor').onChange(function (e) {
    for(var i=0;i<sensors.length;i++){
      for(var j=0;j<sensors.length;j++){
        sensors[i][j].material.color=new THREE.Color(e);
      }
    }
  });
  gui.addColor(controlObject,'borderColor').onChange(function (e) {
    borderMesh.material.color=new THREE.Color(e);
  });
  gui.add(controlObject, 'rotSpeed',0,0.02);
  gui.add(controlObject, 'animate');
  gui.add(controlObject, 'noise',0,imgResolution/15);
  gui.add(controlObject, 'autorotate');
  var x = document.getElementsByClassName("taller-than-window");
  for (var i = 0; i < x.length; i++) {
    x[i].onmouseenter=function(){orbit.disableRotate=true;};
    x[i].onmouseout=function(){orbit.enableRotate=true;};
  }
  gui.close();
  /*gui.add(controlObject, 'fog',0,1).onChange(function (e) {
  scene.fog.intensity = e;
  scene.needsUpdate=true;
});*/
}

function addLights(scene) {
  //************DIRECTIONAL LIGHT
  var directionalLight = new THREE.DirectionalLight();
  directionalLight.position.copy(new THREE.Vector3(120, 0, 0));
  directionalLight.castShadow = true;
  directionalLight.shadowCameraNear = 25;
  directionalLight.shadowCameraFar = 200;
  directionalLight.shadowCameraLeft = -150;
  directionalLight.shadowCameraRight = 150;
  directionalLight.shadowCameraTop = 50;
  directionalLight.shadowCameraBottom = -50;
  directionalLight.shadowMapWidth = 2048;
  directionalLight.shadowMapHeight = 2048;
  directionalLight.name = 'dirLight';
  scene.add(directionalLight);
  //************AMBIENT LIGHT
  var ambientLight = new THREE.AmbientLight(parameters.ambientLightColor);//aaaaaa);//0x555555);//dddddd);
  ambientLight.name = 'ambientLight';
  scene.add(ambientLight);
  //************HEMI-SPHERE
  var vertexShader = "varying vec3 vWorldPosition; void main() {vec4 worldPosition = modelMatrix * vec4( position, 1.0 ); vWorldPosition = worldPosition.xyz;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}";
  var fragmentShader = "uniform vec3 topColor;uniform vec3 bottomColor;uniform float offset;uniform float exponent;varying vec3 vWorldPosition;void main() {float h = normalize( vWorldPosition + offset ).y;gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );}";
  var uniforms = {
    topColor: 	 { type: "c", value: new THREE.Color( parameters.topColor ) },
    bottomColor: { type: "c", value: new THREE.Color( parameters.bottomColor) },
    offset:		 { type: "f", value: 400 },
    exponent:	 { type: "f", value: 0.5 }
  };
  scene.fog = new THREE.Fog( parameters.fogColor, parameters.fogNear, 3*imgResolution);
  scene.fog.intensity=parameters.fog;
  var skyGeo = new THREE.SphereGeometry( 30000, 32, 15 );
  var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
  var sky = new THREE.Mesh( skyGeo, skyMat );
  sky.name='sky';
  scene.add( sky );
}

function addSimilaunModel(callback){
  var texloader = new THREE.TextureLoader();
  texloader.load("textures/depthMap_scaled"+imgResolution+".jpg", function(depthTexture) {
    texloader.load("textures/colorMap_scaled512.jpg", function(colorTexture) {
      zRatio=0.06*worldWidth/50.0;
      data = generateModel( depthTexture.image.width, depthTexture.image.height, depthTexture);
      similaunGeometry = new THREE.PlaneBufferGeometry( worldWidth, worldHeight,  depthTexture.image.width - 1,  depthTexture.image.height - 1 );
      similaunGeometry.rotateX( - Math.PI / 2 );

      var vertices = similaunGeometry.attributes.position.array;
      for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
        vertices[ j + 1 ] = data[ i ]*zRatio;
      }

      similaunTexture = colorTexture;
      similaunTexture.wrapS = similaunTexture.wrapT = THREE.RepeatWrapping;
      similaunTexture.repeat.set( 1, 1 );
      var material=new THREE.MeshLambertMaterial( {
        map: similaunTexture,
        wireframe:parameters.wireframe,
        wireframeLinewidth:1.0
        //,
        //color: 0xffffff,
        //	morphTargets: true,
        //	morphNormals: true,
        //	vertexColors: THREE.VertexColors,
        //	shading: THREE.SmoothShading
      } ) ;

      material.shading = THREE.FlatShading;
      mesh = new THREE.Mesh( similaunGeometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow=true;
      mesh.position.x=meshShift.x;
      mesh.position.y=meshShift.y;
      mesh.position.z=meshShift.z;
      mesh.name='similaunMesh';
      scene.add( mesh );
      callback();
    });
  });
}

function addSensors(callback){
  sensors=new Array(5);
  for (var i = 0; i < 5; i++) {
    sensors[i]=new Array(5);
    for (var j = 0; j < 5; j++) {
      var material = new THREE.MeshBasicMaterial({fog:false,color: parameters.sensorsColor});
      var sphereGeom =new  THREE.SphereGeometry(worldWidth/250.0, 0.5, 0.5);
      sensors[i][j] = new THREE.Mesh(sphereGeom, material);
      sensors[i][j].position.set(0, -worldWidth/200, 0);
      sensors[i][j].castShadow = true;
      sensors[i][j].receiveShadow = false;
      scene.add(sensors[i][j]);
    }
  }
  pts=new Array(7);
  displacements=new Array(7);
  for (var x = 0; x < 7; x++){
    pts[x]=new Array(7);
    displacements[x]=new Array(7);
    for (var y = 0; y < 7; y++){
      var tx=startx-gridW+x*gridW;
      var ty=starty-gridH+y*gridH;
      displacements[x][y]=new THREE.Vector3(0,0,0);
      pts[x][y]=new THREE.Vector2(tx,ty);
    }
  }
  callback();
}


function addBorder(callback){
  $.getJSON("border.json", function(vertexPositions) {
    var g=new THREE.BufferGeometry();
    borderPoints=vertexPositions;
    borderVertices = new Float32Array( vertexPositions.length * 3 ); // three components per vertex
    borderGeometry.addAttribute( 'position', new THREE.BufferAttribute( borderVertices, 3 ) );
    var material = new THREE.LineBasicMaterial( { color: 0xff0000,fog:false, linewidth:3, linecap:'square', linejoin:'miter' } );
    borderMesh= new THREE.Line( borderGeometry, material, THREE.LineStrip );//new THREE.LineSegments( geometry, material );
    borderMesh.position.x=meshShift.x;borderMesh.position.y=meshShift.y;borderMesh.position.z=meshShift.z;//5;
    scene.add(borderMesh);
    updateBorderPosition(0,0,worldWidth-1.0,worldHeight-1.0);
    callback();
  });
}

function generateModel( width, height ,imgTexture) {
  function getImageData( image ) {
    var canvas = document.createElement( 'canvas' );
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext( '2d' );
    context.drawImage( image, 0, 0 );
    return context.getImageData( 0, 0, image.width, image.height );
  }
  function getPixel( imagedata, x, y ) {
    var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
    return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };
  }
  var data = new Uint8Array( width*height);
  var imagedata = getImageData( imgTexture.image );
  var color = getPixel( imagedata, 10, 10 );
  for(var y=0;y<height;y++)
  for(var x=0;x<width;x++)
  data[y*width+x]=getPixel( imagedata, x, y ).r;
  return data;
}

function render() {
  if(parameters.autorotate)orbit.rotateLeft(-0.0021);
  orbit.update();
  stats.update();
  var delta = clock.getDelta(),
  time = clock.getElapsedTime();
  if(parameters.animate){
    var vertices = similaunGeometry.attributes.position.array;
    var t_startx=startx-gridW;
    var t_starty=starty-gridH;
    var lw=worldWidth;
    //SIMULATING SENSOR DISPLACEMENT
    for (var x = 0; x < 7; x++) {
      for (var y = 0; y < 7; y++) {
        var tx=t_startx+x*gridW;
        var ty=t_starty+y*gridH;
        if(x>0 && x<6 && y>0 && y<6){
          displacements[x][y]=new THREE.Vector3(Math.sin(time+x+y-1)*parameters.noise*0.5,
          Math.sin(time+x+y-1)*parameters.noise,Math.sin(time+x+y-1)*parameters.noise*0.5);
          sensors[x-1][y-1].position.set(
            (worldWidth/2)*(tx-(worldHeight-1)*0.5)/(worldHeight*0.5)+displacements[x][y].x+meshShift.x,
            data[(ty*lw+tx)]*zRatio+displacements[x][y].y+meshShift.y,
            (worldWidth/2)*(ty-(worldHeight-1)*0.5)/(worldHeight*0.5)+displacements[x][y].z+meshShift.z);
            vertices[(ty*lw+tx)*3] = (worldWidth/2)*(tx-worldWidth*0.5)/(worldWidth*0.5)+displacements[x][y].x;
            vertices[(ty*lw+tx)*3+1] = data[(ty*lw+tx)]*zRatio+displacements[x][y].y;
            vertices[(ty*lw+tx)*3+2] =(worldWidth/2)*(ty-worldWidth*0.5)/(worldWidth*0.5)+displacements[x][y].z;
          }

      }
    }
    //UPDATING SENSOR POSITION
  /*  for (var x = 0; x < 5; x++) {
      for (var y = 0; y < 5; y++) {
        var tx=t_startx+(x+1)*gridW;
        var ty=t_starty+(y+1)*gridH;
        sensors[x][y].position.set(
          (worldWidth/2)*(tx-(worldHeight-1)*0.5)/(worldHeight*0.5)+displacements[x+1][y+1].x+meshShift.x,
          data[(ty*lw+tx)]*zRatio+displacements[x+1][y+1].y+meshShift.y,
          (worldWidth/2)*(ty-(worldHeight-1)*0.5)/(worldHeight*0.5)+displacements[x+1][y+1].z+meshShift.z);
          vertices[(ty*lw+tx)*3] = (worldWidth/2)*(tx-worldWidth*0.5)/(worldWidth*0.5)+displacements[x+1][y+1].x;
          vertices[(ty*lw+tx)*3+1] = data[(ty*lw+tx)]*zRatio+displacements[x+1][y+1].y;
          vertices[(ty*lw+tx)*3+2] =(worldWidth/2)*(ty-worldWidth*0.5)/(worldWidth*0.5)+displacements[x+1][y+1].z;
        }
      }*/
      //INTERPOLATE THE GRID ELEMENTS POSITION
      for (var x = 0; x < 6; x++) {
        for (var y = 0; y < 6; y++) {
          var tx=t_startx+x*gridW;
          var ty=t_starty+y*gridH;
          for(var xx=tx;xx<tx+gridW;xx++){
            for(var yy=ty;yy<ty+gridH;yy++){
              var displacement=linearInterpolation(displacements[x][y],displacements[x+1][y],displacements[x+1][y+1],displacements[x][y+1],(xx-tx)/gridW,(yy-ty)/gridH);
              vertices[(yy*worldWidth+xx)*3+1] = data[(yy*worldWidth+xx)]*zRatio+displacement.y;
              vertices[(yy*worldWidth+xx)*3] = (worldWidth/2)*(xx-(worldWidth-1)*0.5)/(worldWidth*0.5)+displacement.x;
              vertices[(yy*worldWidth+xx)*3+2] = (worldWidth/2)*(yy-(worldHeight-1)*0.5)/(worldHeight*0.5)+displacement.z;
            }
          }
        }
      }
      updateBorderPosition(t_startx,t_starty,t_startx+gridW*7,t_starty+gridH*7);
      similaunGeometry.attributes.position.needsUpdate = true;
    }
    //MODEL ROTATION
    if(parameters.rotSpeed>0){
      var light = scene.getObjectByName('dirLight');
      var x = light.position.x;
      var z = light.position.y;
      light.position.x = x * Math.cos(parameters.rotSpeed) + z * Math.sin(parameters.rotSpeed);
      light.position.z =0;
      light.position.y = z * Math.cos(parameters.rotSpeed) - x * Math.sin(parameters.rotSpeed);
      //sphereMesh.position.set(light.position.x, light.position.y, light.position.z);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  function updateBorderPosition(startx,starty,endx,endy){
    var r2=Math.sqrt(2);
    var sumt=0.5;
    if(borderPoints){
      var vertices = similaunGeometry.attributes.position.array;
      for (var i = 0; i < borderPoints.length; i+=1) {
        var x=borderPoints[i].x*(worldWidth-1.0);//Math.round((borderPoints[i].x)*(worldWidth-1))//;
        var y=borderPoints[i].y*(worldHeight-1.0);//Math.round(borderPoints[i].y*(worldHeight-1));//;
        if(x>=startx && x<=endx &&
          y>=starty && y<=endy){
            var xx=borderPoints[i].x-0.5;
            var yy=borderPoints[i].y-0.5;
            var tx=x-Math.floor(x);
            var ty=y-Math.floor(y);
            x=Math.floor(x);
            y=Math.floor(y);
            var a=new THREE.Vector3(vertices[((y)*worldWidth+x)*3],vertices[((y)*worldWidth+x)*3+1],vertices[((y)*worldWidth+x)*3+2]);
            var b=new THREE.Vector3(vertices[((y)*worldWidth+x+1)*3],vertices[((y)*worldWidth+x+1)*3+1],vertices[((y)*worldWidth+x+1)*3+2]);
            var c=new THREE.Vector3(vertices[((y+1)*worldWidth+x+1)*3],vertices[((y+1)*worldWidth+x+1)*3+1],vertices[((y+1)*worldWidth+x+1)*3+2]);
            var d=new THREE.Vector3(vertices[((y+1)*worldWidth+x)*3],vertices[((y+1)*worldWidth+x)*3+1],vertices[((y+1)*worldWidth+x)*3+2]);
            var v=barycentricInterpolation(a,b,c,d,tx,ty);
            borderVertices[i*3]=v.x;//+xx*(worldWidth);;//v.x;//(borderPoints[i].x-0.5)*worldWidth;
            borderVertices[i*3+1]=v.y+0.05;//vertices[(y*worldWidth+x)*3+1];//v.y;
            borderVertices[i*3+2]=v.z;//yy*worldWidth;//(borderPointss[i].y-0.5)*worldWidth;
          }
        }
        borderGeometry.attributes.position.needsUpdate = true;
      }
  }

  function onMouseMove( event ) {
    var mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    for(var v=0;v<sensors.length;v++)
    for(var q=0;q<sensors[v].length;q++)
    sensors[v][q].material.color.set( 0xffffff);
    for(var v=0;v<sensors.length;v++){
      var intersects = raycaster.intersectObjects( sensors[v] );
      for (var t=0;t<intersects.length;t++) {
        intersects[t].object.material.color=new THREE.Color(0xff0000);
      }
    }
  }
