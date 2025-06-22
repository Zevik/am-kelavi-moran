# מערכת חיפוש וסינון כרטיסים - עם כלביא

## תיקון בעיית טעינת הנתונים

### הבעיה הנוכחית
הנתונים חוזרים כ-`null` מהפונקציה `getData()`, כפי שניתן לראות בקונסול.

### צעדי אבחון (חדש! 🔥)
1. **העתק את קובץ `debug.js`** ל-Google Apps Script שלך (יצור קובץ חדש)
2. **רענן את האפליקציה** ולחץ על כפתור "🔍 בדוק חיבור"
3. **בדוק את הלוגים** ב-Google Apps Script (View > Logs או Executions)
4. **הודע לי מה המערכת מצאה**

### פתרונות אפשריים

#### אם הגיליון נקרא Sheet2:
```javascript
const SHEET_NAME = 'Sheet2';
```

#### אם יש בעיית הרשאות:
1. וודא שה-Apps Script מחובר לגיליון הנכון
2. בדוק שיש הרשאות קריאה

#### אם הנתונים בפורמט שונה:
העתק את הפונקציות החדשות מ-`debug.js`

### פתרון מתקדם (מומלץ)
החלף את הפונקציה `getData()` ב-Code.js עם הקוד הבא:

```javascript
function getData() {
  try {
    console.log('Attempting to get data...');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets();
    
    // נסה למצוא גיליון עם נתונים
    for (let sheet of sheets) {
      console.log('Checking sheet:', sheet.getName());
      
      const values = sheet.getDataRange().getValues();
      if (values.length > 1) { // יש כותרת + לפחות שורה אחת של נתונים
        console.log(`Found data in sheet: ${sheet.getName()}, rows: ${values.length}`);
        
        // הסר שורת כותרת
        values.shift();
        
        // סנן שורות ריקות
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
```

### וגם החלף את `getUniqueValues()`:

```javascript
function getUniqueValues(columnNames) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets();
    
    // מצא את הגיליון עם הנתונים
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
        // נסה למצוא עמודות דומות
        const similarIndex = headers.findIndex(h => 
          h && h.toString().trim().toLowerCase() === name.toLowerCase()
        );
        console.log(`Similar column for "${name}" found at index:`, similarIndex);
        
        if (similarIndex === -1) {
          result[name] = [];
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
```

### צעדים לתיקון:
1. פתח את Google Apps Script
2. העתק והדבק את הקוד החדש
3. שמור (Ctrl+S)
4. רענן את האפליקציה

### מה הקוד החדש עושה:
- מחפש אוטומטית גיליון שמכיל נתונים
- מסנן שורות ריקות
- מתמודד עם שמות עמודות שונים
- מציג לוגים מפורטים לזיהוי בעיות

## תכונות המערכת

### 🔍 חיפוש מתקדם
- חיפוש בזמן אמת בכל הנתונים
- תמיכה בעברית ואנגלית
- חיפוש בכותרות, תגיות ותוכן

### 🎯 מערכת סינון
- סינון לפי "למי זה"
- סינון לפי "קטגוריה" 
- סינון לפי "תת קטגוריה"
- אפשרות לבחירה מרובה

### 🤖 השלמה אוטומטית
- הצעות חכמות בזמן הקלדה
- למידה מהנתונים הקיימים
- ניווט מהיר עם עכבר או מקלדת

### 📱 עיצוב רספונסיבי
- תמיכה בעברית (RTL)
- עיצוב נקי ומודרני
- חוויית משתמש אינטואיטיבית

## מבנה הפרויקט
```
📁 עם כלביא - למי יש/
├── 📄 index.html     # ממשק המשתמש הראשי
├── 📄 Code.js        # הקוד של Google Apps Script
├── 📄 appsscript.json # הגדרות הפרויקט
└── 📄 README.md      # המדריך הזה
```

## קישורים שימושיים
- [Google Apps Script](https://script.google.com/)
- [GitHub Repository](https://github.com/Zevik/am-kelavi-moran)

---
**נוצר על ידי GitHub Copilot** ✨
