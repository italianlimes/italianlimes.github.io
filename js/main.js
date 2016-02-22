/**
 * ITALIAN LIMES
 * main.js
 * https://github.com/italianlimes
 *
 */

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
else  window.onload = init;

window.addEventListener('resize', onResize,false);
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth , window.innerHeight);
  }
