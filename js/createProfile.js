/* Opens connection to database (at first time, database is created) */

var database = openDatabase("mtr_db", "1.0", "MobileTimeRecording", 200000);
console.log("Database opened");															//For debugging purposes

/* SQL Queries */

var sqlCreateTableProjects = "CREATE TABLE IF NOT EXISTS Projects (id INTEGER PRIMARY KEY, name TEXT)";

var sqlCreateTableSessions = "CREATE TABLE IF NOT EXISTS Sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER, timestamp_start INTEGER, timestamp_stop INTEGER)";

var sqlCreateTableUser = "CREATE TABLE IF NOT EXISTS User (employee_id INTEGER PRIMARY KEY, lastname TEXT, firstname TEXT, weekly_working_time INTEGER, total_vacation_time INTEGER, current_vacation_time INTEGER, current_overtime INTEGER, registration_date INTEGER)";

var sqlInsertUser = "INSERT INTO User (employee_id, firstname, lastname, weekly_working_time, total_vacation_time, current_vacation_time, current_overtime, registration_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

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
function createProfile
Reads the data which the user has entered into the app and inserts it into the database table User
*/
function createProfile()
{
	console.log('insert button pressed');
	
	var tmpProfileIdRaw = document.getElementById("profile.id");
	var tmpProfileForenameRaw = document.getElementById("profile.forename");
	var tmpProfileSurnameRaw = document.getElementById("profile.surname");
	var tmpProfileWeaklyWorkingTimeRaw = document.getElementById("profile.weekly_working_time");
	var tmpProfileTotalVacationTimeRaw = document.getElementById("profile.total_vacation_time");
	var tmpProfileCurrentOvertimeRaw = document.getElementById("profile.current_overtime");
	var tmpProfileCurrentVacationTimeRaw = document.getElementById("profile.current_vacation_time");
	
	var tmpProfileId = tmpProfileIdRaw.value;
	var tmpProfileForename = tmpProfileForenameRaw.value;
	var tmpProfileSurname = tmpProfileSurnameRaw.value;
	var tmpProfileWeaklyWorkingTime = tmpProfileWeaklyWorkingTimeRaw.value;
	var tmpProfileTotalVacationTime = tmpProfileTotalVacationTimeRaw.value;
	var tmpProfileCurrentOvertime = tmpProfileCurrentOvertimeRaw.value;
	var tmpProfileCurrentVacationTime = tmpProfileCurrentVacationTimeRaw.value;
	var currentTimestamp = Math.floor(Date.now() / 1000);
	
	console.log("Insert into Database");
	
	database.transaction(function (tx) { tx.executeSql(sqlInsertUser, [tmpProfileId, tmpProfileForename, tmpProfileSurname, tmpProfileWeaklyWorkingTime, tmpProfileTotalVacationTime, tmpProfileCurrentOvertime, tmpProfileCurrentVacationTime, currentTimestamp], function(tx, res) {
		   console.log("Insert complete");
		   window.location.replace("index.html?style=success&message=Profile%20created");
       }); });
}