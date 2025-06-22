const SHEET_NAME = 'Sheet1';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Helper function to get all sheet names for debugging
function getSheetNames() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    return spreadsheet.getSheets().map(sheet => sheet.getName());
  } catch (error) {
    console.error('Error getting sheet names:', error);
    return [];
  }
}

function getData() {
  try {
    console.log('Attempting to get data from Sheet1...');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found`);
    }
    
    const values = sheet.getDataRange().getValues();
    console.log('Raw data retrieved, rows:', values.length);
    
    if (values.length === 0) {
      console.log('No data found in sheet');
      return [];
    }
    
    // Remove header row
    values.shift();
    console.log('Data after removing header, rows:', values.length);
    
    // Filter out completely empty rows
    const filteredValues = values.filter(row => 
      row.some(cell => cell !== null && cell !== undefined && cell !== '')
    );
    
    console.log('Data after filtering empty rows:', filteredValues.length);
    return filteredValues;
    
  } catch (error) {
    console.error('Error in getData:', error);
    throw new Error('שגיאה בטעינת הנתונים: ' + error.message);
  }
}

function getUniqueValues() {
  try {
    console.log('Getting unique values by column numbers...');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found`);
    }
    
    const data = sheet.getDataRange().getValues();
    data.shift(); // Remove header row
    
    // Column mapping based on the actual spreadsheet structure:
    // 0: Post ID, 1: למי זה, 2: קטגוריה, 3: תת קטגוריה
    const columnMapping = {
      'למי זה ': 1,
      'קטגוריה': 2,
      'תת קטגוריה': 3
    };
    
    let result = {};
    
    Object.keys(columnMapping).forEach(filterName => {
      const columnIndex = columnMapping[filterName];
      console.log(`Processing column ${columnIndex} for ${filterName}`);
      
      const uniqueValues = new Set();
      
      data.forEach(row => {
        if (row[columnIndex]) {
          const value = row[columnIndex].toString().trim();
          if (value) {
            // Split by comma if multiple values in one cell
            value.split(',').forEach(v => {
              const trimmed = v.trim();
              if (trimmed) uniqueValues.add(trimmed);
            });
          }
        }
      });
      
      result[filterName] = Array.from(uniqueValues).sort();
      console.log(`Found ${result[filterName].length} unique values for ${filterName}`);
    });
    
    console.log('Final unique values result:', result);
    return result;
    
  } catch (error) {
    console.error('Error in getUniqueValues:', error);
    throw new Error('שגיאה בטעינת ערכי הסינון: ' + error.message);
  }
}
