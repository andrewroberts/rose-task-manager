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
// Convert calendar events to jobs
// ===============================
// 
// Read in all of todays events on the PPM and add a row to the job list 
// spreadsheet for each.

function convertEventsToJobs() {

  if (RUN_UNIT_TESTS == false) {
    
    var calName = PPM_CALENDAR_NAME;
    var jobsListSsId = JOBS_LIST_SPREADSHEET_ID;
    
  } else {
    
    var calName = UNIT_TESTS_PPM_CALENDAR_NAME;
    var jobsListSsId = UNIT_TESTS_JOBS_LIST_SPREADSHEET_ID;

  }    
  
  // Get the calendar object for the PPM calendar
  var calendars = CalendarApp.getCalendarsByName(calName);
  
  // Check there isn't more than one PPM calendar
  if (calendars.length != 1) {
    
    log(logType.WARNING, 'convertEventsToRows', 'Should be one PPM calendar:', calendars.length);
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
      'Number of events today on PPM: ' + events.length + " start: " + startOfDay + " end: " + endOfDay);
  
  if (events.length == 0) {
    
    // No events today
    return true;
    
  }
    
  // Open the job list spreadsheet 
  var ss = SpreadsheetApp.openById(jobsListSsId);
  
  if (ss == null){
   
    log(logType.WARNING, 'convertEventsToRows', 'Could not open the jobs list spreasheet');
    return false;
    
  }
  
  // Get the first sheet in the spreadsheet
  var ssheet = ss.getSheetByName(JOBS_LIST_WORK_SHEET_NAME)
  
  if (ssheet == null) {
    
    log(logType.WARNING, 
        'convertEventsToRows', 
        'Could not open the worksheet in jobs list spreadsheet');
    
    return false;
    
  }
  
  // Add an entry to the job list spreadsheet for each event
  for (var i = 0; i < events.length; i++) {
    
    // Extract the data for this event
    var title = events[i].getTitle();
    var description = events[i].getDescription();
    var location = events[i].getLocation();
    var eventId = events[i].getId();
    
    // Create an ID for the job (match ID to row number of next free one)
    var jobId = ssheet.getLastRow() + 1;
    
    // Write it into the spreadsheet
    var appendResult = ssheet.appendRow([today, // Opened
                                         "", // Closed
                                         jobId,
                                         title,
                                         location,
                                         PRIORITY_NORMAL, 
                                         STATUS_NEW,
                                         "", // Department
                                         "", // Owner
                                         PROJECT_NO,
                                         GSP_NO,
                                         PPM_CALENDAR_NAME, // Requested by
                                         MAINTENANCE_MANAGER_EMAIL, // Contact email
                                         eventId, // Calendar Event Series ID 
                                         description]); // Notes
    
    if (appendResult == null) {
      
      log(logType.ERROR, 
          'convertEventsToRows', 
          'Could not add PPM event details to jobs list spreadsheet');
      
      return false;
      
    }
      
    log(logType.INFO, 
        'convertEventsToRows', 
        'Added PPM event details to jobs list spreadsheet');
    
    // Send a notification email to the maintenance manager. Do that here to 
    // centralise and standardise job notifications, rather than using the
    // calendar email notifications.
    
    var emailSubject = "PPM Job #" + jobId + " - " + title + " - is due";
    
    var emailBody = "PPM AUTO-NOTIFICATION." +
                    "\n\nPPM Job - " + title + " - due." +
                    "\n\nSee maintenance job list for details and to assign and track progress.";
    
    MailApp.sendEmail(MAINTENANCE_MANAGER_EMAIL, 
                      emailSubject, 
                      emailBody, 
                      EMAIL_OPTIONS_PPM);
  
    log(logType.INFO, "convertEventsToJobs", "PPM Email sent to maintenance manager - " + emailSubject);
    
  } // for each event

  return true;
  
} // function convertEventsToRows()

