import { LogOut, UserRound } from 'lucide-react';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { AzuosThemeToggle } from '../azuos-theme-toggle/azuos-theme-toggle.component';

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
          <SidebarMenuButton asChild tooltip="Meu perfil">
            <a href="/profile">
              <UserRound aria-hidden="true" />
              <span>Meu perfil</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
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
      <div className="flex items-center justify-between gap-2 px-2 group-data-[collapsible=icon]:justify-center">
        <span className="text-sidebar-foreground text-xs group-data-[collapsible=icon]:hidden">
          Tema
        </span>
        <AzuosThemeToggle ui={{ variant: 'sidebar' }} />
      </div>
    </>
  );
}
