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

// Open a spreadsheet and if it doesn't exist create it
// ====================================================

function openSpreadSheet(fileName) {

  log(logType.INFO, "openSpreadSheet", "open " + fileName);
  
  // Search the spreadsheets in the user's Docs List for the 
  // first instance of this spreadsheet
  
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
    
    // Create the spreadsheet 
    ss = SpreadsheetApp.create(fileName);
    
    if (ss == null) {
      
      log(logType.WARNING, "openSpreadSheet", "Failed to create " + fileName);
      
    }
    
  }

  return ss;
  
}

// Log a message for debug and optionally also tell the user
// =========================================================

var logType = {INFO:0, WARNING:1, ERROR:2};

function log(type, functionName, msg) {
  
  if (LOG_ALL == false) {
    
    return "";
    
  }
  
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

