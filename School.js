function School(){
	this.fishes = []
	this.time = 0
	this.target = new THREE.Vector3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5)
						.normalize()
}
School.prototype.enter = function(fish) {
	this.fishes.push(fish)
	fish.school = this

};

School.prototype.exit = function(fish) {
	this.fishes.splice(this.fishes.indexOf(fish),1)
	fish.school = undefined
};

School.prototype.merge = function(school) {

	if(school == this){
		return
	}


	for(var i=0;i<school.fishes.length;i++){
		var fish = school.fishes[i]
		//school.exit(fish)
		this.enter(fish)
	}
	school.fishes = []

	
};

School.prototype.action = function() {
	var pulse = 1
	if(this.fishes.length>0){
		pulse = pulse/this.fishes.length

	}
	this.time+= pulse

	

};


School.prototype.moveTarget = function(fish) {

	if(this.time>=400){
		var range = 20
		this.target = new THREE.Vector3(
			(Math.random()-0.5)*range,
			(Math.random())*range,
			(Math.random()-0.5)*range)
		this.time = 0		
		//alert(this.target.x)	
	}
	return this.target.clone().sub(fish.object.position).normalize()

	// if(this.time>=200){
	// 	this.target = new THREE.Vector3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5)
	// 					.normalize()
	// 	this.time = 0

	// }
	// return this.target

};