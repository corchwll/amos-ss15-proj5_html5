/* Opens connection to database (at first time, database is created) */

var database = openDatabase("mtr_db", "1.0", "MobileTimeRecording", 200000);
console.log("Database opened");															//For debugging purposes

/* SQL Queries */

var sqlCreateTableProjects = "CREATE TABLE IF NOT EXISTS Projects (id INTEGER PRIMARY KEY, name TEXT)";

var sqlCreateTableSessions = "CREATE TABLE IF NOT EXISTS Sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER, timestamp_start INTEGER, timestamp_stop INTEGER)";

var sqlCreateTableUser = "CREATE TABLE IF NOT EXISTS User (employee_id INTEGER PRIMARY KEY, lastname TEXT, firstname TEXT, weekly_working_time INTEGER, total_vacation_time INTEGER, current_vacation_time INTEGER, current_overtime INTEGER, registration_date INTEGER)";

var sqlInsertProjects = "INSERT INTO Projects (id, name) VALUES (?, ?)";

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
	database.transaction(function (tx) {tx.executeSql(sqlCreateTableProjects, [])});
	database.transaction(function (tx) {tx.executeSql(sqlCreateTableSessions, [])});
	database.transaction(function (tx) {tx.executeSql(sqlCreateTableUser, [])});
}

/* 
function errorFunction 
For possible future use
*/
/*
function errorFunction()
{
	//TODO
}
*/


/* 
function insertProject
Reads the data which the user has entered into the app and inserts it into the database table Projects
*/
function insertProject()
{
	console.log('insert button pressed');
	var tmpProjectIdRaw = document.getElementById("project.id");
	var tmpProjectNameRaw = document.getElementById("project.name");
	
	var tmpProjectId = tmpProjectIdRaw.value;
	var tmpProjectName =tmpProjectNameRaw.value;
	console.log("Insert into Database");
	database.transaction(function (tx) { tx.executeSql(sqlInsertProjects, [tmpProjectId, tmpProjectName], function(tx, res) {
		   console.log("Insert complete");
		   window.location.replace("index.html?style=success&message=Project%20" + tmpProjectName + "%20added");
       }); });
}
