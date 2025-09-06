// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;

// Functions
async function getHabitData() {
  // Use FileManager.iCloud() to ensure cross-device sync
  const fm = FileManager.iCloud();
  const path = fm.joinPath(fm.documentsDirectory(), "habits.json");

  if (fm.fileExists(path)) {
    return JSON.parse(fm.readString(path));
  } else {
    // Create file if doesn't exist yet
    const habitData = {}

  }
  throw new Error("Habit data not found.");
}

// Return 0 for Jan. 1st
async function getDayOfYear() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start;
  var oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

async function drawDays(mainStack, habitData, columnAmount, daySize, spacing, dayOfYear) {
  for (let columnNo = 0; columnNo < columnAmount; columnNo++) {
    let weekStack = mainStack.addStack();
    weekStack.layoutVertically();

    // if (columnNo > 0) {
      mainStack.addSpacer(spacing);
    // }

    for (let day = 0; day < columnSize; day++) {
      const index = columnNo * columnSize + day;
      if (index < habitData.days.length) {
        const completed = habitData.days[index];

        let dayStack = weekStack.addStack();
        dayStack.size = new Size(daySize, daySize);
        // dayStack.cornerRadius = 5;
        dayStack.backgroundColor = await getDayColor(completed, dayOfYear, index);

        if (day < columnSize - 1) {
          weekStack.addSpacer(spacing);
        }
      }
    }
  }
}

async function getDayColor(completed, dayOfYear, index) {
  if (completed && dayOfYear > index) {
    return Color.green();
  } else if (!completed && dayOfYear > index) {
    return Color.lightGray();
  } else if (!completed && dayOfYear === index) {
    return Color.yellow();
  } else if (completed && dayOfYear === index) {
    return Color.green();
  } else if (dayOfYear < index) {
    return Color.white();
  } else {
    throw new Error('Invalid state.');
  }
}

async function drawStats(statStack, habitData, dayOfYear) {

  const currentDay = dayOfYear + 1;
  const daysInYear = habitData.days.length;
  let completed = 0;

  for (let i = 0; i <= dayOfYear; i++) {
    if (habitData.days[i]) {
      completed++;
    }
  }

  statStack.addText(currentDay + "/" + daysInYear + ", completed " + completed + " day(s)");
  statStack.minimumScaleFactor = 0.7;
  statStack.setPadding(5, 0, 5, 0);

}

// Constants
const dayOfYear = await getDayOfYear();
const habitData = await getHabitData();
const columnSize = 12;
const daySize = 3;
const spacing = 4;
const columnAmount = Math.ceil(habitData.days.length / columnSize);

// Setting up stack
let widget = new ListWidget();
let mainStack = widget.addStack();
mainStack.layoutHorizontally();

// Drawing days
await drawDays(mainStack, habitData, columnAmount, daySize, spacing, dayOfYear);

// Drawing stats
let statStack = widget.addStack();
statStack.layoutHorizontally();
await drawStats(statStack, habitData, dayOfYear);

Script.setWidget(widget);
Script.complete();
widget.presentMedium();
