{
    init: function(elevators, floors) {
        function utility(elevator, floor) {
            var elevatorLevel = elevator.currentFloor();
            var floorLevel = floor.floorNum();

            var alreadyInQueueFactor = 0;
            if (elevator.destinationQueue.includes(floorLevel)) {
                alreadyInQueueFactor = -10;
            }
            // pick idle elevator first
            var idleFactor = 0;
            if (elevator.destinationDirection == "stopped") {
                idleFactor = -4;
            }
            var destDir = 0;
            if (elevator.destinationDirection == "down") {
                destDir = -1;
            } else if (elevator.destinationDirection == "up") {
                destDir = 1;
            }
            var distance = Math.abs(elevatorLevel + destDir - floorLevel);

            var loadFactor = 0;
            if (elevator.loadFactor > .7) {
                loadFactor = 5;
            }

            return alreadyInQueueFactor + distance + idleFactor + loadFactor;

        }
        function choose_elevator(floor) {
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