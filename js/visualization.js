/**
 * ITALIAN LIMES
 * visualization.js
 * https://github.com/italianlimes
 *
 */
var imgResolution = Math.max(128, Math.min(256, Math.pow(2, Math.floor(Math.log2(window.innerWidth / 6)))));
var borderGeometry = new THREE.BufferGeometry();
var clock = new THREE.Clock();
var raycaster = new THREE.Raycaster();
var sensors, lines, renderer, scene, camera, zRatio, sphereMesh, similaunGeometry, gridGeometry, data, control, orbit, data, borderVertexes, borderPoints, similaunTexture, borderMesh;
var worldWidth = imgResolution,
    worldHeight = imgResolution;
var startx = Math.floor(worldWidth * 0.435);
var starty = Math.floor(worldHeight * 0.288);
var gridW = Math.round(worldWidth * 0.0274) * 2;;
var gridH = gridW;
console.log("Grid: " + gridW + " " + gridH);
var displacements, displacementAlpha;
var animationStarted = false;
var interpolationIndexes = new Array();
var animating = false;
var currentView=0;
var coordinates = [
  {id:1, latitude: "46.76696678", longitude: "10.89216134", altitude: 3424.14},
  {id:3, latitude: "46.76625583", longitude: "10.89358736", altitude: 3422.61},
  {id:6, latitude: "46.76548033", longitude: "10.89457847", altitude: 3407.89},
  {id:10, latitude: "46.76469523", longitude: "10.89566494", altitude: 3392.64},
  {id:15, latitude: "46.76386116", longitude: "10.89681896", altitude: 3364.88},
  {id:2, latitude: "46.76628987", longitude: "10.89112327", altitude: 3394.63},
  {id:5, latitude: "46.76546685", longitude: "10.89230318", altitude: 3397.21},
  {id:9, latitude: "46.76470423", longitude: "10.89343579", altitude: 3395.82},
  {id:14, latitude: "46.76389149", longitude: "10.89454863", altitude: 3388.76},
  {id:19, latitude: "46.76308884", longitude: "10.89566521", altitude: 3373.32},
  {id:4, latitude: "46.76552945", longitude: "10.88992797", altitude: 3379.99},
  {id:8, latitude: "46.76474691", longitude: "10.89107509", altitude: 3382.36},
  {id:13, latitude: "46.76384316", longitude: "10.89213326", altitude: 3383.26},
  {id:18, latitude: "46.76313017", longitude: "10.89336190", altitude: 3383.00},
  {id:22, latitude: "46.76232738", longitude: "10.89445073", altitude: 3376.59},
  {id:7, latitude: "46.76482551", longitude: "10.88883534", altitude: 3375.49},
  {id:12, latitude: "46.76396784", longitude: "10.89000798", altitude: 3375.94},
  {id:17, latitude: "46.76316205", longitude: "10.89104280", altitude: 3374.25},
  {id:21, latitude: "46.76232778", longitude: "10.89220759", altitude: 3372.32},
  {id:24, latitude: "46.76151987", longitude: "10.89328053", altitude: 3370.35},
  {id:11, latitude: "46.76400705", longitude: "10.88761166", altitude: 3371.88},
  {id:16, latitude: "46.76318399", longitude: "10.88879436", altitude: 3367.83},
  {id:20, latitude: "46.76223966", longitude: "10.88991538", altitude: 3364.17},
  {id:23, latitude: "46.76154790", longitude: "10.89103306", altitude: 3360.68},
  {id:25, latitude: "46.76072612", longitude: "10.89202310", altitude: 3355.20}];

//CONTROLS
console.log(window.innerWidth);
var parameters = new function() {
    this.ambientLight = true;
    this.ambientLightColor = "#ffffff";
    this.directionalLight = false;
    this.fog = 1.0;
    this.fogNear = 1.0;
    this.fogFar = 2.0 * imgResolution;
    this.rotSpeed = 0.000;
    this.noise = imgResolution / 100;
    this.meshColor = "#ffffff";
    this.useTexture = true;
    this.wireframe = true;
    this.topColor = "#000000";
    this.bottomColor = "#000000";
    this.fogColor = this.bottomColor;
    this.animate = true;
    this.autorotate = true;
    this.sensorsColor = "#5EC8D8"; // $il-blue defined in _variables.scss
    this.borderColor = "#E5E5E5";
    this.wireframeLineWidth = 0.8;
    this.borderLineWidth = 2;
};

