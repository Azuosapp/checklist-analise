import { type Meta, type StoryObj } from '@storybook/react';
import { AzuosProfileView } from './azuos-profile-view.component';
const meta = {
  title: 'Features/Profile/AzuosProfileView',
  component: AzuosProfileView,
  args: {
    data: {
      user: { name: 'Ana Souza', email: 'ana@example.test', role: 'Consulta' },
      accountUrl: 'https://account.example.test/profile',
    },
  },
} satisfies Meta<typeof AzuosProfileView>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const NoAccountUrl: Story = {
  args: { data: { user: { name: 'Ana Souza', email: 'ana@example.test', role: 'Consulta' } } },
};
