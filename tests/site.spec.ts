import { expect, test, type Page } from '@playwright/test';

async function chooseIdentity(page: Page, name: string) {
  await page.getByRole('button', { name: 'Credencial' }).click();
  await page.getByRole('dialog', { name: 'Elegir credencial' }).getByRole('button', { name: name, exact: false }).first().click();
}

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-02T22:00:00+01:00'));
  await page.goto('/');
});

test('portada con título, cuenta atrás y sin scroll horizontal', async ({ page }) => {
  await expect(page).toHaveTitle(/PANCREAS DELTA 2026/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Pancreas');
  await expect(page.getByRole('timer')).toContainText('2');
  await expect(page.getByRole('link', { name: /Entrar en territorio Pancreas/i })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('las nueve fotografías reales cargan', async ({ page }) => {
  const cast = page.locator('#gobierno ul').first();
  await cast.scrollIntoViewIfNeeded();
  const imgs = cast.locator('img');
  await expect(imgs).toHaveCount(9);
  for (const img of await imgs.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});

test('el expediente de Jorge revela el BMW corporativo', async ({ page }) => {
  await page.getByRole('button', { name: 'Abrir expediente de Jorge' }).click();
  const dialog = page.getByRole('dialog', { name: 'Expediente de Jorge' });
  await expect(dialog).toContainText('Vallecas');
  await expect(dialog).toContainText('Las Rozas');
  for (let i = 0; i < 5; i++) await dialog.getByRole('button', { name: 'Inspeccionar el BMW' }).click();
  await expect(dialog).toContainText('Vehículo propiedad de la empresa');
});

test('Ángela: el Tribunal Superior del Calzado emite dictamen', async ({ page }) => {
  await page.getByRole('button', { name: 'Abrir expediente de Ángela' }).click();
  const dialog = page.getByRole('dialog', { name: 'Expediente de Ángela' });
  await expect(dialog).toContainText('manoletinas');
  await expect(dialog).toContainText('Air Force');
  await dialog.getByRole('button', { name: /Modo Air Force/ }).click();
  await expect(dialog).toContainText('Dictamen nº');
});

test('el Tribunal del Sofá siempre adjudica el sofá a Milla', async ({ page }) => {
  await page.getByRole('tab', { name: 'Tribunal del Sofá' }).click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: /Sortear camas|Repetir sorteo/ }).click();
    await expect(page.getByText(/Se adjudica el sofá del salón a Milla/)).toBeVisible({ timeout: 4000 });
  }
  await page.getByRole('button', { name: 'Presentar recurso' }).click();
  await expect(page.getByText('Desestimado', { exact: true })).toBeVisible();
});

test('Edu propone y Jorge rechaza, con contador persistente', async ({ page }) => {
  await page.getByRole('tab', { name: 'Ideas de Edu' }).click();
  await page.getByRole('button', { name: /Edu tiene una idea mejor/ }).click();
  await expect(page.getByText('Solicitud rechazada por Jorge')).toBeVisible();
  await page.reload();
  await page.getByRole('tab', { name: 'Ideas de Edu' }).click();
  await expect(page.getByText('Propuestas denegadas').locator('..')).toContainText('1');
});

test('la porra del BMW llega a cuatro y permite deshacer', async ({ page }) => {
  await page.getByRole('tab', { name: 'Porra BMW' }).click();
  const add = page.getByRole('button', { name: /Jorge ha vuelto a hablar del consumo/ });
  await add.click();
  await add.click();
  await page.getByRole('button', { name: /Deshacer última/ }).click();
  await add.click();
  await add.click();
  await add.click();
  await expect(page.getByRole('alertdialog', { name: 'Diploma' })).toContainText('David tenía razón');
  await expect(page.getByRole('alertdialog', { name: 'Diploma' })).toContainText('Cuarta mención homologada');
});

test('el bingo guarda casillas marcadas', async ({ page }) => {
  await chooseIdentity(page, 'Patri');
  const cells = page.getByRole('gridcell');
  await expect(cells).toHaveCount(25);
  await expect(cells.nth(12)).toHaveText('Edu ha tenido una idea');
  await cells.nth(0).click();
  await expect(cells.nth(0)).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.getByRole('gridcell').nth(0)).toHaveAttribute('aria-pressed', 'true');
});

test('la Constitución se puede firmar', async ({ page }) => {
  await page.getByRole('button', { name: 'Constituir oficialmente PANCREAS Delta' }).click();
  const dialog = page.getByRole('dialog', { name: 'Constitución PANCREAS' });
  await expect(dialog.getByText('Art. 12')).toBeVisible();
  await dialog.getByRole('button', { name: 'Milla' }).click();
  await dialog.getByRole('button', { name: 'Firmar como Milla' }).click();
  await expect(dialog.getByRole('button', { name: 'Ya has firmado' })).toBeVisible();
});

test('las reservas empiezan pendientes y se pueden confirmar', async ({ page }) => {
  const select = page.getByLabel('Estado de Casa Nuri');
  await expect(select).toHaveValue('pendiente');
  await select.selectOption('confirmada');
  await expect(page.locator('#ep3')).toContainText('Confirmada');
});

test('las votaciones avisan del modo local', async ({ page }) => {
  await expect(page.locator('#premios')).toContainText('Modo local');
  await page.getByRole('radiogroup', { name: 'Víctima inmobiliaria del año' }).getByRole('radio', { name: 'Votar a Milla' }).click();
  await expect(page.locator('#premios')).toContainText('Tu voto: Milla');
});

test('las misiones se pueden completar', async ({ page }) => {
  await page.getByRole('tab', { name: 'Misiones' }).click();
  await page.getByRole('button', { name: 'Desclasificar' }).first().click();
  await expect(page.getByText('Completar un paseo sin registrarlo en Strava.')).toBeVisible();
  await page.getByRole('button', { name: 'Marcar como cumplida' }).first().click();
  await expect(page.getByRole('button', { name: 'Misión cumplida' })).toHaveCount(1);
});

test('durante el viaje muestra el episodio en curso', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-07T11:00:00+01:00'));
  await page.goto('/');
  await expect(page.getByText('Estado de Excepción en vigor')).toBeVisible();
  await expect(page.locator('#top')).toContainText('Operación Flamenco');
});

test('después del viaje muestra el epílogo y nunca un contador negativo', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-12T11:00:00+01:00'));
  await page.goto('/');
  await expect(page.getByText('El Estado de Excepción ha concluido')).toBeVisible();
  await expect(page.getByRole('timer')).toHaveCount(0);
});
