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

// Log a message for debug and optionally also tell the user
// =========================================================

var logType = {INFO:0, WARNING:1, ERROR:2};

function log(type, functionName, msg) {
  
  var newMsg = "";

  switch (type) {
      
    case logType.INFO:
      
      if (LOG_INFO == true) {
        
        newMsg = "INFO: " + functionName + ": " + msg;
        
      }
      
      break;
      
    case logType.WARNING:
      
      if (LOG_WARNINGS == true) {
        
        newMsg = "WARNING: " + functionName + ": " + msg;
        
      }
      
      break;
      
    case logType.ERROR:
      
      if (LOG_ERRORS == true) {
        
        newMsg = "ERROR: " + functionName + ": " + msg;
        
      }
      
      break;
      
    default:
      
      // Invalid type
      newMsg = "";
      return "";
      
  }
      
  if (newMsg != "") {

    Logger.log(newMsg);
    
  }
      
  return newMsg;

}

// Find the column index of the field with this name
// =================================================

function getColIndexByName(sheet, colName) {

  log(logType.INFO, 
      "getColIndexByName", 
      "sheet = " + sheet.getName() + ", colName = " + colName);
    
  if (sheet == "" || colName == "") {
    
    log(logType.ERROR, "getColIndexByName", "Missing parameters");
    
    return -1;
  
  }
  
  var numColumns = sheet.getLastColumn();
  
  var row = sheet.getRange(1, 1, 1, numColumns).getValues();
  
  for (i in row[0]) {
    
    var name = row[0][i];
    
    if (name == colName) {
      
      var colIndex = parseInt(i) + 1;
      
      log(logType.INFO, 
          "getColIndexByName", 
          "Column " + colName + " has index: " + colIndex);
      
      return colIndex;
      
    }
    
  }
  
  log(logType.ERROR, "getColIndexByName", "Column not found");
  
  return -1;
  
}

// Set the value of a spreadhsheet cell
// ====================================

function setCellValue(sheet, rowIndex, colName, value) {
  
  log(logType.INFO, "setCellValue", "sheet name = " + sheet.getName() + 
                    ", rowIndex = " + rowIndex + 
                    ", colName = " + colName + 
                    ", value = " + value);

  if (sheet == "" || rowIndex == "" || colName == "" || value == "") {
    
    log(logType.ERROR, "setCellValue", "Missing parameters");
    return -1;
  
  }
  
  var colIndex = getColIndexByName(sheet, colName);
  
  if (colIndex == -1) {
    
    log(logType.ERROR, "setCellValue", "Could not find column: " + colName);
    
  } else {
    
    if (sheet.getRange(rowIndex, colIndex).setValue(value) == null) {
      
      log(logType.ERROR, "setCellValue", "Could not write cell value: " + value);
      return false;
      
    } else {
      
      log(logType.INFO, "setCellValue", "Wrote value: " + value);
      
    }
      
  }
  
  return value;
    
}

// Get the value of a spreadhsheet cell
// ====================================

function getCellValue(sheet, rowIndex, colName) {
  
  log(logType.INFO, "getCellValue", "sheet name = " + sheet.getName() + 
                                    ", rowIndex = " + rowIndex + 
                                    ", colName = " + colName);
  
  if (sheet == "" || rowIndex == "" || colName == "") {
    
    log(logType.ERROR, "getCellValue", "Missing parameters");
    return -1;
  
  }
  
  var colIndex = getColIndexByName(sheet, colName);
  
  if (colIndex == -1) {
    
    log(logType.ERROR, "setCellValue", "Could not find column: " + colName);
    return -1;
    
  }
  
  value = sheet.getRange(rowIndex, colIndex).getValue();
    
  return value;
    
}

// Import the jobs from the PPM spreadsheet
// ========================================
//

