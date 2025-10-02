// Google Apps Script to receive form data and write to Google Sheet
// Deploy this as a Web App

// Configuration - UPDATE THIS
const SHEET_NAME = 'Teaching Activities'; // Name of your sheet tab

// Column mapping - adjust based on your sheet structure
const COLUMNS = {
  entryDate: 1,        // A
  activityType: 2,     // B
  academicYear: 3,     // C
  status: 4,           // D
  institution: 5,      // E
  date: 6,             // F
  startDate: 7,        // G
  endDate: 8,          // H
  title: 9,            // I
  course: 10,          // J
  learnerLevels: 11,   // K
  learnerNames: 12,    // L
  learnerLevel: 13,    // M
  learnerYear: 14,     // N
  location: 15,        // O
  hours: 16,           // P
  hoursPerSession: 17, // Q
  numLearners: 18,     // R
  numSessions: 19,     // S
  numStudents: 20,     // T
  supervisionType: 21, // U
  unitType: 22,        // V
  recurring: 23,       // W
  roundsType: 24,      // X
  studentName: 25,     // Y
  role: 26,            // Z
  degree: 27,          // AA
  projectTitle: 28,    // AB
  projectStatus: 29,   // AC
  studentInstitution: 30, // AD
  collaborators: 31,   // AE
  studentAwards: 32,   // AF
  examType: 33,        // AG
  otherType: 34,       // AH
  completionDate: 35,  // AI
  evaluation: 36,      // AJ
  description: 37,     // AK
  notes: 38            // AL
};

// Handle POST requests from the web form
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    writeToSheet(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput('Google Apps Script is running. Use POST to submit data.')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Write data to Google Sheet
function writeToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    setupSheet(sheet);
  }
  
  // Prepare row data - create array with correct column positions
  const rowData = new Array(Object.keys(COLUMNS).length).fill('');
  
  // Map data to correct columns
  for (const [key, value] of Object.entries(data)) {
    const columnIndex = COLUMNS[key];
    if (columnIndex) {
      rowData[columnIndex - 1] = value || '';
    }
  }
  
  // Append the row
  sheet.appendRow(rowData);
  
  // Format the new row
  const lastRow = sheet.getLastRow();
  formatRow(sheet, lastRow);
}

// Setup sheet with headers and formatting
function setupSheet(sheet) {
  // Set up headers
  const headers = [
    'Entry Date',
    'Activity Type',
    'Academic Year',
    'Status',
    'Institution',
    'Date',
    'Start Date',
    'End Date',
    'Title',
    'Course/Program',
    'Learner Levels',
    'Learner Names',
    'Learner Level',
    'Learner Year',
    'Location',
    'Hours',
    'Hours Per Session',
    'Number of Learners',
    'Number of Sessions',
    'Number of Students',
    'Supervision Type',
    'Unit Type',
    'Recurring',
    'Rounds Type',
    'Student Name',
    'Role',
    'Degree',
    'Project Title',
    'Project Status',
    'Student Institution',
    'Collaborators',
    'Student Awards',
    'Exam Type',
    'Other Type',
    'Completion Date',
    'Evaluation',
    'Description',
    'Notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4A5568');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  headerRange.setWrap(true);
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Set column widths
  sheet.setColumnWidth(1, 150); // Entry Date
  sheet.setColumnWidth(2, 150); // Activity Type
  sheet.setColumnWidth(3, 100); // Academic Year
  sheet.setColumnWidth(4, 100); // Status
  sheet.setColumnWidth(5, 200); // Institution
  sheet.setColumnWidth(9, 250); // Title
  sheet.setColumnWidth(37, 300); // Description
  sheet.setColumnWidth(38, 200); // Notes
}

// Format a data row
function formatRow(sheet, rowNumber) {
  const range = sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn());
  
  // Alternate row colors
  if (rowNumber % 2 === 0) {
    range.setBackground('#F7FAFC');
  }
  
  // Set borders
  range.setBorder(true, true, true, true, false, false);
  
  // Format date columns
  const dateColumns = [1, 6, 7, 8, 35]; // Entry Date, Date, Start Date, End Date, Completion Date
  dateColumns.forEach(col => {
    sheet.getRange(rowNumber, col).setNumberFormat('yyyy-mm-dd');
  });
  
  // Format number columns
  const numberColumns = [16, 17, 18, 19, 20]; // Hours, Hours Per Session, Learners, Sessions, Students
  numberColumns.forEach(col => {
    sheet.getRange(rowNumber, col).setNumberFormat('0.0');
  });
}

// Utility function to create a summary view
function createSummarySheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let summarySheet = ss.getSheetByName('Summary');
  
  if (!summarySheet) {
    summarySheet = ss.insertSheet('Summary');
  }
  
  summarySheet.clear();
  
  // Add summary formulas
  const headers = [
    ['Teaching Activity Summary'],
    [''],
    ['Academic Year', 'Activity Type', 'Total Hours', 'Total Learners', 'Count']
  ];
  
  summarySheet.getRange(1, 1, headers.length, 5).setValues(headers);
  summarySheet.getRange(1, 1).setFontSize(16).setFontWeight('bold');
  summarySheet.getRange(3, 1, 1, 5).setBackground('#4A5568').setFontColor('#FFFFFF').setFontWeight('bold');
  
  // You can add QUERY or PIVOT formulas here to summarize the data
  // Example:
  // =QUERY('Teaching Activities'!A:Z, "SELECT C, B, SUM(P), SUM(R), COUNT(B) WHERE C IS NOT NULL GROUP BY C, B ORDER BY C, B", 1)
}

// Test function - run this to verify the script works
function testWrite() {
  const testData = {
    entryDate: new Date().toISOString(),
    activityType: 'lecture',
    academicYear: '2024-2025',
    status: 'Completed',
    institution: 'University of Toronto',
    date: '2024-10-01',
    title: 'Test Lecture',
    location: 'Main Auditorium',
    hours: 2,
    numLearners: 30,
    learnerLevels: 'Medical Student, Resident',
    description: 'This is a test entry'
  };
  
  writeToSheet(testData);
  Logger.log('Test data written successfully');
}