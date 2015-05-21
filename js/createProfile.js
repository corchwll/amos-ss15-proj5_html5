/*
  ~     Mobile Time Accounting
  ~     Copyright (C) 2015
  ~
  ~     This program is free software: you can redistribute it and/or modify
  ~     it under the terms of the GNU Affero General Public License as
  ~     published by the Free Software Foundation, either version 3 of the
  ~     License, or (at your option) any later version.
  ~
  ~     This program is distributed in the hope that it will be useful,
  ~     but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~     GNU Affero General Public License for more details.
  ~
  ~     You should have received a copy of the GNU Affero General Public License
  ~     along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/* Opens connection to database (at first time, database is created) */

var database = openDatabase("mtr_db", "1.0", "MobileTimeRecording", 200000);
console.log("Database opened");															//For debugging purposes

/* SQL Queries */

var sqlCreateTableProjects = "CREATE TABLE IF NOT EXISTS Projects (id INTEGER PRIMARY KEY, name TEXT, is_displayed INTEGER, is_used INTEGER, is_archived INTEGER)";

var sqlCreateTableSessions = "CREATE TABLE IF NOT EXISTS Sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER, timestamp_start INTEGER, timestamp_stop INTEGER)";

var sqlCreateTableUser = "CREATE TABLE IF NOT EXISTS User (employee_id INTEGER PRIMARY KEY, lastname TEXT, firstname TEXT, weekly_working_time INTEGER, total_vacation_time INTEGER, current_vacation_time INTEGER, current_overtime INTEGER, registration_date INTEGER)";

var sqlInsertUser = "INSERT INTO User (employee_id, firstname, lastname, weekly_working_time, total_vacation_time, current_vacation_time, current_overtime, registration_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

var sqlUpdateUser = "UPDATE User SET employee_id = ?, firstname = ?, lastname = ?, weekly_working_time = ?, total_vacation_time = ?, current_vacation_time = ?, current_overtime = ?, registration_date = ?";

var sqlSelectUser = "SELECT * FROM User";

var sqlCountUser = "SELECT count(*) AS row_count FROM User";

/* 
function initDatabase 
Ensures that database is initialized and contains the required tables.
*/
function initDatabase() 
{
	createTables();
	console.log("Database initilized");													//For debugging purposes
	checkDatabase();
	console.log("Form filled with current database content");							//For debugging purposes
}

/*
Event listener for customized notification if user does not fill out every required field. 
For fields with specific value range, the particular notification message is further customized.
*/
document.addEventListener("DOMContentLoaded", function() 
{
    var elements = document.getElementsByTagName("INPUT");
    for (var i = 0; i < elements.length; i++) 
		{
        elements[i].oninvalid = function(e) 
		{
            e.target.setCustomValidity("");
            if (!e.target.validity.valid) 
			{
				if("profile.weekly_working_time" === e.target.name && "" != e.target.value) 
				{
					e.target.setCustomValidity("please check your inputs");
				} else if("profile.total_vacation_time" === e.target.name && "" != e.target.value) {
					e.target.setCustomValidity("please check your inputs");
				} else if("profile.current_vacation_time" === e.target.name && "" != e.target.value) {
					e.target.setCustomValidity("please check your inputs");
				} else if("profile.id" === e.target.name && e.target.value.length > 0) {
					e.target.setCustomValidity("Your personal ID must consist of 5 numbers");
				} else {	//Standard (empty field)
					e.target.setCustomValidity("please fill out every field");
				}
            }
        };
        elements[i].oninput = function(e) 
		{
            e.target.setCustomValidity("");
        };
    }
})

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
function checkDatabase
Checks if database table User is already filled with content from the user and prepares the session storage accordingly, in order to allow the function createProfile to use the correct SQL syntax (INSERT if database emtpy, UPDATE if database already filled with user data). If database already contains user data, function fillForm is called in order to display this data in the html form.
Function has to be called upon page load.
*/
function checkDatabase()
{
	database.transaction(function (tx) 
	{ 
		tx.executeSql(sqlCountUser, [], function(tx, res) 
		{
			row = res.rows.item(0);
			
			if(0 === row.row_count) {
				console.log("DB empty");												//For debugging purposes
				window.sessionStorage.setItem("userTable", "empty");		
			} else {
				console.log("DB filled");												//For debugging purposes
				window.sessionStorage.setItem("userTable", "filled");
				fillForm();
			}
		}); 
	});
}

/* 
function fillForm
Reads the current content of database table User and fills the form in order to allow the user to edit the data.
*/
function fillForm()
{
	database.transaction(function (tx) 
	{ 
		tx.executeSql(sqlSelectUser, [], function(tx, res) 
		{
			row = res.rows.item(0);
			
			var tmpProfileIdRaw = document.getElementById("profile.id");
			var tmpProfileForenameRaw = document.getElementById("profile.forename");
			var tmpProfileSurnameRaw = document.getElementById("profile.surname");
			var tmpProfileWeaklyWorkingTimeRaw = document.getElementById("profile.weekly_working_time");
			var tmpProfileTotalVacationTimeRaw = document.getElementById("profile.total_vacation_time");
			var tmpProfileCurrentOvertimeRaw = document.getElementById("profile.current_overtime");
			var tmpProfileCurrentVacationTimeRaw = document.getElementById("profile.current_vacation_time");

			tmpProfileIdRaw.value = row.employee_id;
			tmpProfileForenameRaw.value = row.firstname;
			tmpProfileSurnameRaw.value = row.lastname;
			tmpProfileWeaklyWorkingTimeRaw.value = row.weekly_working_time;
			tmpProfileTotalVacationTimeRaw.value = row.total_vacation_time;
			tmpProfileCurrentOvertimeRaw.value = row.current_vacation_time;
			tmpProfileCurrentVacationTimeRaw.value = row.current_overtime;
		}); 
	});
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
	
	if ("empty" === window.sessionStorage.getItem("userTable"))
	{
		console.log("Insert into Database");
		
		database.transaction(function (tx) 
		{ 
			tx.executeSql(sqlInsertUser, [tmpProfileId, tmpProfileForename, tmpProfileSurname, tmpProfileWeaklyWorkingTime, tmpProfileTotalVacationTime, tmpProfileCurrentOvertime, tmpProfileCurrentVacationTime, currentTimestamp], function(tx, res) 
			{
				window.sessionStorage.removeItem("userTable");
				console.log("Insert complete");
				window.location.replace("index.html?style=success&message=Profile%20created");
			}); 
		});
	} else {
		console.log("Update Database");
		
		database.transaction(function (tx) 
		{
			tx.executeSql(sqlUpdateUser, [tmpProfileId, tmpProfileForename, tmpProfileSurname, tmpProfileWeaklyWorkingTime, tmpProfileTotalVacationTime, tmpProfileCurrentOvertime, tmpProfileCurrentVacationTime, currentTimestamp], function(tx, res) 
			{
				window.sessionStorage.removeItem("userTable");
				console.log("Update complete");
				window.location.replace("index.html?style=success&message=Profile%20updated");
			}); 
		});
	}
}
