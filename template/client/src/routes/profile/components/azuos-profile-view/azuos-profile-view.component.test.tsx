import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AzuosProfileView } from './azuos-profile-view.component';
describe('AzuosProfileView', () => {
  // feliz
  it('shows the person already identified by the system and appearance settings', () => {
    render(
      <AzuosProfileView
        data={{ user: { name: 'Ana Souza', email: 'ana@example.test', role: 'Consulta' } }}
      />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Ana Souza' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Aparência' })).toBeInTheDocument();
  });
  // triste
  it('does not offer an account destination that was not configured', () => {
    render(
      <AzuosProfileView
        data={{ user: { name: 'Ana Souza', email: 'ana@example.test', role: 'Consulta' } }}
      />,
    );
    expect(screen.queryByRole('link', { name: 'Gerenciar minha conta' })).not.toBeInTheDocument();
  });
});
