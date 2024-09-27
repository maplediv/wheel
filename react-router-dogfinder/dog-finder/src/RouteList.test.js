import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import RouteList from './RouteList';
import dogs from "./_testCommon"

test('renders all dog names in the dog list', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={["/dogs"]}>
      <RouteList dogs={dogs} />
    </MemoryRouter>
  );
  const dogNames = dogs.map(d => d.name);
  for (const name of dogNames) {
    const linkElement = getByText(new RegExp(name, "i"));
    expect(linkElement).toBeInTheDocument();
  }
});

test('renders only test\'s info', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={["/dogs/test"]}>
      <RouteList dogs={dogs} />
    </MemoryRouter>
  );
  const testInfo = dogs.find(d => d.name === "test");
  const testInfo2 = dogs.find(d => d.name === "mocked-dog");

  const liElement = getByText(new RegExp(testInfo.facts[0], "i"));
  expect(liElement).toBeInTheDocument();

  expect(screen.queryByText(new RegExp(testInfo2.facts[0], "i"))).toBeNull();
});

test('renders the home page on a dog that is not found', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={["/dogs/wrong"]}>
      <RouteList dogs={dogs} />
    </MemoryRouter>
  );

  expect(getByText("HELLO. WE HAVE DOGS. CLICK ON THEM FOR MORE INFO.")).toBeInTheDocument()

  const dogNames = dogs.map(d => d.name);
  for (const name of dogNames) {
    const linkElement = getByText(new RegExp(name, "i"));
    expect(linkElement).toBeInTheDocument();
  }
});

test('renders home on a bad route', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={["/bad-route"]}>
      <RouteList dogs={dogs} />
    </MemoryRouter>
  );

  const dogNames = dogs.map(d => d.name);
  for (const name of dogNames) {
    const linkElement = getByText(new RegExp(name, "i"));
    expect(linkElement).toBeInTheDocument();
  }
});
