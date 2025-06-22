// פונקציית דיבאג מתקדמת לזיהוי הבעיה
function debugSpreadsheet() {
  try {
    console.log('=== DEBUG SPREADSHEET ===');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    console.log('Spreadsheet ID:', spreadsheet.getId());
    console.log('Spreadsheet Name:', spreadsheet.getName());
    console.log('Spreadsheet URL:', spreadsheet.getUrl());
    
    const sheets = spreadsheet.getSheets();
    console.log('Total sheets:', sheets.length);
    
    sheets.forEach((sheet, index) => {
      console.log(`\n--- Sheet ${index + 1} ---`);
      console.log('Name:', sheet.getName());
      console.log('Sheet ID:', sheet.getSheetId());
      
      try {
        const range = sheet.getDataRange();
        console.log('Data range:', range.getA1Notation());
        
        const values = range.getValues();
        console.log('Total rows:', values.length);
        console.log('Total columns:', values.length > 0 ? values[0].length : 0);
        
        if (values.length > 0) {
          console.log('Headers (first row):', values[0]);
        }
        
        if (values.length > 1) {
          console.log('Sample data (second row):', values[1]);
        }
        
        // בדוק אם יש נתונים אמיתיים
        const nonEmptyRows = values.filter(row => 
          row.some(cell => cell !== null && cell !== undefined && cell !== '')
        );
        console.log('Non-empty rows:', nonEmptyRows.length);
        
      } catch (error) {
        console.error('Error reading sheet data:', error);
      }
    });
    
    console.log('=== END DEBUG ===');
    
  } catch (error) {
    console.error('Debug error:', error);
  }
}

// פונקציה פשוטה לבדיקת חיבור
function testConnection() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    return {
      success: true,
      name: spreadsheet.getName(),
      sheets: spreadsheet.getSheets().map(s => s.getName())
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// פונקציה לקריאת נתונים מגיליון ספציפי
function getDataFromSheet(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }
    
    const values = sheet.getDataRange().getValues();
    console.log(`Data from ${sheetName}:`, values.length, 'rows');
    
    if (values.length === 0) {
      return [];
    }
    
    // הסר כותרת
    const headers = values.shift();
    console.log('Headers:', headers);
    
    // סנן שורות ריקות
    const filteredData = values.filter(row => 
      row.some(cell => cell !== null && cell !== undefined && cell !== '')
    );
    
    console.log('Filtered data:', filteredData.length, 'rows');
    return filteredData;
    
  } catch (error) {
    console.error('Error in getDataFromSheet:', error);
    throw error;
  }
}
