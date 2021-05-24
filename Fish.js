function Fish(){
	this.moveTarget = undefined
	//最小相邻距离
	this.minNeighborDis = 1
	//鱼的视力范围
	this.viewDis = 2
	

	
}
Fish.prototype.create = function(scene,callback) {
	var other = this
	var manager = new THREE.LoadingManager();

	this.scene = scene



	var loader = new THREE.OBJLoader( manager );
	loader.load('models/fish1.obj', function ( object ) {
					
					other.object = object
					//object.lookAt(new THREE.Vector3(1,1,1))
					object.scale.set(0.01,0.01,0.01)
					object.traverse( function ( child ) {
						if ( child instanceof THREE.Mesh ) {
							//child.material.map = texture;
							var mat  = new THREE.MeshStandardMaterial( {
										
										color: 0xFF8040
									} );
							child.material=mat


							scene.add( object );

							callback(other)
						}
					} );
				},  function ( xhr ) {},  function ( xhr ) {} );

	this.moveTarget = new THREE.Vector3(Math.random()*10,Math.random()*10,Math.random()*10)

	this.period = 0
	return this
	
};


Fish.prototype.setPos = function(pos) {
	this.object.position.copy(pos)
};

Fish.prototype.action = function() {
	this.period++
	this.schoolAction()


	//

};
Fish.prototype.individual = function() {
	this.move(this.object.position.clone().add(this.randomMove()))
};


Fish.prototype.move = function(target) {
	
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

	this.object.position.add(direction.clone().multiplyScalar(0.1))


};

Fish.prototype.findNeighbors = function() {
	var neighbors = []
	var fishes = this.ocean.schoolFishes
	for(var i=0;i<fishes.length;i++){
		var neighbor = fishes[i]
		if(neighbor == this){
			continue
		}
		var dis = neighbor.object.position.distanceTo(this.object.position)
		if(dis <= this.viewDis){
			neighbors.push(neighbor)
			neighbor.school.merge(this.school)

		}
	}
	if(fishes.length == 0){
		this.school = new School()

	}

	return neighbors
};



Fish.prototype.schoolAction= function() {
	var finshTarget = new THREE.Vector3()
	var moveStep = new THREE.Vector3()
	var neighbors = this.findNeighbors()

	for(var i=0;i<neighbors.length;i++){
		var fish = neighbors[i]
		if(fish == this){
			continue
		}
		var forward = fish.object.position.clone().sub(this.object.position)
		var distance = forward.length()
		forward = forward.normalize()
		forward.multiplyScalar(distance-this.minNeighborDis)
		// if(forward.length()<this.minNeighborDis){
		// 	forward.negate() 
		// }
		moveStep.add(forward)

	}
	finshTarget.add(moveStep.normalize().multiplyScalar(0.5))
	finshTarget.add(this.school.moveTarget(this).normalize().multiplyScalar(0.6))
	finshTarget.add(this.centerMove().normalize().multiplyScalar(0.4))
	finshTarget.add(this.randomMove().normalize().multiplyScalar(0.05))

	var escapeTarget = this.escapeMove()
	if(escapeTarget.length()>0){
		finshTarget = escapeTarget
	}

	//finshTarget.add(this.escapeMove().multiplyScalar(1000))


	//finshTarget.multiplyScalar(Math.random()*2)
	

	//finshTarget.multiplyScalar(Math.random())
	//moveStep.add(new THREE.Vector3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5) )
	//moveStep.add(this.fishGroup.moveTarget())
	//this.object.position.add(moveStep)
			//.add(this.fishGroup.moveTarget().normalize().multiplyScalar(0.01))
	
	// if(){
	// 	finshTarget.x=-finshTarget.x

	// }
	this.move(this.object.position.clone().add(finshTarget))

	
};

Fish.prototype.randomMove = function() {
	if(this.period>50){
		this.moveTarget = new THREE.Vector3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5)
		this.period = 0
	}
	return this.moveTarget.clone().normalize()
	

	//this.move(this.moveTarget)
	
};

Fish.prototype.schoolMove = function() {
	var move = new Vector3()
	if(this.school == undefined){
		return move
	}else{
		return this.school.moveTarget()
	}
};

Fish.prototype.centerMove = function() {
	var neighbors = this.school.fishes
	var center = new THREE.Vector3()

	for(var i=0;i<neighbors.length;i++){

		center.add(neighbors[i].object.position);
	}
	center.divideScalar(neighbors.length)
	return center.sub(this.object.position).normalize()
	// body...
};

Fish.prototype.escapeMove = function() {
	var forward = new THREE.Vector3()
	for(var i=0;i<this.ocean.sharks.length;i++){
		var shark = this.ocean.sharks[i]
		forward = this.object.position.clone().sub(shark.object.position)
		var distance = forward.length()
		if(distance > this.viewDis){//看不见
			return new THREE.Vector3()
		}

		//forward = forward.normalize()
		forward.multiplyScalar(this.viewDis-distance)

	}
	return forward.normalize()
};

Fish.prototype.died = function() {
	this.scene.remove(this.object)

	this.ocean.fishes.splice(this.ocean.fishes.indexOf(this),1)

};

Fish.prototype.clamRange = function(move) {
	var range = this.ocean.range
	if(this.object.position.x>range/2 && move.x>0||
		this.object.position.x<-range/2 && move.x<0){
		move.x=-move.x
		this.think()

	}
	if(this.object.position.y>range && move.y>0||
		this.object.position.y<0 && move.y<0){
		move.y=-move.y
		this.think()


	}
	if(this.object.position.z>range/2 && move.z>0||
		this.object.position.z<-range/2 && move.z<0){
		move.z=-move.z
		this.think()


	}
};

Fish.prototype.think = function() {
	if(this.school){
		this.school.time = 1000

	}

};