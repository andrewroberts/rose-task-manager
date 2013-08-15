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

//
// Convert calendar events to tasks
// ================================
// 
// Read in all of todays events and add a row to the task list 
// spreadsheet for each.

function convertEventsToTasks() {

  if (RUN_UNIT_TESTS == false) {
    
    var calName = REGULAR_TASK_CALENDAR_NAME;
    var taskListSsId = TASK_LIST_SPREADSHEET_ID;
    
  } else {
    
    var calName = UNIT_TESTS_CALENDAR_NAME;
    var taskListSsId = UNIT_TESTS_TASK_LIST_ID;

  }    
  
  log(logType.INFO, 'convertEventsToRows', 'Calendar to open:' + calName);
  
  // Get the calendar object for the calendar
  var calendars = CalendarApp.getCalendarsByName(calName);
  
  // Check there isn't more than one calendar
  if (calendars.length != 1) {
    
    log(logType.WARNING, 'convertEventsToRows', 'Should be one calendar:', calendars.length);
    return false;  

  }
  
  // Check if any events today. The events are stored in UTC so we need to allow for that.
  // by defining todays date in terms of UTC to avoid picking up events either side of today.
  
  var today = new Date();
  
  var startOfDay = today;
  
  startOfDay.setUTCHours(0);
  startOfDay.setMinutes(0);
  startOfDay.setSeconds(0);
  startOfDay.setMilliseconds(0);  
  
  var endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
  
  var events = calendars[0].getEvents(startOfDay, endOfDay)
  
  log(logType.INFO, 
      'convertEventsToRows', 
      'Number of events today: ' + events.length + " start: " + startOfDay + " end: " + endOfDay);
  
  if (events.length == 0) {
    
    // No events today
    return true;
    
  }
    
  // Open the task list spreadsheet 
  var ss = SpreadsheetApp.openById(taskListSsId);
  
  if (ss == null){
   
    log(logType.WARNING, 'convertEventsToRows', 'Could not open the task list spreasheet');
    return false;
    
  }
  
  // Get the task list sheet in the spreadsheet
  var ssheet = ss.getSheetByName(TASK_LIST_WORK_SHEET_NAME)
  
  if (ssheet == null) {
    
    log(logType.WARNING, 
        'convertEventsToRows', 
        'Could not open the worksheet in task list spreadsheet');
    
    return false;
    
  }
  
  var nextFreeRow = ssheet.getLastRow() + 1;
  
  // Add an entry to the task list spreadsheet for each event
  for (var i = 0; i < events.length; i++) {
    
    // Extract the data for this event
    var title = events[i].getTitle();
    var description = events[i].getDescription();
    var location = events[i].getLocation();
    var eventId = events[i].getId();
    
    // Create an ID for the task (match ID to row number of next free one)
    var id = ssheet.getLastRow() + 1;
    
    // Write it into the spreadsheet
    setCellValue(ssheet, nextFreeRow, SS_COL_TIMESTAMP, today);
    setCellValue(ssheet, nextFreeRow, SS_COL_ID, id);
    setCellValue(ssheet, nextFreeRow, SS_COL_TITLE, title);
    setCellValue(ssheet, nextFreeRow, SS_COL_LOCATION, location);
    setCellValue(ssheet, nextFreeRow, SS_COL_PRIORITY, PRIORITY_NORMAL);
    setCellValue(ssheet, nextFreeRow, SS_COL_STATUS, STATUS_NEW);
    setCellValue(ssheet, nextFreeRow, SS_COL_REQUESTED_BY, REGULAR_TASK_CALENDAR_NAME);
    setCellValue(ssheet, nextFreeRow, SS_COL_EVENT_ID, eventId);
    setCellValue(ssheet, nextFreeRow, SS_COL_NOTES, description);
 
    log(logType.INFO, 
        'convertEventsToRows', 
        'Added regular task details to task list spreadsheet');
    
    nextFreeRow++;
    
    // Send a notification email . Do that here to 
    // centralise and standardise task notifications, rather than using the
    // calendar email notifications.
    
    var subjectTemplate = CALENDAR_SUBJECT_TEMPLATE;
    var subjectData = {id:id, title:title};
    var subject = fillInTemplateFromObject(subjectTemplate, subjectData);
    
    var bodyTemplate = CALENDAR_BODY_TEMPLATE;
    var bodyData = {id:id, title:title};
    var body = fillInTemplateFromObject(bodyTemplate, bodyData);
        
    MailApp.sendEmail(ADMIN_EMAIL, subject, body, {name:CMMS_NAME});
  
    log(logType.INFO, "convertEventsToTasks", "Regular email notification sent. Subject: " + subject + " Body: " + body);
    
  } // for each event

  return true;
  
} // function convertEventsToRows()

