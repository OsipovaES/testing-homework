describe("В каталоге отображается список товаров, который приходит с сервера:", () => {
  it("Список", async ({ browser }) => {
    await browser.url("http://localhost:3000/hw/store/catalog");
    const items = await Promise.all(
      await browser.$$(".card").map((prod) => prod)
    );
    expect(items).toHaveLength(27);
  });

  it("Для товаров в каталоге отображаются их имена", async function ({
    browser,
  }) {
    await browser.url("http://localhost:3000/hw/store/catalog");
    const Name = await browser.$(".ProductItem-Name");
    await Name.waitForExist();
    expect(await Name.getText()).not.toBe("");
  });

  it("Информация о товаре загружается и отображается корректно", async function ({
    browser,
  }) {
    await browser.url("http://localhost:3000/hw/store/catalog/1");
    const item = await browser.$(".Product");
    await item.waitForExist();
    expect(await item.getText()).not.toEqual("LOADING");
  });
});

describe("Проверка требований к каталогу товаров:", () => {
  it("На странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка 'добавить в корзину'", async ({
    browser,
  }) => {
    await browser.url("http://localhost:3000/hw/store/catalog/0");
    expect(browser.$(".ProductDetails-Name")).toHaveText(/\w+/);
    expect(browser.$(".ProductDetails-Description")).toHaveText(/\w+/);
    expect(browser.$(".ProductDetails-Price")).toHaveText(/\d+/);
    expect(browser.$(".ProductDetails-Color")).toHaveText(/\w+/);
    expect(browser.$(".ProductDetails-Material")).toHaveText(/\w+/);
    expect(browser.$(".btn")).toHaveText(/add to cart/i);
  });

  it("Если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом", async function ({
    browser,
  }) {
    await browser.url("http://localhost:3000/hw/store/cart");

    const cartSectionInNavBarText = await browser
      .$(".nav-link.active")
      .getText();

    if (cartSectionInNavBarText.includes("(")) {
      const clear = await browser.$(".Cart-Clear");
      await clear.waitForDisplayed();
      await clear.click();
    }

    await browser.url("http://localhost:3000/hw/store/catalog");
    const test = await browser.$$(".ProductItem")[0];
    await test.waitForDisplayed();
    const testLinkEl = await test.$(".ProductItem-DetailsLink");
    await testLinkEl.waitForDisplayed();
    const testLink = await testLinkEl.getAttribute("href");
    await browser.url("http://localhost:3000" + testLink);
    const testBtn = await browser.$(".btn-lg");

    await testBtn.waitForDisplayed();
    await testBtn.click();

    const testDetailsBadge = await browser.$(".text-success");

    await testDetailsBadge.waitForDisplayed();
    await browser.url("http://localhost:3000/hw/store/catalog");

    const testBadge = await browser.$(".text-success");
    await testBadge.waitForDisplayed();
  });

  it("Если товар уже добавлен в корзину, повторное нажатие кнопки 'добавить в корзину' должно увеличивать его количество", async function ({
    browser,
  }) {
    await browser.url("http://localhost:3000/hw/store/cart");

    const cartSectionInNavBarText = await browser
      .$(".nav-link.active")
      .getText();

    if (cartSectionInNavBarText.includes("(")) {
      const clear = await browser.$(".Cart-Clear");

      await clear.waitForDisplayed();
      await clear.click();
    }

    await browser.url("http://localhost:3000/hw/store/catalog/0");
    const testBtn = await browser.$(".ProductDetails-AddToCart");
    await testBtn.waitForDisplayed();
    await testBtn.click();
    await browser.url("http://localhost:3000/hw/store/cart");

    expect(browser.$("h1")).toHaveText("Shopping cart");
    expect(browser.$(".Cart-Count")).toHaveText("1");

    await browser.url("http://localhost:3000/hw/store/catalog/0");
    await testBtn.waitForDisplayed();
    await testBtn.click();

    expect(browser.$("h1")).toHaveText("Shopping cart");
    expect(browser.$(".Cart-Count")).toHaveText("2");
  });

  it("Содержимое корзины должно сохраняться между перезагрузками страницы", async function ({
    browser,
  }) {
    await browser.url("http://localhost:3000/hw/store/cart");

    const cartSectionInNavBarText = await browser
      .$(".nav-link.active")
      .getText();

    if (cartSectionInNavBarText.includes("(")) {
      const clear = await browser.$(".Cart-Clear");
      await clear.waitForDisplayed();
      await clear.click();
    }

    await browser.url("http://localhost:3000/hw/store/catalog/0");

    const testBtn = await browser.$(".ProductDetails-AddToCart");

    await testBtn.waitForDisplayed();
    await testBtn.click();
    await browser.url("http://localhost:3000/hw/store/cart");

    expect(browser.$(".h1")).toHaveText("Shopping cart");
    expect(browser.$(".th")).toHaveText("Product");

    await browser.refresh();

    expect(browser.$(".h1")).toHaveText("Shopping cart");
    expect(browser.$(".th")).toHaveText("Product");
  });
});
