import { Fragment, type ReactNode } from 'react';
import { Settings } from 'lucide-react';

import { AzuosActionButton } from '../azuos-action-button/azuos-action-button.component';

export type AzuosIdentityOverviewProps = {
  data: {
    person: { name: string; email: string; roleLabel: string; avatarUrl?: string | null } | null;
    details?: readonly (readonly [string, string])[];
    accountUrl?: string | null;
  };
  state?: { isLoading?: boolean; error?: string | null };
  children?: ReactNode;
  identity?: ReactNode;
  actions?: { onRetry?: () => void };
};

/** Resumo de identidade e dados da conta: os mesmos cartões e tokens em todos os sistemas. */
export function AzuosIdentityOverview({
  data,
  state,
  children,
  identity,
  actions,
}: AzuosIdentityOverviewProps) {
  if (state?.error) return <OverviewError message={state.error} actions={actions} />;
  if (state?.isLoading || !data.person)
    return (
      <p role="status" aria-label="Carregando o perfil" className="text-muted-foreground p-6">
        Carregando seu perfil…
      </p>
    );

  const person = data.person;
  const details = data.details ?? [];
  return (
    <section
      className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-10 sm:px-6"
      aria-label="Meu perfil"
    >
      {identity ?? <IdentityHeader person={person} details={details} />}

      <div className="bg-card border-border rounded-surface border p-5 shadow-xs">
        <h2 className="text-foreground mb-4 text-sm font-semibold">Dados da conta</h2>
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
          {[
            ['Nome', person.name],
            ['E-mail', person.email],
            ['Perfil de acesso', person.roleLabel],
            ...details,
          ].map(([label, value]) => (
            <Fragment key={label}>
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-foreground min-w-0 break-words">{value}</dd>
            </Fragment>
          ))}
        </dl>
      </div>

      <AccountLink url={data.accountUrl} />
      {children}
    </section>
  );
}

type Person = NonNullable<AzuosIdentityOverviewProps['data']['person']>;
function IdentityHeader({
  person,
  details,
}: {
  person: Person;
  details: readonly (readonly [string, string])[];
}) {
  return (
    <div className="bg-card border-border rounded-surface border p-6 shadow-xs">
      <div className="flex flex-wrap items-center gap-4">
        <div className="bg-primary-soft text-foreground ring-primary/10 relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full ring-4">
          <span className="text-xl font-bold">
            {person.name
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0])
              .join('')
              .toUpperCase()}
          </span>
          {person.avatarUrl ? (
            <img
              src={person.avatarUrl}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground mb-1 text-xs">Meu perfil</p>
          <h1 className="text-foreground text-xl font-bold tracking-tight break-words">
            {person.name}
          </h1>
          <p className="text-muted-foreground mt-1 font-mono text-xs break-all">{person.email}</p>
          <p className="text-muted-foreground mt-1 text-sm">
            {details
              .filter(([label]) => ['Cargo', 'Departamento', 'Setor'].includes(label))
              .map(([, value]) => value)
              .join(' · ')}
          </p>
        </div>
        <span className="bg-primary text-primary-foreground rounded-chip px-2 py-1 text-xs font-semibold">
          {person.roleLabel}
        </span>
      </div>
    </div>
  );
}

function AccountLink({ url }: { url?: string | null }) {
  if (!url) return null;
  return (
    <div className="bg-card border-border rounded-surface border p-5 shadow-xs">
      <h2 className="text-foreground text-sm font-semibold">Sua conta</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Atualize seus dados, sua foto e sua senha na conta do grupo.
      </p>
      <a
        className="text-primary dark:text-info mt-4 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
        href={url}
      >
        <Settings className="size-4" aria-hidden="true" />
        Gerenciar minha conta
      </a>
    </div>
  );
}

function OverviewError({
  message,
  actions,
}: {
  message: string;
  actions?: AzuosIdentityOverviewProps['actions'];
}) {
  return (
    <div className="p-6">
      <p role="alert" className="text-destructive">
        Não consegui saber quem é você. {message}
      </p>
      {actions?.onRetry ? (
        <AzuosActionButton
          data={{ label: 'Tentar de novo' }}
          actions={{ onClick: actions.onRetry }}
        />
      ) : null}
    </div>
  );
}
