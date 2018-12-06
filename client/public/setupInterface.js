var date = new Date(); 
var timestamp = date.getTime();
var playerLoggedIn = false;
var currentID = timestamp;

//Converts json data of an entry into readable text items
//Format is timestamp: {id: "", text:""}
function parseJSONData(dataEntry) {
	var entryTimestamp = Object.keys(dataEntry);
	var id = dataEntry[entryTimestamp]["id"];
	var textval = dataEntry[entryTimestamp]["text"];
	
	var child = "<li class=\"chatbox-list-item\">" + id + " : " + textval + "</li>";
	$(".chatbox-list").append(child);
}

//UNUSED - Creates a new line in the editor when the user presses 'enter'
function createNewEditorLine(index) {
	var currentLines = $(".line-list").children().length;
	//console.log("current lines: " + currentLines);
	//console.log("current index: " + index);
	var newLineObject = " <input type = \"text\" name=\"editor1\" class=\"editor\">";
	var newLineListObject = "<li class = \"editor-line\">" + newLineObject + "</li>";
	
	if(currentLines == 0) {
		$(".coding-editor .line-list").prepend(newLineListObject);
	}
	else {
		//$(".line-list:nth-child(" + index + ")").after(newLineListObject);
		$(".editor-line:eq(" + (index-1) + ")").after(newLineListObject);
	}


	//Unbind previous on click methods, reinstate for the new set of lines
	$(".editor-line").unbind();
	$(".editor-line").on('keyup', function(e) {
		var new_index = $(".editor-line").index(this);
		if(e.keyCode == 13) {
			createNewEditorLine(new_index+1);
		}
	});

	
	
}

//Get the current chat data from firebase
function readCurrentChat() {
	$.ajax({
		type: "GET",
		url: "https://comm-app-d4cad.firebaseio.com/chat.json",
		dataType: "json"
	}).done(function (res) {
		console.log("Response:" + JSON.stringify(res));
		
		//clear the current chatbox items before refresh:
		$(".chatbox-list").empty();
		
		//Make sure response is not null
		if(res != "null") {
			var entries = Object.keys(res);
			
			//Get each entry under "chat" not including the special randomized ID
			for(index in entries) {
				parseJSONData(res[entries[index]]);
			}
		}
		
	}).fail(function (jqXHR, textStatus, errorThrown) {
		console.log("AJAX call failed: " + textStatus + ", " + errorThrown);
	});
}


//Send the current chat box data to firebase
function sendToFirebase(username, textval) {
	
	var date = new Date(); 
	var timestamp = date.getTime();
	
	var jsonString = '{"d1": {"text": 123}}';
	console.log(jsonString);
	var to_send = '{\"' + timestamp + '\": {"id": \"' + username + '\", "text": \"' + textval + '\"}}';
	$.ajax({
		type: "POST",
		url: "https://comm-app-d4cad.firebaseio.com/chat.json",
		data: to_send,
		dataType: "json",
		success: function (msg) {
		   //do something
		   console.log("POST: " + JSON.stringify(msg));
		},
		error: function (errormessage) {
			//do something else
			console.log("POST ERROR: " + JSON.stringify(errormessage));
		}
	});
}


//"delete" the previous chat data from firebase (actually just rewrites it all to null)
function deleteChatData() {

	$.ajax({
		type: "PUT",
		url: "https://comm-app-d4cad.firebaseio.com/chat.json",
		data: "\"null\"",
		success: function (msg) {
		   //do something
		   console.log("PUT DELETE: " + JSON.stringify(msg));
		},
		error: function (errormessage) {
			//do something else
			console.log("PUT DELETE ERROR: " + JSON.stringify(errormessage));
		}
	});
}

//Add online status for this user
function loginOnline() {
	
	var date = new Date(); 
	var timestamp = date.getTime();
	
	var to_send = '{"id": \"' + currentID + '\", "timestamp": \"' + timestamp + '\"}';
	
	$.ajax({
		type: "POST",
		url: "https://comm-app-d4cad.firebaseio.com/online.json",
		data: to_send,
		success: function (msg) {
		   //do something
		   console.log("POST login online: " + JSON.stringify(msg));
		},
		error: function (errormessage) {
			//do something else
			console.log("POST login online ERRORs: " + JSON.stringify(errormessage));
		}
	});
	
	sendToFirebase(currentID, " joined the chat!");
}

