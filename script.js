var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 5000)

var controls = new THREE.OrbitControls( camera );

var renderer = new THREE.WebGLRenderer()

renderer.setSize( window.innerWidth, window.innerHeight )

// renderer.setClearColor(0x000000, 1)

// scene.overrideMaterial = new THREE.MeshDepthMaterial()

document.body.appendChild( renderer.domElement )

camera.position.set( 0, 20, 100 );
controls.update();

var ambLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambLight)

var light = new THREE.DirectionalLight(0xffffff, 0.8)

light.position.set(0, 0, 15)

scene.add(light)

var p0 = new THREE.Vector3(5, 5, 5)

var p1 = new THREE.Vector3(10, 10, 10)

var PRand = new THREE.Vector3(Math.random(), Math.random(), Math.random()) 
PRand.addScalar(1)
PRand.add(p0)

var R = new THREE.Vector3()
R.crossVectors(new THREE.Vector3().subVectors(PRand, p0), new THREE.Vector3().subVectors(p1, p0))

var S = new THREE.Vector3()
R.crossVectors(R, new THREE.Vector3().subVectors(p1, p0))

var divisions = 6
var theta = 360/divisions

theta = (Math.PI / 180) * theta

var radius = 2

var points = [p0]

var iTheta = 0

for (var i=0; i<divisions; i++) {
    iTheta = theta * i
    points.push(new THREE.Vector3(
        p0.x + (radius * Math.cos(iTheta) * R.x) + (radius * Math.sin(iTheta) * S.x),
        p0.y + (radius * Math.cos(iTheta) * R.y) + (radius * Math.sin(iTheta) * S.y),
        p0.z + (radius * Math.cos(iTheta) * R.z) + (radius * Math.sin(iTheta) * S.z)
        )
    )
}

var geom = new THREE.Geometry()

geom.setFromPoints(points)

var face
for (var i=0; i<divisions-1; i++) {
    face = new THREE.Face3(0, i+1, i+2)
    geom.faces.push(face)
}

geom.faces.push(new THREE.Face3(0, divisions, 1))

console.log(geom)

geom.computeBoundingBox()
geom.computeBoundingSphere()
geom.computeFaceNormals()
geom.computeVertexNormals()
geom.computeFlatVertexNormals()
geom.computeMorphNormals()

console.log(geom)

// var geometry = new THREE.SphereBufferGeometry(5, 32, 32);
// var material = new THREE.MeshLambertMaterial({color: 0xffffff});
// var sphere = new THREE.Mesh( geometry, material );

// scene.add( sphere );

var wireframe = new THREE.WireframeGeometry( geom );

var line = new THREE.LineSegments( wireframe );
line.material.depthTest = false;
line.material.opacity = 0.25;
line.material.transparent = true;

scene.add(new THREE.AxisHelper())

scene.add( line );

var mat = new THREE.MeshBasicMaterial({color: 0x00ffff, side: THREE.DoubleSide});

var indicators = new THREE.Mesh(geom, mat)

scene.add(indicators)

camera.position.z = 15;

function animate() {
    requestAnimationFrame( animate );
    
    controls.update();
    renderer.render( scene, camera );
}
animate();