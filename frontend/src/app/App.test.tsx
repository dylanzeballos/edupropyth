import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    
    // Este test básico verifica que la app se renderiza sin errores
    expect(document.body).toBeInTheDocument();
  });
});