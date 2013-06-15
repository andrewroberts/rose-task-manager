/*

This file is part of Rose CMMS, a Google Apps Script CMMS.

Copyright (C) 2013 Andrew Roberts

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later 
version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see http://www.gnu.org/licenses/.

*/

// Script Constants
// ================

// Programming error - bad use of i/f, etc
LOG_ERRORS = true

// External problem, something the user can do something about: missing spreadsheet, etc.
LOG_WARNINGS = true 

// Info - Email sent, etc.
LOG_INFO = true 

// Unit tests
RUN_UNIT_TESTS = false

UNIT_TESTS_SPREADSHEET_NAME = "Unit_Tests_Spreadsheet"
// UNIT_TESTS_SPREADSHEET_ID = ""
UNIT_TESTS_FIRSTCOL = "FirstCol"
UNIT_TESTS_SECONDCOL = "SecondCol"

UNIT_TESTS_JOBS_LIST_SPREADSHEET_ID = ""
UNIT_TESTS_OLD_JOB_LIST_SPREADSHEET_ID = ""

UNIT_TESTS_PPM_CALENDAR_NAME = "PPM_UNIT_TESTS"
UNIT_TESTS_PPM_EVENTS_SPREADSHEET_ID = ""

// Misc settings

SITE_NAME = ""

EMAIL_OPTIONS_CC_MM = {name:"Maintenance Department", cc:""}
EMAIL_OPTIONS_PPM = {name:"Maintenance Department - PPM"}
EMAIL_OPTIONS = {name:"Maintenance Department"}

JOBS_LIST_SPREADSHEET_ID = ""
JOBS_LIST_WORK_SHEET_NAME = "Job List"

PPM_CALENDAR_NAME = "PPM"

MAINTENANCE_MANAGER_EMAIL = ""
MAINTENANCE_OFFICE_EXTENSION = ""

// PPM Event spreadheet
PPM_EVENTS_SPREADSHEET_ID = ""

PPM_EVENTID = "0"
PPM_EVENTDESCRIP = "1"
PPM_EVENTSTART = "2"
PPM_LASTCOMPLETED = "3"
PPM_WHOCOMPLETED= "4"
PPM_RECURCOUNT = "5"
PPM_PERIODFREQ = "6"
PPM_PERIODTYPEID = "7"
PPM_ACTIONREQUIRED = "8"

// Old job list
OLD_JOB_LIST_SPREADSHEET_ID = "" // Test 

OJL_TIMESTAMP = "2"
OJL_REQUESTED_BY = "3"
OJL_EMAIL_ADDRESS = "4"
OJL_MAINTENANCE_TASK_REQUESTED = "5"
OJL_LOCATION = "6"
OJL_FIXED_BY = "8"
OJL_COMMENTS = "9"

// Form styling
MAIN_PANEL_WIDTH = "550"
LABEL_WIDTH = "200"
TEXTBOX_WIDTH = "300"
TEXTAREA_WIDTH = "300"
TEXTAREA_HEIGHT = "150"
PAGE_TITLE = "Maintenance Job Request"
FORM_TITLE = "Maintenance Job Request"

// Maintenance Job List spreadsheet
SS_COL_TIMESTAMP = "Opened"
SS_COL_CLOSED = "Closed"
SS_COL_ID = "ID"
SS_COL_TITLE = "Subject"
SS_COL_LOCATION = "Location"
SS_COL_PRIORITY = "Priority"
SS_COL_STATUS = "Status"
SS_COL_DEPARTMENT = "Department"
SS_COL_ASSIGNED_TO = "Owner"
SS_COL_PROJECT = "Project"
SS_COL_GSP = "GSP"
SS_COL_REQUESTED_BY = "Requested by"
SS_COL_CONTACT_EMAIL = "Contact Email"
SS_COL_PPMID = "PPMID"
SS_COL_NOTES = "Description/Notes"


STATUS_NEW = "1 - New" // New job/issue raised
STATUS_OPEN = "2 - Open" // Acknowledged by Maintenance
STATUS_IN_PROGRESS = "3 - In Progress" // Work in progress
STATUS_CLOSED = "4 - Closed" // Closed as finished or otherwise

PRIORITY_LOW = "3 - Low"
PRIORITY_NORMAL = "2 - Normal"
PRIORITY_HIGH = "1 - High"

DEPARTMENT_BUILDINGS = "Buildings"
DEPARTMENT_CARPENTRY = "Carpentry"
DEPARTMENT_DECORATING = "Decorating"
DEPARTMENT_ELECTRICS = "Electrics"
DEPARTMENT_GROUNDS = "Grounds"
DEPARTMENT_PLUMBING = "Plumbing"
DEPARTMENT_TECHNOLOGY = "Technology"

PROJECT_YES = "Yes"
PROJECT_NO = "No"

GSP_YES = "Yes"
GSP_NO = "No"
