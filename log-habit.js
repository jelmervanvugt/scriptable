// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: magic;
// log-habit.js
// ... (Your prompt logic) ...

// Use FileManager.iCloud() to ensure cross-device sync
const fm = FileManager.iCloud(); 
const path = fm.joinPath(fm.documentsDirectory(), "habits.json");

let habitData = {};
// Read the existing data file if it exists
if (fm.fileExists(path)) {
    habitData = JSON.parse(fm.readString(path));
}

var now = new Date();
var start = new Date(now.getFullYear(), 0, 0);
var diff = now - start;
var oneDay = 1000 * 60 * 60 * 24;
var day = Math.floor(diff / oneDay);

let dayValue = habitData.days[day];
habitData.days[day] = !dayValue;

// Write the updated data back to the file
fm.writeString(path, JSON.stringify(habitData));

Script.complete();