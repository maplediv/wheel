import FilterDogDetails from './FilterDogDetails';
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"


test("it returns null with empty params", function () {

  const { container } = render(
    <MemoryRouter>
      <FilterDogDetails dogs={[]} />
    </MemoryRouter>)

  expect(container).toBeEmptyDOMElement()
})