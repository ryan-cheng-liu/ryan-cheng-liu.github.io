let animate_callbacks = [];

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
camera.position.z = 10;
let renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

{
  let geometry = new THREE.BoxGeometry( 3, 3, 3 );
  let texture = new THREE.TextureLoader().load( './textures/texture.gif' );  
  let material = new THREE.MeshBasicMaterial( { map: texture } );
	let mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	
	animate_callbacks.push(() => {
		geometry.rotateX(0.01);
		geometry.rotateY(0.01);
	})
}

{
	let light = new THREE.AmbientLight( 0x909090 );
	scene.add( light );
}

{
	let light = new THREE.DirectionalLight( 0xffffff, 2 );
	scene.add(light);
}

function animate() {
	requestAnimationFrame( animate );
	for (let cb of animate_callbacks) cb();
	renderer.render( scene, camera );
}
animate();
