{
	init: function(elevators, floors) {
		function movingTowards(elevator, floor) {
			return ((elevator.destinationDirection == "up" && (elevator.currentFloor() < floor.floorNum())) || ((elevator.destinationDirection == "up" && (elevator.currentFloor() > floor.floorNum()))
		}
		
		function utility(elevator, floor) {
			// first pass, elevator is available and moving up
			
		}
		function choose_elevator(floor) {
			var desired_level = floor.floorNum();
			
			// first pass, elevators moving in desired direction
			var 
			
			var min = elevators.reduce( (currMin, elevator) => { return (utility(currMin, floor) < utility(elevator, floor)) ? currMin : elevator; });
			console.log(min);
			return min;
		}
		
		function initFloor(floor) {
			
			floor.on("up_button_pressed", function() {
				var chosen = choose_elevator(floor);
				chosen.goToFloor(floor.floorNum());
			})
			floor.on("down_button_pressed", function() {
				var chosen = choose_elevator(floor);
				chosen.goToFloor(floor.floorNum());
			})
		
		}
		
		function initElevator(elevator) {
			elevator.on("idle", function() {
				elevator.goToFloor(0);
			});
			elevator.on("floor_button_pressed", function(floorNum) {
				elevator.goToFloor(floorNum);
				// Maybe tell the elevator to go to that floor?
			});
			elevator.on("passing_floor", function(passingFloorNum, direction) {
				console.log(elevator.destinationQueue)
				if (elevator.destinationQueue.includes(passingFloorNum)) {
					elevator.destinationQueue = elevator.destinationQueue.filter(floorNum => passingFloorNum != floorNum);
					elevator.checkDestinationQueue();
					elevator.goToFloor(passingFloorNum, true)
				}
			});
		}
		
		elevators.forEach(initElevator);
		floors.forEach(initFloor);
		
	},
	update: function(dt, elevators, floors) {
		// We normally don't need to do anything here
	}
}