/**
 * ITALIAN LIMES
 * visualization.js
 * https://github.com/italianlimes
 *
 */
var imgResolution = Math.max(128, Math.min(512, Math.pow(2, Math.floor(Math.log2(window.innerWidth / 6)))));
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

var coordinates = [
    "ID: 1<br/>LAT: 46,76696678<br/>LON: 10,89216134<br/>ALTITUDE: 3424,1365",
    "ID: 3<br/>LAT: 46,76625583<br/>LON: 10,89358736<br/>ALTITUDE: 3422,6077",
    "ID: 6<br/>LAT: 46,76548033<br/>LON: 10,89457847<br/>ALTITUDE: 3407,8869",
    "ID: 10<br/>LAT: 46,76469523<br/>LON: 10,89566494<br/>ALTITUDE: 3392,6402",
    "ID: 15<br/>LAT: 46,76386116<br/>LON: 10,89681896<br/>ALTITUDE: 3364,8785",
    "ID: 2<br/>LAT: 46,76628987<br/>LON: 10,89112327<br/>ALTITUDE: 3394,6302",
    "ID: 5<br/>LAT: 46,76546685<br/>LON: 10,89230318<br/>ALTITUDE: 3397,2077",
    "ID: 9<br/>LAT: 46,76470423<br/>LON: 10,89343579<br/>ALTITUDE: 3395,8217",
    "ID: 14<br/>LAT: 46,76389149<br/>LON: 10,89454863<br/>ALTITUDE: 3388,7648",
    "ID: 19<br/>LAT: 46,76308884<br/>LON: 10,89566521<br/>ALTITUDE: 3373,321",
    "ID: 4<br/>LAT: 46,76552945<br/>LON: 10,88992797<br/>ALTITUDE: 3379,9924",
    "ID: 8<br/>LAT: 46,76474691<br/>LON: 10,89107509<br/>ALTITUDE: 3382,3593",
    "ID: 13<br/>LAT: 46,76384316<br/>LON: 10,89213326<br/>ALTITUDE: 3383,2618",
    "ID: 18<br/>LAT: 46,76313017<br/>LON: 10,89336190<br/>ALTITUDE: 3382,9956",
    "ID: 22<br/>LAT: 46,76232738<br/>LON: 10,89445073<br/>ALTITUDE: 3376,586",
    "ID: 7<br/>LAT: 46,76482551<br/>LON: 10,88883534<br/>ALTITUDE: 3375,4905",
    "ID: 12<br/>LAT: 46,76396784<br/>LON: 10,89000798<br/>ALTITUDE: 3375,9382",
    "ID: 17<br/>LAT: 46,76316205<br/>LON: 10,89104280<br/>ALTITUDE: 3374,2488",
    "ID: 21<br/>LAT: 46,76232778<br/>LON: 10,89220759<br/>ALTITUDE: 3372,3191",
    "ID: 24<br/>LAT: 46,76151987<br/>LON: 10,89328053<br/>ALTITUDE: 3370,3513",
    "ID: 11<br/>LAT: 46,76400705<br/>LON: 10,88761166<br/>ALTITUDE: 3371,8775",
    "ID: 16<br/>LAT: 46,76318399<br/>LON: 10,88879436<br/>ALTITUDE: 3367,831",
    "ID: 20<br/>LAT: 46,76223966<br/>LON: 10,88991538<br/>ALTITUDE: 3364,1692",
    "ID: 23<br/>LAT: 46,76154790<br/>LON: 10,89103306<br/>ALTITUDE: 3360,6774",
    "ID: 25<br/>LAT: 46,76072612<br/>LON: 10,89202310<br/>ALTITUDE: 3355,2001",
    "ID: 25<br/>LAT: 46,76072612<br/>LON: 10,89202310<br/>ALTITUDE: 3355,2001",
    "ID: 26<br/>LAT: 46,76402293<br/>LON: 10,89198858<br/>ALTITUDE: 3384,3811"
];

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
    this.topColor = "#4499ff";
    this.bottomColor = "#120101";
    this.fogColor = this.bottomColor;
    this.animate = true;
    this.autorotate = true;
    this.sensorsColor = "#ff4444";
    this.borderColor = "#ffffff";
    this.wireframeLineWidth = 0.8;
    this.borderLineWidth = 2;
};

