import { createFileRoute } from '@tanstack/react-router';
import { useProfileModel } from '../../lib/view-models/use-profile.model';
import { AzuosProfileView } from './components/azuos-profile-view/azuos-profile-view.component';

export const Route = createFileRoute('/profile/')({ component: ProfileRoute });

function ProfileRoute() {
  const model = useProfileModel();
  return <AzuosProfileView data={model.data} state={model.state} />;
}
