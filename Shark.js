function Shark(scene,callback){
	var other = this
	var manager = new THREE.LoadingManager();
	this.moveTarget = undefined
	//最小相邻距离
	this.minNeighborDis = 2
	//鱼的视力范围
	this.viewDis = 5

	this.power = 0.16

	var textureLoader = new THREE.TextureLoader( manager );
	var texture = textureLoader.load( 'models/shark/shark_texture.png' );

	var loader = new THREE.OBJLoader( manager );
	loader.load('models/shark/shark1.obj', function ( object ) {
					object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							child.material.map = texture;

						}

					} );
					other.object = object
					//object.lookAt(new THREE.Vector3(1,1,1))
					object.scale.set(0.1,0.1,0.1)
					scene.add( object );
					callback(other)
				},  function ( xhr ) {},  function ( xhr ) {} );

	this.moveTarget = new THREE.Vector3(Math.random()*10,Math.random()*10,Math.random()*10)

	this.period = 0
}

Shark.prototype = new Fish()


Shark.prototype.setPos = function(pos) {
	this.object.position.copy(pos)
	
};

Shark.prototype.action = function() {
	var forward = this.huntMove()

	if(forward.length()<=0){
		forward = this.randomMove()
	}

	forward.add(this.saparate().multiplyScalar(0.5))


	this.move(this.object.position.clone().add(forward))

	this.period++
};

Shark.prototype.show = function(pos) {

	
	
};

Shark.prototype.move = function(target) {
	this.clamRange(target)

	
	var matrix = new THREE.Matrix4();
	matrix.extractRotation( this.object.matrix );
	var direction = new THREE.Vector3( 0, 0, 1 );
	matrix.multiplyVector3( direction );
	//this.object.lookAt(target.lerp ( direction, 0.01 ))

	var myView = this.object.position.clone().add(direction)
	this.object.lookAt(target.clone().sub(this.object.position).normalize().multiplyScalar(0.1).add(myView))


	var matrix = new THREE.Matrix4();
	matrix.extractRotation( this.object.matrix );
	var direction = new THREE.Vector3( 0, 0, 1 );
	matrix.multiplyVector3( direction );

	//if(direction.angleTo(target.clone().sub(this.object.position))<Math.PI/2){
	this.object.position.add(direction.clone().multiplyScalar(this.power))

	//}


	if(this.power>=0.12){
		this.power-=0.001
	}



};






Shark.prototype.randomMove = function() {
	if(this.period>200){

		this.moveTarget = new THREE.Vector3(
			(Math.random()-0.5)*this.ocean.range,
			(Math.random())*this.ocean.range,
			(Math.random()-0.5)*this.ocean.range)
		this.period = 0		
	}
	return this.moveTarget.clone().sub(this.object.position).normalize()
	//return this.moveTarget.clone().normalize()
};

Shark.prototype.huntMove = function() {

	var foods = this.findFood()
	if(foods.length<=0){
		return new THREE.Vector3()
	}
	var minDis = -1
	var minIndex = 0
	for(var i=0;i<foods.length;i++){
		var food = foods[i]
		var dis = this.object.position.distanceTo(food.object.position)

		if(dis<=0.5){
			this.eat(food)
			continue
			
		}

		if(minIndex == -1|| dis<minDis){
			minDis = dis
			minIndex = i
		}


	}
	var forward = foods[minIndex].object.position.clone().sub(this.object.position).normalize()

	return forward
	
};

Shark.prototype.findFood = function() {
	var foods = []
	for(var i=0;i<this.ocean.schoolFishes.length;i++){
		var dis = this.ocean.schoolFishes[i].object.position.distanceTo(this.object.position)
		if(dis <= this.viewDis){
			foods.push(this.ocean.schoolFishes[i])
		}

	}

	for(var i=0;i<this.ocean.individualFishes.length;i++){
		var dis = this.ocean.individualFishes[i].object.position.distanceTo(this.object.position)
		if(dis <= this.viewDis){
			foods.push(this.ocean.individualFishes[i])
		}

	}
	return foods
};


Shark.prototype.saparate = function() {
	var saparateMove = new THREE.Vector3()
	for(var i=0;i<this.ocean.sharks.length;i++){
		var shark = this.ocean.sharks[i]
		if(shark == this){
			continue
		}

		var forward = shark.object.position.clone().sub(this.object.position)
		var distance = forward.length()

		if(this.minNeighborDis>distance){
			forward = forward.normalize()
			forward.multiplyScalar(distance-this.minNeighborDis)
			saparateMove.add(forward)
		}


	}
	return saparateMove.normalize()
};

Shark.prototype.eat = function(fish) {
	fish.died()


	if(this.power<=0.2){
		this.power+=0.01
		
	}
};