function init() {
    console.log("Started at resolution: " + imgResolution);
    scene = new THREE.Scene();
    displacementAlpha = 1;
    //RENDERER
    renderer = new THREE.WebGLRenderer();
    //renderer.setClearColor(0x000000, 1.0);
    renderer.setClearColor(0x444444);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    scene.position.set(-imgResolution * 0.05, -imgResolution * 0.25, imgResolution * 0.13);

    //CAMERA
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000000000);
    camera.position.x = 0;
    camera.position.y = 0.5 * imgResolution;
    if (window.innerWidth < 768) camera.position.y += imgResolution * 0.8 * (1 - (window.innerWidth / 768.0));
    camera.position.z = 0;
    orbit = new THREE.OrbitControls(camera);
    //camera.lookAt(new THREE.Vector3(0,0,0));
    orbit.zoomSpeed = 0.05;
    orbit.minDistance = 10;
    orbit.maxDistance = 200;
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
            addBorder(function() {
                addAmbientLight();
                //addDirectionalLight();
                addSky();
                window.addEventListener('mousemove', onMouseMove, false);
                window.addEventListener('resize', onResize, false);
                //  window.addEventListener( 'click', onMouseClick, false );
                $(window).bind("tap", onMouseClick);
                $("canvas").bind("click", onMouseClick);
                updateMesh();
                render();
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
            value: 100
        },
        exponent: {
            type: "f",
            value: 0.4
        },
        opacity: {
            type: "f",
            value: 1.0
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
            /*var material = new THREE.MeshBasicMaterial({fog:false,color: parameters.sensorsColor});
            var sphereGeom = new  THREE.SphereGeometry(worldWidth/250.0, 15,15);// Remove center vertex
            var mesh=new THREE.Mesh(sphereGeom, material);
            */
            var material = new THREE.LineBasicMaterial({
                color: 0xffffff,
                fog: false,
                linewidth: 2
            });

            sensors[x][y] = new THREE.Line(circleGeometry, material, THREE.LineStrip); ////

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
        opacity: 1,
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

var p2014, p1920;

function addBorder(callback) {
    $.getJSON("borders/newBorder_256.json", function(vertexPositions) {
        borderPoints = vertexPositions;
        borderVertices = new Float32Array(vertexPositions.length * 3); // three components per vertex
        borderGeometry.addAttribute('position', new THREE.BufferAttribute(borderVertices, 3));
        var material = new THREE.LineBasicMaterial({
            color: parameters.borderColor,
            fog: false,
            linewidth: parameters.borderLineWidth
        });
        borderMesh = new THREE.Line(borderGeometry, material, THREE.LineStrip); //new THREE.LineSegments( geometry, material );
        borderMesh.position.set(0, imgResolution * 0.001, 0);
        scene.add(borderMesh);
        updateBorderPosition(borderPoints, borderGeometry, 0, 0, worldWidth - 1.0, worldHeight - 1.0);

        var index = Math.round(vertexPositions.length * 0.23) * 3.0;
        p2014 = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0
        }));
        p2014.position.set(borderGeometry.attributes.position.array[index * 3.0],
            borderGeometry.attributes.position.array[index * 3.0 + 1],
            borderGeometry.attributes.position.array[index * 3.0 + 2]);
        scene.add(p2014);

        $.getJSON("borders/oldBorder_256.json", function(vertexPositions) {
            var oldBorderGeometry = new THREE.BufferGeometry();
            var borderVts = new Float32Array(vertexPositions.length * 3); // three components per vertex
            oldBorderGeometry.addAttribute('position', new THREE.BufferAttribute(borderVts, 3));
            var material = new THREE.LineBasicMaterial({
                color: new THREE.Color(0x4444ff),
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
                color: 0x00ff00,
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
    if (animating) {
        orbit.autoRotate = false;
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
            /*
            if(camera.position.y<0.5*imgResolution-0.01){
            camera.position.y+=1;
          }
          if(camera.position.y>0.5*imgResolution+0.01){
          camera.position.y-=1;
        }*/
            //  console.log(orbit.getZoomLevel());
            if (maxDis < 0.01)
                animationFinished = true;

        }
        var t = Math.max(0, Math.min(1, maxDis - 0.1)); //Math.max(0.0001,1-Math.max(Math.min(clock.getElapsedTime()-delay,2.0),0)/1.0)
        mesh.material.transparent = true;
        mesh.material.opacity = t;
        //mesh.material.opacity=Math.max(0.0000,1-Math.max(Math.min(clock.getElapsedTime()-delay,3.0),0)/3.0);
        scene.getObjectByName('oldBorder').material.transparent = true;
        scene.getObjectByName('oldBorder').material.opacity = 1 - t;
        scene.getObjectByName('sky').material.transparent = true;
        scene.getObjectByName('sky').material.uniforms.opacity.value = Math.max(t, 0);
        $("#label_1920").css('opacity', 1 - Math.max(t, 0));
        $("#label_2014").css('opacity', 1 - Math.max(t, 0));
        $("#label").css('opacity', 1 - Math.max(t, 0));
        var vector = toScreenPosition(p1920);
        $("#label_1920").css('top', vector.y - $("#label_1920").height() * 1.2);
        $("#label_1920").css('left', vector.x);
        vector = toScreenPosition(p2014);
        $("#label_2014").css('top', vector.y - $("#label_2014").height() * 1.2);
        $("#label_2014").css('left', vector.x);
        if (animationFinished && maxDis > 0.01 && t == 1) {
            animationFinished = false;
            animating = false;
            orbit.autoRotate = true;
        }
    }
    var t = Math.min(0.95, Math.max(0.15, Math.abs(Math.sin(clock.getElapsedTime() * 0.2 + 0.3)) - 0.2));

    if (parameters.animate || t < 0.95) {
        scene.getObjectByName('similaunMesh').material.color = new THREE.Color(t, t, t);
        scene.getObjectByName('sky').material.uniforms.topColor.value = new THREE.Color(t * 0.4, 0.1 + t * 0.6, 0.2 + 0.8 * t);
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
    orbit.autoRotate = true;
    parameters.animate = true;
    var label = document.getElementById('label');
    $("#label").css("display","none");
    for (var v = 0; v < sensors.length; v++) {
        var intersects = raycaster.intersectObjects(sensors[v]);
        for (var t = 0; t < intersects.length; t++) {
            var index = intersects[t].object.sensor_id;
            $("#label").css("display","block");
            $("#label").html(coordinates[index]);
            intersects[t].object.material.color = new THREE.Color(0xff0000);
            orbit.autoRotate = false;
            parameters.animate = false;
        }
    }
}

function onMouseClick(event) {
    //if(!parameters.animate)startAnimation();
    if (!parameters.animate) {
        orbit.autoRotate = false;
        parameters.animate = false;
        animating = true;
    }
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
        y: vector.y
    };
};
