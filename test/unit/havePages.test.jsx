import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { Home } from "../../src/client/pages/Home";
import { Catalog } from "../../src/client/pages/Catalog";
import { Delivery } from "../../src/client/pages/Delivery";
import { Contacts } from "../../src/client/pages/Contacts";

const initState = { cart: {} };
const store = createStore(() => initState);
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter basename={"/"}>
      <Provider store={store}>{component}</Provider>
    </BrowserRouter>
  );
};

describe("В магазине должны быть страницы: главная, каталог, условия доставки, контакты", () => {
  const pages = [
    { component: <Home />, heading: "Comfort" },
    { component: <Catalog />, heading: "Catalog" },
    { component: <Delivery />, heading: "Delivery" },
    { component: <Contacts />, heading: "Contacts" },
  ];

  pages.forEach(({ component, heading }) => {
    it(`Есть страница ${heading}`, () => {
      renderWithProviders(component);
      expect(
        screen.queryByRole("heading", { name: heading })
      ).toBeInTheDocument();
    });
  });
});
