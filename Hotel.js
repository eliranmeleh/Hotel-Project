//Logic Tier - logic related to the presentation tier


// Function to toggle the display of myDIV element
function Display_text() {
    var x = document.getElementById("myDIV");
	// Check if myDIV is currently hidden or not set
    if (x.style.display === "none" || x.style.display === "") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

// If the user is on the button the picture will be shown
function ShowInformation() {
    var infoPic = document.getElementById('InfoPic');
    infoPic.style.display = 'block';   //display InfoPic
    
}

// If the user has moved out of the button the picture will be hidden
function HideInformation() {
    var infoPic = document.getElementById('InfoPic');
    infoPic.style.display = 'none';   //hide InfoPic
}

// Checking the user if the id is written correctly
function validateID() {
    var id_num = document.getElementById('id').value;
    var id_error = document.getElementById('id_error');
    var id_input = document.getElementById('id');

    // Check if the ID contains only digits
    if (!/^\d*$/.test(id_num)) {
        id_input.style.outline = '2px solid red';
        id_error.textContent = "Only digits can be entered";
    } 
    // Check if the ID length is over 9 digits
    else if (id_num.length > 9) {
        id_input.style.outline = '2px solid red';
        id_error.textContent = "ID is too long";
    } 
    // If ID is valid
    else {
        id_input.style.outline = '2px solid black';
        id_error.textContent = "";
    }
}

// It will affect id textbar at booking page
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('id').addEventListener('input', validateID);
});



// Function for submit button
// Function to calculate the number of nights between two dates
function calculateNights(arrivalDate, departureDate) {
    const startDate = new Date(arrivalDate);
    const endDate = new Date(departureDate);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
}

// Function to get the price of the selected room type from local storage
function getRoomPrice(roomType) {
    const roomKeys = {
        'double_room': 'n.1',
        'double_room_delux': 'n.2',
        'family_room': 'n.3',
        'suite': 'n.4'
    };

    const key = roomKeys[roomType];
    const roomInfo = localStorage.getItem(key);
    if (roomInfo) {
        const price = roomInfo.match(/price: (\d+)/)[1];
        return parseInt(price);
    }
    return 0;
}

// Function for submit button
function form_submit() {
    var id_num = document.getElementById('id').value;
    var arrivalDate = document.getElementById('start').value;
    var departureDate = document.getElementById('end').value;
    var adultsAmount = document.getElementById('adults_amount').value;
    var kidsAmount = document.getElementById('kids_amount').value;
    var msgRequest = document.getElementById('t_area').value;
    var alertMsg = "";
    
    var double_room = document.getElementById('double_room').checked;
    var double_room_delux = document.getElementById('double_room_delux').checked;
    var family_room = document.getElementById('family_room').checked;
    var suite = document.getElementById('suite').checked;

    // Get the current date in YYYY-MM-DD format
    var currentDate = new Date().toISOString().split('T')[0];

    // Validate ID
    if (id_num.length === 0) {
        alertMsg += "\nPlease enter your ID number.";
    } // Checking if the ID number is an Israeli ID with the help of the function below
    else if (!is_israeli_id_number(id_num)) {
        alertMsg += "\nPlease enter your ID number correctly.";
    }
    
    // Validate Arrival Date
    if (trim(arrivalDate) === '') {
        alertMsg += "\nPlease select arrival date.";
    } else if (arrivalDate < currentDate) {
        alertMsg += "\nArrival date cannot be in the past.";
    }

    // Validate Departure Date
    if (trim(departureDate) === '') {
        alertMsg += "\nPlease select departure date.";
    }
    
    // Validate Arrival Date is before Departure Date
    if (arrivalDate !== '' && departureDate !== '' && new Date(arrivalDate) > new Date(departureDate)) {
        alertMsg += "\nArrival date cannot be later than departure date.";
    }
    
    // Validate Number of Adults
    if (adultsAmount === 'select') {
        alertMsg += "\nPlease select number of adults.";
    }

    var room_choice;
    // Validate Room Choosing
    if (double_room) {
        room_choice = 'double_room';
    }
    else if (double_room_delux) {
        room_choice = 'double_room_delux';
    }
    else if (family_room){
        room_choice = 'family_room';
    }        
    else if (suite) {
        room_choice = 'suite';
    }
    else { //if none of the options is checked we will ask the user to check one
        alertMsg += "\nPlease select a room.";
    }
    
    if (alertMsg !== '') {
        alert(alertMsg);
    }
    //if the alert message is empty it means that every check passed the test
    else {
        //if the msgRequest is empty we will want it to be 'none'
        if (trim(msgRequest) === '') {
            msgRequest = 'none';
        }

        // Calculate the number of nights
        const nights = calculateNights(arrivalDate, departureDate);

        // Get the room price
        const roomPrice = getRoomPrice(room_choice);

        // Calculate the total price
        const totalPrice = nights * roomPrice;
        
        var textForDisplay = "Your request is submitted with the following details:</br>" +
            "ID number: " + id_num + "</br>" +
            "Arrival Date: " + arrivalDate + "</br>" +
            "Departure Date: " + departureDate + "</br>" +
            "Number of Adults: " + adultsAmount + "</br>" +
            "Number of Kids: " + kidsAmount + "</br>" +
            "Room Type: " + room_choice + "</br>" +
            "Special Requests: " + msgRequest + "</br>" +
            "Total Price: " + totalPrice + " ILS";
        
        //displaying the info submitted
        document.getElementById('free_text').innerHTML = textForDisplay;
        document.getElementById('free_text_container').style.display = 'block';
		// Save information to the database using clientsDB 
        clientsDB.processInfo_client(id_num, arrivalDate, departureDate, adultsAmount, kidsAmount, room_choice, msgRequest);  //saving the information after checking that everything is ok to the DB
    }
}


