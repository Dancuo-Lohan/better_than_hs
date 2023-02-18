class GameMap {
    // ######### CONSTRUCTOR #########
    constructor() {
        this.waterTile = " ";
        this.landTile = "■";
        this.size = 0;
    }

    distanceFromPoint(x1, y1, x2, y2) {
        // Calculate the Euclidean distance between two points
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    generateMap(mapSize) {
        let map = []; // Initialize an empty map
        let numberOfBlobs = Math.floor(Math.random() * 8) + 3; // Generate a random number of blobs between 4 and 9
    
        let blobs = []; // Initialize an empty array to store the coordinates of each blob
        for (let i = 0; i < numberOfBlobs; i++) {
            // Generate random x,y coordinates for each blob
            blobs.push([mapSize / (Math.random() * 2.1 + 1.4), mapSize / (Math.random() * 2.1 + 1.4)]);
        }
    
        for (let i = 0; i < mapSize; i++) { // Iterate over each row of the map
            let row = []; // Initialize an empty array to store the cells of the current row
            for (let j = 0; j < mapSize; j++) { // Iterate over each column of the current row
                let isLand = false; // Initialize a flag to indicate if the current cell should be land or sea
                for (let k = 0; k < numberOfBlobs; k++) {
                    // Calculate the distance between the current cell and the current blob
                    let distance = this.distanceFromPoint(i, j, blobs[k][0], blobs[k][1]);
                    if (distance < (mapSize / 4)) {
                        // If the distance is less than a random size, set the flag to indicate the cell is land
                        isLand = true;
                        break;
                    }
                }
                if (isLand) {
                    row.push(this.landTile);
                } else {
                    row.push(this.waterTile);
                }
            }
            map.push(row);
        }
    
        // Iterate over each row of the map
        for (let i = 0; i < mapSize; i++) {
            // Iterate over each column of the current row
            for (let j = 0; j < mapSize; j++) {
                let numberOfBlankNeighbors = 0;
                // Check the 8 neighboring cells (including diagonals)
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        if (i + x >= 0 && i + x < mapSize && j + y >= 0 && j + y < mapSize && map[i + x][j + y] === this.waterTile) {
                            numberOfBlankNeighbors++;
                        }
                    }
                }
                if (numberOfBlankNeighbors >= 5) {
                    // If there are at least 5 blank neighbors, fill the current cell with this.landTile
                    map[i][j] = this.waterTile;
                }
            }
        }
        return map; // Return the generated map
    }
}

module.exports = GameMap;