function importPPMEvents() {

  // Set up for unit tests
  // ---------------------
  
  if (RUN_UNIT_TESTS == false) {
    
    var calName = PPM_CALENDAR_NAME;
    var ppmSsId = PPM_EVENTS_SPREADSHEET_ID;
    var jobsListSsId = JOBS_LIST_SPREADSHEET_ID;
    
  } else {
    
    var calName = UNIT_TESTS_PPM_CALENDAR_NAME;
    var ppmSsId = UNIT_TESTS_PPM_EVENTS_SPREADSHEET_ID;
    var jobsListSsId = UNIT_TESTS_JOBS_LIST_SPREADSHEET_ID;

  }    
    
  // Open the PPM calendar
  // ---------------------
  
  var pPMcalendars = CalendarApp.getCalendarsByName(calName);

  if (pPMcalendars.length == 0) {
    
    log(logType.WARNING, 'importPPMEvents', 'Could not find a PPM calendar');
    return false;  

  }

  if (pPMcalendars.length > 1) {
    
    log(logType.WARNING, 'importPPMEvents', 'Found ' + pPMcalendars.length + ' PPM calendars, should only be one.');
    return false;  

  }
  
  // Open the spreadsheet containing the old PPM events 
  // --------------------------------------------------
  //
  // The spreadsheet is manually converted to Google spreadsheet 
  // from Access database table.
  //

  // Get the first sheet in the spreadsheet
  var pPMSheet = SpreadsheetApp.openById(ppmSsId).getSheets()[0];
  
  if (pPMSheet == null) {
    
    log(logType.WARNING, 
        'importPPMEvents', 
        'Could not open the worksheet in PPM event spreadsheet');
    
    return false;
    
  }
  
  // Open the job list spreadsheet
  // -----------------------------

  var jobListSheet = SpreadsheetApp.openById(jobsListSsId)
                                   .getSheetByName(JOBS_LIST_WORK_SHEET_NAME);
  
  if (jobListSheet == null) {
    
    log(logType.WARNING, 
        'importPPMEvents', 
        'Could not open the worksheet in PPM event spreadsheet');
    
    return false;
    
  }
  
  // Import each PPM event from the spreadsheet
  // ------------------------------------------
  
  // Read in all of the data from the PPM spreadsheet (the first row is a header so 
  // start on row 2
  
  var numRows = pPMSheet.getLastRow() - 1;
  // var numRows = 7; // Testing
  var numColumns = pPMSheet.getLastColumn();
  var data = pPMSheet.getRange(2, 1, numRows, numColumns).getValues();

  log(logType.INFO, 
      'importPPMEvents', 
      'numRows = ' + numRows + ", numColumns = " + numColumns);

  // Step through each row a column at a time
  for (var row in data) {
   
    // Skip this PPM job if it has been cancelled
    if (data[row][PPM_RECURCOUNT] == "0") {
      
      continue;
    
    }
    
    // Extract the PPM fields from the PPM spreadsheet
    // -----------------------------------------------
    
    var title = data[row][PPM_EVENTDESCRIP];
    var startDate = data[row][PPM_EVENTSTART];
    var lastCompleted = data[row][PPM_LASTCOMPLETED];
    var owner = data[row][PPM_WHOCOMPLETED];
    var description = data[row][PPM_ACTIONREQUIRED];

    // Check if we have a "last completed" date for this job
    if (lastCompleted != "") {
      
      var opened = lastCompleted;
      var closed = lastCompleted;
      var status = STATUS_CLOSED;
      
    } else {
      
      var opened = startDate;
      var closed = "";
      var status = STATUS_OPEN; // "Open" rather than "new" as raised internally
      
    }
    
    // Create an ID for the job (match ID to row number of next free one)
    var jobId = jobListSheet.getLastRow() + 1;
    
    // Calculate the recurrence depending on the period type
    switch (data[row][PPM_PERIODTYPEID]) {
    
      case "yyyy":
        
        // Add a yearly rule at the right interval
        var recurrence = CalendarApp.newRecurrence().addYearlyRule().interval(data[row][PPM_PERIODFREQ]);
        log(logType.INFO, 'importPPMEvents', 'Added yearly event, interval = ' + data[row][PPM_PERIODFREQ]);
        break;
        
      case "m":

        // Add a monthly rule at the right interval
        var recurrence = CalendarApp.newRecurrence().addMonthlyRule().interval(data[row][PPM_PERIODFREQ]);
        log(logType.INFO, 'importPPMEvents', 'Added monthly event, interval = ' + data[row][PPM_PERIODFREQ]);        
        break;
        
      case "ww": 
        
        // Add a weekly rule at the right interval
        var recurrence = CalendarApp.newRecurrence().addWeeklyRule().interval(data[row][PPM_PERIODFREQ]);
        log(logType.INFO, 'importPPMEvents', 'Added weekly event, interval = ' + data[row][PPM_PERIODFREQ]);        
        break;
        
      case "d":
        
        // Add a daily rule at the right interval
        var recurrence = CalendarApp.newRecurrence().addDailyRule().interval(data[row][PPM_PERIODFREQ]);
        log(logType.INFO, 'importPPMEvents', 'Added daily event, interval = ' + data[row][PPM_PERIODFREQ]);        
        break;
        
      default:
        
        log(logType.ERROR, 'importPPMEvents', 'Invalid period type');
        return false;
           
    } // switch
    
    // Add a new event to the calendar for this PPM job
    // ------------------------------------------------
    
    var eventSeries = pPMcalendars[0].createAllDayEventSeries(title, startDate, recurrence)
                                     .setDescription(description);

    if (eventSeries == null) {
      
      log(logType.ERROR, 
             'importPPMEvents', 
             'Could not add PPM event to calendar');
      
      return false;
      
    }
    
    log(logType.INFO, 
        'importPPMEvents', 
        'Added event, title = ' + title + ', Start = ' + startDate + ', Desc = ' + description);
    
    // Store the PPM job in the job list
    // ---------------------------------
    
    var appendResult = jobListSheet.appendRow([opened, // Opened 
                                               closed, // Closed
                                               jobId, // Job ID
                                               title, // Title
                                               "", // Location
                                               PRIORITY_NORMAL, // Priority
                                               status, // Status
                                               "", // Department
                                               owner, // Owner
                                               PROJECT_NO, // Project?
                                               GSP_NO, // GSP?
                                               PPM_CALENDAR_NAME, // Requested by
                                               MAINTENANCE_MANAGER_EMAIL, // Contact email for requestor
                                               eventSeries.getId(), // Calendar Event Series ID for this PPM job
                                               description]); // Notes
    
    if (appendResult == null) {
      
      log(logType.ERROR, 
          'importPPMEvents', 
          'Could not add PPM event details to jobs list spreadsheet');
      
      return false;
      
    }
     
    log(logType.INFO, 'importPPMEvents', 'Added PPM event to job list spreadsheet');

    // Notify the maintenance manager (unless the job is already closed)
    // -----------------------------------------------------------------
    
    if (closed == "") {
    
      var emailSubject = "PPM Job #" + jobId + " - " + title + " - is due";
      
      var emailBody = "PPM AUTO-NOTIFICATION." +
                      "\n\nPPM Job - " + title + " - is due." +
                      "\n\nIt has been automatically added to the job list from " + 
                      "the old PPM Access database." +
                      "\n\nSee maintenance job list for details and to assign " +
                      "ownership and track progress.";
    } else {

      var emailSubject = "PPM Job #" + jobId + " - " + title + " - is closed";
      
      var emailBody = "PPM AUTO-NOTIFICATION." +
                      "\n\nPPM Job - " + title + " - is closed." +
                      "\n\nIt has been automatically added to the job list from " + 
                      "the old PPM Access database, and as there was a \'last completed\' " +
                      "date it has gone straight to \'closed\'." +
                      "\n\nSee the maintenance job list for more details.";

    }
    
    MailApp.sendEmail(MAINTENANCE_MANAGER_EMAIL, 
                      emailSubject, 
                      emailBody, 
                      EMAIL_OPTIONS_PPM);
  
    log(logType.INFO, "importPPMEvents", "PPM Email sent to maintenance manager - " + emailSubject);
    
  } // (var row in data)

  return true;
  
} // importPPMEvents()