function init() {
    console.log("Started at resolution: " + imgResolution);
    scene = new THREE.Scene();
    displacementAlpha = 1;
    //RENDERER
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    //renderer.setClearColor(0x000000, 1.0);
    renderer.setClearColor(0x444444);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'none';
    scene.position.set(-imgResolution * 0.05, -imgResolution * 0.25, imgResolution * 0.13);

    //CAMERA
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000000000);
    camera.position.x = 0;
    camera.position.y = 0.6 * imgResolution;
    if (window.innerWidth < 768) camera.position.y += imgResolution * 1.2 * (1 - (window.innerWidth / 768.0));
    camera.position.z = 0;
    orbit = new THREE.OrbitControls(camera, renderer.domElement);
    //camera.lookAt(new THREE.Vector3(0,0,0));
    orbit.zoomSpeed = 0.05;
    orbit.minDistance = 10;
    orbit.maxDistance = imgResolution*1;
    orbit.rotationSpeed = 0.1;
    orbit.rotateUp(-1.28);
    orbit.rotateLeft(-0.8);
    orbit.maxPolarAngle = 0.9 * Math.PI / 2;
    orbit.enableZoom = true; //false;
    orbit.autoRotate = true;
    orbit.autoRotateSpeed = -1;
    orbit.update();
    var initialDistance = camera.position.y;
    //INTERPOLATION INDEXES (OPTIMISATION)
    for (var yt = 0; yt < gridH; yt += 2) {
        interpolationIndexes.push(new Array());
        for (var xt = 0; xt < gridW; xt += 2) {
            interpolationIndexes[yt].push(barycentricInterpolationIndexes(xt / gridW, yt / gridH));
        }
        interpolationIndexes.push(new Array());
        for (var xt = 0; xt < gridW; xt += 2) {
            interpolationIndexes[yt + 1].push(barycentricInterpolationIndexes((xt + 1) / gridW, (yt + 1) / gridH));
        }
    }

    //STATS
    stats = new Stats();
    //  stats.domElement.style.position = 'absolute';
    //  stats.domElement.style.top = '0px';
    //  document.body.appendChild( stats.domElement );

    //addControls(parameters);
    addSimilaunModel(function() {
        addSensors(function() {
            updateMesh();
            addBorder(function() {
                addAmbientLight();
                //addDirectionalLight();
                addSky();
                window.addEventListener('mousemove', onMouseMove, false);
                window.addEventListener('resize', onResize, false);
                //  window.addEventListener( 'click', onMouseClick, false );
                $(window).bind("tap", onMouseClick);
                //$("canvas").bind("click", onMouseClick);
                $('#narrative-btn-2').on('click', function(event){
                  showView(1);
                });
                $('#narrative-btn-3').on('click', function(event){
                  showView(0);
                });
                $('#narrative-btn-4').on('click', function(event){
                  showView(2);
                });
                $('#narrative-btn-5').on('click', function(event){
                  showView(1);
                });
                render();
                $("canvas").fadeIn();
            });
        });
    });
}

function addControls(controlObject) {
    var gui = new dat.GUI();
    gui.add(controlObject, 'ambientLight').onChange(function(e) {
        scene.getObjectByName('ambientLight').visible = e
    });
    gui.addColor(controlObject, 'ambientLightColor').onChange(function(e) {
        scene.remove(scene.getObjectByName('ambientLight'));
        var ambientLight = new THREE.AmbientLight(e); //aaaaaa);//0x555555);//dddddd);
        ambientLight.name = 'ambientLight';
        scene.add(ambientLight);
    });
    gui.add(controlObject, 'directionalLight').onChange(function(e) {
        scene.getObjectByName('dirLight').visible = e;
    });
    gui.addColor(controlObject, 'fogColor').onChange(function(e) {
        console.log(scene.fog.color)
        scene.fog.color = new THREE.Color(e);
    });
    gui.add(controlObject, 'fogNear', 1, 1000).onChange(function(e) {
        scene.fog.near = e;
        scene.needsUpdate = true;
    });
    gui.add(controlObject, 'fogFar', 1, 2000).onChange(function(e) {
        scene.fog.far = e;
        scene.needsUpdate = true;
    });
    gui.add(controlObject, 'wireframe').onChange(function(e) {
        scene.getObjectByName('similaunMesh').material.wireframe = e;
    });
    gui.add(controlObject, 'wireframeLineWidth', 0.1, 10).onChange(function(e) {
        scene.getObjectByName('similaunMesh').material.wireframeLinewidth = e;
        scene.getObjectByName('similaunMesh').material.needsUpdate = true;
    });
    gui.addColor(controlObject, 'meshColor').onChange(function(e) {
        scene.getObjectByName('similaunMesh').material.color = new THREE.Color(e);
    });
    gui.add(controlObject, 'useTexture').onChange(function(e) {
        if (!e) scene.getObjectByName('similaunMesh').material.map = null;
        else scene.getObjectByName('similaunMesh').material.map = similaunTexture;
        scene.getObjectByName('similaunMesh').material.needsUpdate = true;
    });
    gui.addColor(controlObject, 'topColor').onChange(function(e) {
        scene.getObjectByName('sky').material.uniforms.topColor.value = new THREE.Color(parameters.topColor);
        scene.getObjectByName('sky').material.needsUpdate = true;
    });
    gui.addColor(controlObject, 'bottomColor').onChange(function(e) {
        scene.getObjectByName('sky').material.uniforms.bottomColor.value = new THREE.Color(parameters.bottomColor);
        scene.getObjectByName('sky').material.needsUpdate = true;
    });
    gui.addColor(controlObject, 'sensorsColor').onChange(function(e) {
        sensors[0][0].material.color = new THREE.Color(e);
    });
    gui.addColor(controlObject, 'borderColor').onChange(function(e) {
        borderMesh.material.color = new THREE.Color(e);
    });
    gui.add(controlObject, 'rotSpeed', 0, 0.02);
    gui.add(controlObject, 'animate');
    gui.add(controlObject, 'noise', 0, imgResolution / 15);
    gui.add(controlObject, 'autorotate');
    var x = document.getElementsByClassName("taller-than-window");
    for (var i = 0; i < x.length; i++) {
        x[i].onmouseenter = function() {
            orbit.disableRotate = true;
        };
        x[i].onmouseout = function() {
            orbit.enableRotate = true;
        };
    }
    gui.close();
    /*gui.add(controlObject, 'fog',0,1).onChange(function (e) {
    scene.fog.intensity = e;
    scene.needsUpdate=true;
  });*/
}

