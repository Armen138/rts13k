
/* unitObject:
	{
		mobile: bool,
		health: int,
		art: Function (see art object),
		optional loadTime: int,
		optional damage: int,
		optional range: int (tiles),
		optional upkeep: int (energy),
		optional moveDuration: int (ms)
	}
*/

var def = {
	tank: {
		name: "tank",
		mobile: true,
		health: 100,
		damage: 10,
		range: 5,
		art: art.tank,
		loadTime: 1000,
		moveDuration: 400,
		cost: 100
	},
	heavyTank: {
		name: "heavyTank",
		mobile: true,
		health: 200,
		damage: 15,
		range: 6,
		art: art.heavyTank,
		loadTime: 1500,
		moveDuration: 600,
		cost: 200
	},
	turret: {
		name: "turret",
		mobile: false,
		health: 120,
		damage: 40,
		range: 7,
		art: art.turret,
		loadTime: 700,
		upkeep: -50,
		cost: 100,
		collision: 3
	},
	mine: {
		name: "mine",
		mobile: false,
		health: 100,
		range: 7,
		upkeep: -100,
		cost: 150,
		income: 10,
		art: art.mine,
		//resource crystal thingies
		terrain: 3,
		collision: 3
	},
	powerplant: {
		name: "powerplant",
		mobile: false,
		health: 100,
		range: 7,
		upkeep: 150,
		cost: 50,
		art: art.powerplant,
		collision: 3,
		big: true
	},
	hydroplant: {
		name: "hydroplant",
		mobile: false,
		health: 100,
		range: 7,
		upkeep: 800,
		cost: 500,
		art: art.hydroplant,
		terrain: 0,
		collision: 3
	},
	factory: {
		name: "factory",
		mobile: false,
		health: 1000,
		art: art.factory,
		factory: true,
		range: 5,
		collision: 3,
		cost: 150,
		upkeep: -100,
		big: true,
		builds: ["tank", "heavyTank"]
	}
};
