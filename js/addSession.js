/* Opens connection to database (at first time, database is created) */

var database = openDatabase("mtr_db", "1.0", "MobileTimeRecording", 200000);
console.log("Database opened");															//For debugging purposes

/* SQL Queries */

var sqlCreateTableProjects = "CREATE TABLE IF NOT EXISTS Projects (id INTEGER PRIMARY KEY, name TEXT, is_displayed INTEGER, is_used INTEGER, is_archived INTEGER)";

var sqlCreateTableSessions = "CREATE TABLE IF NOT EXISTS Sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER, timestamp_start INTEGER, timestamp_stop INTEGER)";

var sqlCreateTableUser = "CREATE TABLE IF NOT EXISTS User (employee_id INTEGER PRIMARY KEY, lastname TEXT, firstname TEXT, weekly_working_time INTEGER, total_vacation_time INTEGER, current_vacation_time INTEGER, current_overtime INTEGER, registration_date INTEGER)";

var sqlInsertSession = "INSERT INTO Sessions (project_id, timestamp_start, timestamp_stop) VALUES (?, ?, ?)";

/*
function setProjectName
Enters the project name into the legend of the HTML-page in order to show the user for which project he enters a session.
*/
function setProjectName()
{
	var projectName = window.sessionStorage.getItem("projectName");
	document.getElementById("pageHead").innerHTML = "Add a session for Project " + projectName;
}

/* 
function initDatabase 
Ensures that database is initialized and contains the required tables.
*/
function initDatabase() 
{
	createTables();
	console.log("Database initilized");													//For debugging purposes
}

/* 
function createTables
Creates the required tables for the database.
 */
function createTables()
{
	database.transaction(function (tx)
	{
		tx.executeSql(sqlCreateTableProjects, []);
		tx.executeSql(sqlCreateTableSessions, []);
		tx.executeSql(sqlCreateTableUser, []);
	});
}

/* 
function addSession
Reads the data which the user has entered into the app and inserts it into the database table Sessions
*/
function addSession()
{
	console.log("addSession starts:");													//For debugging purposes
	var dateRaw = document.getElementById("session.date");
	var startTimeRaw = document.getElementById("session.start");
	var stopTimeRaw = document.getElementById("session.stop");
	
	var date = dateRaw.value;
	var startTime = startTimeRaw.value;
	var stopTime = stopTimeRaw.value;
	
	console.log("date: " + date);														//For debugging purposes
	console.log("startTime: " + startTime);												//For debugging purposes
	console.log("stopTime: " + stopTime);												//For debugging purposes
	
	var projectName = window.sessionStorage.getItem("projectName");
	var projectId = window.sessionStorage.getItem("projectId");
	var startTimestamp = Date.parse(date + " " + startTime)/1000;
	var stopTimestamp = Date.parse(date + " " + stopTime)/1000;
	
	if (startTimestamp <= stopTimestamp) 
	{
		console.log("Insert into Database");
		database.transaction(function (tx) { tx.executeSql(sqlInsertSession, [projectId, startTimestamp, stopTimestamp], function(tx, res) {
			   console.log("Insert complete");
			   window.sessionStorage.removeItem("projectName");
			   window.sessionStorage.removeItem("projectId");
			   window.location.replace("index.html?style=success&message=Session%20added%20for%20" + projectName);
		   }); });
	} else {
		window.location.replace("index.html?style=danger&message=negative%20times%20are%20not%20allowed");
	}
}