const SHEET_NAME = 'Sheet2';

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
    console.log('Attempting to get data...');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets();
    
    // Try to find a sheet with data
    for (let sheet of sheets) {
      console.log('Checking sheet:', sheet.getName());
      
      const values = sheet.getDataRange().getValues();
      if (values.length > 1) { // Has header + at least one row of data
        console.log(`Found data in sheet: ${sheet.getName()}, rows: ${values.length}`);
        
        // Remove header row
        values.shift();
        
        // Filter out completely empty rows
        const filteredValues = values.filter(row => 
          row.some(cell => cell !== null && cell !== undefined && cell !== '')
        );
        
        console.log('Data after filtering empty rows:', filteredValues.length);
        return filteredValues;
      }
    }
    
    console.log('No data found in any sheet');
    return [];
    
  } catch (error) {
    console.error('Error in getData:', error);
    throw new Error('שגיאה בטעינת הנתונים: ' + error.message);
  }
}

function getUniqueValues(columnNames) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets();
    
    // Find the sheet with data
    let dataSheet = null;
    for (let sheet of sheets) {
      const values = sheet.getDataRange().getValues();
      if (values.length > 1) {
        dataSheet = sheet;
        break;
      }
    }
    
    if (!dataSheet) {
      throw new Error('No sheet with data found');
    }
    
    const data = dataSheet.getDataRange().getValues();
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