function addDirectionalLight() {
    //************DIRECTIONAL LIGHT
    renderer.shadowMap.enabled = true;

    var directionalLight = new THREE.DirectionalLight();
    directionalLight.position.copy(new THREE.Vector3(100, 100, 0));
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
    mesh.castShadow = true;
    mesh.receiveShadow = true;
}

function addAmbientLight() {
    //************AMBIENT LIGHT
    var ambientLight = new THREE.AmbientLight(parameters.ambientLightColor); //aaaaaa);//0x555555);//dddddd);
    ambientLight.name = 'ambientLight';
    scene.add(ambientLight);
}

function addSky() {
    //************HEMI-SPHERE
    var vertexShader = "varying vec3 vWorldPosition; void main() {vec4 worldPosition = modelMatrix * vec4( position, 1.0 ); vWorldPosition = worldPosition.xyz;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}";
    var fragmentShader = "uniform vec3 topColor;uniform vec3 bottomColor;uniform float offset;uniform float exponent;uniform float opacity;varying vec3 vWorldPosition;void main() {float h = normalize( vWorldPosition + offset ).y;gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ),opacity);}";
    var uniforms = {
        topColor: {
            type: "c",
            value: new THREE.Color(parameters.topColor)
        },
        bottomColor: {
            type: "c",
            value: new THREE.Color(parameters.bottomColor)
        },
        offset: {
            type: "f",
            //value: 100
            value: 400
        },
        exponent: {
            type: "f",
            value: 0.4
        },
        opacity: {
            type: "f",
            //value: 1.0
            value: 10.0
        }
    };
    scene.fog = new THREE.Fog(parameters.fogColor, parameters.fogNear, parameters.fogFar);
    scene.fog.intensity = parameters.fog;
    var skyGeo = new THREE.SphereGeometry(imgResolution * 20, 32, 15);
    var skyMat = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        side: THREE.BackSide
    });
    var sky = new THREE.Mesh(skyGeo, skyMat);
    sky.name = 'sky';
    scene.add(sky);
}

function addSimilaunModel(callback) {
    var texloader = new THREE.TextureLoader();
    texloader.load("textures/depthMap_scaled" + imgResolution + ".jpg", function(depthTexture) {
        texloader.load("textures/colorMap_original.jpg", function(colorTexture) {
            zRatio = 0.06 * worldWidth / 50.0;
            data = generateModel(depthTexture.image.width, depthTexture.image.height, depthTexture);
            similaunGeometry = new THREE.PlaneBufferGeometry(worldWidth, worldHeight, depthTexture.image.width - 1, depthTexture.image.height - 1);
            similaunGeometry.rotateX(-Math.PI / 2);

            var vertices = similaunGeometry.attributes.position.array;

            for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
                vertices[j + 1] = data[i] * zRatio;
            }

            similaunTexture = colorTexture;
            similaunTexture.wrapS = similaunTexture.wrapT = THREE.RepeatWrapping;
            similaunTexture.repeat.set(1, 1);
            var material = new THREE.MeshBasicMaterial({
                map: similaunTexture,
                wireframe: parameters.wireframe,
                wireframeLinewidth: parameters.wireframeLineWidth,
                color: new THREE.Color(parameters.meshColor),
                shading: THREE.FlatShading
                    //,
                    //color: 0xffffff,
                    //	morphTargets: true,
                    //	morphNormals: true,
                    //	vertexColors: THREE.VertexColors,
                    //	shading: THREE.SmoothShading
            });
            mesh = new THREE.Mesh(similaunGeometry, material);

            //  originalMeshVertices = similaunGeometry.attributes.position.array.slice();
            mesh.name = 'similaunMesh';
            scene.add(mesh);
            callback();
        });
    });
}

