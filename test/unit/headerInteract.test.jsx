import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import { Application } from "../../src/client/Application";
import "@testing-library/jest-dom";

const initState = { cart: [] };
const store = createStore(() => initState);

describe("Общие требования к header", () => {
  it('При выборе элемента из меню "гамбургера", меню должно закрываться', () => {
    const app = (
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    const { container } = render(app);
    const catalog = screen.queryByRole("link", {
      name: /Catalog/i,
    });
    if (catalog) fireEvent.click(catalog);
    const menu = container.getElementsByClassName("Application-Menu")[0];
    if (menu) expect(menu).toHaveClass("collapse");
  });

  it("В шапке отображаются ссылки на страницы магазина, а также ссылка на корзину", () => {
    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    const catalog = screen.queryByRole("link", {
      name: /Catalog/i,
    });
    if (catalog) expect(catalog.getAttribute("href")).toBe("/catalog");
    const delivery = screen.queryByRole("link", {
      name: /Delivery/i,
    });
    if (delivery) expect(delivery.getAttribute("href")).toBe("/delivery");
    const contacts = screen.queryByRole("link", {
      name: /Contacts/i,
    });
    if (contacts) expect(contacts.getAttribute("href")).toBe("/contacts");
    const cart = screen.queryByRole("link", {
      name: /cart/i,
    });
    if (cart) expect(cart.getAttribute("href")).toBe("/cart");
  });
});
