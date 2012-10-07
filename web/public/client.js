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

var fps;

function init() {

	camera = new THREE.PerspectiveCamera( 75, WIDTH/HEIGHT , 1, 10000 );
	camera.position.z = 1500;
	camera.position.y = 0;


	scene = new THREE.Scene();

	geometry = new THREE.CylinderGeometry( 10, 0, 20 );
	material = new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: false } );
	mesh = new THREE.Mesh( geometry, material );
	console.log(mesh);
	scene.add( mesh );

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
	
	mesh.position.x = sim[index].pos.x;
	mesh.position.y = sim[index].pos.y;
	mesh.position.z = sim[index].pos.z;
	
	var vel = v(sim[index].vel.x, sim[index].vel.y, sim[index].vel.z);
	vel.normalize();

	var xRot = Math.acos( vel.dot(v(1,0,0)));
	var yRot = Math.acos( vel.dot(v(0,1,0)));
	var zRot = Math.acos( vel.dot(v(0,0,1)));

	mesh.rotation.x = -xRot;
	mesh.rotation.y =  yRot;
	mesh.rotation.z = -zRot;
	
	//mesh.rotation.y = Math.PI;

	if(index < (sim.length-1))
		index++; 

	//mesh.rotation.x += 0.01;
	//mesh.rotation.y += 0.02;
	renderer.render( scene, camera );
	//setTimeout(animate,1000);
}

socket.on('data', function (data) {
	console.log(data);
	sim = data;

	init();
	setTimeout(animate,1000);
	//animate();
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
