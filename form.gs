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

// Create the task request form
// ============================

function createForm(event) {
  
  var app = UiApp.createApplication().setTitle(PAGE_TITLE);

  // Create the entry form
  // ---------------------

  // Create a vertical panel to hold all the widgets
  var mainPanel = app.createVerticalPanel();
  
  mainPanel.setWidth(MAIN_PANEL_WIDTH);
  setStyleMainPanel(mainPanel);
  mainPanel.setId("mainPanel");
  
  // Add a title to the panel
  var titlePanel = app.createVerticalPanel();
  var titleLabel = app.createLabel().setText(FORM_TITLE);
  setStyleTitle(titleLabel);
  
  titlePanel.add(titleLabel);
  
  mainPanel.add(titlePanel);
  
  // Create a grid for the main text
  var grid = app.createGrid(6, 2);
  
  grid.setWidget(0, 0, setStyle1(app.createLabel('Requested By:')));
  
  var textBox = app.createTextBox()
                   .setWidth(TEXTBOX_WIDTH)
                   .setName('requestedBy') 
                   .setId('requestedBy');
  
  grid.setWidget(0, 1, textBox);
  
  grid.setWidget(1, 0, setStyle1(app.createLabel('Contact Email:')));
  
  textBox = app.createTextBox()
               .setWidth(TEXTBOX_WIDTH)  
               .setName('contactEmail') 
               .setId('contactEmail');
  
  grid.setWidget(1, 1, textBox);

  grid.setWidget(2, 0, setStyle1(app.createLabel('Subject:')));

  textBox = app.createTextBox()
               .setWidth(TEXTBOX_WIDTH)  
               .setName('title') 
               .setId('title');
  
  grid.setWidget(2, 1, textBox);
  
  grid.setWidget(3, 0, setStyle1(app.createLabel('Description:')));
  
  var textArea = app.createTextArea()
                    .setSize(TEXTAREA_WIDTH, TEXTAREA_HEIGHT)
                    .setName('description')
                    .setId('description');
  
  grid.setWidget(3, 1, textArea);

  grid.setWidget(4, 0, setStyle1(app.createLabel('Location:')));
  
  textBox = app.createTextBox()
               .setWidth(TEXTBOX_WIDTH)  
               .setName('location') 
               .setId('location');
    
  grid.setWidget(4, 1, textBox);

  grid.setWidget(5, 0, setStyle1(app.createLabel('Priority: ')));  

  // Create sub-grid for radio buttons
  var rbGrid = app.createGrid(1, 3);
  
  var rbLowPriority = app.createRadioButton('group1', PRIORITY_LOW)
                         .setName('lowPriority')
                         .setId('lowPriority')
                         .setValue(true); // Low priority by default
  
  rbGrid.setWidget(0, 2, rbLowPriority);
  
  var rbNormalPriority = app.createRadioButton('group1', PRIORITY_NORMAL)
                            .setName('normalPriority')
                            .setId('normalPriority');

  rbGrid.setWidget(0, 1, rbNormalPriority);                 
  
  var rbHighPriority = app.createRadioButton('group1', PRIORITY_HIGH)
                          .setName('highPriority')
                          .setId('highPriority');  

  rbGrid.setWidget(0, 0, rbHighPriority);

  // Create change Handlers for radio buttons
  var handlerLow = app.createServerValueChangeHandler('handlerLow').addCallbackElement(mainPanel);
  var handlerNormal = app.createServerValueChangeHandler('handlerNormal').addCallbackElement(mainPanel);
  var handlerHigh = app.createServerValueChangeHandler('handlerHigh').addCallbackElement(mainPanel);
 
  rbLowPriority.addValueChangeHandler(handlerLow);
  rbNormalPriority.addValueChangeHandler(handlerNormal);
  rbHighPriority.addValueChangeHandler(handlerHigh);
  
  // Add radio button grid to main grid
  grid.setWidget(5, 1, rbGrid);
  
  // Add main grid to main panel
  mainPanel.add(grid);
  
  // Create a horizontal panel called buttonPanel to hold two buttons, one for submitting the contents of the form
  // to the Spreadsheet, the other to close the form.
  var buttonPanel = app.createHorizontalPanel();
  setStyleButtonPanel(buttonPanel);

  // Two buttons get added to buttonPanel: button (for submits) and closeButton (for closing the form)
  // For the submit button we create a server click handler submitHandler and pass submitHandler to the button as a click handler.
  // the function submit gets called when the submit button is clicked.
  var button = app.createButton('Submit');
  var submitHandler = app.createServerClickHandler('submit');
  submitHandler.addCallbackElement(grid); 
  button.addClickHandler(submitHandler);
  buttonPanel.add(button);

  // For the close button, we create a server click handler closeHandler and pass closeHandler to the close button as a click handler.
  // The function close is called when the close button is clicked.
  var closeButton = app.createButton('Close');
  var closeHandler = app.createServerClickHandler('close');
  closeButton.addClickHandler(closeHandler);
  // buttonPanel.add(closeButton); Remove it until it does something

  // Create label called statusLabel and make it invisible; add buttonPanel and statusLabel to the main display panel.
  var statusLabel = app.createLabel().setId('status').setVisible(false);
  setStyleBottomText(statusLabel);
  mainPanel.add(statusLabel);

  mainPanel.add(buttonPanel);

  app.add(mainPanel);
  
  return app;

}

