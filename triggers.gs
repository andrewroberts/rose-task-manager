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

// Event handler for the sheet being opened
// ========================================

function onOpen() {
  
  var subMenus = [{name:"Send Status Email", functionName: "emailStatusUpdates"},
                  {name:"Sort and Filter", functionName: "sortAndFilter"}];
 
  SpreadsheetApp.getActiveSpreadsheet().addMenu("Task Management", subMenus);
  
}

// Event handler for the form being edited
// =======================================

function onEdit(event) {
  
  // Get some info about the event
  var sheet = event.source.getActiveSheet();
  var range = event.source.getActiveRange();
  var email = Session.getActiveUser().getEmail();
  
  // Record when the latest change was made and who did it
  range.setComment("Last modified by " + email + ": " + (new Date()));
  
  // Record the "closed" date
  // ------------------------
  
  var colIndex = range.getColumn();
  var rowIndex = range.getRow();
  
  log(logType.INFO, "onEdit", "row:" + rowIndex + " col:" + colIndex);
  
  if (colIndex == getColIndexByName(sheet, SS_COL_STATUS)) {
    
    var value = range.getValue();
    
    log (logType.INFO, "onEdit", "Changed value =" + value);
  
    if ((value == STATUS_IGNORED) || (value == STATUS_DONE)) {
    
      // Record the closed date
      log(logType.INFO, "onEdit", "set closed date");
      setCellValue(sheet, rowIndex, SS_COL_CLOSED, (new Date()));
      
    } else {
      
      // Clear the field otherwise
      log(logType.INFO, "onEdit", "clear closed date");
      setCellValue(sheet, rowIndex, SS_COL_CLOSED, null);
      
    }
      
  }
  
}

// Sort and filter the spreadsheet
// ===============================

function sortAndFilter() {
  
  
  if (RUN_UNIT_TESTS == true) {
   
    // Use the test list rather than the main one
    var sheet = openSpreadSheet(UNIT_TESTS_TASK_LIST).getSheets()[0];

  } else {
  
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    
  }
  
  var statusIndex = getColIndexByName(sheet, SS_COL_STATUS);
  var priIndex = getColIndexByName(sheet, SS_COL_PRIORITY);
  
  // Sort the sheet by Status
  sheet.sort(statusIndex, false);
  
  // Sorts the sheet by Priority
  sheet.sort(priIndex, false);
  
  // Filter 
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  
  for (var i=1; i <= numRows -1; i++) {
    
    var row = values[i];
    
    // Column value
    var myValue = row[statusIndex - 1];
    
    // filter value 
    if ((myValue == STATUS_IGNORED) || (myValue == STATUS_DONE)) {
      
      sheet.hideRows(i+1);
      
    }
    
  }
  
  return true;

} // sortAndFilter

// Send an email status update
// ===========================

function emailStatusUpdates() {
  
  if (RUN_UNIT_TESTS == true) {
   
    // Use the test list rather than the main one
    var sheet = openSpreadSheet(UNIT_TESTS_TASK_LIST).getSheets()[0];
    sheet.setActiveSelection(sheet.getRange("E2")); // TODO - hardcoding 

  } else {
  
    // Get the row number of the row in the spreadsheet that's 
    // currently active (the task list).
    var ss = SpreadsheetApp.getActiveSpreadsheet();
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
  
  var subjectTemplate = STATUS_SUBJECT_TEMPLATE;
  var subjectData = {id:id, status:status};
  var subject = fillInTemplateFromObject(subjectTemplate, subjectData);
    
  var bodyTemplate = STATUS_BODY_TEMPLATE;
  var bodyData = {row:id, title:title, status:status};
  var body = fillInTemplateFromObject(bodyTemplate, bodyData);
  
  MailApp.sendEmail(userEmail, subject, body, {name:CMMS_NAME, cc:ADMIN_EMAIL});
  
  log(logType.INFO, 
      "emailStatusUpdates", 
      "Email status sent to email: " + userEmail +
      "\n\nsubject: " + subject +
      "\n\nbody: " + body);
  
  return true;
  
} // emailStatusUpdates()
