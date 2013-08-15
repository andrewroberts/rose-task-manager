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

// See the test doc for how to set up the unit tests
// =================================================


// Unit Tests Config
// =================

UNIT_TESTS_SPREADSHEET = "RoseCMMS_Unit_Tests_Spreadsheet"
UNIT_TESTS_FIRSTCOL = "FirstCol"
UNIT_TESTS_SECONDCOL = "SecondCol"

UNIT_TESTS_TASK_LIST = "RoseCMMS_Unit_Tests_Task_List"

UNIT_TESTS_CALENDAR_NAME = "RoseCMMS_UNIT_TESTS"
UNIT_TESTS_TASK_LIST_ID = "0AhRtIprIrwuzdDZRRTVOOGt3SmxKZFd1emxiUjRtUXc"

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
  
  // Set up the test spreadsheet
  // ---------------------------
  
  var testSheet = openSpreadSheet(UNIT_TESTS_SPREADSHEET).getSheets()[0];
  
  // Set up the spreadsheet headers
  var headers = [[UNIT_TESTS_FIRSTCOL, UNIT_TESTS_SECONDCOL]];
  testSheet.clear();
  testSheet.getRange("A1:B1").setValues(headers);
  
  // Set up the test task list
  // -------------------------
  
  var taskList = openSpreadSheet(UNIT_TESTS_TASK_LIST).getSheets()[0];
  
  // Set up the spreadsheet headers
  var headers = [[SS_COL_TIMESTAMP, 
                  SS_COL_CLOSED,
                  SS_COL_ID,
                  SS_COL_TITLE,
                  SS_COL_LOCATION,
                  SS_COL_PRIORITY,
                  SS_COL_STATUS,
                  SS_COL_CATEGORY,
                  SS_COL_REQUESTED_BY,
                  SS_COL_CONTACT_EMAIL,
                  SS_COL_EVENT_ID,
                  SS_COL_NOTES]];
  
  taskList.clear();
  
  taskList.getRange("A1:L1").setValues(headers);

  // config.gs
  //----------
  
  // Just config values, no functions
  
  module("utilities.gs");
  // --------------------
  
  // This function is already used in setting up the unit tests, so check we find the same sheet again
  test("openSpreadSheet", function() { 

    deepEqual(openSpreadSheet(UNIT_TESTS_SPREADSHEET).getSheets()[0], testSheet, "");
  
  });

  test("log", function() {
    
    deepEqual(log(logType.ERROR, "myTests", "test msg"), "ERROR: myTests: test msg", "");
    deepEqual(log(logType.WARNING, "myTests", "test msg"), "WARNING: myTests: test msg", "");
    deepEqual(log(logType.INFO, "myTests", "test msg"), "INFO: myTests: test msg", "");
  
  });

  test("getColIndexByName", function() {
    
    deepEqual(getColIndexByName(testSheet, UNIT_TESTS_FIRSTCOL), 1, "");
    deepEqual(getColIndexByName(testSheet, "SOME RANDOM TEXT"), -1, "");    
  
  });
  
  // Clear the field A2 in the spreadsheet
  testSheet.getRange("A2").setValue("");
  
  test("setCellValue", function() {
    
    deepEqual(setCellValue(testSheet, 2, UNIT_TESTS_FIRSTCOL, 99), testSheet.getRange("A2").getValue());
    
  });
  
  test("getCellValue", function() {
    
    deepEqual(getCellValue(testSheet, 2, UNIT_TESTS_FIRSTCOL), testSheet.getRange("A2").getValue());
    
  });
  
  module("triggers.gs");
  //------------------
    
  // onOpen() and onEdit() are tested in systems tests, not going to replicate in unit.
  
  // Add the necessary fields to the test task list to run emailStatusUpdates
  setCellValue(taskList, 2, SS_COL_ID, 2);
  setCellValue(taskList, 2, SS_COL_CONTACT_EMAIL, ADMIN_EMAIL);
  setCellValue(taskList, 2, SS_COL_STATUS, STATUS_NEW);
  setCellValue(taskList, 2, SS_COL_TITLE, "test task");
                                                        
  test("emailStatusUpdates", function() {
    
    deepEqual(emailStatusUpdates(), true);
    
  });
  
  test("sortAndFilter", function() {
    
    deepEqual(sortAndFilter(), true);
    
  });
  
  module("calendar.gs");
  //--------------------
  
  test("convertEventsToTasks", function() {
    
    deepEqual(convertEventsToTasks(), true);
    
  });
  
  // form.gs
  // -------
  //
  // form.gs is just tested in system tests
  //
  
  // unitTests.gs
  // ------------
  //
  // This file.
  //
  
  // style.gs
  // --------
  //
  // Just config, no functionality to test
  //
  
  // doGet.gs
  // --------
  //
  // Tested in system tests
  //
  
  module("fillTemplate.gs");
  // -----------------------
  
  var template = "Replace this ${\"Test\"} and ${\"Test1\"}";
  var value = {test:"text", test1:"text1"};
  
  test("fillInTemplateFromObject", function() {
    
    deepEqual(fillInTemplateFromObject(template,value), "Replace this text and text1");
    
  });
  
  // importDDDP.gs
  // -------------
  //
  // This was just used back in v0.1.0, although there are test sheets available
  //
  
  // changeLog.gs
  // ------------
  //
  // Just change info
  //
  
}

