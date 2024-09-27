
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

it('renders without crashing', () => {
    render(<App />);
});

it('matches the snapshot', () => {
    const {asFragment} = render(<App />);
    expect(asFragment()).toMatchSnapshot();
});
