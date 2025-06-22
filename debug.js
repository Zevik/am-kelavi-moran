// פונקציות דיבאג פשוטות לפי מספרי עמודות
function debugSpreadsheet() {
  try {
    console.log('=== DEBUG SPREADSHEET ===');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    console.log('Spreadsheet ID:', spreadsheet.getId());
    console.log('Spreadsheet Name:', spreadsheet.getName());
    
    const sheet = spreadsheet.getSheetByName('Sheet1');
    if (!sheet) {
      console.log('Sheet1 not found');
      return;
    }
    
    console.log('Sheet found: Sheet1');
    
    const range = sheet.getDataRange();
    console.log('Data range:', range.getA1Notation());
    
    const values = range.getValues();
    console.log('Total rows:', values.length);
    console.log('Total columns:', values.length > 0 ? values[0].length : 0);
    
    if (values.length > 0) {
      console.log('Headers (row 1):', values[0]);
    }
    
    if (values.length > 1) {
      console.log('Sample data (row 2):', values[1]);
    }
    
    // Column mapping
    console.log('Column mapping:');
    console.log('0: Post ID');
    console.log('1: למי זה');
    console.log('2: קטגוריה');
    console.log('3: תת קטגוריה');
    console.log('4: שם המשרד/הארגון');
    console.log('5: לינק לפרטים');
    console.log('6: מתי עודכן');
    console.log('7: פרטים');
    
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
