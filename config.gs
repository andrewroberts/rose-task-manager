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

// User Configuration
// ==================
//
// This file contains all the constants used to configure the Rose CMMS script.
//

// Misc settings
// -------------

// This is used for the regular task celendar
CMMS_NAME = "RoseCMMS"

// This is very important - the Google ID of the main task list spreadsheet (it defaults to the master copy)
TASK_LIST_SPREADSHEET_ID = ""
TASK_LIST_WORK_SHEET_NAME = "Task List"

REGULAR_TASK_CALENDAR_NAME = CMMS_NAME

// This is email of the administrator of this instance of Rose CMMS 
ADMIN_EMAIL = ""
 
RUN_UNIT_TESTS = false;

// Logging
// -------

// All Logging on (true) or off (false)
LOG_ALL = true

// Programming error - bad use of i/f, etc
LOG_ERRORS = true

// External problem, something the user can do something about: missing spreadsheet, etc.
LOG_WARNINGS = true 

// Info - Email sent, etc.
LOG_INFO = true 

// Status Email Update Template
// ----------------------------
// 
// This is the email sent to update the person who submitted a task as to its status.
//

STATUS_SUBJECT_TEMPLATE = "Task #${\"id\"} - Status Update - \"${\"status\"}\""

STATUS_BODY_TEMPLATE = "We've updated the status of task #${\"row\"} - ${\"title\"}." + 
                        "\n\nNew Status: ${\"status\"}."

// Form Email Template
// -------------------
//
// This is the email notification sent when a form is submitted.
//

FORM_SUBJECT_TEMPLATE = "Task #${\"id\"} \"${\"title\"}\" Received"

FORM_BODY_TEMPLATE = "AUTO-RESPONSE. \n\nThank you for submitting task #${\"id\"} - \"${\"title\"}\"."

// Form styling
// ------------

MAIN_PANEL_WIDTH = "550"
LABEL_WIDTH = "200"
TEXTBOX_WIDTH = "300"
TEXTAREA_WIDTH = "300"
TEXTAREA_HEIGHT = "150"
PAGE_TITLE = "Task Request"
FORM_TITLE = "Task Request"

FORM_ACK_TEXT = 'Thank you for your task request. You ' +
                'will receive email confirmation shortly. To make another request type in the ' + 
                'information and click Submit. ' + 
                '\n\nSee the task list for ' +
                'details and to track progress.'

// Calendar Email Template
// -----------------------
//
// This is the email notification sent when a regular task is
// added to the list.
//

CALENDAR_SUBJECT_TEMPLATE = "Regular Task #${\"id\"} \"${\"title\"}\" is due"

CALENDAR_BODY_TEMPLATE = "AUTO-NOTIFICATION OF REGULAR TASK. \n\nTask #${\"id\"} - \"${\"title\"}\" is due."

// Task List spreadsheet
// ---------------------
//
// These are the required fields in the task list spreadsheet, others can be added 
// to the task list spreadsheet itself without affecting its operation.
//

SS_COL_TIMESTAMP = "Opened"
SS_COL_CLOSED = "Closed"
SS_COL_ID = "ID"
SS_COL_TITLE = "Subject"
SS_COL_LOCATION = "Location"
SS_COL_PRIORITY = "Priority"
SS_COL_STATUS = "Status"
SS_COL_CATEGORY = "Category"
SS_COL_REQUESTED_BY = "Requested by"
SS_COL_CONTACT_EMAIL = "Contact Email"
SS_COL_EVENT_ID = "Event ID"
SS_COL_NOTES = "Notes"

STATUS_NEW = "1 - New" // New task/issue raised
STATUS_OPEN = "2 - Open" // Acknowledged by Admin
STATUS_IN_PROGRESS = "3 - In Progress" // Work in progress
STATUS_IGNORED = "4 - Ignored" // Closed, but not completed
STATUS_DONE = "5 - Done" // Closed and completed

PRIORITY_LOW = "3 - Low"
PRIORITY_NORMAL = "2 - Normal"
PRIORITY_HIGH = "1 - High"

