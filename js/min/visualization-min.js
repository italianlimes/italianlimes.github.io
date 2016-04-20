function init(){console.log("Started at resolution: "+imgResolution),scene=new THREE.Scene,displacementAlpha=1,renderer=new THREE.WebGLRenderer({antialias:!0}),renderer.setClearColor(4473924),renderer.setPixelRatio(window.devicePixelRatio),renderer.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(renderer.domElement),renderer.domElement.style.display="none",scene.position.set(.05*-imgResolution,.25*-imgResolution,.13*imgResolution),camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,.1,1e10),camera.position.x=0,camera.position.y=.5*imgResolution,window.innerWidth<768&&(camera.position.y+=.8*imgResolution*(1-window.innerWidth/768)),camera.position.z=0,orbit=new THREE.OrbitControls(camera,renderer.domElement),orbit.zoomSpeed=.05,orbit.minDistance=10,orbit.maxDistance=.75*imgResolution,orbit.rotationSpeed=.1,orbit.rotateUp(-1.28),orbit.rotateLeft(-.8),orbit.maxPolarAngle=.9*Math.PI/2,orbit.enableZoom=!0,orbit.autoRotate=!0,orbit.autoRotateSpeed=-1,orbit.update();for(var e=camera.position.y,t=0;gridH>t;t+=2){interpolationIndexes.push(new Array);for(var r=0;gridW>r;r+=2)interpolationIndexes[t].push(barycentricInterpolationIndexes(r/gridW,t/gridH));interpolationIndexes.push(new Array);for(var r=0;gridW>r;r+=2)interpolationIndexes[t+1].push(barycentricInterpolationIndexes((r+1)/gridW,(t+1)/gridH))}stats=new Stats,addSimilaunModel(function(){addSensors(function(){updateMesh(),addBorder(function(){addAmbientLight(),addSky(),window.addEventListener("mousemove",onMouseMove,!1),window.addEventListener("resize",onResize,!1),$(window).bind("tap",onMouseClick),$("canvas").bind("click",onMouseClick),$("#side-menu-borders").on("click",function(e){showView(0)}),$("#side-menu-sensors").on("click",function(e){showView(1)}),render(),$("canvas").fadeIn()})})})}function addControls(e){var t=new dat.GUI;t.add(e,"ambientLight").onChange(function(e){scene.getObjectByName("ambientLight").visible=e}),t.addColor(e,"ambientLightColor").onChange(function(e){scene.remove(scene.getObjectByName("ambientLight"));var t=new THREE.AmbientLight(e);t.name="ambientLight",scene.add(t)}),t.add(e,"directionalLight").onChange(function(e){scene.getObjectByName("dirLight").visible=e}),t.addColor(e,"fogColor").onChange(function(e){console.log(scene.fog.color),scene.fog.color=new THREE.Color(e)}),t.add(e,"fogNear",1,1e3).onChange(function(e){scene.fog.near=e,scene.needsUpdate=!0}),t.add(e,"fogFar",1,2e3).onChange(function(e){scene.fog.far=e,scene.needsUpdate=!0}),t.add(e,"wireframe").onChange(function(e){scene.getObjectByName("similaunMesh").material.wireframe=e}),t.add(e,"wireframeLineWidth",.1,10).onChange(function(e){scene.getObjectByName("similaunMesh").material.wireframeLinewidth=e,scene.getObjectByName("similaunMesh").material.needsUpdate=!0}),t.addColor(e,"meshColor").onChange(function(e){scene.getObjectByName("similaunMesh").material.color=new THREE.Color(e)}),t.add(e,"useTexture").onChange(function(e){e?scene.getObjectByName("similaunMesh").material.map=similaunTexture:scene.getObjectByName("similaunMesh").material.map=null,scene.getObjectByName("similaunMesh").material.needsUpdate=!0}),t.addColor(e,"topColor").onChange(function(e){scene.getObjectByName("sky").material.uniforms.topColor.value=new THREE.Color(parameters.topColor),scene.getObjectByName("sky").material.needsUpdate=!0}),t.addColor(e,"bottomColor").onChange(function(e){scene.getObjectByName("sky").material.uniforms.bottomColor.value=new THREE.Color(parameters.bottomColor),scene.getObjectByName("sky").material.needsUpdate=!0}),t.addColor(e,"sensorsColor").onChange(function(e){sensors[0][0].material.color=new THREE.Color(e)}),t.addColor(e,"borderColor").onChange(function(e){borderMesh.material.color=new THREE.Color(e)}),t.add(e,"rotSpeed",0,.02),t.add(e,"animate"),t.add(e,"noise",0,imgResolution/15),t.add(e,"autorotate");for(var r=document.getElementsByClassName("taller-than-window"),o=0;o<r.length;o++)r[o].onmouseenter=function(){orbit.disableRotate=!0},r[o].onmouseout=function(){orbit.enableRotate=!0};t.close()}function addDirectionalLight(){renderer.shadowMap.enabled=!0;var e=new THREE.DirectionalLight;e.position.copy(new THREE.Vector3(100,100,0)),e.castShadow=!0,e.shadowCameraNear=25,e.shadowCameraFar=200,e.shadowCameraLeft=-150,e.shadowCameraRight=150,e.shadowCameraTop=50,e.shadowCameraBottom=-50,e.shadowMapWidth=2048,e.shadowMapHeight=2048,e.name="dirLight",scene.add(e),mesh.castShadow=!0,mesh.receiveShadow=!0}function addAmbientLight(){var e=new THREE.AmbientLight(parameters.ambientLightColor);e.name="ambientLight",scene.add(e)}function addSky(){var e="varying vec3 vWorldPosition; void main() {vec4 worldPosition = modelMatrix * vec4( position, 1.0 ); vWorldPosition = worldPosition.xyz;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}",t="uniform vec3 topColor;uniform vec3 bottomColor;uniform float offset;uniform float exponent;uniform float opacity;varying vec3 vWorldPosition;void main() {float h = normalize( vWorldPosition + offset ).y;gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ),opacity);}",r={topColor:{type:"c",value:new THREE.Color(parameters.topColor)},bottomColor:{type:"c",value:new THREE.Color(parameters.bottomColor)},offset:{type:"f",value:400},exponent:{type:"f",value:.4},opacity:{type:"f",value:10}};scene.fog=new THREE.Fog(parameters.fogColor,parameters.fogNear,parameters.fogFar),scene.fog.intensity=parameters.fog;var o=new THREE.SphereGeometry(20*imgResolution,32,15),i=new THREE.ShaderMaterial({vertexShader:e,fragmentShader:t,uniforms:r,side:THREE.BackSide}),a=new THREE.Mesh(o,i);a.name="sky",scene.add(a)}function addSimilaunModel(e){var t=new THREE.TextureLoader;t.load("textures/depthMap_scaled"+imgResolution+".jpg",function(r){t.load("textures/colorMap_scaled512.jpg",function(t){zRatio=.06*worldWidth/50,data=generateModel(r.image.width,r.image.height,r),similaunGeometry=new THREE.PlaneBufferGeometry(worldWidth,worldHeight,r.image.width-1,r.image.height-1),similaunGeometry.rotateX(-Math.PI/2);for(var o=similaunGeometry.attributes.position.array,i=0,a=0,n=o.length;n>i;i++,a+=3)o[a+1]=data[i]*zRatio;similaunTexture=t,similaunTexture.wrapS=similaunTexture.wrapT=THREE.RepeatWrapping,similaunTexture.repeat.set(1,1);var s=new THREE.MeshBasicMaterial({map:similaunTexture,wireframe:parameters.wireframe,wireframeLinewidth:parameters.wireframeLineWidth,color:new THREE.Color(parameters.meshColor),shading:THREE.FlatShading});mesh=new THREE.Mesh(similaunGeometry,s),mesh.name="similaunMesh",scene.add(mesh),e()})})}function addSensors(e){sensors=new Array(5),displacements=new Array(7);for(var t=new THREE.BufferGeometry,r=15,o=new Float32Array(3*(r+1)),i=0;r>=i;i++)o[3*i]=Math.sin(2*Math.PI*i/r)*worldWidth/250,o[3*i+1]=0,o[3*i+2]=Math.cos(2*Math.PI*i/r)*worldWidth/250;t.addAttribute("position",new THREE.BufferAttribute(o,3));for(var a=new THREE.LineBasicMaterial({color:16777215,fog:!1,linewidth:2}),n=new Array,s=0;7>s;s++){displacements[s]=new Array(7);for(var d=0;7>d;d++){var l=startx-gridW+s*gridW*.5-d*gridW*.5+3*gridW,m=starty-gridH+d*gridH*.5+s*gridH*.5;s>0&&6>s&&d>0&&6>d&&n.push(m*worldWidth+l),displacements[s][d]=new THREE.Vector3(worldWidth/2*(l-.5*(worldHeight-1))/(.5*worldHeight),data[m*worldWidth+l]*zRatio,worldWidth/2*(m-.5*(worldHeight-1))/(.5*worldHeight))}}for(var s=0;5>s;s++){sensors[s]=new Array(5);for(var d=0;5>d;d++){var a=new THREE.LineBasicMaterial({color:16777215,fog:!1,linewidth:2});sensors[s][d]=new THREE.Line(t,a,THREE.LineStrip),sensors[s][d].position.set(displacements[s+1][d+1].x,displacements[s+1][d+1].y+.05,displacements[s+1][d+1].z),sensors[s][d].sensor_id=5*d+s,scene.add(sensors[s][d])}}var a=new THREE.LineBasicMaterial({color:11184810,fog:!1,linewidth:1,opacity:0,transparent:!0});gridGeometry=new THREE.BufferGeometry;for(var c=[],s=0;5>s;s++)for(var d=0;5>d;d++)4!=s&&(c.push(n[5*d+s]),c.push(n[5*d+s+1])),4!=d&&(c.push(n[5*d+s]),c.push(n[5*(d+1)+s]));gridGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(c),1)),gridGeometry.addAttribute("position",new THREE.BufferAttribute(similaunGeometry.attributes.position.array,3));var h=new THREE.LineSegments(gridGeometry,a);h.name="grid",scene.add(h),h.position.set(0,.05,0),e()}function addBorder(e){$.getJSON("borders/newBorder_256.json",function(t){borderPoints=t,borderVertices=new Float32Array(3*t.length),borderGeometry.addAttribute("position",new THREE.BufferAttribute(borderVertices,3));var r=new THREE.LineBasicMaterial({color:parameters.borderColor,fog:!1,linewidth:parameters.borderLineWidth});borderMesh=new THREE.Line(borderGeometry,r,THREE.LineStrip),borderMesh.position.set(0,.001*imgResolution,0),scene.add(borderMesh),updateBorderPosition(borderPoints,borderGeometry,0,0,worldWidth-1,worldHeight-1);var o=3*Math.round(.23*t.length);p2014=new THREE.Mesh(new THREE.BoxGeometry(.001,.001,.001),new THREE.MeshBasicMaterial({color:65280,transparent:!0,opacity:0})),p2014.position.set(borderGeometry.attributes.position.array[3*o],borderGeometry.attributes.position.array[3*o+1],borderGeometry.attributes.position.array[3*o+2]),scene.add(p2014),$.getJSON("borders/oldBorder_256.json",function(t){var r=new THREE.BufferGeometry,o=new Float32Array(3*t.length);r.addAttribute("position",new THREE.BufferAttribute(o,3));var i=new THREE.LineBasicMaterial({color:new THREE.Color(6211800),fog:!1,linewidth:parameters.borderLineWidth,transparent:!0,opacity:0}),a=new THREE.Line(r,i,THREE.LineStrip);a.position.set(0,1e-4*imgResolution,0),a.name="oldBorder",scene.add(a),updateBorderPosition(t,r,0,0,worldWidth-1,worldHeight-1);var n=3*Math.round(.228*t.length);p1920=new THREE.Mesh(new THREE.BoxGeometry(.001,.001,.001),new THREE.MeshBasicMaterial({color:65280,transparent:!0,opacity:0})),p1920.position.set(r.attributes.position.array[3*n],r.attributes.position.array[3*n+1],r.attributes.position.array[3*n+2]),scene.add(p1920),e()})})}function generateModel(e,t,r){function o(e){var t=document.createElement("canvas");t.width=e.width,t.height=e.height;var r=t.getContext("2d");return r.drawImage(e,0,0),r.getImageData(0,0,e.width,e.height)}function i(e,t,r){var o=4*(t+e.width*r),i=e.data;return{r:i[o],g:i[o+1],b:i[o+2],a:i[o+3]}}for(var a=new Uint8Array(e*t),n=o(r.image),s=i(n,10,10),d=0;t>d;d++)for(var l=0;e>l;l++)a[d*e+l]=i(n,l,d).r;return a}function render(){var e=clock.getDelta(),t=clock.getElapsedTime(),r=Math.max(Math.abs(orbit.getPolarAngle()),Math.abs(orbit.getAzimuthalAngle())),o=Math.abs(camera.position.y-.5*imgResolution);if(animating){if(!animationFinished){var i=.015;orbit.getAzimuthalAngle()>.01&&orbit.rotateLeft(Math.min(i,orbit.getAzimuthalAngle())),orbit.getAzimuthalAngle()<-.01&&orbit.rotateLeft(Math.max(-i,orbit.getAzimuthalAngle())),orbit.getPolarAngle()>.01&&orbit.rotateUp(Math.min(i,orbit.getPolarAngle())),orbit.getPolarAngle()<-.01&&orbit.rotateUp(Math.max(-i,orbit.getPolarAngle())),.01>r&&(animationFinished=!0)}var a=Math.max(0,Math.min(1,2*r-.1));animationFinished&&(a=Math.max(0,Math.min(1,12*r-.2))),mesh.material.transparent=!0,mesh.material.opacity=a,scene.getObjectByName("oldBorder").material.transparent=!0,scene.getObjectByName("oldBorder").material.opacity=1-a,scene.getObjectByName("grid").material.transparent=!0,scene.getObjectByName("grid").material.opacity=1-a,scene.getObjectByName("sky").material.transparent=!0,scene.getObjectByName("sky").material.uniforms.opacity.value=Math.max(a,0),$("#label_1920").css("opacity",1-Math.max(a,0)),$("#label_2014").css("opacity",1-Math.max(a,0)),$("#label").css("opacity",1-Math.max(a,0));var n=toScreenPosition(p1920);$("#label_1920").css("top",n.y-1.2*$("#label_1920").height()),$("#label_1920").css("left",n.x),n=toScreenPosition(p2014),$("#label_2014").css("top",n.y-1.2*$("#label_2014").height()),$("#label_2014").css("left",n.x),animationFinished&&r>.01&&1==a&&(animationFinished=!1,animating=!1,orbit.autoRotate=!0)}var a=Math.min(.99,Math.max(.15,1.5*Math.abs(Math.sin(.2*clock.getElapsedTime()+.3))-.2));if((parameters.animate||.95>a)&&(scene.getObjectByName("similaunMesh").material.color=new THREE.Color(a,a,a),scene.getObjectByName("sky").material.uniforms.topColor.value=new THREE.Color(.4*a,.1+.6*a,.2+.8*a)),stats.update(),orbit.update(),parameters.rotSpeed>0){var s=scene.getObjectByName("dirLight"),d=s.position.x,l=s.position.y;s.position.x=d*Math.cos(parameters.rotSpeed)+l*Math.sin(parameters.rotSpeed),s.position.z=0,s.position.y=l*Math.cos(parameters.rotSpeed)-d*Math.sin(parameters.rotSpeed)}renderer.render(scene,camera),requestAnimationFrame(render)}function updateBorderPosition(e,t,r,o,i,a){var n=Math.sqrt(2),s=.5;if(e){for(var d=similaunGeometry.attributes.position.array,l=t.attributes.position.array,m=0;m<e.length;m+=1){var c=e[m].x*(worldWidth-1),h=e[m].y*(worldHeight-1);if(c>=r&&i>=c&&h>=o&&a>=h){var b=e[m].x-.5,p=e[m].y-.5,g=c-Math.floor(c),u=h-Math.floor(h);c=Math.floor(c),h=Math.floor(h);var w=new THREE.Vector3(d[3*(h*worldWidth+c)],d[3*(h*worldWidth+c)+1],d[3*(h*worldWidth+c)+2]),f=new THREE.Vector3(d[3*(h*worldWidth+c+1)],d[3*(h*worldWidth+c+1)+1],d[3*(h*worldWidth+c+1)+2]),E=new THREE.Vector3(d[3*((h+1)*worldWidth+c+1)],d[3*((h+1)*worldWidth+c+1)+1],d[3*((h+1)*worldWidth+c+1)+2]),T=new THREE.Vector3(d[3*((h+1)*worldWidth+c)],d[3*((h+1)*worldWidth+c)+1],d[3*((h+1)*worldWidth+c)+2]),y=barycentricInterpolation(w,f,E,T,g,u);l[3*m]=y.x,l[3*m+1]=y.y+.05,l[3*m+2]=y.z}}t.attributes.position.needsUpdate=!0}}function onResize(){camera.aspect=window.innerWidth/window.innerHeight,camera.updateProjectionMatrix(),renderer.setSize(window.innerWidth,window.innerHeight)}function onMouseMove(e){var t=new THREE.Vector2;t.x=e.clientX/window.innerWidth*2-1,t.y=2*-(e.clientY/window.innerHeight)+1,raycaster.setFromCamera(t,camera);for(var r=0;r<sensors.length;r++)for(var o=0;o<sensors[r].length;o++)sensors[r][o].material.color.set(16777215);animating||(orbit.autoRotate=!0),parameters.animate=!0;var i=document.getElementById("label");$("#label").css("display","none");for(var r=0;r<sensors.length;r++)for(var a=raycaster.intersectObjects(sensors[r]),n=0;n<a.length;n++){var s=a[n].object.sensor_id;$("#label").css("display","block"),$("#label").html(coordinates[s]),a[n].object.material.color=new THREE.Color(6211800),orbit.autoRotate=!1,parameters.animate=!1}}function onMouseClick(e){showView(parameters.animate?0:1)}function showView(e){0==e&&(console.log("hello"),orbit.autoRotate=!0,orbit.enableZoom=!0,$("#borders").fadeIn(1e3)),1==e&&(orbit.autoRotate=!1,parameters.animate=!1,orbit.enableZoom=!1,animating=!0,$("#borders").fadeOut(1e3))}function updateMesh(){for(var e=similaunGeometry.attributes.position.array,t=startx-gridW+3*gridW,r=starty-gridH,o=.5*gridW,i=0;7>i;i++)for(var a=0;7>a;a++){var n=t+a*o-i*o,s=r+i*o+a*o;a>0&&6>a&&i>0&&6>i&&(displacements[a][i].y=data[s*worldWidth+n]*zRatio,sensors[a-1][i-1].position.y=displacementAlpha*displacements[a][i].y+.002*worldWidth)}for(var i=0;6>i;i++)for(var s=i*o,d=r+s,a=0;6>a;a++)for(var n=a*o,l=t+n,m=0;o>m;m++)for(var c=d+n+m,h=l-s-m,b=0;o>b;b+=1)e[3*(c*worldWidth+h)+1]=displacements[a][i].y*interpolationIndexes[2*m][b].a+displacements[a+1][i].y*interpolationIndexes[2*m][b].b+displacements[a+1][i+1].y*interpolationIndexes[2*m][b].c+displacements[a][i+1].y*interpolationIndexes[2*m][b].d,c++,e[3*(c*worldWidth+h)+1]=displacements[a][i].y*interpolationIndexes[2*m+1][b].a+displacements[a+1][i].y*interpolationIndexes[2*m+1][b].b+displacements[a+1][i+1].y*interpolationIndexes[2*m+1][b].c+displacements[a][i+1].y*interpolationIndexes[2*m+1][b].d,h++;updateBorderPosition(borderPoints,borderGeometry,startx-gridW,starty-gridH,startx-gridW+7*gridW,starty-gridH+7*gridH),similaunGeometry.attributes.position.needsUpdate=!0,gridGeometry.attributes.position.needsUpdate=!0}function toScreenPosition(e){var t=new THREE.Vector3,r=.5*window.innerWidth,o=.5*window.innerHeight;return e.updateMatrixWorld(),t.setFromMatrixPosition(e.matrixWorld),t.project(camera),t.x=t.x*r+r,t.y=-(t.y*o)+o,{x:t.x,y:t.y}}var imgResolution=Math.max(128,Math.min(256,Math.pow(2,Math.floor(Math.log2(window.innerWidth/6))))),borderGeometry=new THREE.BufferGeometry,clock=new THREE.Clock,raycaster=new THREE.Raycaster,sensors,lines,renderer,scene,camera,zRatio,sphereMesh,similaunGeometry,gridGeometry,data,control,orbit,data,borderVertexes,borderPoints,similaunTexture,borderMesh,worldWidth=imgResolution,worldHeight=imgResolution,startx=Math.floor(.435*worldWidth),starty=Math.floor(.288*worldHeight),gridW=2*Math.round(.0274*worldWidth),gridH=gridW;console.log("Grid: "+gridW+" "+gridH);var displacements,displacementAlpha,animationStarted=!1,interpolationIndexes=new Array,animating=!1,coordinates=["ID: 1<br/>LAT: 46,76696678<br/>LON: 10,89216134<br/>ALTITUDE: 3424,1365","ID: 3<br/>LAT: 46,76625583<br/>LON: 10,89358736<br/>ALTITUDE: 3422,6077","ID: 6<br/>LAT: 46,76548033<br/>LON: 10,89457847<br/>ALTITUDE: 3407,8869","ID: 10<br/>LAT: 46,76469523<br/>LON: 10,89566494<br/>ALTITUDE: 3392,6402","ID: 15<br/>LAT: 46,76386116<br/>LON: 10,89681896<br/>ALTITUDE: 3364,8785","ID: 2<br/>LAT: 46,76628987<br/>LON: 10,89112327<br/>ALTITUDE: 3394,6302","ID: 5<br/>LAT: 46,76546685<br/>LON: 10,89230318<br/>ALTITUDE: 3397,2077","ID: 9<br/>LAT: 46,76470423<br/>LON: 10,89343579<br/>ALTITUDE: 3395,8217","ID: 14<br/>LAT: 46,76389149<br/>LON: 10,89454863<br/>ALTITUDE: 3388,7648","ID: 19<br/>LAT: 46,76308884<br/>LON: 10,89566521<br/>ALTITUDE: 3373,321","ID: 4<br/>LAT: 46,76552945<br/>LON: 10,88992797<br/>ALTITUDE: 3379,9924","ID: 8<br/>LAT: 46,76474691<br/>LON: 10,89107509<br/>ALTITUDE: 3382,3593","ID: 13<br/>LAT: 46,76384316<br/>LON: 10,89213326<br/>ALTITUDE: 3383,2618","ID: 18<br/>LAT: 46,76313017<br/>LON: 10,89336190<br/>ALTITUDE: 3382,9956","ID: 22<br/>LAT: 46,76232738<br/>LON: 10,89445073<br/>ALTITUDE: 3376,586","ID: 7<br/>LAT: 46,76482551<br/>LON: 10,88883534<br/>ALTITUDE: 3375,4905","ID: 12<br/>LAT: 46,76396784<br/>LON: 10,89000798<br/>ALTITUDE: 3375,9382","ID: 17<br/>LAT: 46,76316205<br/>LON: 10,89104280<br/>ALTITUDE: 3374,2488","ID: 21<br/>LAT: 46,76232778<br/>LON: 10,89220759<br/>ALTITUDE: 3372,3191","ID: 24<br/>LAT: 46,76151987<br/>LON: 10,89328053<br/>ALTITUDE: 3370,3513","ID: 11<br/>LAT: 46,76400705<br/>LON: 10,88761166<br/>ALTITUDE: 3371,8775","ID: 16<br/>LAT: 46,76318399<br/>LON: 10,88879436<br/>ALTITUDE: 3367,831","ID: 20<br/>LAT: 46,76223966<br/>LON: 10,88991538<br/>ALTITUDE: 3364,1692","ID: 23<br/>LAT: 46,76154790<br/>LON: 10,89103306<br/>ALTITUDE: 3360,6774","ID: 25<br/>LAT: 46,76072612<br/>LON: 10,89202310<br/>ALTITUDE: 3355,2001","ID: 25<br/>LAT: 46,76072612<br/>LON: 10,89202310<br/>ALTITUDE: 3355,2001","ID: 26<br/>LAT: 46,76402293<br/>LON: 10,89198858<br/>ALTITUDE: 3384,3811"];console.log(window.innerWidth);var parameters=new function(){this.ambientLight=!0,this.ambientLightColor="#ffffff",this.directionalLight=!1,this.fog=1,this.fogNear=1,this.fogFar=2*imgResolution,this.rotSpeed=0,this.noise=imgResolution/100,this.meshColor="#ffffff",this.useTexture=!0,this.wireframe=!0,this.topColor="#4499ff",this.bottomColor="#120101",this.fogColor=this.bottomColor,this.animate=!0,this.autorotate=!0,this.sensorsColor="#5EC8D8",this.borderColor="#E5E5E5",this.wireframeLineWidth=.8,this.borderLineWidth=2},p2014,p1920,dis,initialRotation=null,rotationVector,animationFinished=!1;