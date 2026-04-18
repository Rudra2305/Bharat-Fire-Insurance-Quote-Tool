import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// Define paths to the downloaded Excel files
const DOWNLOADS_DIR = '/Users/shiva/Downloads';
const PINCODE_FILE = path.join(DOWNLOADS_DIR, 'Pin code wise EQ zone & city detail.xlsx');
const OCCUPANCY_FILE = path.join(DOWNLOADS_DIR, 'Occupancy wise Flexa Rate.xlsx');
const RATES_FILE = path.join(DOWNLOADS_DIR, 'EQ, STFI & Terrorism Rate.xlsx');

const OUTPUT_DIR = './src/data/generated';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function convertExcelToJson() {
  try {
    console.log('--- Processing Pincodes ---');
    if (fs.existsSync(PINCODE_FILE)) {
      const workbook = XLSX.readFile(PINCODE_FILE);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);
      fs.writeFileSync(path.join(OUTPUT_DIR, 'pincodes.json'), JSON.stringify(data, null, 2));
      console.log(`Saved ${data.length} pincodes to pincodes.json`);
    } else {
      console.error(`Pincode file not found at ${PINCODE_FILE}`);
    }

    console.log('\n--- Processing Occupancies ---');
    if (fs.existsSync(OCCUPANCY_FILE)) {
      const workbook = XLSX.readFile(OCCUPANCY_FILE);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);
      fs.writeFileSync(path.join(OUTPUT_DIR, 'occupancies.json'), JSON.stringify(data, null, 2));
      console.log(`Saved ${data.length} occupancies to occupancies.json`);
    } else {
      console.error(`Occupancy file not found at ${OCCUPANCY_FILE}`);
    }

    console.log('\n--- Processing Rates ---');
    if (fs.existsSync(RATES_FILE)) {
      const workbook = XLSX.readFile(RATES_FILE);
      // Processing all sheets in the rates file if they exist
      const ratesData: any = {};
      workbook.SheetNames.forEach(name => {
        ratesData[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name]);
      });
      fs.writeFileSync(path.join(OUTPUT_DIR, 'rates.json'), JSON.stringify(ratesData, null, 2));
      console.log(`Saved rates data from sheets: ${workbook.SheetNames.join(', ')}`);
    } else {
      console.error(`Rates file not found at ${RATES_FILE}`);
    }

  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

convertExcelToJson();
