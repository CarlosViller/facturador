import { Page } from "@playwright/test";

export default async function login(page: Page) {
  // Navigate to the AFIP login page
  console.log("Navigating to AFIP login page...");
  await page.goto("https://auth.afip.gob.ar/contribuyente_/login.xhtml");

  // Wait for the page to load
  await page.waitForLoadState("networkidle");

  // Fill the CUIT/CUIL input field
  await page.waitForSelector("#F1\\:username", { state: "visible" });
  await page.locator("#F1\\:username").fill(process.env.AFIP_CUIL || "");

  // Click the Siguiente button
  await page.locator("#F1\\:btnSiguiente").click();
  console.log("Clicked Siguiente button");

  // Wait for the password input field to be visible
  await page.waitForSelector("#F1\\:password", { state: "visible" });
  await page.locator("#F1\\:password").fill(process.env.PASSWORD || "");
  console.log("Password filled");

  // Click the Ingresar button
  await page.locator("#F1\\:btnIngresar").click();
  console.log("Clicked Ingresar button");

  // Wait for the page to load after login
  await page.waitForLoadState("networkidle");
  console.log("Login completed and page loaded");
}
