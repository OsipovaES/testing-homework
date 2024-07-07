import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Catalog } from "../../src/client/pages/Catalog";

test("Для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", () => {
  const initState = {
    cart: [],
    products: [{ id: 1, name: "tov1", price: 3000, count: 3 }],
  };
  const store = createStore(() => initState);

  render(
    <BrowserRouter basename={"/"}>
      <Provider store={store}>
        <Catalog />
      </Provider>
    </BrowserRouter>
  );

  expect(screen.getByRole("heading", { name: "tov1" })).toBeInTheDocument();
  expect(screen.getByText("$3000")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /details/i })).toBeInTheDocument();
});
