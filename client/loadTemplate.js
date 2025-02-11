import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import { WHATSAPP_TEMPLATES } from "./src/command/templateData";

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON file that stores templates
const JSON_FILE_PATH = path.join(__dirname, "./src/utils/template.json");

// Folder to store downloaded images
const folderPath = path.join(__dirname, "/public/templates");

// Ensure folder exists
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

const downloadImage = async (url, filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      console.log(`Image already exists: ${filePath}`);
      return;
    }

    const response = await axios({
      url,
      responseType: "arraybuffer",
    });

    fs.writeFileSync(filePath, response.data);
    console.log(`Downloaded: ${filePath}`);
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
  }
};

const loadExistingTemplates = () => {
  if (!fs.existsSync(JSON_FILE_PATH)) {
    return [];
  }

  try {
    const fileData = fs.readFileSync(JSON_FILE_PATH, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error(`Error reading JSON file:`, error);
    return [];
  }
};

const saveTemplates = (templates) => {
  fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(templates, null, 2));
  console.log(`Updated templates saved to: ${JSON_FILE_PATH}`);
};

const updateTemplates = async () => {
  let existingTemplates = loadExistingTemplates();
  let updatedTemplates = [...existingTemplates];

  for (const newTemplate of WHATSAPP_TEMPLATES) {
    const extension =
      path.extname(new URL(newTemplate.imageUrl).pathname) || ".jpg";
    const fileName = `${newTemplate.id}${extension}`;
    const filePath = path.join(folderPath, fileName);

    await downloadImage(newTemplate.imageUrl, filePath);

    const localImageUrl = `/templates/${fileName}`;
    const existingIndex = existingTemplates.findIndex(
      (t) => t.id === newTemplate.id
    );

    if (existingIndex !== -1) {
      // Update existing template
      updatedTemplates[existingIndex] = {
        ...existingTemplates[existingIndex],
        ...newTemplate,
        imageUrl: localImageUrl,
      };
      console.log(`Updated template: ${newTemplate.id}`);
    } else {
      // Add new template
      updatedTemplates.push({ ...newTemplate, imageUrl: localImageUrl });
      console.log(`Added new template: ${newTemplate.id}`);
    }
  }

  saveTemplates(updatedTemplates);
};

// Run the function
updateTemplates();
