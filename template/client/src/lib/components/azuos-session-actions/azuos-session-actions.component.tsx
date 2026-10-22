import { LogOut } from 'lucide-react';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';

export type AzuosSessionActionsProps = {
  state?: { isSigningOut?: boolean; error?: string | null };
  actions?: { onSignOut: () => void };
};

/** As mesmas ações no rodapé, inclusive com o menu recolhido ou aberto no celular. */
export function AzuosSessionActions({ state, actions }: AzuosSessionActionsProps) {
  if (!actions) return null;
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Sair"
            disabled={state?.isSigningOut}
            onClick={actions.onSignOut}
          >
            <LogOut aria-hidden="true" />
            <span>{state?.isSigningOut ? 'Saindo…' : 'Sair'}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      {state?.error ? (
        <p role="alert" className="text-sidebar-foreground px-2 text-sm">
          {state.error}
        </p>
      ) : null}
    </>
  );
}
