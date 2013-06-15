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

// Helper methods to set the style of an element
// =============================================

function setStyleTitle(a) {
  
  a.setStyleAttribute("fontSize","27pt");
  a.setStyleAttribute("margin-top","20px");
  a.setStyleAttribute("margin-bottom","20px");
  a.setStyleAttribute("font-weight","bold");
  a.setStyleAttribute("color","brown");
  
  return a;
  
}

function setStyle1(a) {

  a.setStyleAttribute("fontSize","16pt");
  a.setStyleAttribute("margin-top","2px");
  a.setStyleAttribute("font-weight","normal");
  a.setStyleAttribute("color","black");
  
  return a;
  
}

function setStyleBottomText(a) {

  a.setStyleAttribute("fontSize","12pt");
  a.setStyleAttribute("margin-top","5px");
  a.setStyleAttribute("font-weight","normal");
  a.setStyleAttribute("color","brown");
  
  return a;
  
}

function setStyleMainPanel(a) {

  a.setStyleAttribute("padding","25px");
  a.setStyleAttribute("fontSize", "12pt");
  a.setStyleAttribute("text-align", "center"); // Doesn't work
  // a.setStyleAttribute("border-style", "solid");
  // a.setStyleAttribute("border-width", "2px");
                      
  return a;
  
}

function setStyleButtonPanel(a) {

  a.setStyleAttribute("margin-top","10px");
  a.setStyleAttribute("fontSize", "12pt");
  
  return a;
  
}
