import { Page } from "@playwright/test";
import { pedirConfirmacion } from "./utils";

async function clickContinuar(page: Page) {
  await page.waitForSelector('input[value="Continuar >"]', {
    state: "visible",
  });
  await page.locator('input[value="Continuar >"]').click();
}

async function seleccionarServicio(page: Page, service: string): Promise<Page> {
  console.log("Seleccionando servicio: ", service);
  await page.getByText("Ver todos").click();

  // Esperar a que se abra la nueva pestaña cuando se hace click en el servicio
  const [newPage] = await Promise.all([
    page.context().waitForEvent("page"), // Espera a que se abra una nueva pestaña
    page.getByText(service).click(), // Hace click en el servicio
  ]);

  // Cambiar el contexto a la nueva pestaña
  await newPage.waitForLoadState("networkidle");
  return newPage;
}

async function seleccionarEmpresa(page: Page): Promise<void> {
  console.log("Seleccionando empresa");
  await page.waitForSelector(`input[value="${process.env.NAME}"]`, {
    state: "visible",
  });
  await page.locator(`input[value="${process.env.NAME}"]`).click();
  await page.getByText("Generar Comprobantes").click();
}

async function configurarTipoComprobante(page: Page): Promise<void> {
  console.log("Configurando tipo de comprobante");
  await page
    .locator("#puntodeventa")
    .selectOption(process.env.PUNTO_VENTA || "");
  await page
    .locator("#universocomprobante")
    .selectOption({ value: process.env.UNIVERSO_COMPROBANTE || "" });
  await clickContinuar(page);
}

async function seleccionarTipoFacturacion(page: Page): Promise<void> {
  console.log("Seleccionando tipo de facturacion");
  await page.waitForSelector("#idconcepto", { state: "visible" });
  await page
    .locator("#idconcepto")
    .selectOption({ value: process.env.ID_CONCEPTO || "" });
  await page
    .locator("#actiAsociadaId")
    .selectOption({ value: process.env.ACTI_ASOCIADA_ID || "" });
  await clickContinuar(page);
}

async function rellenarDatosFacturacion(page: Page): Promise<void> {
  console.log("Rellenando datos de facturacion");
  await page.waitForSelector("#destino", { state: "visible" });
  await page
    .locator("#destino")
    .selectOption({ label: process.env.DESTINO || "" });
  await page.locator("#nrodocreceptor").fill(process.env.CUIT_RECEPTOR || "");
  await page.locator("#razonsocialreceptor").click();
  await page
    .getByText("ESTADOS UNIDOS - Persona Física")
    .waitFor({ state: "visible" });
  await page
    .locator("#razonsocialreceptor")
    .fill(process.env.RAZON_SOCIAL_RECEPTOR || "");
  await page
    .locator("#domicilioreceptor")
    .fill(process.env.ADDRESS_RECEPTOR || "");
  await page
    .locator("#descripcionformadepago")
    .fill(process.env.DESCRIPTION_PAYMENT || "");
  await clickContinuar(page);
}

async function rellenarDatosOperacion(
  page: Page,
  monto: number
): Promise<void> {
  console.log("Rellenando datos de la operacion");
  await page.waitForSelector("#detalle_codigo_articulo1", {
    state: "visible",
  });
  await page
    .locator("#detalle_codigo_articulo1")
    .fill(process.env.DETAIL_CODE_ARTICLE || "");
  await page
    .locator("#detalle_descripcion1")
    .fill(process.env.DETAIL_DESCRIPTION || "");
  await page
    .locator("#detalle_medida1")
    .selectOption({ value: process.env.DETALLE_MEDIDA || "" });
  await page.locator("#detalle_precio1").fill(monto.toString());
  await clickContinuar(page);
}

async function pedirConfirmacionManual(): Promise<void> {
  console.log("Confirmar datos");
  await pedirConfirmacion("Terminar proceso? (Enter): ", "");
}

export default async function generarFactura(
  page: Page,
  service: string,
  monto: number
) {
  const newPage = await seleccionarServicio(page, service);
  await seleccionarEmpresa(newPage);
  await configurarTipoComprobante(newPage);
  await seleccionarTipoFacturacion(newPage);
  await rellenarDatosFacturacion(newPage);
  await rellenarDatosOperacion(newPage, monto);
  await pedirConfirmacionManual();

  return newPage;
}