//Update the current user in the database
function updateCurrentUser(uniqueID) {
	console.log("Updating new user" + uniqueID);
	
	var date = new Date(); 
	var current_timestamp = date.getTime();
	
	var to_send = '{"id": \"' + currentID + '\", "timestamp": \"' + current_timestamp + '\"}';
	
	$.ajax({
		type: "PUT",
		url: "https://comm-app-d4cad.firebaseio.com/online/" + uniqueID + ".json",
		data: to_send,
		success: function (msg) {
		   //do something
		   console.log("POST login update: " + JSON.stringify(msg));
		},
		error: function (errormessage) {
			//do something else
			console.log("POST login update ERRORs: " + JSON.stringify(errormessage));
		}
	});
}

//Remove online user
function removeOnlineUser(uniqueID, username) {
	console.log("removing old user " + uniqueID);
	
	$.ajax({
		type: "DELETE",
		url: "https://comm-app-d4cad.firebaseio.com/online/" + uniqueID + ".json",
		success: function (msg) {
		   //do something
		   console.log("POST login delete: " + JSON.stringify(msg));
		},
		error: function (errormessage) {
			//do something else
			console.log("POST login delete ERRORs: " + JSON.stringify(errormessage));
		}
	});
	
	sendToFirebase(username, " left the chat!");
	
}

//Check current online users
function findOnlineSelf(uniqueID, dataEntry) {
	var id = dataEntry["id"];
	var timestamp = dataEntry["timestamp"];
	
	var date = new Date(); 
	var current_timestamp = date.getTime();
	
	//If the timestamp difference exceeds 10 seconds, delete this user
	if(parseInt(current_timestamp) - parseInt(timestamp) > 10000) {
		removeOnlineUser(uniqueID, id);
	}
	
	//We found the ID, so update the new time
	if(id == currentID) {
		updateCurrentUser(uniqueID);
	}
}

//Send online status
function pingOnlineStatus() {
	
	$.ajax({
		type: "GET",
		url: "https://comm-app-d4cad.firebaseio.com/online.json",
		dataType: "json"
	}).done(function (res) {
		console.log("Response:" + JSON.stringify(res));
		
		//Make sure response is not null
		if(res != "null") {
			var entries = Object.keys(res);
			
			//Get each entry under "online" not including the special randomized ID
			for(index in entries) {
				findOnlineSelf(entries[index], res[entries[index]]);
			}
		}
		
	}).fail(function (jqXHR, textStatus, errorThrown) {
		console.log("AJAX call failed: " + textStatus + ", " + errorThrown);
	});
}


//Check if another player has submitted 

//Refresh the page every second to update the chat
setInterval(function () {
	 readCurrentChat();
	 
	 if(playerLoggedIn) {
		 pingOnlineStatus();
	 }
	 
 }, 1000);


//Sends a chat message to firebase depending on the chat input
function sendChatMessage() {
	var message = $("#sendMsg").val();
	if(message == "deleteall") {
		console.log("Deleting all messages");
		deleteChatData();
	}
	else {
		sendToFirebase(currentID, message);
	}
}

//Opens the username creation box
function toggleUsernameBox() {
	
	//If the chatbox container is closed, then we close it
	if($( ".login-chat-container" ).hasClass( "close" )) {
		$( ".login-chat-container").removeClass("close");
	}  //If the chatbox container is closed, we open it
	else {
		$( ".login-chat-container" ).addClass("close");
	}
}

//Shows/hides the chatbox
function toggleChatContainer() {
	
	//If the chatbox container is open, then we close it
	if($( ".chatbox-container" ).hasClass( "show" )) {
		$( ".chatbox-container" ).removeClass("show");
	}  //If the chatbox container is closed, we open it
	else {
		$( ".chatbox-container" ).addClass("show");
	}
	
}

//Save the current username
function saveUsername() {
	currentID = $("#saveUsernamebox").val();
	
	if(currentID != "") {
		console.log("Created ID: " + currentID);
		$(".login-chat-container").addClass("close");
		toggleChatContainer();
		
		playerLoggedIn = true;
		
		loginOnline();
	}
	
}

//Bind the chat icon to open or close the chat when clicked
$('.chat-toggle').bind('click', function() {
	
	if(!playerLoggedIn) {
		toggleUsernameBox();
	}
	else {
		toggleChatContainer();
	}
	
	
});

//Bind the username box submit button to save the username when clicked
$('.login-chat-submit').bind('click', function() {
	saveUsername();
});
 
//Bind the chat send functionality to the "Send Chat" button
$('.sendChat').bind('click', function() {
	sendChatMessage();
	document.getElementById('sendMsg').value = '';
});

//Bind the chat X button with the display toggle for the chat container
$('.close-button').bind('click', function() {
	toggleChatContainer();
});

setTimeout(function(){ 
	$("#run_button").bind('click', function() {
		if(playerLoggedIn) {
			sendToFirebase(currentID, " - Submitted some Code!");
		}
		
	});
 }, 2000);