// Function for reset button
function form_reset() {
	document.getElementById('id').value = '';
    document.getElementById('start').value = '';
    document.getElementById('end').value = '';
    document.getElementById('adults_amount').value = 'select';
    document.getElementById('kids_amount').value = 'select';
    document.getElementById('t_area').value = '';
    
    var roomRadios = document.getElementsByName('room_choosing');
    for (var i = 0; i < roomRadios.length; i++) {
        roomRadios[i].checked = false;
    }
	
	document.getElementById('free_text').innerHTML = '';
    document.getElementById('free_text_container').style.display = 'none';
}


// Remove spaces before and after str
function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

//
//
//
// The carusel of the room pictures
var img_room = document.getElementById('room_img');
var img_room_caro = ['assets/sources/room_pic1.jpg', 'assets/sources/room_pic2.jpg', 'assets/sources/room_pic3.jpg'];
var currentPicture = 0;

// Prev_button event on the carousel 
function button_prev()
{
	if(currentPicture  === 0)
		currentPicture  = img_room_caro.length - 1; //setting the current picture to be prev one by changing the index value
	else
		currentPicture--; //setting the current picture to be last one by changing the index value
	updateImage();

}

// Next_button event on the carousel 
function button_next()
{
	if(currentPicture == img_room_caro.length - 1)
		currentPicture = 0; //setting the current picture to be the first one by changing the index value
	else
		currentPicture++; //setting the current picture to be prev one by changing the index value
	updateImage();
}

// Updating the picture
function updateImage() 
{
    document.getElementById('room_img').src = img_room_caro[currentPicture];
}
// Function that will detect if the id number is an israeli id or not
function is_israeli_id_number(id) {
    id = String(id).trim();
    if (id.length > 9 || isNaN(id)) return false;
    id = id.length < 9 ? ("00000000" + id).slice(-9) : id;
    return Array.from(id, Number).reduce((counter, digit, i) => {
        const step = digit * ((i % 2) + 1);
        return counter + (step > 9 ? step - 9 : step);
    }, 0) % 10 === 0;
}

document.addEventListener('DOMContentLoaded', (event) => {
    const videoElement = document.getElementById('b-roll');
    if (videoElement) {
        videoElement.play();
    }
});

//Updates the room details and image based on the selected room type.
function showRoomInfo(roomType) {
    let roomDetails = ''; // Holds the text description of the selected room
    let roomImage = '';   // Holds the path to the image of the selected room
	
	// Determine the room details and image based on the selected roomType
	switch(roomType) {
		case 'double_room':
			roomDetails = 'The Double Room features a comfortable double bed, modern amenities, and a beautiful view of the city.';
			roomImage = 'assets/rooms/double_room.jpg';
			break;
		case 'double_room_delux':
			roomDetails = 'The Double Room Deluxe offers extra space, luxurious furnishings, and an enhanced city view.';
			roomImage = 'assets/rooms/double_room_delux.jpg';
			break;
		case 'family_room':
			roomDetails = 'The Family Room is perfect for families, featuring multiple beds and a spacious living area.';
			roomImage = 'assets/rooms/family_room.jpg';
			break;
		case 'suite':
			roomDetails = 'Our Suite includes a separate living area, a private balcony with a jacuzzi, and stunning sea views.';
			roomImage = 'assets/rooms/suite.jpg';
			break;
		default:
			roomDetails = 'Click on a room type to see the details.';
			roomImage = '';
	}
	
    // Update the room details text content in the HTML
	document.getElementById('roomDetails').textContent = roomDetails;
	
	// Get the image element and update its source and visibility
	const imgElement = document.getElementById('roomImage');
	imgElement.src = roomImage;
	imgElement.style.display = roomImage ? 'block' : 'none';
}
////////////////////////////////////////////////////
// ADMIN => CUSTOMER ACTIONS

