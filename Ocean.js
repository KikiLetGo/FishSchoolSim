function Ocean(){
	this.sharks = []
	this.schoolFishes = []
	this.individualFishes = []
	this.range = 20
	this.period=0
}
Ocean.prototype.create = function(scene,fishCounts=10) {
	var other = this
	var range = this.range
	// for(var i=0;i<fishCounts/2;i++){
	// 	var fish = new IndividualFish().create(scene,function(fish){
	// 				other.individualFishes.push(fish)
	// 				var pos = new THREE.Vector3(Math.random()*range-range/2,Math.random()*range,Math.random()*range-range/2)

	// 				fish.setPos(pos)
	// 				fish.ocean = other
	// 			})

	// }

	for(var i=0;i<fishCounts/2;i++){
		var fish = new SchoolFish().create(scene,function(fish){
					other.schoolFishes.push(fish)
					var pos = new THREE.Vector3(Math.random()*range-range/2,Math.random()*range,Math.random()*range-range/2)

					fish.setPos(pos)
					fish.ocean = other
				})

	}
	for(var i=0;i<1;i++){
		var shark = new Shark(scene,function(shark){
					other.sharks.push(shark)
					var pos = new THREE.Vector3(Math.random()*range-range/2,Math.random()*range,Math.random()*range-range/2)
					shark.setPos(pos)
					
					shark.ocean = other

				})

	}
	
}



Ocean.prototype.action = function() {
	this.period++
	for(var i=0;i<this.schoolFishes.length;i++){
		this.schoolFishes[i].action()
	}
	for(var i=0;i<this.individualFishes.length;i++){
		this.individualFishes[i].action()
	}
	for(var i=0;i<this.sharks.length;i++){
		this.sharks[i].action()
	}
	
}



Ocean.prototype.moveTarget = function(fish) {
	if(this.target == undefined || this.period>=500){
		this.target = new THREE.Vector3(
			(Math.random()-0.5)*this.range,
			(Math.random()-0.5)*this.range,
			(Math.random()-0.5)*this.range)
		this.period = 0		
		//alert(this.target.x)	
	}
	return this.target.clone().sub(fish.object.position).normalize()

};