// Import old job list
// ===================

function importJobList() {

  // Set up for unit tests
  // ---------------------
  
  if (RUN_UNIT_TESTS == false) {
    
    var oldJobsListSsId = OLD_JOB_LIST_SPREADSHEET_ID;
    var jobsListSsId = JOBS_LIST_SPREADSHEET_ID;
    
  } else {
    
    var oldJobsListSsId = UNIT_TESTS_OLD_JOB_LIST_SPREADSHEET_ID;
    var jobsListSsId = UNIT_TESTS_JOBS_LIST_SPREADSHEET_ID;

  }    
   
  // Open the spreadsheet containing the old job list 
  // ------------------------------------------------

  // Get the first sheet in the spreadsheet
  var oldJobListSheet = SpreadsheetApp.openById(oldJobsListSsId).getSheets()[0];
  
  if (oldJobListSheet == null) {
    
    log(logType.WARNING, 
        'importJobList', 
        'Could not open the old job list');
    
    return false;
    
  }
  
  // Open the job list spreadsheet
  // -----------------------------

  var jobListSheet = SpreadsheetApp.openById(jobsListSsId)
                                   .getSheetByName(JOBS_LIST_WORK_SHEET_NAME);
  
  if (jobListSheet == null) {
    
    log(logType.WARNING, 
        'importJobList', 
        'Could not open the worksheet in PPM event spreadsheet');
    
    return false;
    
  }
  
  // Import each job from the spreadsheet
  // ------------------------------------
  
  // Read in all of the data from the job list spreadsheet (the first row is a header so 
  // start on row 2
  
  var numRows = oldJobListSheet.getLastRow() - 1;
  // var numRows = 1; // Testing
  
  if (numRows == 0 ) {
    
    return true;
    
  }
  
  var numColumns = oldJobListSheet.getLastColumn();
  var data = oldJobListSheet.getRange(2, 1, numRows, numColumns).getValues();
      
  log(logType.INFO, 'importJobList', 'numRows = ' + numRows + ', numColumns = ' + numColumns);
  
  // Step through each row a column at a time
  for (var row in data) {
   
    // Extract the fields for this job
    // -------------------------------
    
    var timeStamp = data[row][OJL_TIMESTAMP];
    var requestedBy = data[row][OJL_REQUESTED_BY];
    var email = data[row][OJL_EMAIL_ADDRESS];
    var task = data[row][OJL_MAINTENANCE_TASK_REQUESTED];
    var location = data[row][OJL_LOCATION];
    var fixedBy = data[row][OJL_FIXED_BY];
    var comments = data[row][OJL_COMMENTS];
    
    // Check the "email" (the old "fixed by" field) and "fixed by"
    // field to make first guess at whether the job is closed.
    if (fixedBy != "" || email != "" ) {
      
      var status = STATUS_CLOSED;
      
    } else {
      
      // Don't think this is closed, but assume is has been seen
      var status = STATUS_OPEN;
      
    }
    
    // Store the job in the job list
    // -----------------------------
    
    // Create an ID for the job (match ID to row number of next free one)
    var jobId = jobListSheet.getLastRow() + 1;
    
    var appendResult = jobListSheet.appendRow([timeStamp, // Opened 
                                               "", // Closed
                                               jobId, // Job ID
                                               "", // Title
                                               location, // Location
                                               PRIORITY_NORMAL, // Priority
                                               status, // Status - 
                                               "", // Department
                                               fixedBy, // Owner
                                               PROJECT_NO, // Project?
                                               GSP_NO, // GSP?
                                               requestedBy, // Requested by
                                               email, // Contact email for requestor
                                               "", // Calendar Event Series ID for this PPM job
                                               task + ". " + comments]); // Description/Notes
    
    if (appendResult == null) {
      
      log(logType.ERROR, 
          'importJobList', 
          'Could not add job to jobs list spreadsheet');
      
      return false;
      
    } 
    
    // Notify the maintenance manager
    // ------------------------------
    
    var emailSubject = "Job #" + jobId + " - Recieved";
  
    var emailBody = "AUTO-NOTIFICATION." +
                  "\n\nJob #" + jobId + " has been added to " + 
                  "the job list as part of a batch import of the old job list (June2013)." +
                  "\n\nSee the maintenance job list for details and to track progress.";
    
    MailApp.sendEmail(MAINTENANCE_MANAGER_EMAIL, 
                      emailSubject, 
                      emailBody, 
                      EMAIL_OPTIONS);
    
    log(logType.INFO, 'importJobList', 'Added job to job list');      
    
  } // for (var row in data)

  return true;
  
} // importJobList()

// Open a spreadsheet and if it doesn't exist create it
// ====================================================

function openSpreadSheet(fileName) {

  log(logType.INFO, "openSpreadSheet", "open " + fileName);
  
  // Search the spreadsheets in the user's Docs List for the 
  // first instance of the first Unit Test spreadsheet
  
  var files = DocsList.getFilesByType(DocsList.FileType.SPREADSHEET);
  var ss = null;
  
  for (var i = 0; i < files.length; i++) {
    
    if (files[i].getName() == fileName) {
      
      ss = SpreadsheetApp.open(files[i]);
      
      if (ss == null) {
        
        log(logType.WARNING, "openSpreadSheet", "Failed to open " + fileName);
        
      }

      // Stop of the first instance of the file
      break;
      
    }
    
  }
  
  if (ss == null) {
    
    // Create the Unit Test spreadsheet 
    ss = SpreadsheetApp.create(fileName);
    
    if (ss == null) {
      
      log(logType.WARNING, "openSpreadSheet", "Failed to create " + fileName);
      
    }
    
  }

  return ss;
  
}