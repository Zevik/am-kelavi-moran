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
    console.log('Attempting to get data from sheet:', SHEET_NAME);
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    console.log('Spreadsheet found:', spreadsheet.getName());
    
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found. Available sheets: ${spreadsheet.getSheets().map(s => s.getName()).join(', ')}`);
    }
    
    console.log('Sheet found:', sheet.getName());
    
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

function getUniqueValues(columnNames) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    
    console.log('Headers found:', headers);
    console.log('Looking for columns:', columnNames);

    let result = {};
    columnNames.forEach(name => {
      const index = headers.indexOf(name);
      console.log(`Column "${name}" found at index:`, index);
      
      if (index === -1) {
        // Try to find similar column names (case insensitive, with trim)
        const similarIndex = headers.findIndex(h => 
          h && h.toString().trim().toLowerCase() === name.toLowerCase()
        );
        console.log(`Similar column for "${name}" found at index:`, similarIndex);
        
        if (similarIndex === -1) {
          result[name] = []; // Return empty array if column not found
          return;
        } else {
          result[name] = extractUniqueValues(data, similarIndex);
          return;
        }
      }
      
      result[name] = extractUniqueValues(data, index);
    });

    console.log('Final result:', result);
    return result;
    
  } catch (error) {
    console.error('Error in getUniqueValues:', error);
    throw new Error('שגיאה בטעינת ערכי הסינון: ' + error.message);
  }
}

function extractUniqueValues(data, columnIndex) {
  const set = new Set();
  
  data.forEach(row => {
    if (row.length <= columnIndex) return;
    const cell = row[columnIndex];

    if (typeof cell === 'string') {
      cell.split(',').forEach(v => {
        const trimmed = v.trim();
        if (trimmed) set.add(trimmed);
      });
    } else if (cell !== undefined && cell !== null && cell !== '') {
      set.add(String(cell).trim());
    }
  });

  return Array.from(set).filter(v => v.length > 0).sort();
}
