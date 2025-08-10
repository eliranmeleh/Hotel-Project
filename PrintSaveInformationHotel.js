// Data Access Tier - logic related to the data access tier
// Singleton Class for managing Room Prices

class RoomPricesDB {
    constructor() {
        if (!RoomPricesDB.instance) {
            this.initializeRoomPrices();
            RoomPricesDB.instance = this;
        }

        return RoomPricesDB.instance;
    }

	// Function to stringify room data and store it in localStorage
    stringifyRoomPrices(number, room, price) {
        var numberStr = 'n.' + number;
        var room_type = 'room_type: ' + room;
        var price_str = 'price: ' + price;
        var dbStr = '{' + numberStr + ',' + room_type + ',' + price_str + '}';
        return dbStr;
    }

    processInfoRoomPrices(number, room, price) {
        var dbString = this.stringifyRoomPrices(number, room, price);
        var key = 'n.' + number; // Key for the room type in the DB
        localStorage.setItem(key, dbString);
    }

    initializeRoomPrices() {
        // Check if room prices are already initialized in localStorage
        if (!localStorage.getItem('roomPricesInitialized')) {
            // Room Types saved in DB (default settings)
            this.processInfoRoomPrices(1, 'Double Room', 350);
            this.processInfoRoomPrices(2, 'Double Room Deluxe', 420);
            this.processInfoRoomPrices(3, 'Family Room', 490);
            this.processInfoRoomPrices(4, 'Suite', 560);

            // Mark as initialized in localStorage
            localStorage.setItem('roomPricesInitialized', true);
        } else {
            console.log("Room prices are already initialized in the database.");
        }
    }
	
	// Gathering the DB about the room prices of the hotel
    getRoomPricesDB() {
        var rooms = [];
        // Define keys to retrieve in the desired order
        var roomKeys = ['n.1', 'n.2', 'n.3', 'n.4'];

        // Iterate through roomKeys to gather room data
        for (var i = 0; i < roomKeys.length; i++) {
            var roomID = roomKeys[i];
            var roomInfo = localStorage.getItem(roomID);

            if (roomInfo) {
                var tmpRoom = [];
                tmpRoom[0] = this.getDescription(roomInfo);
                tmpRoom[1] = this.getPrice(roomInfo);
                rooms.push(tmpRoom); // Store room information in array
            }
        }
        return rooms;
    }

    getDescription(roomInfo) {
        var startIndex = roomInfo.indexOf('room_type:') + 10;
        var endIndex = roomInfo.indexOf('price:') - 1;
        return roomInfo.substring(startIndex, endIndex);
    }

    getPrice(roomInfo) {
        var startIndex = roomInfo.indexOf('price:') + 6;
        var endIndex = roomInfo.indexOf('}');
        return roomInfo.substring(startIndex, endIndex);
    }
}

// Creating Singleton instance
const roomPricesDB = new RoomPricesDB();

// Singleton Class for managing Clients
class ClientsDB {
    constructor() {
        if (!ClientsDB.instance) {
            ClientsDB.instance = this;
        }

        return ClientsDB.instance;
    }

    processInfo_client(id, arrDate, depDate, adultCnt, kidCnt, roomType, specialReq) {
        var dbString = this.stringify_client(id, arrDate, depDate, adultCnt, kidCnt, roomType, specialReq);
        localStorage.setItem(id, dbString);
    }

    stringify_client(id, arrDate, depDate, adultCnt, kidCnt, roomType, specialReq) {
        var id = 'id: ' + id;
        var arrDate = 'arrDate: ' + arrDate;
        var depDate = 'depDate: ' + depDate;
        var adultCnt = 'adultCnt: ' + adultCnt;
        var kidCnt = 'kidCnt: ' + kidCnt;
        var roomType = 'roomType: ' + roomType;
        var specialReq = 'specialReq: ' + specialReq;
        var dbStr = '{' + id + ',' + arrDate + ',' + depDate + ',' + adultCnt + ',' + kidCnt + ',' + roomType + ',' + specialReq + '}';
        return dbStr;    
    }

    getClientDB() {
        var clients = [];    //rows: number of clients. cols: number of info params
        for (var i = 0; i < localStorage.length; i++) {
            var clientId = localStorage.key(i); //our key of every row will be the id of the client
            if (clientId.length === 9) { //checking if the length of the key is 9 (id 
                var clientInfo = localStorage.getItem(clientId);
                var tmpClient = [];
                tmpClient[0] = clientId;
                tmpClient[1] = this.getArrDate(clientInfo);
                tmpClient[2] = this.getDepDate(clientInfo);
                tmpClient[3] = this.getAdultCnt(clientInfo);
                tmpClient[4] = this.getKidCnt(clientInfo);
                tmpClient[5] = this.getRoomType(clientInfo);
                tmpClient[6] = this.getSpecialReq(clientInfo);
                clients.push(tmpClient); // Storing client information in the array
            }
        }
        return clients;
    }

    there_is(id) {
        return localStorage.getItem(id) !== null;
    }

    getArrDate(clientInfo) {
        var startIndex = clientInfo.indexOf('arrDate:') + 8;
        var endIndex = clientInfo.indexOf('depDate:') - 1;
        return clientInfo.substring(startIndex, endIndex);
    }

    getDepDate(clientInfo) {
        var startIndex = clientInfo.indexOf('depDate:') + 8;
        var endIndex = clientInfo.indexOf('adultCnt:') - 1;
        return clientInfo.substring(startIndex, endIndex);
    }

    getAdultCnt(clientInfo) {
        var startIndex = clientInfo.indexOf('adultCnt:') + 9;
        var endIndex = clientInfo.indexOf('kidCnt:') - 1;
        return clientInfo.substring(startIndex, endIndex);
    }

    getKidCnt(clientInfo) {
        var startIndex = clientInfo.indexOf('kidCnt:') + 7;
        var endIndex = clientInfo.indexOf('roomType:') - 1;
        return clientInfo.substring(startIndex, endIndex);
    }

    getRoomType(clientInfo) {
        var startIndex = clientInfo.indexOf('roomType:') + 9;
        var endIndex = clientInfo.indexOf('specialReq:') - 1;
        return clientInfo.substring(startIndex, endIndex);
    }

    getSpecialReq(clientInfo) {
        var startIndex = clientInfo.indexOf('specialReq:') + 11;
        var endIndex = clientInfo.indexOf('}');
        return clientInfo.substring(startIndex, endIndex);
    }
}

// Creating Singleton instance
const clientsDB = new ClientsDB();