function addSensors(callback) {
    sensors = new Array(5);
    displacements = new Array(7);
    /*
    var circleGeometry = new THREE.BufferGeometry();;
    var circleRes = 15.0;
    var circleVertices = new Float32Array((circleRes + 1) * 3); // three components per vertex
    for (var a = 0; a <= circleRes; a++) {
        circleVertices[a * 3] = Math.sin(Math.PI * 2.0 * a / circleRes) * worldWidth / 250.0;
        circleVertices[a * 3 + 1] = 0;
        circleVertices[a * 3 + 2] = Math.cos(Math.PI * 2.0 * a / circleRes) * worldWidth / 250.0;
    }
    circleGeometry.addAttribute('position', new THREE.BufferAttribute(circleVertices, 3));
    var material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        fog: false,
        linewidth: 2
    });
    */

    var indices = new Array();
    for (var x = 0; x < 7; x++) {
        displacements[x] = new Array(7);
        for (var y = 0; y < 7; y++) {
            //  var tx=startx-gridW+x*gridW;
            //  var ty=starty-gridH+y*gridH;
            var tx = startx - gridW + x * gridW * 0.5 - y * gridW * 0.5 + 3 * gridW;
            var ty = starty - gridH + y * gridH * 0.5 + x * gridH * 0.5;
            //console.log(tx+" "+ty+" "+worldWidth);
            if (x > 0 && x < 6 && y > 0 && y < 6)
                indices.push(ty * worldWidth + tx);
            displacements[x][y] = new THREE.Vector3(
                (worldWidth / 2) * (tx - (worldHeight - 1) * 0.5) / (worldHeight * 0.5),
                (data[(ty * worldWidth + tx)] * zRatio),
                (worldWidth / 2) * (ty - (worldHeight - 1) * 0.5) / (worldHeight * 0.5));
        }
    }

    for (var x = 0; x < 5; x++) {
        sensors[x] = new Array(5);
        for (var y = 0; y < 5; y++) {
           var material = new THREE.MeshBasicMaterial({fog:false,color: parameters.sensorsColor,transparent:true,opacity:0});
            var sphereGeom = new  THREE.SphereGeometry(worldWidth/250.0, 15,15);// Remove center vertex
            var mesh=new THREE.Mesh(sphereGeom, material);
            mesh.scale.set(1,0.1,1);
            /*
            var material = new THREE.LineBasicMaterial({
                color: 0xffffff,
                fog: false,
                linewidth: 2
            });
            */
            sensors[x][y] = mesh;//new THREE.Line(circleGeometry, material, THREE.LineStrip); ////
            sensors[x][y].position.set(displacements[x + 1][y + 1].x, displacements[x + 1][y + 1].y + 0.05, displacements[x + 1][y + 1].z);
            sensors[x][y].sensor_id = y * 5 + x;
            scene.add(sensors[x][y]);
            //  geometry.vertices.push(displacements[x+1][y+1]);

        }
    }
    var material = new THREE.LineBasicMaterial({
        color: 0xaaaaaa,
        fog: false,
        linewidth: 1,
        opacity: 0,
        transparent: true
    });

    gridGeometry = new THREE.BufferGeometry();
    var indices_array = [];

    for (var x = 0; x < 5; x++) {
        for (var y = 0; y < 5; y++) {
            if (x != 4) {
                indices_array.push(indices[y * 5 + x]);
                indices_array.push(indices[y * 5 + x + 1]);
            }
            if (y != 4) {
                indices_array.push(indices[y * 5 + x]);
                indices_array.push(indices[(y + 1) * 5 + x]);
            }
        }
    }
    gridGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices_array), 1));
    gridGeometry.addAttribute('position', new THREE.BufferAttribute(similaunGeometry.attributes.position.array, 3));


    var t = new THREE.LineSegments(gridGeometry, material);
    t.name = 'grid';
    scene.add(t);
    t.position.set(0, 0.05, 0);
    callback();
}

var p2016, p1920;

function addBorder(callback) {
    $.getJSON("borders/newBorder_256.json", function(vertexPositions) {
        borderPoints = vertexPositions;
        borderVertices = new Float32Array(vertexPositions.length * 3); // three components per vertex
        borderGeometry.addAttribute('position', new THREE.BufferAttribute(borderVertices, 3));
        var material = new THREE.LineBasicMaterial({
            color:  new THREE.Color(0xff3232),
            fog: false,
            linewidth: parameters.borderLineWidth
        });
        borderMesh = new THREE.Line(borderGeometry, material, THREE.LineStrip); //new THREE.LineSegments( geometry, material );
        borderMesh.position.set(0, imgResolution * 0.001, 0);
        scene.add(borderMesh);
        updateBorderPosition(borderPoints, borderGeometry, 0, 0, worldWidth - 1.0, worldHeight - 1.0);

        var index = Math.round(vertexPositions.length * 0.23) * 3.0;
        p2016 = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0
        }));
        p2016.position.set(borderGeometry.attributes.position.array[index * 3.0],
            borderGeometry.attributes.position.array[index * 3.0 + 1],
            borderGeometry.attributes.position.array[index * 3.0 + 2]);
        scene.add(p2016);

        $.getJSON("borders/oldBorder_256.json", function(vertexPositions) {
            var oldBorderGeometry = new THREE.BufferGeometry();
            var borderVts = new Float32Array(vertexPositions.length * 3); // three components per vertex
            oldBorderGeometry.addAttribute('position', new THREE.BufferAttribute(borderVts, 3));
            var material = new THREE.LineBasicMaterial({
                //color: new THREE.Color(0x4444ff),
                color: new THREE.Color(0xffffff),
                fog: false,
                linewidth: parameters.borderLineWidth,
                transparent: true,
                opacity: 0
            });
            var oldBorderMesh = new THREE.Line(oldBorderGeometry, material, THREE.LineStrip); //new THREE.LineSegments( geometry, material );
            oldBorderMesh.position.set(0, imgResolution * 0.0001, 0);
            oldBorderMesh.name = 'oldBorder';
            scene.add(oldBorderMesh);
            updateBorderPosition(vertexPositions, oldBorderGeometry, 0, 0, worldWidth - 1.0, worldHeight - 1.0);
            var index = Math.round(vertexPositions.length * 0.228) * 3.0;
            p1920 = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), new THREE.MeshBasicMaterial({
                color: new THREE.Color(0xff3232),
                transparent: true,
                opacity: 0
            }));
            p1920.position.set(oldBorderGeometry.attributes.position.array[index * 3.0],
                oldBorderGeometry.attributes.position.array[index * 3.0 + 1],
                oldBorderGeometry.attributes.position.array[index * 3.0 + 2]);
            scene.add(p1920);
            callback();
        });
    });
}

