	{
		init: function(elevators, floors) {
			function movingTowards(elevator, floorNum) {
				return (elevator.destinationDirection == "up" && (elevator.currentFloor() < floorNum)) || (elevator.destinationDirection == "up" && (elevator.currentFloor() > floorNum));
			}
			
			function dist(elevator, floor) {
				// first pass, elevator is available and moving up
				return Math.abs(elevator.currentFloor() - floor.floorNum());
			}
			function choose_elevator(floor) {
				var desiredLevel = floor.floorNum();
				var best;
				// first pass, elevators already moving there
		
				var options = elevators.filter(elevator => movingTowards(elevator, desiredLevel) && elevator.loadFactor < .8);
				if (options.length > 0) {
					best = options.reduce( (currMin, elevator) => { return (dist(currMin, floor) < dist(elevator, floor)) ? currMin : elevator; });
				} else {
					best = elevators.reduce( (currMin, elevator) => { return (dist(currMin, floor) < dist(elevator, floor)) ? currMin : elevator; });
				}
				
			
				return best;
			}
			
			function initFloor(floor) {
				
				floor.on("up_button_pressed", function() {
					var chosen = choose_elevator(floor);
					chosen.goToFloor(floor.floorNum());
				});
				floor.on("down_button_pressed", function() {
					var chosen = choose_elevator(floor);
					chosen.goToFloor(floor.floorNum());
				});
			
			}
			
			function initElevator(elevator) {
				elevator.movementState = "up";
				elevator.on("floor_button_pressed", function(floorNum) {
					elevator.goToFloor(floorNum);
					// Maybe tell the elevator to go to that floor?
				});
				elevator.on("passing_floor", function(passingFloorNum, direction) {
					if (elevator.turnOnLogging) {
						console.log(elevator.destinationQueue);
					}
					if (elevator.destinationQueue.includes(passingFloorNum)) {
						elevator.destinationQueue = elevator.destinationQueue.filter(floorNum => passingFloorNum != floorNum);
						elevator.checkDestinationQueue();
						elevator.goToFloor(passingFloorNum, true)
					}
				});
				elevator.on("stopped_at_floor", function(floorNum) {
					var topFloor = Math.max(...elevator.destinationQueue);
					var bottomFloor = Math.min(...elevator.destinationQueue);
					if (elevator.turnOnLogging) {
						console.log(elevator.movementState + " " + elevator.currentFloor() + " " + elevator.destinationQueue);
					}
					
					if (floorNum >= topFloor || floorNum == floors.length) {
						elevator.movementState = "down";
						elevator.goingUpIndicator(false);
						elevator.goingDownIndicator(true);
						if (elevator.turnOnLogging) {
								console.log("reached the top");
						}

					} else if (floorNum <= bottomFloor || floorNum == 0) {

						elevator.movementState = "up";
						elevator.goingUpIndicator(true);
						elevator.goingDownIndicator(false);
						if (elevator.turnOnLogging) {
							console.log("reached the bottom");
						}

					}
					if (elevator.movementState == "up") {
						elevator.goToFloor(topFloor, true);
					} else {
						elevator.goToFloor(bottomFloor, true);
					}
					elevator.destinationQueue = [...new Set(elevator.destinationQueue.filter(lv => lv != floorNum))];
					elevator.checkDestinationQueue();
				});
			}

			elevators.forEach(initElevator);
			elevators[0].turnOnLogging = true;
			floors.forEach(initFloor);
			
		},
		update: function(dt, elevators, floors) {
			// We normally don't need to do anything here
		}
	}