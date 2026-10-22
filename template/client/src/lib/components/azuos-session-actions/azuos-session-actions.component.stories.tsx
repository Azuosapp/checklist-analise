import { type Meta, type StoryObj } from '@storybook/react';
import { SidebarProvider } from '../ui/sidebar';
import { AzuosSessionActions } from './azuos-session-actions.component';
const meta = {
  title: 'Components/AzuosSessionActions',
  component: AzuosSessionActions,
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
  args: { actions: { onSignOut: () => undefined } },
} satisfies Meta<typeof AzuosSessionActions>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const SigningOut: Story = { args: { state: { isSigningOut: true } } };
export const Error: Story = {
  args: { state: { error: 'Não consegui encerrar a sessão. Tente novamente.' } },
};
