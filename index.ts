import dotenv from "dotenv";
dotenv.config();

import { chromium, LaunchOptions } from "playwright";
import login from "./src/login";
import generarFactura from "./src/serviceSelector";
import { pedirMonto } from "./src/utils";

const configs: LaunchOptions = {
  headless: false,
  slowMo: 500,
};

async function main(_args: string[]) {
  // Pedir el monto a facturar
  const monto = await pedirMonto("Ingresa el monto a facturar: ");

  // Launch browser
  const browser = await chromium.launch(configs);

  try {
    const page = await browser.newPage();
    await login(page);
    await generarFactura(page, "COMPROBANTES EN LÍNEA", monto);
  } catch (error) {
    console.error("Error accessing AFIP login page:", error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

// Run the main function
main(process.argv).catch(console.error);
