rose-cmms
=========

Rose CMMS is a Computerised Maintenance Management System (CMMS) that has been developed to make full use of Google Apps and tied together with Google Apps Script.

In is still early in development and at present only supports planned preventative maintenance (PPM) and work orders (ad hoc job requests) - pretty much a task manager. 

The heart of the CMMS is the Google spreadsheet that holds the task list. This spreadsheet has to be created with the fields detailed in config.gs and its ID has to be entered in config.gs (along with an admin email address), or a copy of the demo spreadsheet can be taken. This will give a basic list into which tasks can be entered, with the ability to send a customisable update email to the task requestor. With extra configuration a customised form can be deployed as a web app to add tasks and send an email notification to the list admin. By adding a daily trigger and a calendar regular tasks can automatically be added to the list, again with email notifications. 

Documentation is available on Google Drive
------------------------------------------

Installation Guide v0.2.0

https://docs.google.com/document/d/18gq2ppU85llHqIAJB2iLBXlUaqDDPll50fte4v2jX5Q/edit?usp=sharing

Demo Version 

https://docs.google.com/spreadsheet/ccc?key=0AhRtIprIrwuzdE9FSlJtVFA1MDRpUWxJQVZCVWt3ZXc&usp=sharing

Issue Tracker

https://docs.google.com/spreadsheet/ccc?key=0Aneep_MqACaUdDRRMjg4VlZJbUVEMF91cHhtVUp2Unc&usp=sharing

Test Doc v0.2.0

https://docs.google.com/document/d/1AVo7nHECXS4cnC90z3AuQqp1R2RMiERHjVw0QWYm4Do/edit?usp=sharing


