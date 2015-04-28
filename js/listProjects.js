/* Opens connection to database (at first time, database is created) */

var database = openDatabase("mtr_db", "1.0", "MobileTimeRecording", 200000);
console.log("Database opened");															//For debugging purposes

/* SQL Queries */

var sqlCreateTableProjects = "CREATE TABLE IF NOT EXISTS Projects (id INTEGER PRIMARY KEY, name TEXT)";

var sqlCreateTableSessions = "CREATE TABLE IF NOT EXISTS Sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER, timestamp_start INTEGER, timestamp_stop INTEGER)";

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
	database.transaction(function (tx) {tx.executeSql(sqlCreateTableProjects, [])});
	database.transaction(function (tx) {tx.executeSql(sqlCreateTableSessions, [])});
	database.transaction(function (tx) {tx.executeSql(sqlCreateViewTimes, [])});
}

/* 
function listProjects
Initiates the listing of all projects by receiving the data on projects from the database.
Deligates the actual listing to the result function printProjects
 */
function listProjects()
{
	console.log("list Projects");														//For debugging purposes
	database.transaction(function (tx) {tx.executeSql(sqlSelectAllProjectsWithTimes, [], printProjects)});
}

/* 
function printProjects
Prints the projects from the database table Projects
 */
function printProjects(tx, results) {
	console.log("print Projects");													//For debugging purposes
	var len = results.rows.length;
	for (var i = 0; i < len; i++)
	{
		document.getElementById("ProjectList").innerHTML +=
		'<div class="panel panel-default">' +
			'<div class="panel-heading" role="tab" id="' + results.rows.item(i).id + '" data-toggle="collapse" data-parent="#ProjectList" href="#' + results.rows.item(i).id + 'body" aria-expanded="true" aria-controls="collapseOne" onclick="startStop(' + results.rows.item(i).id + ')">' +
				'<h4 class="panel-title">' +
					results.rows.item(i).name +
				'</h4>' +
			'</div>' +
			'<div id="' + results.rows.item(i).id + 'body" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">' +
				'<div class="form-group">' +
					'<input class="btn btn-default" id="' + results.rows.item(i).id + 'counter" value="0:0:0" />' +
					'<button class="btn btn-danger" onclick="stop(' + results.rows.item(i).id + ')"><span class="glyphicon glyphicon-stop"></span></button>' +
				'</div>' +
				/* //for test purposes
				'<input class="btn btn-default" id="' + results.rows.item(i).id + 'time" value="' + results.rows.item(i).aggregated_time + '" />' +			*/		
			'</div>' +
		'</div>'
		console.log("dat time: " + results.rows.item(i).aggregated_time);
	}
}