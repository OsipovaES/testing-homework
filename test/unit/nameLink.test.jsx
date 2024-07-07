import React from "react";
import { render } from "@testing-library/react";
import { Application } from "../../src/client/Application";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { ExampleApi } from "../../src/client/api";
import { CartApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";
import { Provider } from "react-redux";

test("Название магазина в шапке - ссылка на главную страницу", () => {
  const api = new ExampleApi("hw/store");
  const cart = new CartApi();

  const mockStore = initStore(api, cart);
  const { getByText } = render(
    <BrowserRouter>
      <Provider store={mockStore}>
        <Application />
      </Provider>
    </BrowserRouter>
  );
  const linkElement = getByText("Kogtetochka store");
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute("href", "/");
});