// Function that prints all of the clients information
function getAllClients(){
    var ClientTable = clientsDB.getClientDB(); // Use clientsDB instance
	var textPrint = '';
	for(var i=0; i<ClientTable.length; i++){
		var client = ClientTable[i];
		textPrint += 'id: ' + client[0] + ', arrive date: ' + client[1] + ', departure date: '+ client[2];
		textPrint += ', adult number: ' + client[3] + ', kids number: ' + client[4];
		textPrint += ', room type chosen: ' + client[5] + ', special requests: ' + client [6];
		textPrint += '</br>';
	}
	document.getElementById('printAllClients').innerHTML = textPrint;
}

// Function that clears all of the clients information that we printed on the screen
function clearAllClients() {
	document.getElementById('printAllClients').innerHTML = '';
}

// Function to show the field for deleting a specific order
function show_Delete_Client() {
    if (document.getElementById("Delete_client_enter").style.display === 'none') {
        document.getElementById("Delete_client_enter").style.display = 'block';
		document.getElementById("button_delete_accept").style.display = 'block';
		document.getElementById("Delete_text").style.display = 'block';
    } else {
		document.getElementById("Delete_client_enter").style.display = 'none';
		document.getElementById("button_delete_accept").style.display = 'none';
		document.getElementById("Delete_text").style.display = 'none';
    }
}

// Checking the user if the id is written correctly
function validateID_admin() {
    var id_num = document.getElementById('Delete_client_enter').value;
    var id_error = document.getElementById('id_error_admin');
    var id_input = document.getElementById('Delete_client_enter');

    // Check if the ID contains only digits
    if (!/^\d*$/.test(id_num)) {
        id_input.style.outline = '2px solid red';
        id_error.textContent = "Only digits can be entered";
    } 
    // Check if the ID length is over 9 digits
    else if (id_num.length > 9) {
        id_input.style.outline = '2px solid red';
        id_error.textContent = "ID is too long";
    } 
    // If ID is valid
    else {
        id_input.style.outline = '2px solid black';
        id_error.textContent = "";
    }
}

// It will affect id textbar at booking page
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('Delete_client_enter').addEventListener('input', validateID);
});

// Function that deletes a spesific client from the clients orders
function delete_Spesific_Client() {
	var clientId = document.getElementById('Delete_client_enter').value.trim();
    
    // Check if the ID field is empty
    if (!clientId) {
        alert('Please enter an ID');
        return;
    }
    
    // Create an instance of ClientsDB
    const clientsDB = new ClientsDB();
    
    // Check if the ID exists in the database
    if (!clientsDB.there_is(clientId)) {
        alert('There is no client with that ID');
        return;
    }
    
    // Confirmation prompt
    var confirmation = confirm("Are you sure you want to delete this client?");
    if (confirmation) {
        // Remove the client data from local storage
        localStorage.removeItem(clientId);
        
        alert('Client deleted successfully');
        
        // Refresh the client table (assuming this function is defined)
        getAllClients();
    }
	
} 

// Function that deletes all client information from the DB
function deleteAllClients() {
    var confirmation = confirm("Are you sure you want to delete all clients?");  // Confirmation dialog
    
    if (confirmation) {
        var keysToDelete = [];  // Array to store keys to delete
        
        // Iterate through localStorage keys
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            
            // Check if the key is a client ID (assuming client IDs are exactly 9 characters long)
            if (key.length === 9) {
                keysToDelete.push(key);  // Add client ID key to keysToDelete array
            }
        }
        
        // Iterate through keysToDelete array and remove corresponding entries from localStorage
        keysToDelete.forEach(function(key) {
            localStorage.removeItem(key);
        });

        // Update user and clear displayed clients
        alert("All clients have been deleted.");
        clearAllClients();  // Clear displayed client information
    }
}

///////////////////////////////////////
// ADMIN => ROOM PRICES CHANGE FUNCTION 

