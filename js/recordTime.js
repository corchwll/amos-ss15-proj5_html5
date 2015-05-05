/* ATTENTION:
Functions demand an already initialized database!
*/

var database = openDatabase("mtr_db", "1.0", "MobileTimeRecording", 200000);
console.log("Database opened");	

/* SQL Queries */

//var sqlCreateTableProjects = "CREATE TABLE IF NOT EXISTS Projects (id INTEGER PRIMARY KEY, name TEXT)";

//var sqlCreateTableSessions = "CREATE TABLE IF NOT EXISTS Sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER, timestamp_start INTEGER, timestamp_stop INTEGER)";

var sqlInsertSession = "INSERT INTO Sessions (project_id, timestamp_start) VALUES (?, ?)";

var sqlUpdateSession = "UPDATE Sessions SET timestamp_stop = ? WHERE project_id = ? AND timestamp_stop IS NULL";



/* state whether timer is running or not */
var state = 0;
var currentDate;
var counter;
var refresh;

/*
function onError
Prints error message to console output if a sqlite error occurs.
 */
function onError(tx, err)
{
    console.log('Database error: ' + err.message);
}

/*
function start
The function expects the project id of the project it should start as parameter. If the project is not already running, the timer gets startet and an respective database entry is made, using the function starttimeDb.
*/
function start(projectId)
{
    var startDate = new Date();
    var startTime = startDate.getTime();

    /* Start counter if it is not already running */
    if(state === 0)
    {
        state = 1;
        timer(startTime, projectId);
        starttimeDb(startTime, projectId);
    }
}

/*
function stop
The function expects the project id of the project it should stop as parameter. If the project is currently running, the timer gets stopped and an respective database entry is made, using the function stoptimeDb.
*/
function stop(projectId)
{
    if(state === 1)
    {
        state = 0;
        stoptimeDb(projectId);
    }
}

/*
 Function timer increases the counter element every second, starting from a given start time.
 */
function timer(startTime, projectId)
{
    currentDate = new Date();
	var elementID = projectId + 'counter';
    counter = document.getElementById(elementID);

    var timeDiff = currentDate.getTime() - startTime;

    if(state === 1)
    {
        counter.value = formatTime(timeDiff);
        refresh = setTimeout('timer(' + startTime + ', ' + projectId + ');', 10);
    }
}

/*
 Function formatTime converts unformatted time into seconds, minutes and hours and returns them as combined string.
 */
function formatTime(unformattedTime)
{
    var second = Math.floor(unformattedTime/1000);
    var minute = Math.floor(unformattedTime/60000);
    var hour = Math.floor(unformattedTime/3600000);
    second = second - (60 * minute);
    minute = minute - (60 * hour);
    return hour + ':' + minute + ':' + second;
}

/*
 Function starttimeDb inserts the current timestamp into the database table Sessions as starting point of the respective session.
 */
function starttimeDb(startTime, projectId)
{
	var startTimeSeconds = Math.floor(startTime/1000);
	database.transaction(function (tx) {tx.executeSql(sqlInsertSession, [projectId, startTimeSeconds], function(tx, res) {
	   console.log("insertId: " + res.insertId + " --");
	   console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
   }); });
}

/*
 Function stoptimeDb updates the current session in the database table Sessions with the current timestamp as end point of the respespectie session.
 */
function stoptimeDb(projectId)
{
	var latestOpenSessionLocal;
	var stopDate = new Date();
    var stopTime = stopDate.getTime();
	var stopSeconds = Math.floor(stopTime/1000);
	
   
   database.transaction(function (tx) {tx.executeSql(sqlUpdateSession, [stopSeconds, projectId], function(tx, res) {
	   //console.log("insertId: " + res.insertId + " --");
	   //console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
   }); });
   console.log("Session completed");
}
