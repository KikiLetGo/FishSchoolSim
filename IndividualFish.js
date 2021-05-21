
function IndividualFish(){
	this.type = "IndividualFish"

	
}
IndividualFish.prototype = new Fish()

IndividualFish.prototype.action = function() {
	this.period++
	this.individual()
};


IndividualFish.prototype.died = function() {
	this.scene.remove(this.object)

	this.ocean.individualFishes.splice(this.ocean.individualFishes.indexOf(this),1)

};