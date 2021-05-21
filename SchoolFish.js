function SchoolFish(){
	this.moveTarget = undefined
	//最小相邻距离
	this.minNeighborDis = 2
	//鱼的视力范围
	this.viewDis = 5
	this.school = new School()
	this.school.enter(this)

}	

SchoolFish.prototype = new Fish()


SchoolFish.prototype.action = function() {
	this.period++
	this.school.action()

	this.schoolAction()


};



SchoolFish.prototype.died = function() {
	this.scene.remove(this.object)

	this.ocean.schoolFishes.splice(this.ocean.schoolFishes.indexOf(this),1)

};
