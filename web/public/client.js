$(function() {

var socket = io.connect();

var camera, scene, renderer;
var geometry, material, mesh;
var clock = new THREE.Clock();

var sim = '';
var index = 0;

var WIDTH = 1024;
var HEIGHT = 768;

var SimBox = {
	X : 512,
	Y : 512,
	Z : 512
};

var ship1, ship2;
function Ship ()
{
	this.geometry = new THREE.CylinderGeometry( 10, 0, 20 );
	this.material = new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: false } );
	this.mesh = new THREE.Mesh( this.geometry, this.material );
	scene.add( this.mesh );
}
Ship.prototype.update = function(simObject)
{
	simObject = simObject.Ship.Base.SpaceObject;
	this.mesh.position.x = simObject.pos.x;
	this.mesh.position.y = simObject.pos.y;
	this.mesh.position.z = simObject.pos.z;
	
	var vel = v(simObject.vel.x, simObject.vel.y, simObject.vel.z);
	vel.normalize();
	
	var xRot = Math.acos( vel.dot(v(1,0,0)));
	var yRot = Math.acos( vel.dot(v(0,1,0)));
	var zRot = Math.acos( vel.dot(v(0,0,1)));

	this.mesh.rotation.x = -xRot;
	this.mesh.rotation.y = yRot;
	this.mesh.rotation.z = -zRot;
}

var fps;

function init() {

	camera = new THREE.PerspectiveCamera( 75, WIDTH/HEIGHT , 1, 10000 );
	camera.position.z = 1500;
	camera.position.y = 0;


	scene = new THREE.Scene();

	ship1 = new Ship();
	ship2 = new Ship();

	addOriginLines();
	addBoxOutline();

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize( WIDTH, HEIGHT );
	renderer.setClearColorHex(0x000000, 1.0);
	renderer.clear();

	document.body.appendChild( renderer.domElement );
	
	fps = new THREE.FirstPersonControls(camera,renderer.domElement);
	fps.movementSpeed = 250;
	fps.lookSpeed = 0.25;
	fps.freeze = true;
	//fps.target = new THREE.Vector3(0,0,-1.0);	
}

function animate() {
	// note: three.js includes requestAnimationFrame shim
	
	requestAnimationFrame( animate );
	fps.update(clock.getDelta());
	
	ship1.update(sim[index]["s1"]);
	ship2.update(sim[index]["s2"]);


	if(index < (sim.length-1))
		index++; 

	renderer.render( scene, camera );
}

socket.on('data', function (data) {
	console.log(data);
	sim = data;

	init();
	animate();
});

function v(x,y,z) {
	return new THREE.Vector3(x,y,z);
}

function addOriginLines(){
	var lineGeo = new THREE.Geometry();
	
	lineGeo.vertices.push(
			v(-SimBox.X, 0, 0), v(SimBox.X,0,0),
			v(0, -SimBox.Y, 0), v(0,SimBox.Y,0),
			v(0, 0, -SimBox.Z), v(0,0,SimBox.Z)
	);
	var lineMat = new THREE.LineBasicMaterial( {
		color: 0xffffff, lineWidth: 2});
	var line = new THREE.Line(lineGeo, lineMat);
	line.type = THREE.Lines;
	scene.add(line);

}

function addBoxOutline(){
	var lineGeo = new THREE.Geometry();
	
	lineGeo.vertices.push(
			v(SimBox.X, SimBox.Y, SimBox.Z), v(SimBox.X,-SimBox.Y,SimBox.Z),
			v(SimBox.X, SimBox.Y, -SimBox.Z), v(SimBox.X,-SimBox.Y,-SimBox.Z),
			v(SimBox.X, -SimBox.Y, SimBox.Z), v(SimBox.X,-SimBox.Y,-SimBox.Z),
			v(SimBox.X, SimBox.Y, SimBox.Z), v(SimBox.X,SimBox.Y,-SimBox.Z),
			v(-SimBox.X, SimBox.Y, SimBox.Z), v(-SimBox.X,-SimBox.Y,SimBox.Z),
			v(-SimBox.X, SimBox.Y, -SimBox.Z),v(-SimBox.X,-SimBox.Y,-SimBox.Z),
			v(-SimBox.X, -SimBox.Y, SimBox.Z),v(-SimBox.X,-SimBox.Y,-SimBox.Z),
			v(-SimBox.X, SimBox.Y, SimBox.Z), v(-SimBox.X,SimBox.Y,-SimBox.Z),

			v(SimBox.X, SimBox.Y, SimBox.Z), v(-SimBox.X,SimBox.Y,SimBox.Z),
			v(SimBox.X, SimBox.Y, -SimBox.Z), v(-SimBox.X,SimBox.Y,-SimBox.Z),
			v(SimBox.X, -SimBox.Y, SimBox.Z), v(-SimBox.X,-SimBox.Y,SimBox.Z),
			v(SimBox.X, -SimBox.Y, -SimBox.Z), v(-SimBox.X,-SimBox.Y,-SimBox.Z)
	);
	var lineMat = new THREE.LineBasicMaterial( {
		color: 0xcccccc, lineWidth: 1});
	var line = new THREE.Line(lineGeo, lineMat);
	line.type = THREE.Lines;
	scene.add(line);

}


});