function generateModel(width, height, imgTexture) {
    function getImageData(image) {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height);
    }

    function getPixel(imagedata, x, y) {
        var position = (x + imagedata.width * y) * 4,
            data = imagedata.data;
        return {
            r: data[position],
            g: data[position + 1],
            b: data[position + 2],
            a: data[position + 3]
        };
    }
    var data = new Uint8Array(width * height);
    var imagedata = getImageData(imgTexture.image);
    var color = getPixel(imagedata, 10, 10);
    for (var y = 0; y < height; y++)
        for (var x = 0; x < width; x++)
            data[y * width + x] = getPixel(imagedata, x, y).r;
    return data;
}
var dis;
var initialRotation = null,
    rotationVector;
var animationFinished = false;

function render() {
    //  console.log(camera.position.y);
    var delta = clock.getDelta(),
        time = clock.getElapsedTime();
    var maxDis = Math.max(Math.abs(orbit.getPolarAngle()), Math.abs(orbit.getAzimuthalAngle()));
    var yAlpha = Math.abs(camera.position.y - 0.5 * imgResolution);
    /*if (animating) {
        if (!animationFinished) {
            var r = 0.015;
            if (orbit.getAzimuthalAngle() > 0.01) {
                orbit.rotateLeft(Math.min(r, orbit.getAzimuthalAngle()));
            }
            if (orbit.getAzimuthalAngle() < -0.01) {
                orbit.rotateLeft(Math.max(-r, orbit.getAzimuthalAngle()));
            }

            if (orbit.getPolarAngle() > 0.01) {
                orbit.rotateUp(Math.min(r, orbit.getPolarAngle()));
            }
            if (orbit.getPolarAngle() < -0.01) {
                orbit.rotateUp(Math.max(-r, orbit.getPolarAngle()));
            }
              //  console.log(orbit.getZoomLevel());
            if (maxDis < 0.01)
                animationFinished = true;

        }
        var maxDis = Math.max(Math.abs(orbit.getPolarAngle()), Math.abs(orbit.getAzimuthalAngle()));

        var t = Math.max(0, Math.min(1, maxDis * 2 - 0.1)); //Math.max(0.0001,1-Math.max(Math.min(clock.getElapsedTime()-delay,2.0),0)/1.0)

        if (animationFinished)
            t = Math.max(0, Math.min(1, maxDis * 12 - 0.2));
        mesh.material.transparent = true;
        if(t-0.2<0){
          var tt=Math.min(1,Math.max(0,-(t-0.2)/0.2));
          mesh.material.wireframe=false;
          mesh.material.opacity = tt*0.8;
        }else{
          mesh.material.wireframe=true;
          mesh.material.opacity = Math.max(0,t-0.2);
        }


        //mesh.material.opacity=Math.max(0.0000,1-Math.max(Math.min(clock.getElapsedTime()-delay,3.0),0)/3.0);
        scene.getObjectByName('oldBorder').material.transparent = true;
        scene.getObjectByName('oldBorder').material.opacity = 1 - t;
        scene.getObjectByName('grid').material.transparent = true;
        scene.getObjectByName('grid').material.opacity = 1 - t;
        scene.getObjectByName('sky').material.transparent = true;
        scene.getObjectByName('sky').material.uniforms.opacity.value = Math.max(t, 0);
        $("#label_1920").css('opacity', 1 - Math.max(t, 0));
        $("#label_2016").css('opacity', 1 - Math.max(t, 0));
        $("#label").css('opacity', 1 - Math.max(t, 0));
        var vector = toScreenPosition(p1920);
        $("#label_1920").css('top', vector.y - $("#label_1920").height() * 1.2);
        $("#label_1920").css('left', vector.x);
        vector = toScreenPosition(p2016);
        $("#label_2016").css('top', vector.y - $("#label_2016").height() * 1.2);
        $("#label_2016").css('left', vector.x);
        if (animationFinished && maxDis > 0.01 && t == 1) {
            animationFinished = false;
            animating = false;
            orbit.autoRotate = true;
        }
    }*/
    var t =0.99;// Math.min(0.99, Math.max(0.15, Math.abs(Math.sin(clock.getElapsedTime() * 0.2 + 0.3)) * 1.5 - 0.2));

    if (parameters.animate || t < 0.95) {
        scene.getObjectByName('similaunMesh').material.color = new THREE.Color(t, t, t);
    //    scene.getObjectByName('sky').material.uniforms.topColor.value = new THREE.Color(t * 0.4, 0.1 + t * 0.6, 0.2 + 0.8 * t);
    }
    stats.update();
    orbit.update();

    //MODEL ROTATION
    if (parameters.rotSpeed > 0) {
        var light = scene.getObjectByName('dirLight');
        var x = light.position.x;
        var z = light.position.y;
        light.position.x = x * Math.cos(parameters.rotSpeed) + z * Math.sin(parameters.rotSpeed);
        light.position.z = 0;
        light.position.y = z * Math.cos(parameters.rotSpeed) - x * Math.sin(parameters.rotSpeed);
        //sphereMesh.position.set(light.position.x, light.position.y, light.position.z);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function updateBorderPosition(pts, geom, startx, starty, endx, endy) {
    var r2 = Math.sqrt(2);
    var sumt = 0.5;
    if (pts) {
        var vertices = similaunGeometry.attributes.position.array;
        var bVertices = geom.attributes.position.array;
        for (var i = 0; i < pts.length; i += 1) {
            var x = pts[i].x * (worldWidth - 1.0); //Math.round((pts[i].x)*(worldWidth-1))//;
            var y = pts[i].y * (worldHeight - 1.0); //Math.round(pts[i].y*(worldHeight-1));//;
            if (x >= startx && x <= endx &&
                y >= starty && y <= endy) {
                var xx = pts[i].x - 0.5;
                var yy = pts[i].y - 0.5;
                var tx = x - Math.floor(x);
                var ty = y - Math.floor(y);
                x = Math.floor(x);
                y = Math.floor(y);
                var a = new THREE.Vector3(vertices[((y) * worldWidth + x) * 3], vertices[((y) * worldWidth + x) * 3 + 1], vertices[((y) * worldWidth + x) * 3 + 2]);
                var b = new THREE.Vector3(vertices[((y) * worldWidth + x + 1) * 3], vertices[((y) * worldWidth + x + 1) * 3 + 1], vertices[((y) * worldWidth + x + 1) * 3 + 2]);
                var c = new THREE.Vector3(vertices[((y + 1) * worldWidth + x + 1) * 3], vertices[((y + 1) * worldWidth + x + 1) * 3 + 1], vertices[((y + 1) * worldWidth + x + 1) * 3 + 2]);
                var d = new THREE.Vector3(vertices[((y + 1) * worldWidth + x) * 3], vertices[((y + 1) * worldWidth + x) * 3 + 1], vertices[((y + 1) * worldWidth + x) * 3 + 2]);
                var v = barycentricInterpolation(a, b, c, d, tx, ty);
                bVertices[i * 3] = v.x; //+xx*(worldWidth);;//v.x;//(pts[i].x-0.5)*worldWidth;
                bVertices[i * 3 + 1] = v.y + 0.05; //vertices[(y*worldWidth+x)*3+1];//v.y;
                bVertices[i * 3 + 2] = v.z; //yy*worldWidth;//(ptss[i].y-0.5)*worldWidth;
            }
        }
        geom.attributes.position.needsUpdate = true;
    }
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    for (var v = 0; v < sensors.length; v++)
        for (var q = 0; q < sensors[v].length; q++)
            sensors[v][q].material.color.set(0xffffff);
    if (currentView==0) orbit.autoRotate = true;
    parameters.animate = true;
    if(currentView==2){
    var label = document.getElementById('label');
    $("#label").css("display", "none");
    for (var v = 0; v < sensors.length; v++) {
        var intersects = raycaster.intersectObjects(sensors[v]);
        for (var t = 0; t < intersects.length; t++) {
            var index = intersects[t].object.sensor_id;
            $("#label").css("display", "block");
            $("#label").html("<span class='label-title'>Sensor</span><br><span class='label-value'>"+coordinates[index].id+"</span><br>"+
                             "<span class='label-title'>Latitude<br></span><span class='label-value'>"+convertDDToDMS(coordinates[index].latitude)+"</span><br>"+
                             "<span class='label-title'>Longitude<br></span><span class='label-value'>"+convertDDToDMS(coordinates[index].longitude,true)+"</span><br>"+
                             "<span class='label-title'>Altitude<br></span><span class='label-value'>"+coordinates[index].altitude+"m</span>"
                           );
            intersects[t].object.material.color = new THREE.Color(0x5EC8D8); // $il-blue defined in _variables.scss
            orbit.autoRotate = false;
            parameters.animate = false;
        }
    }
  }
}

function onMouseClick(event) {
    if (!parameters.animate) showView(1);
    else showView(0);
}
var animating=false;
var interval;
var t=0;
function showView(i) {
  if(animating)clearInterval(interval);
  currentView=i;
  t=0;
  animating=true;
  var maxDis = Math.max(Math.abs(orbit.getPolarAngle()), Math.abs(orbit.getAzimuthalAngle()));

  if (i == 0) {
    interval=setInterval(function(){
      var r = 0.012;
      var changed=false;
      if (orbit.getPolarAngle() < 1.27) {
        orbit.rotateUp(-r);//Math.min(r, orbit.getPolarAngle()+1.28));
        changed=true;
      }
      if (orbit.getPolarAngle() > 1.29) {
        orbit.rotateUp(r);//Math.min(r, orbit.getPolarAngle()+1.28));
        changed=true;
      }
      transitions(0);
      if(!changed){
        clearInterval(interval);
        console.log("done");
        animating=false;
      }
    },1000/60.0);
        orbit.autoRotate = true;
        orbit.enableZoom = true;
        orbit.enableRotate=true;
        $("#narrative-1").addClass("is-visible");
        $("#narrative-2").removeClass("is-visible");
        $("#narrative-3").removeClass('is-visible');
    }
    if (i == 1) {
      interval=setInterval(function(){
        var r = 0.012;
        var changed=false;
        if (orbit.getAzimuthalAngle() > 0.01) {
            orbit.rotateLeft(Math.min(r, orbit.getAzimuthalAngle()));
            changed=true;
        }
        if (orbit.getAzimuthalAngle() < -0.01) {
            orbit.rotateLeft(Math.max(-r, orbit.getAzimuthalAngle()));
            changed=true;
        }
        if (orbit.getPolarAngle() > 0.01) {
            orbit.rotateUp(Math.min(r, orbit.getPolarAngle()));
            changed=true;
        }
        if (orbit.getPolarAngle() < -0.01) {
            orbit.rotateUp(Math.max(-r, orbit.getPolarAngle()));
            changed=true;
        }

        transitions(1);
        if(!changed){
        clearInterval(interval);
        console.log("done");
        animating=false;
        }
      },1000/60.0);

        orbit.autoRotate = false;
        parameters.animate = false;
        orbit.enableZoom = false;
        orbit.enableRotate=false;
        animating = true;
        $("#narrative-1").removeClass("is-visible");
        $("#narrative-2").addClass("is-visible");
        $("#narrative-3").removeClass('is-visible');
    }
    if (i == 2) {
      interval=setInterval(function(){
        var t=scene.getObjectByName('grid').material.opacity;
        if(t<1){
          t+=0.2;
          t=Math.min(1,t);
          scene.getObjectByName('grid').material.opacity=Math.max(t,scene.getObjectByName('grid').material.opacity);
          for (var v = 0; v < sensors.length; v++)
              for (var q = 0; q < sensors[v].length; q++){
                sensors[v][q].material.visible = true;
                sensors[v][q].material.transparent = true;
                sensors[v][q].material.opacity=Math.max(t,sensors[v][q].material.opacity);
              }
        }
        else{
          clearInterval(interval);
          console.log("done");
          animating=false;
        }
      },100);
        orbit.autoRotate = false;
        parameters.animate = false;
        orbit.enableZoom = true;
        orbit.enableRotate=false;
        animating = true;
        $("#narrative-1").removeClass("is-visible");
        $("#narrative-2").removeClass("is-visible");
        $("#narrative-3").addClass('is-visible');
    }
}

function transitions(i){
  var maxDis = Math.max(Math.abs(orbit.getPolarAngle()), Math.abs(orbit.getAzimuthalAngle()));
  var t = Math.max(0, Math.min(1, maxDis * 2 - 0.1)); //Math.max(0.0001,1-Math.max(Math.min(clock.getElapsedTime()-delay,2.0),0)/1.0)
  mesh.material.transparent = true;
  if(t-0.2<0){
    var tt=Math.min(1,Math.max(0,-(t-0.2)/0.2));
    mesh.material.wireframe=false;
    mesh.material.opacity = tt*0.8;
  }else{
    mesh.material.wireframe=true;
    mesh.material.opacity = Math.max(0,t-0.2);
  }
  //mesh.material.opacity=Math.max(0.0000,1-Math.max(Math.min(clock.getElapsedTime()-delay,3.0),0)/3.0);
  scene.getObjectByName('oldBorder').material.transparent = true;
  scene.getObjectByName('oldBorder').material.opacity = 1 - t;
//  scene.getObjectByName('grid').material.opacity = 1 - t;
for (var v = 0; v < sensors.length; v++)
    for (var q = 0; q < sensors[v].length; q++){
      sensors[v][q].material.transparent = true;
      sensors[v][q].material.opacity=Math.min(sensors[v][q].material.opacity,t);
      if(sensors[v][q].material.opacity==0)
      sensors[v][q].material.visible=false;
      else
      sensors[v][q].material.visible=true;
    }
    scene.getObjectByName('grid').material.opacity =  Math.min(t,scene.getObjectByName('grid').material.opacity);



  $("#label_1920").css('opacity', 1 - Math.max(t, 0));
  $("#label_2016").css('opacity', 1 - Math.max(t, 0));
  $("#label").css('opacity', 1 - Math.max(t, 0));
  var vector = toScreenPosition(p1920);
  $("#label_1920").css('top', vector.y - $("#label_1920").height() * 1.2);
  $("#label_1920").css('left', vector.x);
  vector = toScreenPosition(p2016);
  $("#label_2016").css('top', vector.y - $("#label_2016").height() * 1.2);
  $("#label_2016").css('left', vector.x);


  $("#label_1920").css('opacity', 1 - Math.max(t, 0));
  $("#label_2016").css('opacity', 1 - Math.max(t, 0));
  $("#label").css('opacity', 1 - Math.max(t, 0));

  var vector04 = toScreenPosition(sensors[0][3]);
  var vector44 = toScreenPosition(sensors[4][3]);
  var vector40 = toScreenPosition(sensors[4][1]);
  var vector00 = toScreenPosition(sensors[0][1]);

  $("#label_italy").css('left', vector40.x);
  $("#label_italy").css('top', vector44.y - $("#label_italy").height() * 1.2);
  $("#label_austria").css('left', vector04.x);
  $("#label_austria").css('top', vector00.y - $("#label_austria").height() * 1.2);

  $("#label_austria").css('opacity', 1 - Math.max(t, 0));
  $("#label_italy").css('opacity', 1 - Math.max(t, 0));
}

function updateMesh() {
    var vertices = similaunGeometry.attributes.position.array;
    var t_startx = startx - gridW + 3 * gridW;
    var t_starty = starty - gridH;
    var halfGrid = gridW * 0.5;
    //SIMULATING SENSOR DISPLACEMENT
    for (var y = 0; y < 7; y++) {
        for (var x = 0; x < 7; x++) {
            var tx = t_startx + x * halfGrid - y * halfGrid;
            var ty = t_starty + y * halfGrid + x * halfGrid;
            //  var tx=t_startx+x*gridW;
            //  var ty=t_starty+y*gridH;
            if (x > 0 && x < 6 && y > 0 && y < 6) {
                displacements[x][y].y = data[(ty * worldWidth + tx)] * zRatio; //+Math.sin(time+x+y-1)*parameters.noise*displacementAlpha;
                sensors[x - 1][y - 1].position.y = displacementAlpha * displacements[x][y].y + worldWidth * 0.002;
            }
        }
    }
    //INTERPOLATE THE GRID ELEMENTS POSITION
    //var xx=t_startx+(x*gridW+xt)*0.5-(y*gridH+yt)*0.5;
    //var yy=t_starty+(y*gridH+yt)*0.5+(x*gridW+xt)*0.5;
    for (var y = 0; y < 6; y++) {
        var ty = y * halfGrid;
        var vstarty = t_starty + ty;
        for (var x = 0; x < 6; x++) {
            var tx = x * halfGrid;
            var vstartx = t_startx + tx;
            for (var yt = 0; yt < halfGrid; yt++) {
                var yy = vstarty + tx + (yt);
                var xx = vstartx - ty - yt;
                for (var xt = 0; xt < halfGrid; xt += 1) {
                    vertices[(yy * worldWidth + xx) * 3 + 1] = displacements[x][y].y * interpolationIndexes[yt * 2][xt].a +
                        displacements[x + 1][y].y * interpolationIndexes[yt * 2][xt].b +
                        displacements[x + 1][y + 1].y * interpolationIndexes[yt * 2][xt].c +
                        displacements[x][y + 1].y * interpolationIndexes[yt * 2][xt].d;
                    yy++;
                    vertices[(yy * worldWidth + xx) * 3 + 1] = displacements[x][y].y * interpolationIndexes[yt * 2 + 1][xt].a +
                        displacements[x + 1][y].y * interpolationIndexes[yt * 2 + 1][xt].b +
                        displacements[x + 1][y + 1].y * interpolationIndexes[yt * 2 + 1][xt].c +
                        displacements[x][y + 1].y * interpolationIndexes[yt * 2 + 1][xt].d;
                    xx++;
                }
            }
        }
    }
    updateBorderPosition(borderPoints, borderGeometry, startx - gridW, starty - gridH, startx - gridW + gridW * 7, starty - gridH + gridH * 7);
    similaunGeometry.attributes.position.needsUpdate = true;
    gridGeometry.attributes.position.needsUpdate = true;

}

function toScreenPosition(obj) {
    var vector = new THREE.Vector3();
    var widthHalf = 0.5 * window.innerWidth;
    var heightHalf = 0.5 * window.innerHeight;
    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);
    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;
    return {
        x: vector.x,
        y: vector.y-5
    };
};

function convertDDToDMS(D, lng){
    var  dir = D<0?lng?'W':'S':lng?'E':'N',
        deg = 0|(D<0?D=-D:D),
        min = 0|D%1*60,
        sec =(0|D*60%1*6000)/100;
        return deg+"º "+min+'\' '+sec+'\" '+dir;
}