// Close everything return when the close button is clicked
// ========================================================

function close() {
  
  var app = UiApp.getActiveApplication();
  
  app.close();
  
  // The following line is REQUIRED for the widget to actually close.
  return app;
  
}

// Function called when submit button is clicked
// =============================================

function submit(e) {

  // Write the data in the text boxes back to the Spreadsheet
  // --------------------------------------------------------
  
  var ss = SpreadsheetApp.openById(TASK_LIST_SPREADSHEET_ID);
  var sheet = ss.getSheetByName(TASK_LIST_WORK_SHEET_NAME);  
  var id = ss.getLastRow() + 1; // Match ID to row number of next free one
  var nextFreeRow = ss.getLastRow() + 1;
  var date = new Date();
  
  log(logType.INFO, "submit", "Event low priority = " + e.parameter.lowPriority); 
  log(logType.INFO, "submit", "Event normal priority = " + e.parameter.normalPriority); 
  log(logType.INFO, "submit", "Event high priority = " + e.parameter.highPriority); 
  
  // Get the priority of the task by checking which radio button was active
  var priority = PRIORITY_LOW;
  
  if (e.parameter.normalPriority == "true") {
    
    priority = PRIORITY_NORMAL;
  
  } else if (e.parameter.highPriority == "true") {
    
    priority = PRIORITY_HIGH;
  
  }
   
  log(logType.INFO, "submit", "priority = " + priority); 
  
  setCellValue(sheet, nextFreeRow, SS_COL_ID, id);
  setCellValue(sheet, nextFreeRow, SS_COL_TIMESTAMP, date);
  setCellValue(sheet, nextFreeRow, SS_COL_TITLE, e.parameter.title);
  setCellValue(sheet, nextFreeRow, SS_COL_REQUESTED_BY, e.parameter.requestedBy);
  setCellValue(sheet, nextFreeRow, SS_COL_PRIORITY, priority);
  setCellValue(sheet, nextFreeRow, SS_COL_CONTACT_EMAIL, e.parameter.contactEmail);
  setCellValue(sheet, nextFreeRow, SS_COL_LOCATION, e.parameter.location);
  setCellValue(sheet, nextFreeRow, SS_COL_STATUS, STATUS_NEW);
  setCellValue(sheet, nextFreeRow, SS_COL_NOTES, e.parameter.description);
  
  log(logType.INFO, "submit", "Data written to spreadsheet");
  
  // Construct and send the response email to user
  // ---------------------------------------------
  
  // Extract the contact email and the task description from the event object
  var userEmail = e.parameter.contactEmail;
  var title = e.parameter.title;
  
  // Create the email and send it
  var subjectTemplate = FORM_SUBJECT_TEMPLATE;
  var subjectData = {id:id, title:title};
  var subject = fillInTemplateFromObject(subjectTemplate, subjectData);
    
  var bodyTemplate = FORM_BODY_TEMPLATE;
  var bodyData = {id:id, title:title};
  var body = fillInTemplateFromObject(bodyTemplate, bodyData);
    
  MailApp.sendEmail(userEmail, subject, body, {name:CMMS_NAME, cc:ADMIN_EMAIL});
  
  log(logType.INFO, "submit", "subject: " + subject + "body: " + body);

  // Clear the values from the text boxes so that new values can be entered
  // ----------------------------------------------------------------------
  
  var app = UiApp.getActiveApplication();
  
  app.getElementById('requestedBy').setValue('');
  app.getElementById('title').setValue('');
  app.getElementById('description').setValue('');
  app.getElementById('contactEmail').setValue('');
  app.getElementById('location').setValue('');
  app.getElementById('lowPriority').setValue(true);
  app.getElementById('normalPriority').setValue(false);
  app.getElementById('highPriority').setValue(false);
  
  log(logType.INFO, "submit", "widgets reset");
  
  // Make the status line visible and tell the user the possible actions
  app.getElementById('status')
     .setVisible(true)
     .setText(FORM_ACK_TEXT);
  
  return app;
  
}

// Priority radio button change handler
// ====================================

function handlerLow(e) { 
  
  var app = UiApp.getActiveApplication();
  
  log(logType.INFO, "handlerLow", "low pri = " + e.parameter.lowPriority);
  
  app.getElementById('lowPriority').setValue(true);
  app.getElementById('normalPriority').setValue(false);
  app.getElementById('highPriority').setValue(false);
  
  return app;
  
}

function handlerNormal(e) { 
  
  var app = UiApp.getActiveApplication();
  
  log(logType.INFO, "handlerNormal", "normal pri = " + e.parameter.normalPriority);
  
  app.getElementById('lowPriority').setValue(false);
  app.getElementById('normalPriority').setValue(true);  
  app.getElementById('highPriority').setValue(false);
  
  return app;
  
}

function handlerHigh(e) { 
  
  var app = UiApp.getActiveApplication();
  
  log(logType.INFO, "handlerHigh", "high pri = " + e.parameter.higPriority);  
  
  app.getElementById('lowPriority').setValue(false);
  app.getElementById('normalPriority').setValue(false);
  app.getElementById('highPriority').setValue(true);
  
  return app;
  
}
