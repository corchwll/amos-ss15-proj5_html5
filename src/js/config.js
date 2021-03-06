angular.module('MobileTimeAccounting.config', [])

.constant('DB_CONFIG', {
	name: 'MTR',
	tables: [
		{
			name: 'Projects',
			columns: [
				{name: 'id', type: 'TEXT PRIMARY KEY'},
				{name: 'name', type: 'TEXT'},
				{name: 'is_displayed', type: 'INTEGER'},
				{name: 'is_used', type: 'INTEGER'},
				{name: 'is_archived', type: 'INTEGER'},
				{name: 'timestamp_final_date', type: 'INTEGER'},
				{name: 'longitude', type: 'REAL'},
				{name: 'latitude', type: 'REAL'}
			]
		},
		{
			name: 'Sessions',
			columns: [
				{name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT'},
				{name: 'project_id', type: 'TEXT'},
				{name: 'timestamp_start', type: 'INTEGER'},
				{name: 'timestamp_stop', type: 'INTEGER'}
			]
		},
		{
			name: 'User',
			columns: [
				{name: 'employee_id', type: 'TEXT PRIMARY KEY'},
				{name: 'lastname', type: 'TEXT'},
				{name: 'firstname', type: 'TEXT'},
				{name: 'weekly_working_time', type: 'INTEGER'},
				{name: 'total_vacation_time', type: 'INTEGER'},
				{name: 'current_vacation_time', type: 'INTEGER'},
				{name: 'current_overtime', type: 'INTEGER'},
				{name: 'registration_date', type: 'INTEGER'},
				{name: 'location_sort_is_used', type: 'INTEGER'},
				{name: 'vacation_updated', type: 'INTEGER'}
			]
		},
		{
			name: 'DummyMonth',
			columns: [
				{name: 'day', type: 'TEXT PRIMARY KEY'},
				{name: 'dummy', type: 'INTEGER'}
			]	
		}
	]
});