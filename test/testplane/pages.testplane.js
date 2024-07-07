describe("На сайте есть страницы:", () => {
  it("Главная", async ({ browser }) => {
    await browser.url("http://localhost:3000/hw/store");
    await browser.pause(2000);
    await expect(browser.$(".display-3")).toHaveText(
      "Welcome to Kogtetochka store!"
    );
  });

  it("Каталог", async ({ browser }) => {
    await browser.url("http://localhost:3000/hw/store/catalog");
    await browser.pause(2000);
    await expect(browser.$$("h1")).toHaveText("Catalog");
  });

  it("Доставка", async ({ browser }) => {
    await browser.url("http://localhost:3000/hw/store/delivery");
    await browser.pause(2000);
    await expect(browser.$$("h1")).toHaveText("Delivery");
  });

  it("Контакты", async ({ browser }) => {
    await browser.url("http://localhost:3000/hw/store/contacts");
    await browser.pause(2000);
    await expect(browser.$$("h1")).toHaveText("Contacts");
  });
});
