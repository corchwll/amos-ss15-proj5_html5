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

var sqlCreateViewTimes = "CREATE VIEW IF NOT EXISTS Aggregated_Times AS SELECT project_id, SUM(timestamp_stop - timestamp_start) AS aggregated_time FROM Sessions GROUP BY project_id"; 
/* WHERE timestamp_stop != 0 AND timestamp_start != 0 AND timestamp_stop IS NOT NULL AND timestamp_start IS NOT NULL GROUP BY project_id"; */

var sqlSelectAllProjectsWithTimes = "SELECT Projects.id, Projects.name, Projects.is_displayed, Projects.is_used, Aggregated_Times.aggregated_time FROM Projects LEFT JOIN Aggregated_Times ON Projects.id = Aggregated_Times.project_id";

var sqlInsertStandardProjectIllness = "INSERT INTO Projects (id, name, is_displayed, is_used, is_archived) VALUES ('1', 'Illness', '1', '0', '0')";

var sqlInsertStandardProjectTraining = "INSERT INTO Projects (id, name, is_displayed, is_used, is_archived) VALUES ('2', 'Training', '1', '1', '0')";

var sqlInsertStandardProjectHoliday = "INSERT INTO Projects (id, name, is_displayed, is_used, is_archived) VALUES ('3', 'Holiday', '1', '0', '0')";

var sqlCheckStandardProjects = "SELECT * FROM Projects WHERE (name = 'Illness' AND id = 1) OR (name = 'Training' AND id = 2) OR (name = 'Holiday' AND id = 3)";

var sqlDeleteStandardProjects = "DELETE FROM Projects WHERE name = 'Illness' OR name = 'Training' OR name = 'Holiday'";

var sqlArchiveProject = "UPDATE Projects SET is_displayed = '0', is_archived = '1' WHERE id = ?";

/* 
function initDatabase 
Ensures that database is initialized and contains the required tables and views.
*/
function getProjectsFromDatabase() 
{
	createTablesAndViews();
	checkStandardProjects();
	printNotification();
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
function checkStandardProjects
Checks if the predefined standard projects are already in the database and calls function addStandardProject, if they are not already in the database.
*/
function checkStandardProjects()
{
	database.transaction(function (tx) 
	{
		tx.executeSql(sqlCheckStandardProjects, [], function(tx, res) 
		{
			if (res.rows.length !== 3) 
			{
				tx.executeSql(sqlDeleteStandardProjects, [], function(tx, res) 
				{
					addStandardProject(sqlInsertStandardProjectIllness);
					addStandardProject(sqlInsertStandardProjectTraining);
					addStandardProject(sqlInsertStandardProjectHoliday);
				});
			}
		}); 
	});
}

/*
function addStandardProject
Generic execution of SQL code given as parameter. However, only able to process SQL code without wild cards (question marks) or returns. (Thus only Insert or Updates possible).
*/
function addStandardProject(sqlCode)
{
	database.transaction(function (tx)
	{
		tx.executeSql(sqlCode, []);
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

		if(0 === row.is_displayed) 
		{
			return '';
		} else if (1 === row.id || 2 === row.id || 3 === row.id) {
			if (0 === row.is_used) {
				return '<div class="panel panel-default">' +
					'<div class="panel-heading" role="tab" id="' + row.id + '" data-toggle="collapse" data-parent="#ProjectList" href="#' + row.id + 'body" aria-expanded="true" aria-controls="collapseOne" onclick="">' +
						'<h4 class="panel-title">' +
							row.name +
						'</h4>' +
					'</div>' +
					'<div id="' + row.id + 'body" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">' +
						'<p>' +
							'<button class="btn btn-info" onclick="addSessionForProject(&quot;' + row.id + '&quot;, &quot;' + row.name + '&quot;)"><span class="glyphicon glyphicon-plus"></span></button>' +
						'</p>' +	
					'</div>' +
				'</div>';
			} else {
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
			}
		} else {
				return '<div class="panel panel-default">' +
					'<div class="panel-heading" role="tab" id="' + row.id + '" data-toggle="collapse" data-parent="#ProjectList" href="#' + row.id + 'body" aria-expanded="true" aria-controls="collapseOne" onclick="">' +
						'<h4 class="panel-title">' +
							row.name +
						'</h4>' +
					'</div>' +
					'<div id="' + row.id + 'body" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">' +
						'<p>' +
							'<input class="btn btn-default" id="' + row.id + 'counter" value="0:0:0" />' +
						'</p>' +
						'<p>' +
							'<button class="btn btn-success" onclick="start(' + row.id + ')"><span class="glyphicon glyphicon-play"></span></button>' +
							'<button class="btn btn-danger" onclick="stop(' + row.id + ')"><span class="glyphicon glyphicon-stop"></span></button>' +
							'<button class="btn btn-info" onclick="addSessionForProject(&quot;' + row.id + '&quot;, &quot;' + row.name + '&quot;)"><span class="glyphicon glyphicon-plus"></span></button>' +
							'<button class="btn btn-danger" onclick="showDeleteConfirmation(' + row.id +')"><span class="glyphicon glyphicon-trash"></span></button>' +
						'</p>' +	
					'</div>' +
				'</div>';
		}
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
function addSessionForProject(projectId, projectName) 
{
	window.sessionStorage.setItem("projectId", projectId);
	window.sessionStorage.setItem("projectName", projectName);
	window.location.replace("addSession.html");
}

/*
function showDeleteConfirmation
Shows a confirmation modal if the delete button is pressed.
*/
function showDeleteConfirmation(projectId) 
{
	document.getElementById("deleteProjectModal").innerHTML = 
		'<div class="modal-dialog">' +
    '<div class="modal-content">' +
        '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h4 class="modal-title">Confirmation</h4>' +
        '</div>' +
        '<div class="modal-body">' +
            '<p>Are you sure?</p>' +
        '</div>' +
        '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default" data-dismiss="modal">No</button>' +
            '<button type="button" class="btn btn-primary" onclick="deleteProject(' + projectId + ')">Yes</button>' +
        '</div>' +
    '</div>' +
	'</div>';
	$("#deleteProjectModal").modal('show');
}

/*
function deleteProject
Sets the is_archived flag to 1 and the is_displayed to 0 for the passed projectId. Thereby, the project is no longer displayed by the listProjects function.
 */
function deleteProject(projectId)
{
	database.transaction(function(tx)
	{
		tx.executeSql(sqlArchiveProject, [projectId], function(tx, results)
		{
			window.location = "index.html";
		}, onError);
	});
}

/*
function printNotification
Prints a notification on top of the screen, if parameters are given in the url.
 */
function printNotification()
{
	/* get url parameter based on 'http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript' */
	var match,
	  urlParams = {},
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      query  = window.location.search.substring(1);

  while (match = search.exec(query))
  {
  	urlParams[decode(match[1])] = decode(match[2]);
  }

  /* check if any parameter is in object */
  if(!Object.keys(urlParams).length)
  {
  	return;
  }

  document.getElementById("notification").className = "alert alert-" + urlParams.style;
  document.getElementById("notificationInner").innerHTML = '<strong>' + urlParams.message + '</strong>';
}