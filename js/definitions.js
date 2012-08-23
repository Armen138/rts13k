
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
		mobile: true,
		health: 100,
		damage: 10,
		range: 5,
		art: art.tank,
		loadTime: 1000,
		moveDuration: 100
	},
	turret: {
		mobile: false,
		health: 120,
		damage: 20,
		range: 7,
		art: art.turret,
		loadTime: 700,
		//collision.STRUCTURE
		collision: 3
	},
	base: {
		mobile: false,
		health: 1000,		
		art: art.base,
		range: 5,
		//collision.STRUCTURE
		collision: 3,
		big: true
	}
};
