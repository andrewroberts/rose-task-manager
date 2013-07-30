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

// Event handler for the form being opened
// =======================================

function onOpen() {
  
  var subMenus = [{name:"Send Status Email", functionName: "emailStatusUpdates"},
                  {name:"Notify Assignee", functionName: "notifyAssignee"},
                  {name:"Sort and Filter", functionName: "sortAndFilter"];
 
  SpreadsheetApp.getActiveSpreadsheet().addMenu("Job Management", subMenus);
  
}

// Sort and filter the spreadsheet
// ===============================

function sortAndFilter() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  
  // Sort the sheet by Status
  sheet.sort(7, false);
  
  // Sorts the sheet by Priority
  sheet.sort(6, false);
  
  // Filter 
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  
  for (var i=1; i <= numRows -1; i++) {
    
    var row = values[i];
    
    // Column value
    var myValue = row[6];
    
    // filter value 
    if (myValue == "3 - Closed") {
      
      sheet.hideRows(i+1);
      
    }
    
  }

} // sortAndFilter

// Send an email status update
// ===========================

function emailStatusUpdates() {
  
  if (RUN_UNIT_TESTS == true) {
   
    // Use the test job list rather than the main one
    var sheet = SpreadsheetApp.openById(UNIT_TESTS_JOBS_LIST_SPREADSHEET_ID).getSheets()[0];
    sheet.setActiveSelection(sheet.getRange("E2"));
        
  } else {
  
    // Get the row number of the row in the spreadsheet that's currently active.
    var sheet = SpreadsheetApp.getActiveSheet();
    
  }
  
  if (sheet == null) {
    
    log(logType.WARNING, "emailStatusUpdates", "Can't open spreadsheet");
    return false;
    
  }
  
  var row = sheet.getActiveRange().getRowIndex();

  if ((row == 1) || (row == 0)) {
    
    log(logType.WARNING, "emailStatusUpdates", "No row selected, row = " + row);
    return false;
    
  }
  
  log(logType.INFO, "emailStatusUpdates", "Working on row: " + row);
  
  // Retrieve the user's info 
  
  
  
  var userEmail = sheet.getRange(row, getColIndexByName(sheet, SS_COL_CONTACT_EMAIL)).getValue();
  
  if (userEmail == "") {
    
    log(logType.WARNING, "emailStatusUpdates", "No email address found"); 
    return false;

  }
  
  var title = sheet.getRange(row, getColIndexByName(sheet, SS_COL_TITLE)).getValue();

  var status = sheet.getRange(row, getColIndexByName(sheet, SS_COL_STATUS)).getValue();
  
  var id = sheet.getRange(row, getColIndexByName(sheet, SS_COL_ID)).getValue();
  
  if (status == "") {
    
    log(logType.ERROR, "emailStatusUpdates", "No status found"); 
    return false;
  
  }
  
  // Construct the update email and send it
  
  var subject = "Job #" + id + " - Status Update - " + "\"" + status + "\"";
  
  var body = "We've updated the status of job #" + row +" - " + title + "." +
             "\n\nNew " + SS_COL_STATUS + ": " + status +
             "\n\nPlease see the maintenance job list for more details or contact " +
             "the maintenance manager." +
             "\n\nThe Maintenance Manager" +
             "\n\nx" + MAINTENANCE_OFFICE_EXTENSION;
               

  MailApp.sendEmail(userEmail, subject, body, EMAIL_OPTIONS_CC_MM);
  
  log(logType.INFO, 
      "emailStatusUpdates", 
      "Email status sent to email: " + userEmail +
      "\n\nsubject: " + subject +
      "\n\nbody: " + body);
  
  return true;
  
}

// Notify staff that job has been assigned
// =======================================

function notifyAssignee() {

  if (RUN_UNIT_TESTS == true) {
   
    // Use the test job list rather than the main one
    var sheet = SpreadsheetApp.openById(UNIT_TESTS_JOBS_LIST_SPREADSHEET_ID).getSheets()[0];
    sheet.setActiveSelection(sheet.getRange("E2"));
        
  } else {
  
    // Get the row number of the row in the spreadsheet that's currently active.
    var sheet = SpreadsheetApp.getActiveSheet();
    
  }
    
  var row = sheet.getActiveRange().getRowIndex();

  if ((row == 1) || (row == 0)) {
    
    log(logType.WARNING, "notifyAssignee", "No row selected");
    return false;

  }    
  
  log(logType.INFO, "notifyAssignee", "Working on row: " + row);
  
  // Retrieve the assignee's info 
  
  var email = getCellValue(sheet, row, SS_COL_ASSIGNED_TO);
  
  if (email == -1) {
    
    log(logType.ERROR, "notifyAssignee", "Couldn't read assignee cell"); 
    return false;
  
  }
  
  if (email == "") {
    
    log(logType.WARNING, "notifyAssignee", "Email field blank"); 
    return false;
  
  }
  
  var title = getCellValue(sheet, row, SS_COL_TITLE);
  
  if (title == -1) {
    
    log(logType.ERROR, "notifyAssignee", "Couldn't read title"); 
    return false;
  
  }

  var notes = getCellValue(sheet, row, SS_COL_NOTES);

  if (notes == -1) {
    
    log(logType.ERROR, "notifyAssignee", "Couldn't read notes");
    return false;
 
  }
  
  // Construct the email for the assignee and send it
  
  var subject = "Job #" + row + " has been assigned to you.";
  
  var body = "You've been assigned maintenance job #" + row +" - " + title + "." +
             "\n\nPlease see the maintenance job list for more details or contact " +
             "the maintenance manager." + 
             "\n\nThe Maintenance Manager" +
             "\n\nx" + MAINTENANCE_OFFICE_EXTENSION;

  MailApp.sendEmail(email, subject, body, EMAIL_OPTIONS);
  
  // Send an email to the maintenance manager as a reminder

  var subject = "Job #" + row + " has been assigned to " + email + ".";
  
  var body = "AUTO-REMINDER" + 
             "\n\n" + email + " has been assigned maintenance job #" + row + " - " + title + ".";
  
  MailApp.sendEmail(MAINTENANCE_MANAGER_EMAIL, subject, body, EMAIL_OPTIONS);
    
  log(logType.INFO, 
      "notifyAssignee", 
      "Email assignee sent to email: " + email +
      "\n\nsubject: " + subject +
      "\n\nbody: " + body);
  
  return true;
  
}
