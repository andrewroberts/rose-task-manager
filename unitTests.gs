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

// Run the unit tests
// ==================

function runUnitTests(event) {
  
  // QUnit.urlParams(event.parameter);
  QUnit.config({title: "Rose CMMS - Unit tests" });
  QUnit.load(myTests);
  return QUnit.getHtml();
  
};

// Imports the following functions:
// ok, equal, notEqual, deepEqual, notDeepEqual, strictEqual,
// notStrictEqual, throws, module, test, asyncTest, expect
QUnit.helpers(this);

// The Unit Tests
// ==============

function myTests() {
  
  // utilities.gs
  // ------------
  
  // Need tests for openSpreadSheet
  
  // Check for the required docs and create if necessary
  var sheet = openSpreadSheet(UNIT_TESTS_SPREADSHEET_NAME).getSheets()[0];
  
  // Set up the spreadsheet headers
  var headers = [[UNIT_TESTS_FIRSTCOL, UNIT_TESTS_SECONDCOL]];
  sheet.clear();
  sheet.getRange("A1:B1").setValues(headers);
  
  module("utilities.gs");
  
  test("log", function() {
    
    deepEqual(log(logType.ERROR, "myTests", "test msg"), "ERROR: myTests: test msg", "");
    deepEqual(log(logType.WARNING, "myTests", "test msg"), "WARNING: myTests: test msg", "");
    deepEqual(log(logType.INFO, "myTests", "test msg"), "INFO: myTests: test msg", "");
  
  });

  test("getColIndexByName", function() {
    
    deepEqual(getColIndexByName(sheet, UNIT_TESTS_FIRSTCOL), 1, "");
    deepEqual(getColIndexByName(sheet, "SOME RANDOM TEXT"), -1, "");    
  
  });
  
  // Clear the field A2 in the spreadsheet
  sheet.getRange("A2").setValue("");
  
  test("setCellValue", function() {
    
    deepEqual(setCellValue(sheet, 2, UNIT_TESTS_FIRSTCOL, 99), sheet.getRange("A2").getValue());
    
  });
  
  test("getCellValue", function() {
    
    deepEqual(getCellValue(sheet, 2, UNIT_TESTS_FIRSTCOL), sheet.getRange("A2").getValue());
    
  });
  
  // This only gets run the once so do a visual check on the test email account, calendar and job list.
  test("importPPMEvents", function() {
    
    // Takes ages (20s)
    // deepEqual(importPPMEvents(), true);
    ok(true);
    
  });

  // This only gets run the once so do a visual check on the test job list.
  test("importJobList", function() {
    
    deepEqual(importJobList(), true);
    
  });
  
  // onOpen.gs
  // ---------
  
  module("onOpen.gs");
    
  test("emailStatusUpdates", function() {
    
    deepEqual(emailStatusUpdates(), true);
    
  });

  test("notifyAssignee", function() {
    
    deepEqual(notifyAssignee(), true);
    
  });
  
  // calendar.gs
  // -----------

  module("calendar.gs");
  
  test("convertEventsToJobs", function() {
    
    deepEqual(convertEventsToJobs(), true);
    
  });
  
  // form.gs
  // -------
  
  // form.gs is just tested in system tests
  
}

