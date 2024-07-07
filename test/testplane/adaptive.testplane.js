describe("Общие требования по адаптивности верстки:", () => {
  it("Верстка адаптируется под ширину экрана", async function ({ browser }) {
    await browser.setWindowSize(1920, 1080);
    await browser.url("http://localhost:3000/hw/store/");

    const container = await browser.$(".container.pt-4");
    await container.waitForExist();
    const previousW = await container.getSize("width");
    await browser.setWindowSize(570, 700);
    const currentlyW = await container.getSize("width");

    expect(currentlyW).toBeLessThan(previousW);
  });

  it("На ширине меньше 576px навигационное меню должно скрываться за гамбургер", async function ({
    browser,
  }) {
    await browser.setWindowSize(570, 700);
    await browser.url("http://localhost:3000/hw/store/");

    const applicationToggler = await browser.$(".Application-Toggler");
    await applicationToggler.waitForExist();
    const display = await applicationToggler.isDisplayed();

    expect(display).toBe(true);
  });

  it("При выборе элемента из меню гамбургера, меню должно закрываться", async function ({
    browser,
  }) {
    await browser.setWindowSize(570, 1080);
    await browser.url("http://localhost:3000/hw/store/");

    const applicationMenu = await browser.$(".Application-Menu");
    await applicationMenu.waitForExist();
    const applicationToggler = await browser.$(".Application-Toggler");
    await applicationToggler.waitForExist();
    await applicationToggler.click();
    const link = await applicationMenu.$$(".nav-link")[0];
    await link.waitForExist();
    await link.click();
    const applicationClass = await applicationMenu.getAttribute("class");
    const applicationCollapse = applicationClass
      .split(" ")
      .includes("collapse");

    expect(applicationCollapse).toBe(true);
  });

  it("На ширине меньше 576px ссылки исчезают", async function ({ browser }) {
    await browser.setWindowSize(570, 700);
    await browser.url("http://localhost:3000/hw/store/");

    const applicationMenu = await browser.$(".Application-Menu");
    await applicationMenu.waitForExist();
    const display = await applicationMenu.isDisplayed();

    expect(display).toBe(false);
  });
});
