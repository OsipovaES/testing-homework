import React from "react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExampleApi, CartApi } from "../../src/client/api";
import { Cart } from "../../src/client/pages/Cart";
import { initStore } from "../../src/client/store";
import { Application } from "../../src/client/Application";

describe("Проверка функциональных требований к корзине", () => {
  it("Количество не повторяющихся товаров в корзине", () => {
    const initState = {
      cart: [
        { id: 1, name: "tovar1", price: 10, count: 2 },
        { id: 2, name: "tovar2", price: 20, count: 4 },
      ],
      products: [
        { id: 1, name: "tovar1", price: 10 },
        { id: 2, name: "tovar2", price: 20 },
      ],
    };
    const store = createStore(() => initState);

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("link", { name: /Cart \(2\)/i })
    ).toBeInTheDocument();
  });

  it("Отображение таблицы с добавленными в нее товарами", () => {
    const initState = {
      cart: [
        { id: 1, name: "tovar1", price: 10, count: 2 },
        { id: 2, name: "tovar2", price: 20, count: 4 },
      ],
      products: [
        { id: 1, name: "tovar1", price: 10 },
        { id: 2, name: "tovar2", price: 20 },
      ],
    };
    const store = createStore(() => initState);

    const { container } = render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const table = container.getElementsByClassName("table")[0];
    expect(table).toBeInTheDocument();
    expect(screen.getByTestId("1")).toBeInTheDocument();
  });

  it("Для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа", () => {
    const initState = {
      cart: {
        0: { name: "tovar1", price: 3000, count: 2 },
        1: { name: "tovar2", price: 6000, count: 3 },
      },
    };
    const store = createStore(() => initState);

    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    expect(
      screen.getByRole("heading", { name: "Shopping cart" })
    ).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "2" })).toBeInTheDocument();
    expect(screen.getByTestId("0")).toBeInTheDocument();
    expect(screen.getByTestId("0")).toHaveTextContent(/tovar1/i);
    expect(screen.getByTestId("1")).toBeInTheDocument();
    expect(screen.getByTestId("1")).toHaveTextContent(/tovar2/i);
    expect(screen.getByTestId("0")).toHaveTextContent("$3000");
    expect(screen.getByTestId("1")).toHaveTextContent("$6000");
    expect(screen.getByTestId("0")).toHaveTextContent("$6000");
    expect(screen.getByTestId("1")).toHaveTextContent("$18000");
    expect(screen.getByTestId("0")).toHaveTextContent("1");
    expect(screen.getByTestId("1")).toHaveTextContent("3");
    const total = screen.getByText(/order price/i);
    expect(total).toBeInTheDocument();
    expect(total).toHaveTextContent(/order price/i);
    expect(screen.getByText("$24000")).toBeInTheDocument();
  });

  it("По нажатию на кнопку очистки корзины все товары удаляются", () => {
    const initState = {
      0: { name: "tovar1", count: 2, price: 20 },
      1: { name: "tovar2", count: 4, price: 30 },
    };

    const api = new ExampleApi("/hw/store");
    const cart = new CartApi();
    cart.setState(initState);
    const store = initStore(api, cart);

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /Clear shopping cart/i });
    expect(button).toBeInTheDocument();

    expect(screen.queryByText("tovar1")).toBeInTheDocument();
    expect(screen.queryByText("tovar2")).toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.queryByText("tovar1")).not.toBeInTheDocument();
    expect(screen.queryByText("tovar2")).not.toBeInTheDocument();
  });

  it("Если корзина пустая, то отображается ссылка на каталог товаров", async () => {
    const initState = {
      cart: {},
    };
    const store = createStore(() => initState);

    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.queryByRole("link", { name: "catalog" })).toHaveAttribute(
      "href",
      "/catalog"
    );
  });
});
