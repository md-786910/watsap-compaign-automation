const fs = require("fs");
const xlsx = require("xlsx");
const Papa = require("papaparse");
const pdfParse = require("pdf-parse");

class ProcessSheetManager {
  filePath = null;
  constructor(path) {
    this.filePath = path;
  }

  // Format Data (Ensure Consistency)
  formatData(row) {
    // Check if at least one 'name' key exists
    if (!("name" in row) && !("Name" in row)) {
      throw new Error("No valid 'name' key found in the row object");
    }
  
    // Check if at least one 'phone number' key exists
    if (
      !("phone_number" in row) &&
      !("Phone Number" in row) &&
      !("phone number" in row) &&
      !("Mobile" in row)
    ) {
      throw new Error("No valid 'phone number' key found in the row object");
    }
  
    return {
      name: row["name"] || row["Name"] || "Unknown",
      phone_number:
        row["phone_number"] ||
        row["Phone Number"] ||
        row["phone number"] ||
        row["Mobile"] ||
        "N/A",
    };
  }

  // Extract Name & Phone from PDF Text
  extractNamePhoneFromText(text) {
    const nameRegex = /Name:\s*([A-Za-z\s]+)/i;
    const phoneRegex = /Phone:\s*(\d{10,15})/i;
    const names = text.match(nameRegex);
    const phones = text.match(phoneRegex);
    return [
      {
        name: names ? names[1].trim() : "Unknown",
        phone_number: phones ? phones[1].trim() : "N/A",
      },
    ];
  }

  async parseCSV() {
    // @parse
    const fileContent = fs.readFileSync(this.filePath, "utf8");
    return new Promise((resolve, reject) => {
      Papa.parse(fileContent, {
        header: true,
        complete: (results) => {
          if (results.length > 1000) {
            reject(new Error("File size exceeds 1000 rows"));
          }
          return resolve(results.data.map(this.formatData));
        },
        error: (err) => reject(err),
      });
    });
  }
  async parsePDF() {
    // @parse
    try {
      const data = await pdfParse(fs.readFileSync(this.filePath));
      return this.extractNamePhoneFromText(data.text);
    } catch (error) {
      throw new Error("Error parsing PDF: " + error.message);
    }
  }
  async parseExcel() {
    // @parse
    try {
      const workbook = xlsx.readFile(this.filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);
      if (jsonData.length > 1000) {
        throw new Error("Excel file is too large.Max row is 1000");
      }
      return jsonData.map(this.formatData);
    } catch (error) {
      throw new Error("Error parsing Excel: " + error.message);
    }
  }
}

module.exports = ProcessSheetManager;
