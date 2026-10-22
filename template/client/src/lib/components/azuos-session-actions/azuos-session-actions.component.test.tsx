import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SidebarProvider } from '../ui/sidebar';
import { AzuosSessionActions } from './azuos-session-actions.component';

describe('AzuosSessionActions', () => {
  // feliz
  it('opens profile and calls the session action from logout', () => {
    const onSignOut = vi.fn();
    render(
      <SidebarProvider>
        <AzuosSessionActions actions={{ onSignOut }} />
      </SidebarProvider>,
    );
    expect(screen.getByRole('link', { name: 'Meu perfil' })).toHaveAttribute('href', '/profile');
    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));
    expect(onSignOut).toHaveBeenCalledOnce();
  });
  // triste
  it('prevents repeated logout and exposes a failure', () => {
    const onSignOut = vi.fn();
    render(
      <SidebarProvider>
        <AzuosSessionActions
          state={{ isSigningOut: true, error: 'Tente novamente.' }}
          actions={{ onSignOut }}
        />
      </SidebarProvider>,
    );
    expect(screen.getByRole('button', { name: 'Saindo…' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Saindo…' }));
    expect(onSignOut).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Tente novamente.');
  });
});