// Function to validate all room price inputs
function validateRoomPrices() {
    // Get input elements
    var doubleRoomInput = document.getElementById('Double_Room_Edit');
    var doubleRoomDeluxInput = document.getElementById('Double_Room_Delux_Edit');
    var familyRoomInput = document.getElementById('Family_Room_Edit');
    var suiteInput = document.getElementById('Suite_Edit');

    // Get the error message container
    var errorMessageDiv = document.getElementById('error_message_admin_rooms');

    // Function to validate each input
    function validateInput(input) {
        return /^\d*$/.test(input.value);
    }

    // Reset all input borders and error messages
    [doubleRoomInput, doubleRoomDeluxInput, familyRoomInput, suiteInput].forEach(input => {
        input.style.border = '2px solid black';
    });
    errorMessageDiv.textContent = '';

    // Check if any input field has non-digit values
    var hasError = false;
    [doubleRoomInput, doubleRoomDeluxInput, familyRoomInput, suiteInput].forEach(input => {
        if (!validateInput(input)) {
            input.style.border = '2px solid red';
            hasError = true;
        }
    });

    if (hasError) {
        errorMessageDiv.textContent = 'All fields must contain only digits';
    }
}

// Attach the validation function to the input event of each text input field
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('Double_Room_Edit').addEventListener('input', validateRoomPrices);
    document.getElementById('Double_Room_Delux_Edit').addEventListener('input', validateRoomPrices);
    document.getElementById('Family_Room_Edit').addEventListener('input', validateRoomPrices);
    document.getElementById('Suite_Edit').addEventListener('input', validateRoomPrices);
});
// Edit Room Prices
function Edit_Room_prices() {
    var db = roomPricesDB.getRoomPricesDB(); // Use roomPricesDB instance

    var roomTypes = [
        { key: 'n.1', description: 'Double Room', inputId: 'Double_Room_Edit' },
        { key: 'n.2', description: 'Double Room Delux', inputId: 'Double_Room_Delux_Edit' },
        { key: 'n.3', description: 'Family Room', inputId: 'Family_Room_Edit' },
        { key: 'n.4', description: 'Suite', inputId: 'Suite_Edit' }
    ];

    for (var i = 0; i < roomTypes.length; i++) {
        var room = roomTypes[i];
        var inputValue = document.getElementById(room.inputId).value.trim();

        if (inputValue !== "") {
            if (isNumber(inputValue)) {
                var roomPrice = parseFloat(inputValue);
                roomPricesDB.processInfoRoomPrices(room.key.split('.')[1], room.description, roomPrice);
            } else {
                alert("Prices must be a valid number");
                return;
            }
        }
    }

    alert("Room prices updated successfully.");
    getAllRoomPrices();
}

// Function to check if an input is an int number
function isNumber(value) {
    return /^\d+$/.test(value);
}


// Function to display all room prices on the screen
function getAllRoomPrices() {
    var roomTable = roomPricesDB.getRoomPricesDB(); // Use roomPricesDB instance
    var textPrint = '';

    for (var i = 0; i < roomTable.length; i++) {
        var room = roomTable[i];
        textPrint += 'Room type: ' + room[0] + ', Price: ' + room[1] + '<br>';
    }
    document.getElementById('printAllRoom-types').innerHTML = textPrint;
}

// Wait until the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get the login form element and error message paragraph by their IDs
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
	var enter = false;
    // Add an event listener for the form submission event
    loginForm.addEventListener('submit', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the values entered in the username and password fields
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Check if the entered username and password match the required credentials
        if (username === 'admin' && password === '123456') {
            // If the credentials are correct, redirect the user to the Admin page
			alert("signed in successfully!");
            window.location.href = 'Admin.html';
        } else {
            // If the credentials are incorrect, display an error message
            errorMessage.textContent = 'Invalid username or password';
        }
    });
		
});

// Function to load room prices and update the HTML elements
function loadRoomPrices() {
    // Define the keys for the room prices
    const roomKeys = ['n.1', 'n.2', 'n.3', 'n.4'];

    // Get the room price elements in the HTML
    const priceElements = document.querySelectorAll('.RoomPrice'); // Updated the selector to match class

    // Iterate over the room keys and update the HTML with the corresponding price
    roomKeys.forEach((key, index) => {
        const roomInfo = localStorage.getItem(key);
        if (roomInfo) {
            const price = roomInfo.match(/price: (\d+)/)[1];
            if (priceElements[index]) {
                priceElements[index].textContent = `Price: ${price} ILS`;
            }
        }
    });
}

// Function to handle storage changes
function handleStorageChange(event) {
    if (event.key && event.key.startsWith('n.')) {
        loadRoomPrices();
    }
}

// Listen for storage changes
window.addEventListener('storage', handleStorageChange);

// Load room prices when the DOM content is loaded
document.addEventListener('DOMContentLoaded', (event) => {
    const videoElement = document.getElementById('b-roll');
    if (videoElement) {
        videoElement.play();
    }

    loadRoomPrices();
});

function confirmSignOut() {
    var confirmation = confirm('Are you sure you want to sign out?');
    if (confirmation) {
        window.location.href = 'Hotel.html';
    } else {
        // Do nothing and stay on the same page
    }
}
