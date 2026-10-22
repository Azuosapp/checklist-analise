import { AzuosIdentityOverview } from '../../../../lib/components/azuos-identity-overview/azuos-identity-overview.component';

export type AzuosProfileViewProps = {
  state?: { isLoading?: boolean; error?: string | null };
  data: {
    user: { name: string; email: string; role: string; avatarUrl?: string | null } | null;
    accountUrl?: string | null;
  };
};

export function AzuosProfileView({ data, state }: AzuosProfileViewProps) {
  return (
    <AzuosIdentityOverview
      data={{
        person: data.user ? { ...data.user, roleLabel: data.user.role } : null,
        accountUrl: data.accountUrl,
      }}
      state={state}
    />
  );
}
