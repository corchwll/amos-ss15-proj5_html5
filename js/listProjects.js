/* Opens connection to database (at first time, database is created) */

var database = openDatabase("mtr_db", "1.0", "MobileTimeRecording", 200000);
console.log("Database opened");															//For debugging purposes

/* SQL Queries */

var sqlCreateTableProjects = "CREATE TABLE IF NOT EXISTS Projects (id INTEGER PRIMARY KEY, name TEXT)";

var sqlCreateTableSessions = "CREATE TABLE IF NOT EXISTS Sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER, timestamp_start INTEGER, timestamp_stop INTEGER)";

var sqlCreateTableUser = "CREATE TABLE IF NOT EXISTS User (employee_id INTEGER PRIMARY KEY, lastname TEXT, firstname TEXT, weekly_working_time INTEGER, total_vacation_time INTEGER, current_vacation_time INTEGER, current_overtime INTEGER, registration_date INTEGER)";

var sqlCreateViewTimes = "CREATE VIEW IF NOT EXISTS Aggregated_Times AS SELECT project_id, SUM(timestamp_stop - timestamp_start) AS aggregated_time FROM Sessions GROUP BY project_id"; 
/* WHERE timestamp_stop != 0 AND timestamp_start != 0 AND timestamp_stop IS NOT NULL AND timestamp_start IS NOT NULL GROUP BY project_id"; */

var sqlSelectAllProjectsWithTimes = "SELECT Projects.id, Projects.name, Aggregated_Times.aggregated_time FROM Projects LEFT JOIN Aggregated_Times ON Projects.id = Aggregated_Times.project_id";

/* 
function initDatabase 
Ensures that database is initialized and contains the required tables and views.
*/
function getProjectsFromDatabase() 
{
	createTablesAndViews();
	console.log("Database initilized");													//For debugging purposes
	listProjects();
}

/* 
function createTablesAndViews
Creates the required tables ad views for the database.
 */
function createTablesAndViews()
{
	database.transaction(function (tx)
	{
		tx.executeSql(sqlCreateTableProjects, []);
		tx.executeSql(sqlCreateTableSessions, []);
		tx.executeSql(sqlCreateTableUser, []);
		tx.executeSql(sqlCreateViewTimes, []);
	});
}

/* 
function listProjects
Lists all projects currently saved in the database table Projects and generates the required html-code for each project to allow their representation on the start page (index.html)
*/
function listProjects()
{
	var renderProject = function(row)
	{
		console.log("the time: " + row.aggregated_time);

		return '<div class="panel panel-default">' +
			'<div class="panel-heading" role="tab" id="' + row.id + '" data-toggle="collapse" data-parent="#ProjectList" href="#' + row.id + 'body" aria-expanded="true" aria-controls="collapseOne" onclick="">' +
				'<h4 class="panel-title">' +
					row.name +
				'</h4>' +
			'</div>' +
			'<div id="' + row.id + 'body" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">' +
				'<p>' +
					'<input class="btn btn-default" id="' + row.id + 'counter" value="0:0:0" />' +
					'<button class="btn btn-success" onclick="start(' + row.id + ')"><span class="glyphicon glyphicon-play"></span></button>' +
					'<button class="btn btn-danger" onclick="stop(' + row.id + ')"><span class="glyphicon glyphicon-stop"></span></button>' +
					'<button class="btn btn-info" onclick="addSessionForProject(&quot;' + row.id + '&quot;, &quot;' + row.name + '&quot;)"><span class="glyphicon glyphicon-plus"></span></button>' +
				'</p>' +	
			'</div>' +
		'</div>';
	};

	var render = function(tx, rs)
	{
		var rowOutput = '';
		var projectList = document.getElementById("ProjectList");
		var len = rs.rows.length;
		for(var i = 0; i < len; i++)
		{
			 rowOutput += renderProject(rs.rows.item(i));
		}

		projectList.innerHTML = rowOutput;
	};

	database.transaction(function(tx) 
	{
		tx.executeSql(sqlSelectAllProjectsWithTimes, [], render, onError);
	});
}

/*
function addSessionForProject
This function locally stores the information on which project the user chooses in order to add a session for the project. Furthermore, the function forwards after the storage process to the required page.
*/
function addSessionForProject(projectId, projectName) {
	window.sessionStorage.setItem("projectId", projectId);
	window.sessionStorage.setItem("projectName", projectName);
	window.location.replace("addSession.html");
}